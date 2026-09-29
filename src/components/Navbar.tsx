"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogIn, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
});

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/$/, '') || '/';
  const hasHeroBanner = ['/', '/sanggar', '/pemusik', '/seniman', '/seniman-musik'].includes(normalizedPath);
  const isTransparent = hasHeroBanner && !scrolled;

  const isEnglish = language === 'en';
  const brandTitle = isEnglish ? "Art Catalog" : "Katalog Seni";

  const isAdmin = user?.email === 'admindisbud@gmail.com';
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <>
      <header className={`flex items-center justify-center transition-all duration-300 ease-in-out fixed w-full top-0 z-[9999] h-16 ${jakarta.className} border-none ${
        isTransparent
          ? 'bg-transparent border-none shadow-none text-white'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-none text-zinc-900'
      }`}>
        <nav className="relative flex items-center justify-between w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12 text-sm">
          {/* Group 1: Left - Logos & Title */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-nowrap shrink-0 z-10 min-w-0">
            <Link
              href="/"
              className="group flex items-center gap-1.5 sm:gap-3 flex-nowrap transition-transform duration-200 hover:scale-[1.02] min-w-0"
            >
              <div className="flex items-center gap-1.5 sm:gap-3 flex-nowrap shrink-0">
                <Image
                  src="/logo-jayaraya.webp"
                  alt="Logo Jaya Raya DKI Jakarta"
                  width={40}
                  height={40}
                  className="h-6 sm:h-9 w-auto object-contain translate-y-[1px]"
                  priority
                />
                <Image
                  src={language === 'en' ? '/logo-5abad-english.webp' : '/logo-5abad.webp'}
                  alt="Logo Jakarta 5 Abad"
                  width={40}
                  height={40}
                  className="h-6 sm:h-9 w-auto object-contain drop-shadow-sm"
                  priority
                />
                <Image
                  src="/logo-disbud.webp"
                  alt="Logo Dinas Kebudayaan DKI Jakarta"
                  width={40}
                  height={40}
                  className="h-5 sm:h-8 w-auto object-contain"
                  priority
                />
              </div>

              {/* Vertical divider line */}
              <div className={`h-5 sm:h-7 w-[1px] my-auto mx-0.5 shrink-0 transition-colors duration-300 ${
                isTransparent ? 'bg-white/40' : 'bg-slate-200'
              }`} />

              <div className={`flex flex-col justify-center items-start text-left whitespace-nowrap min-w-0 ${jakarta.className}`}>
                <span className="text-xs sm:text-base font-bold leading-tight whitespace-nowrap truncate text-orange-500">
                  {brandTitle}
                </span>
                <span className={`text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase ml-[1px] leading-none transition-colors duration-300 ${
                  isTransparent ? 'text-white' : 'text-zinc-800'
                }`}>
                  DKI Jakarta
                </span>
              </div>
            </Link>
          </div>

          {/* Group 2: Center - Nav Links (Desktop md+) */}
          <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6 z-10">
            {/* Beranda */}
            {(() => {
              const isActive = pathname === "/";
              return (
                <Link
                  href="/"
                  className={`relative px-2 py-1 whitespace-nowrap text-[13px] tracking-wide transition-colors duration-300 ${jakarta.className} ${
                    isActive 
                      ? (isTransparent ? "text-white font-semibold" : "text-orange-600 font-bold")
                      : (isTransparent ? "text-white/80 hover:text-white font-medium" : "text-zinc-700 hover:text-orange-600 font-medium")
                  } after:content-[''] after:absolute after:bottom-0 after:left-2 after:h-[2px] after:transition-all after:duration-300 ${
                    isActive ? "after:w-[calc(100%-16px)]" : "after:w-0 hover:after:w-[calc(100%-16px)]"
                  } ${isTransparent ? "after:bg-white" : "after:bg-orange-600"}`}
                >
                  {t('navHome')}
                </Link>
              );
            })()}

            {/* Kategori Dropdown */}
            {(() => {
              const isActive = pathname.startsWith("/sanggar") || pathname.startsWith("/pemusik");
              return (
                <div className="relative group">
                  <button
                    className={`relative flex items-center gap-1 px-2 py-1 whitespace-nowrap text-[13px] tracking-wide transition-colors duration-300 ${jakarta.className} ${
                      isActive 
                        ? (isTransparent ? "text-white font-semibold" : "text-orange-600 font-bold")
                        : (isTransparent ? "text-white/80 hover:text-white font-medium" : "text-zinc-700 hover:text-orange-600 font-medium")
                    } after:content-[''] after:absolute after:bottom-0 after:left-2 after:h-[2px] after:transition-all after:duration-300 ${
                      isActive ? "after:w-[calc(100%-16px)]" : "after:w-0 group-hover:after:w-[calc(100%-16px)]"
                    } ${isTransparent ? "after:bg-white" : "after:bg-orange-600"}`}
                  >
                    {language === 'en' ? 'Category' : 'Kategori'}
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  {/* Dropdown Panel */}
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-neutral-950/70 backdrop-blur-md border border-neutral-800/80 rounded-none shadow-lg w-max">
                      <Link
                        href="/sanggar"
                        className={`block px-4 py-2.5 text-[13px] tracking-wide transition-all duration-300 ${jakarta.className} ${
                          pathname.startsWith("/sanggar")
                            ? "text-orange-400 font-semibold bg-neutral-900/60"
                            : "text-gray-300 hover:text-orange-400 hover:bg-neutral-900/60"
                        }`}
                      >
                        {t('navSanggar')}
                      </Link>
                      <div className="border-t border-neutral-800/60"></div>
                      <Link
                        href="/pemusik"
                        className={`block px-4 py-2.5 text-[13px] tracking-wide transition-all duration-300 ${jakarta.className} ${
                          pathname.startsWith("/pemusik")
                            ? "text-orange-400 font-semibold bg-neutral-900/60"
                            : "text-gray-300 hover:text-orange-400 hover:bg-neutral-900/60"
                        }`}
                      >
                        {t('navPemusik')}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Group 3: Right - Actions & Auth (Desktop md+) */}
          <div className="hidden md:flex shrink-0 items-center justify-end gap-3 lg:gap-4 z-10">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link 
                    className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${jakarta.className} ${
                      isTransparent 
                        ? 'text-white hover:bg-white/10 border border-white/30' 
                        : 'text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-100'
                    }`} 
                    href="/admin"
                  >
                    <LayoutDashboard size={14}/>
                    <span className="hidden xl:inline">{t('navDashboard')}</span>
                  </Link>
                )}
                <div className="flex items-center gap-1.5">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-xs border border-primary-200 shadow-sm ${jakarta.className}`}>
                    {displayName ? displayName.charAt(0).toUpperCase() : <UserIcon className="h-3 w-3" />}
                  </div>
                  <span className={`text-xs font-medium hidden xl:block max-w-[120px] truncate whitespace-nowrap transition-colors duration-300 ${jakarta.className} ${
                    isTransparent ? 'text-white' : 'text-zinc-800'
                  }`}>
                    {displayName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap ${jakarta.className} ${
                    isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t('navLogout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-1.5 rounded-none text-[13px] font-medium flex items-center gap-2 transition-all shadow-sm ${jakarta.className} ${
                  isTransparent
                    ? 'bg-white text-slate-900 hover:bg-gray-100'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                <LogIn className="h-4 w-4" />
                {language === 'en' ? 'Sign In' : 'Masuk'}
              </Link>
            )}

            {/* Standalone Language Switcher Pill */}
            <div className={`w-px h-5 mx-1 shrink-0 transition-colors duration-300 ${
              isTransparent ? 'bg-white/30' : 'bg-slate-200'
            }`}></div>
            <button 
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className={`px-4 py-1.5 rounded-none flex items-center gap-2 transition-colors duration-300 ${jakarta.className} ${
                isTransparent
                  ? 'text-white border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10'
                  : 'text-zinc-800 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
              }`}
            >
              <span className="text-[13px] font-medium">
                {language === 'id' ? 'Indonesia' : 'English'}
              </span>
              <img 
                src={language === 'id' ? 'https://flagcdn.com/id.svg' : 'https://flagcdn.com/gb.svg'} 
                alt={language === 'id' ? 'ID' : 'EN'} 
                className="w-6 h-4 rounded-none object-cover shadow-sm"
              />
            </button>
          </div>

          {/* Group 4: Mobile Hamburger Button - ONLY on mobile (< md) */}
          <div className="flex items-center md:hidden ml-auto shrink-0 z-10">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className={`inline-flex items-center justify-center rounded-xl p-2 transition-colors duration-300 ${
                isTransparent ? 'text-white hover:bg-white/10' : 'text-zinc-900 hover:bg-orange-50'
              }`}
              aria-label={t('navOpenMenu')}
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Slide-Over Mobile Drawer (Side Sheet - Guess.id style) */}
      <div
        className={`fixed inset-0 z-[10000] md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Box */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('navMenuSection')}
          className={`fixed top-0 right-0 w-[85%] max-w-xs h-full bg-white/98 backdrop-blur-xl z-[10001] p-6 flex flex-col justify-between gap-6 overflow-y-auto shadow-2xl rounded-l-3xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } ${jakarta.className}`}
        >
          <div>
            {/* Drawer Header: Logo + Branding + Close */}
            <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src="/logo-jayaraya.webp"
                  alt="Logo Jaya Raya DKI Jakarta"
                  width={36}
                  height={36}
                  className="h-9 w-auto object-contain shrink-0"
                />
                <div className="flex flex-col justify-center text-left min-w-0">
                  <span className="text-base font-bold text-zinc-900 tracking-tight leading-tight truncate">
                    {brandTitle}
                  </span>
                  <span className="text-[9px] font-bold text-orange-600 tracking-[0.2em] uppercase leading-none mt-1">
                    DKI Jakarta
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                aria-label={t('navCloseMenu')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="pt-6 flex flex-col gap-1.5 text-left">
              <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-3 px-1">
                {t('navMenuSection')}
              </span>

              {/* Home */}
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={pathname === "/" ? "page" : undefined}
                className={`text-sm tracking-wide uppercase ${
                  pathname === "/"
                    ? "bg-orange-50 text-orange-600 font-bold px-4 py-3 rounded-xl flex items-center justify-between border-l-4 border-orange-500 transition-all"
                    : "text-zinc-800 font-semibold px-4 py-3 hover:bg-zinc-50 rounded-xl transition-all flex items-center justify-between"
                }`}
              >
                <span>{t('navHome')}</span>
              </Link>

              {/* Art Categories (accordion) */}
              {(() => {
                const isCategoryActive = pathname.startsWith("/sanggar") || pathname.startsWith("/pemusik");
                return (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      aria-expanded={isCategoryOpen}
                      className={`w-full text-sm tracking-wide uppercase px-4 py-3 rounded-xl flex items-center justify-between transition-all ${
                        isCategoryActive
                          ? "bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-500"
                          : "text-zinc-800 font-semibold hover:bg-zinc-50"
                      }`}
                    >
                      <span>{t('navArtCategories')}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isCategoryOpen ? "rotate-180 text-orange-600" : "text-zinc-400"
                        }`}
                      />
                    </button>

                    {/* Sub-items */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        isCategoryOpen ? "max-h-48 opacity-100 mt-1" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-l-2 border-orange-200 ml-6 pl-4 py-1 space-y-2">
                        {[
                          { href: "/sanggar", label: t('navSanggar') },
                          { href: "/pemusik", label: t('navPemusik') },
                        ].map((sub) => {
                          const isSubActive = pathname.startsWith(sub.href);
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              aria-current={isSubActive ? "page" : undefined}
                              className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                                isSubActive
                                  ? "bg-orange-50 text-orange-600 font-semibold"
                                  : "text-zinc-600 font-medium hover:text-orange-600 hover:bg-zinc-50"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </nav>

            {/* Language selector */}
            <div className="pt-8">
              <span className="block text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-3 px-1">
                {t('navSelectLanguage')}
              </span>
              <div className="grid grid-cols-2 gap-2 bg-zinc-100/80 p-1.5 rounded-2xl">
                {([
                  { code: 'id', label: 'Indonesia', flag: 'https://hatscripts.github.io/circle-flags/flags/id.svg' },
                  { code: 'en', label: 'English', flag: 'https://hatscripts.github.io/circle-flags/flags/gb.svg' },
                ] as const).map((lang) => {
                  const isActiveLang = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      aria-pressed={isActiveLang}
                      className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-all ${
                        isActiveLang
                          ? "bg-white text-orange-600 font-bold shadow-sm"
                          : "text-zinc-500 font-medium hover:text-zinc-800"
                      }`}
                    >
                      <img
                        src={lang.flag}
                        alt=""
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{lang.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Drawer Footer: Sign In / User info */}
          <div>
            {user ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 px-1 py-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200">
                    {displayName ? displayName.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-sm font-semibold text-zinc-900 truncate">{displayName}</span>
                    <span className="text-[11px] text-zinc-400 truncate">{user?.email}</span>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 py-3 rounded-2xl transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{t('navDashboardAdmin')}</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-50 hover:bg-red-100 py-3 text-sm font-semibold text-red-600 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('navLogout')}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <LogIn className="h-4 w-4" />
                <span>{t('navSignIn')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
