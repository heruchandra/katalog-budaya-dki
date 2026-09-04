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
import HeroAudio from "@/components/HeroAudio";
import RotatingText from "@/components/RotatingText";
import AccordionGallery from "@/components/AccordionGallery";
import { motion, AnimatePresence } from "motion/react";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
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
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const router = useRouter();

  const isEnglish = language === 'en';
  const heroWords = language === 'id'
    ? ['Pelaku Seni', 'Sanggar Tari', 'Seniman Musik']
    : ['Traditional Artists', 'Dance Studios', 'Music Artists'];

  const culturalPillars = [
    {
      id: 'penari',
      title: isEnglish ? 'Penari (Sanggar Tari)' : 'Penari (Sanggar Tari)',
      label: isEnglish ? 'Penari (Sanggar Tari)' : 'Penari (Sanggar Tari)',
      subtitle: isEnglish ? 'Grace of Traditional Betawi Dance' : 'Keanggunan Gerak Tradisional Betawi',
      image: '/penari1.webp',
      link: '/sanggar'
    },
    {
      id: 'pemusik',
      title: isEnglish ? 'Pemusik (Seniman Musik)' : 'Pemusik (Seniman Musik)',
      label: isEnglish ? 'Pemusik (Seniman Musik)' : 'Pemusik (Seniman Musik)',
      subtitle: isEnglish ? 'Harmonies & Classical Rhythms' : 'Harmoni Nada & Irama Klasik',
      image: '/koleksi2.webp',
      link: '/seniman-musik'
    },
    {
      id: 'ondel-ondel',
      title: 'Ondel-Ondel',
      label: 'Ondel-Ondel',
      subtitle: isEnglish ? 'Grand Icon of Jakarta Folk Festivity' : 'Ikon Megah Pesta Rakyat Jakarta',
      image: '/koleksi3.webp',
      link: '#'
    },
    {
      id: 'pesilat',
      title: isEnglish ? 'Pesilat (Silat Betawi)' : 'Pesilat (Silat Betawi)',
      label: isEnglish ? 'Pesilat (Silat Betawi)' : 'Pesilat (Silat Betawi)',
      subtitle: isEnglish ? 'Stances & Agility of Betawi Martial Arts' : 'Jurus & Ketangkasan Bela Diri Betawi',
      image: '/koleksi4.webp',
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
        let formattedSanggar: any[] = [];
        let formattedPemusik: any[] = [];

        if (selectedCategory === 'all' || selectedCategory === 'dance') {
          const { data: sanggarData } = await supabase
            .from('sanggars')
            .select('id, nama_sanggar')
            .ilike('nama_sanggar', `%${searchQuery}%`)
            .limit(10);

          const rawSanggar = (sanggarData || []).map((item) => ({
            id: `s-${item.id}`,
            name: item.nama_sanggar.replace(/^Sanggar\s+/i, ''),
            type: 'Sanggar',
            href: `/sanggar/${item.id}`
          }));

          formattedSanggar = rawSanggar
            .filter(item => item.name.toLowerCase().startsWith(searchQuery.toLowerCase()))
            .slice(0, 3);
        }

        if (selectedCategory === 'all' || selectedCategory === 'music') {
          const { data: pemusikData } = await supabase
            .from('pemusiks')
            .select('id, nama_seniman')
            .ilike('nama_seniman', `%${searchQuery}%`)
            .limit(10);

          const rawPemusik = (pemusikData || []).map((item) => ({
            id: `p-${item.id}`,
            name: item.nama_seniman,
            type: 'Pemusik',
            href: `/pemusik/${item.id}`
          }));

          formattedPemusik = rawPemusik
            .filter(item => item.name.toLowerCase().startsWith(searchQuery.toLowerCase()))
            .slice(0, 3);
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

        <div className="relative z-50 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12 mt-8">
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
        
        <HeroAudio />
      </section>

      {/* ===== Hero 4-Panel Accordion Gallery ===== */}
      <section className="w-full bg-surface-50 py-4 sm:py-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <AccordionGallery
            items={culturalPillars}
            defaultIndex={0}
            height={560}
            radius={20}
            gap={14}
            expandRatio={0.52}
            accentColor="#ff7b00"
            overlayColor="#060010"
            trigger="hover"
            className="shadow-2xl"
          />
        </div>
      </section>

      {/* ===== Scroll 3: Editorial Category Grid ===== */}
      <section id="kategori" className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-7xl mx-auto px-4 md:px-8">
          {/* Category: Sanggar Tari */}
          <Link href="/sanggar" className="block group">
            <div className="relative w-full aspect-[3/4] bg-slate-200 overflow-hidden mb-4 cursor-pointer group-hover:shadow-2xl transition-shadow duration-500">
              <img src="/katalog-sanggar.webp" className="object-cover w-full h-full absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700 ease-in-out" alt="Sanggar Tari" />
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 text-white z-10">
                <h3 className={`${dancingScript.className} text-4xl md:text-5xl tracking-wide relative inline-block pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 group-hover:after:w-full`}>{t('categorySanggar')}</h3>
              </div>
            </div>
            <div className="flex justify-center">
              <span className="inline-block px-8 py-3 border border-slate-300 text-slate-800 text-sm tracking-[0.2em] uppercase hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-colors duration-300">{t('viewSanggar')}</span>
            </div>
          </Link>

          {/* Category: Seniman Musik */}
          <Link href="/pemusik" className="block group">
            <div className="relative w-full aspect-[3/4] bg-slate-200 overflow-hidden mb-4 cursor-pointer group-hover:shadow-2xl transition-shadow duration-500">
              <img src="/katalog-musik.webp" className="object-cover w-full h-full absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700 ease-in-out" alt="Seniman Musik" />
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 text-white z-10">
                <h3 className={`${dancingScript.className} text-4xl md:text-5xl tracking-wide relative inline-block pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 group-hover:after:w-full`}>{t('categorySenimanMusik')}</h3>
              </div>
            </div>
            <div className="flex justify-center">
              <span className="inline-block px-8 py-3 border border-slate-300 text-slate-800 text-sm tracking-[0.2em] uppercase hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-colors duration-300">{t('viewPemusik')}</span>
            </div>
          </Link>
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
                className="rounded-none border border-neutral-200 bg-white p-8 hover:border-orange-500 transition-colors duration-300 shadow-sm flex flex-col items-center text-center"
              >
                <div className="rounded-none w-14 h-14 flex items-center justify-center bg-orange-50 border border-orange-100 mb-6 mx-auto">
                  <feature.icon className="h-7 w-7 stroke-[1.5] text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
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
