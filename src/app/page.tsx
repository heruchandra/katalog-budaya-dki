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
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const backgrounds = ['/batik-1.webp', '/batik-2.webp', '/batik-3.webp'];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === backgrounds.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data: sanggarData } = await supabase
          .from('sanggar')
          .select('id, namaSanggar')
          .ilike('namaSanggar', `%${searchQuery}%`)
          .limit(3);
          
        const { data: pemusikData } = await supabase
          .from('pemusik')
          .select('id, nama')
          .ilike('nama', `%${searchQuery}%`)
          .limit(3);

        const formattedSanggar = (sanggarData || []).map((item) => ({
          id: `s-${item.id}`,
          name: item.namaSanggar,
          type: 'Sanggar',
          href: `/sanggar/${item.id}`
        }));

        const formattedPemusik = (pemusikData || []).map((item) => ({
          id: `p-${item.id}`,
          name: item.nama,
          type: 'Pemusik',
          href: `/pemusik/${item.id}`
        }));

        setSuggestions([...formattedSanggar, ...formattedPemusik]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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
        <div className="absolute inset-0 overflow-hidden z-0">
          {backgrounds.map((bg, index) => (
            <img 
              key={bg} 
              src={bg} 
              alt={`Background ${index + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'} -z-10`} 
            />
          ))}
          {/* Dark overlay for premium contrast */}
          <div className="absolute inset-0 bg-black/65 z-0 pointer-events-none"></div>
        </div>

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12 mt-20">
          {/* Heading */}
          <h1 className="mx-auto max-w-5xl text-center text-3xl font-extrabold leading-tight tracking-tight animate-fade-in sm:text-4xl md:text-5xl lg:text-6xl font-sans drop-shadow-sm">
            <span className="text-white">{t('heroDiscover')}</span>{" "}
            <span className="relative inline-block">
              <span className={`text-orange-500 inline-block drop-shadow-sm ${dancingScript.className} text-5xl md:text-7xl font-bold tracking-normal`}>{t('heroArtists')}</span>
              <img src="/ondel-ondel.webp" alt="Aksen Ondel-ondel" className="absolute -top-10 -right-8 md:-top-14 md:-right-12 w-16 h-16 md:w-24 md:h-24 opacity-85 drop-shadow-lg rotate-12 pointer-events-none z-10" />
            </span>
            <br className="hidden md:block" />
            <span className="text-white">
              {t('heroBestIn')}
            </span>
          </h1>

          {/* ===== Search Bar ===== */}
          <div className="w-full max-w-3xl animate-slide-up">
            <div className="group relative z-50">
              <form 
                onSubmit={handleSearch}
                className="relative flex items-center rounded-full bg-white shadow-2xl"
              >
                <Search className="ml-5 h-5 w-5 shrink-0 text-surface-400" />
                
                {/* Premium Category Dropdown */}
                <div className="relative border-r border-slate-200">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsCategoryOpen(!isCategoryOpen);
                      setIsFocused(false);
                    }}
                    className="flex items-center justify-between gap-2 pl-6 pr-5 py-4 rounded-l-full bg-transparent hover:bg-slate-50 transition-colors w-[160px] sm:w-[190px] h-full"
                  >
                    <span className="text-sm font-semibold text-slate-700 truncate">
                      {selectedCategory === 'all' ? t('searchAllCat') : selectedCategory === 'dance' ? t('searchDanceCat') : t('searchMusicCat')}
                    </span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Floating Animated Menu */}
                  <div className={`absolute top-full left-0 mt-4 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-white/50 overflow-hidden transition-all duration-300 z-[999] origin-top-left ${isCategoryOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    <div className="p-2 flex flex-col gap-1">
                      <button 
                        type="button"
                        onClick={() => { setSelectedCategory('all'); setIsCategoryOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-colors ${selectedCategory === 'all' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
                      >
                        {t('searchAllCat')}
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setSelectedCategory('dance'); setIsCategoryOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-colors ${selectedCategory === 'dance' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
                      >
                        {t('searchDanceCat')}
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setSelectedCategory('music'); setIsCategoryOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-colors ${selectedCategory === 'music' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
                      >
                        {t('searchMusicCat')}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full relative">
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
                    className="w-full border-none focus:border-transparent focus:ring-0 outline-none bg-transparent px-4 py-4.5 text-sm text-surface-800 placeholder:text-surface-400 sm:text-base"
                    aria-label={t('searchAriaLabel')}
                  />
                </div>
                <button
                  type="submit"
                  className="mr-2 shrink-0 rounded-full bg-primary-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-primary-500/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-lg"
                >
                  {t('searchBtn')}
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-white/50 overflow-hidden z-[999]">
                  {isLoading ? (
                    <div className="p-4 flex items-center justify-center text-sm text-surface-500">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      {t('searchLoading')}
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul>
                      {suggestions.map((suggestion) => (
                        <li key={suggestion.id}>
                          <Link 
                            href={suggestion.href}
                            className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                            onClick={() => setIsFocused(false)}
                          >
                            <span className="font-medium text-surface-900">{suggestion.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              suggestion.type === 'Sanggar' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {suggestion.type}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-sm text-surface-500">
                      {t('searchNoResults')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-2 z-20">
          {backgrounds.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentSlide(index)}
              onMouseEnter={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${index === currentSlide ? 'w-10 bg-orange-600' : 'w-2 bg-gray-400/60 hover:bg-gray-800/80'}`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* ===== Scroll 2: Full-Width Editorial Banner ===== */}
      <section className="relative w-full aspect-video overflow-hidden bg-[#e5e5e5] mb-16">
        <img src="/penari1.webp" alt="Jiwa Jakarta. Seni Kita." className="absolute inset-0 w-full h-full object-cover object-center opacity-90" />
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 lg:px-12 pointer-events-none">
          <h2 className="relative z-10 text-white font-poppins text-2xl md:text-5xl tracking-wide drop-shadow-md pointer-events-auto"><span className={`${dancingScript.className} text-4xl md:text-7xl font-normal tracking-normal mr-2`}>{t('bannerSoul')}</span> {t('bannerJakarta')}</h2>
          <h2 className="relative z-10 text-white font-poppins text-2xl md:text-5xl tracking-wide drop-shadow-md pointer-events-auto"><span className={`${dancingScript.className} text-4xl md:text-7xl font-normal tracking-normal mr-2`}>{t('bannerArt')}</span> {t('bannerOurs')}</h2>
        </div>
      </section>

      {/* ===== Scroll 3: Editorial Category Grid ===== */}
      <section id="kategori" className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-7xl mx-auto px-4 md:px-8">
          {/* Category: Sanggar Tari */}
          <Link href="/sanggar" className="block group">
            <div className="relative w-full aspect-[3/4] bg-slate-200 overflow-hidden mb-4 cursor-pointer">
              <img src="/penari2.webp" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out" alt="Sanggar Tari" />
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
            <div className="relative w-full aspect-[3/4] bg-slate-200 overflow-hidden mb-4 cursor-pointer">
              <img src="/musik1.webp" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out" alt="Seniman Musik" />
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
            <h2 className="font-sans font-extrabold tracking-tight text-4xl text-slate-900">
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
