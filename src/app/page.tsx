"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Music,
  ArrowRight,
  ChevronRight,
  Star,
  Award,
  Users,
  Loader2,
  Building2,
  User as UserIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Dancing_Script } from 'next/font/google';
import { useLanguage } from "@/context/LanguageContext";
import HeroAudio from "@/components/HeroAudio";
import RotatingText from "@/components/RotatingText";
import AccordionGallery from "@/components/AccordionGallery";
import { motion, AnimatePresence } from "motion/react";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });

// Same images the sanggar catalog shows for these curated studios (keyed by lowercase name)
const KNOWN_SANGGAR_THUMBS: Record<string, string> = {
  "sinar norray": "/profile-sanggar-2.webp",
  "art enthusiast production": "/card-1.webp",
  "am dance studio": "/card-2.webp",
  "arunika art production": "/card-3.webp",
  "ayodya pala": "/card-4.webp",
  "citra art studio": "/card-5.webp",
  "daya presta": "/card-6.webp",
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
 *   0 = name starts with q ("Amarta")
 *   1 = any word starts with q ("Sanggar Anggun", "Tari Angklung")
 *   2 = q appears inside a word ("Gayatari")
 *   3 = only the full/legal name matches (e.g. "Sanggar Seni …"), never shown for 1-char queries
 * Single-character queries are strict: only tiers 0-1 are returned.
 */
const getMatchTier = (name: string, q: string, fullName?: string): number | null => {
  const n = name.toLowerCase();
  let tier: number | null = null;
  if (n.startsWith(q)) tier = 0;
  else if (n.split(/[^a-z0-9]+/).some((word) => word.startsWith(q))) tier = 1;
  else if (n.includes(q)) tier = 2;
  else if (fullName && fullName.toLowerCase().includes(q)) tier = 3;
  if (tier === null || (q.length === 1 && tier > 1)) return null;
  return tier;
};

type RankedSuggestion = { name: string; fullName?: string; _tier?: number };

// Filter to matches and sort by tier, then alphabetically
const rankByRelevance = <T extends RankedSuggestion>(items: T[], q: string): (T & { _tier: number })[] =>
  items
    .map((item) => ({ ...item, _tier: getMatchTier(item.name, q, item.fullName) }))
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
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="object-cover w-full h-full"
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
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
  const heroWords = language === 'id'
    ? ['Pelaku Seni', 'Sanggar Tari', 'Seniman Musik']
    : ['Traditional Artists', 'Dance Studios', 'Music Artists'];

  const culturalPillars = [
    {
      id: 'sanggar-tari',
      title: isEnglish ? 'Dance Studio' : 'Sanggar Tari',
      label: isEnglish ? 'Dance Studio' : 'Sanggar Tari',
      subtitle: isEnglish ? 'Grace of Traditional Betawi Dance' : 'Keanggunan Gerak Tradisional Betawi',
      image: '/penari1.webp',
      link: '/sanggar'
    },
    {
      id: 'seniman-musik',
      title: isEnglish ? 'Music Artists' : 'Seniman Musik',
      label: isEnglish ? 'Music Artists' : 'Seniman Musik',
      subtitle: isEnglish ? 'Harmony of Melodic Traditions' : 'Harmoni Nada & Irama Klasik',
      image: '/koleksi2.webp',
      link: '/seniman-musik'
    },
    {
      id: 'pesilat',
      title: isEnglish ? 'Martial Artists' : 'Pesilat',
      label: isEnglish ? 'Martial Artists' : 'Pesilat',
      subtitle: isEnglish ? 'Mastery of Traditional Combat' : 'Jurus & Ketangkasan Bela Diri',
      image: '/koleksi4.webp',
      link: '#'
    },
    {
      id: 'ondel-ondel',
      title: 'Ondel-Ondel',
      label: 'Ondel-Ondel',
      subtitle: isEnglish ? 'Grand Icon of Jakarta Folklore' : 'Ikon Megah Pesta Rakyat Jakarta',
      image: '/koleksi3.webp',
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

        // Ask the DB for prefix + word-start matches explicitly, so a plain `%q%` limit can't crowd out
        // the best results (e.g. "a" returning only names with an inner "a"). Substring matches are only
        // needed for 2+ characters, since single-character queries are word-start only.
        const fetchCandidates = async (table: string, column: string) => {
          const patterns = [`${queryLower}%`, `% ${queryLower}%`];
          if (queryLower.length > 1) patterns.push(`%${queryLower}%`);
          const results = await Promise.all(
            patterns.map((pattern) => supabase.from(table).select('*').ilike(column, pattern).limit(10))
          );
          const byId = new Map<string, any>();
          for (const { data, error } of results) {
            if (error) console.error(`Supabase ${table} search error:`, error);
            for (const row of data || []) byId.set(String(row.id), row);
          }
          return [...byId.values()];
        };

        if (selectedCategory === 'all' || selectedCategory === 'dance') {
          let dbSanggars: any[] = [];
          try {
            dbSanggars = await fetchCandidates('sanggars', 'nama_sanggar');
          } catch (err) {
            console.error("Supabase search error:", err);
          }

          const rawSanggar = dbSanggars.map((item) => {
            const name = item.nama_sanggar.replace(/^Sanggar\s+/i, '');
            return {
              id: `s-${item.id}`,
              name,
              fullName: item.nama_sanggar,
              type: 'Sanggar',
              href: `/sanggar/${item.id}`,
              image: KNOWN_SANGGAR_THUMBS[name.toLowerCase()] || pickImage(item),
              subtitle: item.kota_kab || item.wilayah || item.kecamatan || null,
            };
          });

          // Known curated studios ensuring Sinar Norray and others always match
          const knownSanggars = [
            { id: "s-sinar-norray", name: "Sinar Norray", fullName: "Sanggar Seni Sinar Norray", type: "Sanggar", href: "/sanggar/sinar-norray", subtitle: "Jakarta Timur" },
            { id: "s-1", name: "Art Enthusiast Production", fullName: "Art Enthusiast Production", type: "Sanggar", href: "/sanggar/1" },
            { id: "s-2", name: "AM Dance Studio", fullName: "AM Dance Studio", type: "Sanggar", href: "/sanggar/2" },
            { id: "s-3", name: "Arunika Art Production", fullName: "Arunika Art Production", type: "Sanggar", href: "/sanggar/3" },
            { id: "s-4", name: "Ayodya Pala", fullName: "Ayodya Pala", type: "Sanggar", href: "/sanggar/4" },
            { id: "s-5", name: "Citra Art Studio", fullName: "Citra Art Studio", type: "Sanggar", href: "/sanggar/5" },
            { id: "s-6", name: "Daya Presta", fullName: "Daya Presta", type: "Sanggar", href: "/sanggar/6" },
          ].map((k) => ({ ...k, image: KNOWN_SANGGAR_THUMBS[k.name.toLowerCase()], subtitle: k.subtitle ?? null }));

          const combined = [...rawSanggar];
          for (const k of knownSanggars) {
            if (!combined.some(c => c.name.toLowerCase() === k.name.toLowerCase() || c.href === k.href)) {
              combined.push(k);
            }
          }

          formattedSanggar = rankByRelevance(combined, queryLower).slice(0, 5);
        }

        if (selectedCategory === 'all' || selectedCategory === 'music') {
          let dbPemusiks: any[] = [];
          try {
            dbPemusiks = await fetchCandidates('pemusiks', 'nama_seniman');
          } catch (err) {
            console.error("Supabase music search error:", err);
          }

          const rawPemusik = dbPemusiks.map((item) => ({
            id: `p-${item.id}`,
            name: item.nama_seniman,
            type: 'Pemusik',
            href: `/pemusik/${item.id}`,
            image: pickImage(item),
            subtitle: item.genre_musik || item.jenis_seniman || item.instrumen || null,
          }));

          formattedPemusik = rankByRelevance(rawPemusik, queryLower).slice(0, 3);
        }

        // Keep the per-type caps (5 sanggar, 3 musicians), then interleave by relevance so a strong
        // musician match isn't stuck below weak sanggar matches
        setSuggestions(
          [...formattedSanggar, ...formattedPemusik].sort(
            (a, b) => a._tier - b._tier || a.name.localeCompare(b.name)
          )
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
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-20"
        >
          <source src="/videoberanda.webm" type="video/webm" />
        </video>
        {/* Dark overlay for premium contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 -z-10 pointer-events-none"></div>

        {/* Mobile only: lift title + search ~10% of the viewport; md+ stays centered as before */}
        <div className="relative z-50 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12 mt-8 -translate-y-[10vh] md:translate-y-0">

          <div className="flex flex-col items-center justify-center text-center px-4 space-y-2 mt-8 md:space-y-4">
            <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
              <motion.h1
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-white text-3xl md:text-5xl font-light tracking-wide drop-shadow-md flex flex-wrap items-center justify-center gap-x-3"
              >
                <span>{t('heroDiscover')}</span>
                <span className={`relative inline-flex items-center ${dancingScript.className} text-5xl md:text-7xl font-medium text-orange-500 pr-2`}>
                  <RotatingText
                    texts={heroWords}
                    mainClassName={`inline-flex ${dancingScript.className} text-orange-500`}
                    splitLevelClassName={dancingScript.className}
                    elementLevelClassName={dancingScript.className}
                    staggerDuration={0.03}
                    staggerFrom="first"
                    rotationInterval={3000}
                    onNext={(index) => setHeroWordIndex(index)}
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={heroWords[heroWordIndex]}
                      initial={{ opacity: 0, scale: 0.8, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 5 }}
                      transition={{ duration: 0.3, delay: 0.4, ease: "easeInOut" }}
                      className={`absolute z-10 ${heroWords[heroWordIndex] === 'Seniman Musik' || heroWords[heroWordIndex] === 'Music Artists' ? '-top-12 md:-top-16 -right-6 md:-right-8' : '-top-8 md:-top-12 -right-8 md:-right-10'}`}
                    >
                      <img
                        src="/ondel-ondel.webp"
                        alt="Aksen Ondel-ondel"
                        className="w-12 h-12 md:w-20 md:h-20 object-contain rotate-12 scale-75 md:scale-100 drop-shadow-md hover:scale-110 pointer-events-none transition-transform duration-300"
                      />
                    </motion.div>
                  </AnimatePresence>
                </span>
              </motion.h1>
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
                    className="flex items-center justify-between gap-2 pl-6 pr-5 py-4 bg-transparent hover:bg-white/10 focus:outline-none focus:ring-0 border-none transition-colors w-full h-full text-white min-h-[44px]"
                  >
                    <span className="text-sm font-semibold truncate">
                      {selectedCategory === 'all' ? t('searchAllCat') : selectedCategory === 'dance' ? t('searchDanceCat') : t('searchMusicCat')}
                    </span>
                    <svg className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Floating Category Menu */}
                  {/* Flush with the search bar's OUTER left border: this wrapper sits inside the form's
                      p-2 (0.5rem) + 1px border, so shift left by exactly that. On md+ also drop below
                      the bar's bottom border; on mobile span the full bar width. */}
                  <div
                    role="listbox"
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
                  className="w-full md:w-auto bg-brand hover:bg-brand-deep text-white font-bold px-6 py-3 rounded-none shadow-md shadow-orange-600/20 text-xs tracking-[0.2em] uppercase transition-all min-h-[44px]"
                >
                  {t('searchBtn')}
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/20 text-white shadow-2xl rounded-none py-1 max-h-48 sm:max-h-60 overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar custom-scrollbar--dark z-50">
                  {isLoading ? (
                    <div className="p-4 flex items-center justify-center text-sm text-zinc-300 min-h-[60px]">
                      <Loader2 className="h-5 w-5 animate-spin mr-2 text-orange-400" />
                      {t('searchLoading')}
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul>
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
                            <span className="min-w-0 flex flex-col">
                              <span className="text-sm font-medium text-zinc-100 group-hover/item:text-orange-400 truncate transition-colors">{suggestion.name}</span>
                              {suggestion.subtitle && (
                                <span className="text-[11px] text-zinc-400 truncate">{suggestion.subtitle}</span>
                              )}
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
                    <div className="p-4 text-center text-sm text-zinc-300 min-h-[60px] flex items-center justify-center">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {isEnglish ? "The Living Arts of Jakarta" : "Ragam Pesona Kesenian Jakarta"}
          </h1>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto mt-2">
            {isEnglish 
              ? "Explore the rhythmic heritage, melodic harmonies, and living folklore rooted in Jakarta's cultural tapestry."
              : "Temukan kekayaan seni gerak, harmoni musik, dan tradisi warisan Betawi yang terus bertumbuh."}
          </p>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent border-none shadow-none ring-0">
          {/* Desktop Hover Accordion Gallery (md+) */}
          <div className="hidden md:block">
            <AccordionGallery
              items={culturalPillars}
              defaultIndex={0}
              height={560}
              radius={16}
              gap={14}
              expandRatio={0.52}
              accentColor="#ff7b00"
              overlayColor="#060010"
              trigger="hover"
            />
          </div>

          {/* Mobile Touch Cards (< md) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
            {culturalPillars.map((pillar) => {
              const isClickable = Boolean(pillar.link && pillar.link !== '#');
              const cardContent = (
                <>
                  {/* Full-color Background Image (no grayscale filter on mobile) */}
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="absolute inset-0 w-full h-full object-cover"
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
