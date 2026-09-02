"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Music,
  Sparkles,
  ArrowRight,
  Star,
  Users,
  Award,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Dancing_Script, Playfair_Display } from 'next/font/google';
import { useLanguage } from "@/context/LanguageContext";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] });
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

export default function HomePage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();



  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        let formattedSanggar: any[] = [];
        let formattedPemusik: any[] = [];

        if (selectedCategory === 'all' || selectedCategory === 'dance') {
          const { data: sanggarData } = await supabase
            .from('sanggars')
            .select('id, nama_sanggar')
            .ilike('nama_sanggar', `${searchQuery}%`)
            .limit(3);

          formattedSanggar = (sanggarData || []).map((item) => ({
            id: `s-${item.id}`,
            name: item.nama_sanggar,
            type: 'Sanggar',
            href: `/sanggar/${item.id}`
          }));
        }

        if (selectedCategory === 'all' || selectedCategory === 'music') {
          const { data: pemusikData } = await supabase
            .from('pemusiks')
            .select('id, nama_seniman')
            .ilike('nama_seniman', `${searchQuery}%`)
            .limit(3);

          formattedPemusik = (pemusikData || []).map((item) => ({
            id: `p-${item.id}`,
            name: item.nama_seniman,
            type: 'Pemusik',
            href: `/pemusik/${item.id}`
          }));
        }

        setSuggestions([...formattedSanggar, ...formattedPemusik]);
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

    const queryParam = searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery)}` : '';

    if (selectedCategory === 'dance') {
      router.push(`/sanggar${queryParam}`);
    } else if (selectedCategory === 'music') {
      router.push(`/pemusik${queryParam}`);
    } else {
      // 'all' category selected
      if (queryParam) {
        router.push(`/search${queryParam}`);
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

        <div className="relative z-50 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12 mt-20">
          <div className="flex flex-col items-center justify-center text-center px-4 space-y-2 mt-16 md:space-y-4">
            <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
              <h1 className="text-white text-3xl md:text-5xl font-light tracking-wide drop-shadow-md">
                {t('heroDiscover')}{' '}
                <span className={`relative inline-block ${dancingScript.className} text-5xl md:text-7xl font-medium text-orange-500 pr-2`}>
                  {t('heroArtists')}
                  <img
                    src="/ondel-ondel.webp"
                    alt="Aksen Ondel-ondel"
                    className={`absolute -top-8 md:-top-12 w-12 h-12 md:w-20 md:h-20 object-contain rotate-12 scale-75 md:scale-100 z-10 drop-shadow-md hover:scale-110 transition-all duration-300 pointer-events-none ${language === 'id' ? '-right-8 md:-right-10' : '-right-2 md:-right-4'}`}
                  />
                </span>
              </h1>
            </div>
            <h2 className="text-white text-3xl md:text-5xl font-light tracking-wide leading-tight drop-shadow-md max-w-3xl">
              {t('heroBestIn')}
            </h2>
          </div>

          {/* ===== Search Bar ===== */}
          <div className="w-full max-w-3xl animate-slide-up">
            <div className="group relative z-50">
              <form
                onSubmit={handleSearch}
                className="mt-12 flex flex-col md:flex-row items-stretch w-full max-w-4xl mx-auto bg-black/20 backdrop-blur-md border border-white/20 p-2 shadow-2xl"
              >
                {/* Premium Category Dropdown */}
                <div className="relative flex-shrink-0 w-full md:w-48 border-b md:border-b-0 md:border-r border-white/20">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategoryOpen(!isCategoryOpen);
                      setIsFocused(false);
                    }}
                    className="flex items-center justify-between gap-2 pl-6 pr-5 py-4 bg-transparent hover:bg-white/10 transition-colors w-full h-full text-white"
                  >
                    <span className="text-sm font-semibold truncate">
                      {selectedCategory === 'all' ? t('searchAllCat') : selectedCategory === 'dance' ? t('searchDanceCat') : t('searchMusicCat')}
                    </span>
                    <svg className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Floating Animated Menu */}
                  <div className={`absolute top-full -left-[9px] mt-[10px] w-[calc(100%+10px)] bg-neutral-900/80 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 z-[999] origin-top-left ${isCategoryOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    <div className="p-2 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => { setSelectedCategory('all'); setIsCategoryOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedCategory === 'all' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'}`}
                      >
                        {t('searchAllCat')}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSelectedCategory('dance'); setIsCategoryOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedCategory === 'dance' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'}`}
                      >
                        {t('searchDanceCat')}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSelectedCategory('music'); setIsCategoryOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedCategory === 'music' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'}`}
                      >
                        {t('searchMusicCat')}
                      </button>
                    </div>
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
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder={t('searchHeroPlaceholder')}
                    className="w-full h-full bg-transparent text-white placeholder-white/70 px-6 py-4 outline-none text-sm tracking-wide"
                    aria-label={t('searchAriaLabel')}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-10 py-4 bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-orange-600 hover:text-white hover:border-orange-600 border border-white transition-all duration-500"
                >
                  {t('searchBtn')}
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900/80 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-none z-50 overflow-hidden">
                  {isLoading ? (
                    <div className="p-4 flex items-center justify-center text-sm text-white/70">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      {t('searchLoading')}
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul>
                      {suggestions.map((suggestion) => (
                        <li key={suggestion.id}>
                          <Link
                            href={suggestion.href}
                            className="flex items-center justify-between px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/10 last:border-0"
                            onClick={() => setIsFocused(false)}
                          >
                            <span className="text-white font-medium">{suggestion.name}</span>
                            {selectedCategory === 'all' && (
                              <span className={`px-3 py-1 rounded-none text-[10px] uppercase tracking-widest font-medium border backdrop-blur-sm transition-colors ${suggestion.type === 'Sanggar'
                                  ? 'bg-white/5 border-white/20 text-white/80'
                                  : 'bg-[#D4C8B8]/10 border-[#D4C8B8]/30 text-[#D4C8B8]'
                                }`}>
                                {suggestion.type}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-sm text-white/70">
                      {t('searchNoResults')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


        </div>

      </section>

      {/* ===== Scroll 2: Full-Width Editorial Banner ===== */}
      <section className="relative w-full aspect-video overflow-hidden bg-[#e5e5e5] mb-16">
        <img src="/penari1.webp" alt="Jiwa Jakarta. Seni Kita." className="absolute inset-0 w-full h-full object-cover object-center opacity-90" />
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 lg:px-12 pointer-events-none">
          <h2 className="relative z-10 text-white font-poppins text-2xl md:text-5xl tracking-wide drop-shadow-md pointer-events-auto pr-4 md:pr-12 lg:pr-20"><span className={`${dancingScript.className} text-4xl md:text-7xl font-normal tracking-normal mr-2`}>{t('bannerSoul')}</span> {t('bannerJakarta')}</h2>
          <h2 className="relative z-10 text-white font-poppins text-2xl md:text-5xl tracking-wide drop-shadow-md pointer-events-auto pl-4 md:pl-12 lg:pl-20"><span className={`${dancingScript.className} text-4xl md:text-7xl font-normal tracking-normal mr-2`}>{t('bannerArt')}</span> {t('bannerOurs')}</h2>
        </div>
      </section>

      {/* ===== Scroll 3: Editorial Category Grid ===== */}
      <section id="kategori" className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-7xl mx-auto px-4 md:px-8">
          {/* Category: Sanggar Tari */}
          <Link href="/sanggar" className="block group">
            <div className="relative w-full aspect-[3/4] bg-slate-200 overflow-hidden mb-4 cursor-pointer group-hover:shadow-2xl transition-shadow duration-500">
              {/* <img src="/penari2.webp" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out" alt="Sanggar Tari" /> */}
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/50 text-lg font-medium tracking-widest uppercase group-hover:scale-105 transition-transform duration-700 ease-in-out">NO IMAGE</div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className={`${dancingScript.className} text-4xl md:text-5xl tracking-wide relative inline-block pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 group-hover:after:w-full`}>{t('categorySanggar')}</h3>
              </div>
            </div>
            <div className="flex justify-center">
              <span className="inline-block px-8 py-3 border border-slate-300 text-slate-800 text-sm tracking-[0.2em] uppercase hover:bg-slate-900 hover:text-white transition-colors">{t('viewSanggar')}</span>
            </div>
          </Link>

          {/* Category: Seniman Musik */}
          <Link href="/pemusik" className="block group">
            <div className="relative w-full aspect-[3/4] bg-slate-200 overflow-hidden mb-4 cursor-pointer group-hover:shadow-2xl transition-shadow duration-500">
              {/* <img src="/musik1.webp" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out" alt="Seniman Musik" /> */}
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/50 text-lg font-medium tracking-widest uppercase group-hover:scale-105 transition-transform duration-700 ease-in-out">NO IMAGE</div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className={`${dancingScript.className} text-4xl md:text-5xl tracking-wide relative inline-block pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 group-hover:after:w-full`}>{t('categorySenimanMusik')}</h3>
              </div>
            </div>
            <div className="flex justify-center">
              <span className="inline-block px-8 py-3 border border-slate-300 text-slate-800 text-sm tracking-[0.2em] uppercase hover:bg-slate-900 hover:text-white transition-colors">{t('viewPemusik')}</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ===== Feature Highlights ===== */}
      <section className="border-t border-surface-200/60 bg-slate-50/50 py-16 sm:py-20">
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

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 max-w-6xl mx-auto">
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
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(234,88,12,0.15)] flex flex-col items-center text-center relative z-10"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-orange-600 mb-6 shadow-inner">
                  <feature.icon className="h-10 w-10 stroke-[1.5]" />
                </div>
                <h3 className="font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
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
