"use client";

import { useState, useEffect, useRef, useSyncExternalStore, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Search,
  ChevronRight,
  Award,
  Users,
  Loader2,
  Building2,
  User as UserIcon,
  MapPin,
} from "lucide-react";
import { resolveWilayah } from "@/lib/wilayah";
import { dancingScript } from "@/lib/fonts";
import { useLanguage } from "@/context/LanguageContext";
import HeroAudio from "@/components/HeroAudio";
import type { HeroHeadlineProps } from "@/components/HeroHeadline";
import type { MusikCardData } from "@/types/musik";
// Desktop-only (it is hidden below md), so it and gsap are split out and only fetched on md+ screens
const AccordionGallery = dynamic(() => import("@/components/AccordionGallery"), {
  ssr: false,
  loading: () => <div style={{ height: 560 }} aria-hidden="true" />,
});

const DESKTOP_QUERY = "(min-width: 768px)";
const subscribeDesktop = (onChange: () => void) => {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/** Runs `callback` once the page has loaded and the browser is idle; returns a cleanup that cancels it */
const whenPageIdle = (callback: () => void) => {
  let idleId: number | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const start = () => {
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(callback, { timeout: 2000 });
    else timeoutId = setTimeout(callback, 300);
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
  return () => {
    window.removeEventListener("load", start);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  };
};

/**
 * First-paint copy of the hero headline: the same markup HeroHeadline/RotatingText render for the first word,
 * without motion. Swapped for the animated HeroHeadline once the page has loaded, with no visible change.
 */
function StaticHeroHeadline({ lead, words, scriptClassName }: HeroHeadlineProps) {
  const parts = words[0].split(" ");
  return (
    <h1 className="text-white text-3xl md:text-5xl font-light tracking-wide drop-shadow-md flex flex-wrap items-center justify-center gap-x-3">
      <span>{lead}</span>
      <span className={`relative inline-flex items-center ${scriptClassName} text-5xl md:text-7xl font-medium text-orange-500 pr-2`}>
        <span className={`text-rotate inline-flex ${scriptClassName} text-orange-500`}>
          <span className="text-rotate-sr-only">{words[0]}</span>
          <span className="text-rotate" aria-hidden="true">
            {parts.map((part, i) => (
              <span key={i} className={`text-rotate-word ${scriptClassName}`}>
                {Array.from(part).map((char, j) => (
                  <span key={j} className={`text-rotate-element ${scriptClassName}`}>{char}</span>
                ))}
                {i !== parts.length - 1 && <span className="text-rotate-space"> </span>}
              </span>
            ))}
          </span>
        </span>
      </span>
    </h1>
  );
}


// Same images the sanggar catalog shows for these curated studios (keyed by lowercase name)
const KNOWN_SANGGAR_THUMBS: Record<string, string> = {
  "sinar norray": "/images/sanggar/sinar-norray/profile/profile-sanggar-2.webp",
  "art enthusiast production": "/images/sanggar/general/dinamis/card-1.webp",
  "am dance studio": "/images/sanggar/general/dinamis/card-2.webp",
  "arunika art production": "/images/sanggar/general/dinamis/card-3.webp",
  "ayodya pala": "/images/sanggar/general/dinamis/card-4.webp",
  "citra art studio": "/images/sanggar/general/dinamis/card-5.webp",
  "daya presta": "/images/sanggar/general/dinamis/card-6.webp",
};

// First non-empty image-like field on a DB row (column names differ between tables)
const pickImage = (row: Record<string, unknown>): string | null => {
  for (const key of ["logo_url", "thumbnail_url", "foto_url", "image_url", "avatar_url", "image", "logo"]) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
};

/**
 * Search relevance tier for a display name (lower = better), or null if it doesn't match.
 * Strict prefix matching: nothing matches in the middle of a word.
 *   0 = the name itself starts with q            ("Sinar Norray" for "s" / "sin")
 *   1 = a later word of the name starts with q   ("Sinar Norray" for "norray"); needs 2+ characters
 *   2 = a secondary field (full/legal name, leader, PIC, region) or one of its words starts with q;
 *       needs 3+ characters
 * So a single character only ever returns names that begin with that letter.
 * Matching is case-insensitive; `q` must already be lower-cased and trimmed.
 */
const getMatchTier = (name: string, q: string, fullName?: string, extra: (string | null | undefined)[] = []): number | null => {
  const startsWithWord = (text: string) => text.split(/[^a-z0-9]+/).some((word) => word.startsWith(q));
  const n = name.trim().toLowerCase();
  if (n.startsWith(q)) return 0;
  if (q.length >= 2 && startsWithWord(n)) return 1;
  if (q.length >= 3) {
    const secondary = [fullName, ...extra].filter((text): text is string => Boolean(text)).map((text) => text.trim().toLowerCase());
    if (secondary.some((text) => text.startsWith(q) || startsWithWord(text))) return 2;
  }
  return null;
};

/** Most results the dropdown shows (it scrolls) */
const MAX_SUGGESTIONS = 20;
/** How long the loaded catalog is reused before asking the database again */
const CATALOG_TTL_MS = 60_000;

type RankedSuggestion = { name: string; fullName?: string; extra?: (string | null | undefined)[]; _tier?: number };

// Filter to matches and sort by tier, then alphabetically
const rankByRelevance = <T extends RankedSuggestion>(items: T[], q: string): (T & { _tier: number })[] =>
  items
    .map((item) => ({ ...item, _tier: getMatchTier(item.name, q, item.fullName, item.extra) }))
    .filter((item): item is T & { _tier: number } => item._tier !== null)
    .sort((a, b) => a._tier - b._tier || a.name.localeCompare(b.name));

// Square search-result thumbnail: image when available, otherwise the name's initial (or a type icon)
function SearchThumb({ src, name, type }: { src?: string | null; name: string; type: string }) {
  const [failed, setFailed] = useState(false);
  const initial = name.replace(/^Sanggar\s+/i, '').trim().charAt(0).toUpperCase();
  const FallbackIcon = type === 'Sanggar' ? Building2 : UserIcon;

  return (
    <span className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 relative overflow-hidden rounded-sm border border-white/20 bg-white/10 flex items-center justify-center">
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="36px"
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : initial ? (
        <span className="text-xs font-bold text-orange-400" aria-hidden="true">{initial}</span>
      ) : (
        <FallbackIcon className="w-4 h-4 text-orange-400" aria-hidden="true" />
      )}
    </span>
  );
}

export default function HomePage() {  
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // false on the server and during hydration, then the real value: phones never request the accordion chunk
  const isDesktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP_QUERY).matches, () => false);
  // Hero video (1.6 MB, 720p) is attached only after the page has loaded (and fades in once playing), so it doesn't
  // compete with the page's own CSS/JS/images. Skipped for reduced-motion, Save-Data and slow connections.
  const [showHeroVideo, setShowHeroVideo] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  // The video's poster reuses the frame next/image already downloaded (its currentSrc), so it costs no extra request
  const heroImageRef = useRef<HTMLImageElement>(null);
  const [heroPoster, setHeroPoster] = useState<string>();
  // The animated headline (and motion with it) is loaded after the page has loaded; StaticHeroHeadline until then
  const [AnimatedHeroHeadline, setAnimatedHeroHeadline] = useState<ComponentType<HeroHeadlineProps> | null>(null);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || connection?.saveData || /(^|-)(2g|3g)$/.test(connection?.effectiveType || "")) return;
    return whenPageIdle(() => {
      setHeroPoster(heroImageRef.current?.currentSrc || undefined);
      setShowHeroVideo(true);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const cancelIdle = whenPageIdle(() => {
      import("@/components/HeroHeadline").then((mod) => {
        if (!cancelled) setAnimatedHeroHeadline(() => mod.default);
      });
    });
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, []);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  // Sanggar + musician rows loaded for the live search, reused between keystrokes
  const catalogCache = useRef<{ sanggars: any[]; pemusiks: MusikCardData[]; at: number } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const isEnglish = language === 'en';
  const selectedCategoryLabel =
    selectedCategory === 'all' ? t('searchAllCat') : selectedCategory === 'dance' ? t('searchDanceCat') : t('searchMusicCat');
  const heroWords = language === 'id'
    ? ['Pelaku Seni', 'Sanggar Tari', 'Seniman Musik']
    : ['Traditional Artists', 'Dance Studios', 'Music Artists'];

  const culturalPillars = [
    {
      id: 'sanggar-tari',
      title: isEnglish ? 'Dance Studio' : 'Sanggar Tari',
      label: isEnglish ? 'Dance Studio' : 'Sanggar Tari',
      subtitle: isEnglish ? 'Grace of Traditional Betawi Dance' : 'Keanggunan Gerak Tradisional Betawi',
      image: '/images/hero/penari1.webp',
      link: '/sanggar'
    },
    {
      id: 'seniman-musik',
      title: isEnglish ? 'Music Artists' : 'Seniman Musik',
      label: isEnglish ? 'Music Artists' : 'Seniman Musik',
      subtitle: isEnglish ? 'Harmony of Melodic Traditions' : 'Harmoni Nada & Irama Klasik',
      image: '/images/hero/koleksi2.webp',
      link: '/seniman-musik'
    },
    {
      id: 'pesilat',
      title: isEnglish ? 'Martial Artists' : 'Pesilat',
      label: isEnglish ? 'Martial Artists' : 'Pesilat',
      subtitle: isEnglish ? 'Mastery of Traditional Combat' : 'Jurus & Ketangkasan Bela Diri',
      image: '/images/hero/koleksi4.webp',
      link: '#'
    },
    {
      id: 'ondel-ondel',
      title: 'Ondel-Ondel',
      label: 'Ondel-Ondel',
      subtitle: isEnglish ? 'Grand Icon of Jakarta Folklore' : 'Ikon Megah Pesta Rakyat Jakarta',
      image: '/images/hero/koleksi3.webp',
      link: '#'
    }
  ];


  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const queryLower = searchQuery.toLowerCase().trim();
        let formattedSanggar: any[] = [];
        let formattedPemusik: any[] = [];

        // The whole catalog is small, so load it once (reused for CATALOG_TTL_MS) and rank in the browser.
        // Per-keystroke `ilike ... limit 10` queries dropped good matches: for "s" the database returned an
        // arbitrary 10 of the many names starting with S, and "Sinar Norray" was often not among them.
        const loadCatalog = async () => {
          const cached = catalogCache.current;
          if (cached && Date.now() - cached.at < CATALOG_TTL_MS) return cached;
          const [s, p, musik] = await Promise.all([
            // supabase-js is only fetched once someone starts typing in the search bar
            import("@/lib/supabase").then(({ supabase }) => supabase.from('sanggars').select('*').limit(1000)),
            import("@/lib/supabase").then(({ supabase }) => supabase.from('pemusiks').select('*').limit(1000)),
            // Seniman Musik master data (komunitas + pemusik profiles), merged with the rows like the /pemusik catalog
            import("@/data/musikData"),
          ]);
          if (s.error) console.error("Supabase search error:", s.error);
          if (p.error) console.error("Supabase music search error:", p.error);
          const loaded = {
            sanggars: (s.data as any[]) || [],
            pemusiks: musik.buildMusikCatalog((p.data as any[]) || []),
            at: Date.now(),
          };
          // Only cache complete loads, so a failed request is retried on the next keystroke
          if (!s.error && !p.error) catalogCache.current = loaded;
          return loaded;
        };
        const catalog = await loadCatalog();

        if (selectedCategory === 'all' || selectedCategory === 'dance') {
          const dbSanggars: any[] = catalog.sanggars;

          const rawSanggar = dbSanggars.filter((item) => item.status !== "draft").map((item) => {
            const name = item.nama_sanggar.replace(/^Sanggar\s+/i, '');
            return {
              id: `s-${item.id}`,
              name,
              fullName: item.nama_sanggar,
              type: 'Sanggar',
              href: `/sanggar/${item.id}`,
              image: KNOWN_SANGGAR_THUMBS[name.toLowerCase()] || pickImage(item),
              // Administrative city (same resolver as the catalog); null when it isn't on record
              wilayah: resolveWilayah(item),
              subtitle: null as string | null,
              // Secondary search text (lowest relevance tier): leader, PIC and region
              extra: [item.ketua_sanggar, item.nama_pic, resolveWilayah(item)] as (string | null | undefined)[],
            };
          });

          // Known curated studios ensuring Sinar Norray and others always match (hrefs use the real database ids)
          const knownSanggars = [
            { id: "s-sinar-norray", name: "Sinar Norray", fullName: "Sanggar Seni Sinar Norray", type: "Sanggar", href: "/sanggar/sinar-norray" },
            { id: "s-40", name: "Art Enthusiast Production", fullName: "Art Enthusiast Production", type: "Sanggar", href: "/sanggar/40" },
            { id: "s-30", name: "AM Dance Studio", fullName: "AM Dance Studio", type: "Sanggar", href: "/sanggar/30" },
            { id: "s-21", name: "Arunika Art Production", fullName: "Arunika Art Production", type: "Sanggar", href: "/sanggar/21" },
            { id: "s-17", name: "Ayodya Pala", fullName: "Ayodya Pala", type: "Sanggar", href: "/sanggar/17" },
            { id: "s-6", name: "Citra Art Studio", fullName: "Citra Art Studio", type: "Sanggar", href: "/sanggar/6" },
            { id: "s-7", name: "Daya Presta", fullName: "Daya Presta", type: "Sanggar", href: "/sanggar/7" },
          ].map((k) => ({
            ...k,
            image: KNOWN_SANGGAR_THUMBS[k.name.toLowerCase()],
            wilayah: resolveWilayah({ id: k.href.split("/").pop() }),
            subtitle: null as string | null,
            extra: [resolveWilayah({ id: k.href.split("/").pop() })] as (string | null | undefined)[],
          }));

          const combined = [...rawSanggar];
          for (const k of knownSanggars) {
            if (!combined.some(c => c.name.toLowerCase() === k.name.toLowerCase() || c.href === k.href)) {
              combined.push(k);
            }
          }

          formattedSanggar = rankByRelevance(combined, queryLower);
        }

        if (selectedCategory === 'all' || selectedCategory === 'music') {
          const rawPemusik = catalog.pemusiks.map((item) => ({
            id: `p-${item.id}`,
            name: item.nama,
            // stage / ensemble name also matches ("Mitra", "Orkes Gambang Kromong Suara Lama")
            fullName: item.namaPanggung,
            type: 'Pemusik',
            href: `/pemusik/${item.id}`,
            // illustration photos aren't used as a thumbnail: they don't show this artist
            image: item.isDummyMedia ? null : item.foto ?? null,
            // The id is left out on purpose: the curated id -> wilayah map is for sanggar ids only
            wilayah: resolveWilayah({ alamat: item.alamat }),
            subtitle: (item.subtitle || item.namaPanggung || null) as string | null,
          }));

          formattedPemusik = rankByRelevance(rawPemusik, queryLower);
        }

        // Sanggar and musicians ranked together by relevance, then alphabetically; the list scrolls
        setSuggestions(
          [...formattedSanggar, ...formattedPemusik]
            .sort((a, b) => a._tier - b._tier || a.name.localeCompare(b.name))
            .slice(0, MAX_SUGGESTIONS)
        );
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    if (e) e.preventDefault();

    const queryTrim = searchQuery.trim();
    const queryParam = queryTrim ? `?q=${encodeURIComponent(queryTrim)}` : '';

    if (selectedCategory === 'dance') {
      router.push(`/sanggar${queryParam}`);
    } else if (selectedCategory === 'music') {
      router.push(`/pemusik${queryParam}`);
    } else {
      // 'all' category: navigate to sanggar catalog with query, or scroll to categories if empty
      if (queryTrim) {
        router.push(`/sanggar${queryParam}`);
      } else {
        const targetSection = document.getElementById('kategori');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push('/#kategori');
        }
      }
    }
    setIsCategoryOpen(false);
  };

  return (
    <>
      {/* ===== Hero Section ===== */}
      <section
        className="relative w-full h-screen flex flex-col justify-center items-center"
      >
        {/* Still frame of the hero video, served responsive (next/image) and fetched first. It shows instantly;
            the video is deliberately not requested until the page has loaded. */}
        <Image
          ref={heroImageRef}
          src="/images/hero/hero-poster.webp"
          alt=""
          fill
          sizes="100vw"
          quality={75}
          loading="eager"
          fetchPriority="high"
          className="object-cover -z-30"
        />
        {showHeroVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={heroPoster}
            onPlaying={() => setHeroVideoReady(true)}
            className={`absolute inset-0 w-full h-full object-cover -z-20 transition-opacity duration-700 ${
              heroVideoReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/videos/videoberanda-hd.mp4" type="video/mp4" />
          </video>
        )}
        {/* Dark overlay for premium contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 -z-10 pointer-events-none"></div>

        {/* Mobile only: lift title + search ~10% of the viewport; md+ stays centered as before */}
        <div className="relative z-50 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12 mt-8 -translate-y-[10vh] md:translate-y-0">

          <div className="flex flex-col items-center justify-center text-center px-4 space-y-2 mt-8 md:space-y-4">
            <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
              {AnimatedHeroHeadline ? (
                <AnimatedHeroHeadline lead={t('heroDiscover')} words={heroWords} scriptClassName={dancingScript.className} />
              ) : (
                <StaticHeroHeadline lead={t('heroDiscover')} words={heroWords} scriptClassName={dancingScript.className} />
              )}
            </div>
            <h2 className="text-white text-3xl md:text-5xl font-light tracking-wide leading-tight drop-shadow-md max-w-3xl">
              {t('heroBestIn')}
            </h2>
          </div>

          {/* ===== Search Bar ===== */}
          {/* Transform-only entrance (no opacity) so the frosted blur below is never flattened */}
          <div className="w-full max-w-3xl animate-[slide-up-solid_0.5s_ease-out_both]">
            <div ref={searchContainerRef} className="group relative z-50">
              <form
                role="search"
                aria-label={t('searchFormLabel')}
                onSubmit={handleSearch}
                className="relative isolate mt-12 flex flex-col md:flex-row items-stretch w-full max-w-4xl mx-auto border border-white/20 p-2 shadow-2xl rounded-none transition-all duration-300"
              >
                {/* Frosted glass lives on this layer, not on the form: a backdrop-filter on the form would make it
                    a backdrop root, and the category popup's own blur would then only see the form, not the video */}
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/40 backdrop-blur-md sm:backdrop-blur-lg pointer-events-none" />

                {/* Premium Category Dropdown */}
                <div className="relative flex-shrink-0 w-full md:w-48 border-b md:border-b-0 md:border-r border-white/20">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategoryOpen(!isCategoryOpen);
                      setIsFocused(false);
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={isCategoryOpen}
                    aria-controls="hero-search-category"
                    aria-label={`${t('searchCategoryLabel')}: ${selectedCategoryLabel}`}
                    className="flex items-center justify-between gap-2 pl-6 pr-5 py-4 bg-transparent hover:bg-white/10 focus:outline-none focus:ring-0 border-none transition-colors w-full h-full text-white min-h-[44px]"
                  >
                    <span className="text-sm font-semibold truncate">
                      {selectedCategoryLabel}
                    </span>
                    <svg aria-hidden="true" className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Floating Category Menu */}
                  {/* Flush with the search bar's OUTER left border: this wrapper sits inside the form's
                      p-2 (0.5rem) + 1px border, so shift left by exactly that. On md+ also drop below
                      the bar's bottom border; on mobile span the full bar width. */}
                  <div
                    id="hero-search-category"
                    role="listbox"
                    aria-label={t('searchCategoryOptions')}
                    className={`absolute top-full -left-[calc(0.5rem+1px)] mt-1 md:mt-[calc(0.5rem+1px+0.25rem)] w-[calc(100%+1rem+2px)] md:w-full min-w-[200px] z-50 bg-black/80 backdrop-blur-xl border border-white/20 text-white shadow-2xl rounded-none py-1 overflow-hidden transition-all duration-200 origin-top ${
                      isCategoryOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
                    }`}
                  >
                    {([
                      { value: 'all', label: t('searchAllCat') },
                      { value: 'dance', label: t('searchDanceCat') },
                      { value: 'music', label: t('searchMusicCat') },
                    ] as const).map((option) => {
                      const isSelected = selectedCategory === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => { setSelectedCategory(option.value); setIsCategoryOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 min-h-[44px] flex items-center text-sm rounded-none border-l-2 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-orange-600/30 text-orange-400 font-bold border-orange-500'
                              : 'text-zinc-200 font-medium border-transparent hover:bg-white/10 hover:text-orange-400'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-grow relative">
                  <input
                    type="text"
                    name="q"
                    autoComplete="off"
                    enterKeyHint="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsCategoryOpen(false);
                    }}
                    onFocus={() => {
                      setIsFocused(true);
                      setIsCategoryOpen(false);
                    }}
                    onBlur={() => setTimeout(() => setIsFocused(false), 250)}
                    placeholder={t('searchHeroPlaceholder')}
                    className="w-full h-full bg-transparent focus:bg-transparent text-white placeholder:text-zinc-300 border-none focus:outline-none focus:ring-0 px-6 py-4 outline-none text-sm tracking-wide min-h-[44px]"
                    aria-label={t('searchAriaLabel')}
                  />
                </div>
                <button
                  type="submit"
                  aria-label={t('searchFormLabel')}
                  className="w-full md:w-auto bg-brand hover:bg-brand-deep text-white font-bold px-6 py-3 rounded-none shadow-md shadow-orange-600/20 text-xs tracking-[0.2em] uppercase transition-all min-h-[44px]"
                >
                  {t('searchBtn')}
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/20 text-white shadow-2xl rounded-none py-1 max-h-80 overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar custom-scrollbar--dark z-50">
                  {isLoading ? (
                    <div role="status" className="p-4 flex items-center justify-center text-sm text-zinc-300 min-h-[60px]">
                      <Loader2 className="h-5 w-5 animate-spin mr-2 text-orange-400" aria-hidden="true" />
                      {t('searchLoading')}
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul aria-label={t('searchSuggestions')}>
                      {suggestions.map((suggestion) => (
                        <li key={suggestion.id} className="border-b border-white/10 last:border-none">
                          <Link
                            href={suggestion.href || '#'}
                            className="group/item flex items-center gap-3 py-2.5 px-4 min-h-[44px] hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer"
                            onClick={() => {
                              setIsFocused(false);
                              setIsCategoryOpen(false);
                            }}
                          >
                            <SearchThumb src={suggestion.image} name={suggestion.name} type={suggestion.type} />
                            <span className="min-w-0 flex flex-col gap-0.5">
                              <span className="text-sm font-medium text-zinc-100 group-hover/item:text-orange-400 truncate transition-colors">{suggestion.name}</span>
                              {/* Region with a pin when known; otherwise the secondary info (e.g. genre); nothing if neither */}
                              {suggestion.wilayah ? (
                                <span className="flex items-center gap-1 text-xs text-zinc-400 min-w-0">
                                  <MapPin className="w-3 h-3 shrink-0 text-orange-400/80" aria-hidden="true" />
                                  <span className="truncate">{suggestion.wilayah}</span>
                                </span>
                              ) : suggestion.subtitle ? (
                                <span className="text-xs text-zinc-400 truncate">{suggestion.subtitle}</span>
                              ) : null}
                            </span>
                            {selectedCategory === 'all' && (
                              <span className="ml-auto shrink-0 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-none tracking-wider uppercase">
                                {suggestion.type === 'Sanggar'
                                  ? (isEnglish ? 'Studio' : 'Sanggar')
                                  : (isEnglish ? 'Music Artist' : 'Seniman Musik')}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div role="status" className="p-4 text-center text-sm text-zinc-300 min-h-[60px] flex items-center justify-center">
                      {t('searchNoResults')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


        </div>
        
        <HeroAudio />
      </section>

      {/* ===== Hero 4-Panel Accordion Gallery ===== */}
      <section id="kategori" className="w-full bg-transparent border-none shadow-none ring-0 py-8 sm:py-12 pb-16 sm:pb-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] text-[#ff7b00] uppercase mb-2">
            {isEnglish ? "Cultural Exploration" : "Eksplorasi Budaya"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {isEnglish ? "The Living Arts of Jakarta" : "Ragam Pesona Kesenian Jakarta"}
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto mt-2">
            {isEnglish 
              ? "Explore the rhythmic heritage, melodic harmonies, and living folklore rooted in Jakarta's cultural tapestry."
              : "Temukan kekayaan seni gerak, harmoni musik, dan tradisi warisan Betawi yang terus bertumbuh."}
          </p>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent border-none shadow-none ring-0">
          {/* Desktop Hover Accordion Gallery (md+) */}
          <div className="hidden md:block min-h-[560px]">
            {isDesktop && <AccordionGallery
              ariaLabel={isEnglish ? "Art category gallery" : "Galeri kategori seni"}
              items={culturalPillars}
              defaultIndex={0}
              height={560}
              radius={16}
              gap={14}
              expandRatio={0.52}
              accentColor="#ff7b00"
              overlayColor="#060010"
              trigger="hover"
            />}
          </div>

          {/* Mobile Touch Cards (< md) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
            {culturalPillars.map((pillar) => {
              const isClickable = Boolean(pillar.link && pillar.link !== '#');
              const cardContent = (
                <>
                  {/* Full-color Background Image (no grayscale filter on mobile) */}
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />

                  {/* Gradient Overlay for high text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                  {/* Text & Action Row */}
                  <div className="relative z-10 w-full flex items-end justify-between gap-3 pointer-events-none">
                    <div className="flex flex-col text-left">
                      <span className={`text-xl sm:text-2xl text-white font-bold tracking-tight drop-shadow-md leading-tight ${dancingScript.className}`}>
                        {pillar.title}
                      </span>
                      <span className="text-xs text-zinc-300 font-medium drop-shadow-sm mt-0.5 line-clamp-1">
                        {pillar.subtitle}
                      </span>
                    </div>

                    <div className="flex items-center justify-center w-8 h-8 rounded-none bg-white/20 backdrop-blur-md border border-white/30 text-white shrink-0 shadow-sm group-active:scale-95 transition-transform">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </>
              );

              const cardClasses = "group w-full h-28 sm:h-36 rounded-2xl overflow-hidden relative shadow-md border border-zinc-200/80 active:scale-[0.98] transition-all duration-300 flex items-end p-4 block";

              return isClickable ? (
                <Link
                  key={pillar.id}
                  href={pillar.link || '#'}
                  className={cardClasses}
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={pillar.id}
                  className={cardClasses}
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Feature Highlights ===== */}
      <section className="border-t border-surface-200/60 bg-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-extrabold tracking-tight text-4xl text-slate-900">
              {t('featuresTitle')}{" "}
              <span className="text-orange-600">Katalog Seni DKI?</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-surface-500 sm:text-base">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Award,
                title: t('featureVerifiedTitle'),
                description: t('featureVerifiedDesc'),
              },
              {
                icon: Search,
                title: t('featureSearchTitle'),
                description: t('featureSearchDesc'),
              },
              {
                icon: Users,
                title: t('featureContactTitle'),
                description: t('featureContactDesc'),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-none border border-zinc-200/80 p-8 text-center shadow-sm flex flex-col items-center justify-center hover:border-orange-500/40 transition-colors duration-200"
              >
                <div className="w-14 h-14 rounded-none bg-orange-100/60 border border-orange-200/50 flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="h-7 w-7 stroke-[1.5] text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed text-center max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
