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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const isTransparentPage = pathname === '/';
  const isTransparent = isTransparentPage && !scrolled;

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

  if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className={`flex items-center justify-center transition-all duration-300 ease-in-out fixed w-full top-0 z-[9999] py-2.5 ${jakarta.className} ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    } ${
      isTransparent ? 'text-white' : 'text-orange-600'
    }`}>
      <nav className="relative flex items-center justify-between w-full max-w-[1440px] mx-auto px-6 lg:px-12 text-sm gap-4 lg:gap-8">
        {/* Group 1: Left - Logos & Title */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
          >
          <div className="flex items-center gap-4 border-r border-slate-200 pr-4">
            <Image src="/logo-jayaraya.webp" alt="Logo Jaya Raya DKI Jakarta" width={40} height={40} className="h-10 w-auto object-contain translate-y-[2px]" priority />
            <Image src={language === 'en' ? '/logo-5abad-english.webp' : '/logo-5abad.webp'} alt="Logo Jakarta 5 Abad" width={40} height={40} className="h-10 w-auto object-contain drop-shadow-sm" priority />
            <Image src="/logo-disbud.webp" alt="Logo Dinas Kebudayaan DKI Jakarta" width={40} height={40} className="h-10 w-auto object-contain" priority />
          </div>
          <div className={`flex flex-col justify-center items-start text-left whitespace-nowrap ${jakarta.className}`}>
            <span className={`text-lg font-bold tracking-tight ${isTransparent ? 'text-white' : 'text-orange-600'}`}>Katalog Seni</span>
            <span className={`text-[9px] font-bold tracking-[0.2em] mt-0.5 uppercase ml-[1px] ${isTransparent ? 'text-white/80' : 'text-orange-600'}`}>DKI Jakarta</span>
          </div>
          </Link>
        </div>

        {/* Group 2: Center - Nav Links */}
        <div className="hidden lg:flex items-center justify-center gap-4 lg:gap-6 z-10">
          {/* Beranda */}
          {(() => {
            const isActive = pathname === "/";
            return (
              <Link
                href="/"
                className={`relative px-2 py-1 whitespace-nowrap text-[13px] tracking-wide transition-colors ${jakarta.className} ${
                  isActive 
                    ? (isTransparent ? "text-white font-semibold" : "text-orange-600 font-bold")
                    : (isTransparent ? "text-white/80 hover:text-white font-medium" : "text-orange-600 hover:text-orange-700 font-medium")
                } after:content-[''] after:absolute after:bottom-0 after:left-2 after:h-[2px] after:transition-all after:duration-300 ${isActive ? "after:w-[calc(100%-16px)]" : "after:w-0 hover:after:w-[calc(100%-16px)]"} ${isTransparent ? "after:bg-white" : "after:bg-orange-600"}`}
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
                  className={`relative flex items-center gap-1 px-2 py-1 whitespace-nowrap text-[13px] tracking-wide transition-colors ${jakarta.className} ${
                    isActive 
                      ? (isTransparent ? "text-white font-semibold" : "text-orange-600 font-bold")
                      : (isTransparent ? "text-white/80 hover:text-white font-medium" : "text-orange-600 hover:text-orange-700 font-medium")
                  } after:content-[''] after:absolute after:bottom-0 after:left-2 after:h-[2px] after:transition-all after:duration-300 ${isActive ? "after:w-[calc(100%-16px)]" : "after:w-0 group-hover:after:w-[calc(100%-16px)]"} ${isTransparent ? "after:bg-white" : "after:bg-orange-600"}`}
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

        {/* Group 3: Right - Actions & Auth */}
        <div className="hidden lg:flex shrink-0 items-center justify-end gap-3 lg:gap-4 z-10">
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors border whitespace-nowrap ${jakarta.className} ${isTransparent ? 'text-white hover:bg-white/10 border-white/30' : 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-100'}`} href="/admin">
                  <LayoutDashboard size={14}/>
                  <span className="hidden xl:inline">{t('navDashboard')}</span>
                </Link>
              )}
              <div className="flex items-center gap-1.5">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-xs border border-primary-200 shadow-sm ${jakarta.className}`}>
                  {displayName ? displayName.charAt(0).toUpperCase() : <UserIcon className="h-3 w-3" />}
                </div>
                <span className={`text-xs font-medium hidden xl:block max-w-[120px] truncate whitespace-nowrap ${jakarta.className} ${isTransparent ? 'text-white' : 'text-surface-700'}`}>
                  {displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap ${jakarta.className} ${isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-red-600 hover:bg-red-50'}`}
              >
                <LogOut className="h-3.5 w-3.5" />
                {t('navLogout')}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`px-4 py-1.5 rounded-none text-[13px] font-medium flex items-center gap-2 transition-colors shadow-sm ${jakarta.className} ${
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
          <div className={`w-px h-5 mx-1 ${isTransparent ? 'bg-white/30' : 'bg-slate-300'} shrink-0`}></div>
          <button 
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className={`px-4 py-1.5 rounded-none flex items-center gap-2 transition-colors ${jakarta.className} ${
              isTransparent 
                ? 'text-white border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10'
                : 'text-slate-900 border border-gray-200 hover:bg-gray-100' 
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center justify-center rounded-xl p-2.5 transition-colors lg:hidden ${isTransparent ? 'text-white hover:bg-white/10' : 'text-surface-600 hover:bg-surface-100'}`}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-surface-100 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-xl">
          {[
            { href: "/", labelKey: "navHome" },
            { href: "/sanggar", labelKey: "navSanggar" },
            { href: "/pemusik", labelKey: "navPemusik" },
          ].map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium tracking-wide transition-colors ${jakarta.className} ${
                  isActive
                    ? "bg-orange-50 text-orange-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
          <div className="mt-2 border-t border-surface-100 pt-4 pb-2 px-2">
            {/* Language Toggle Mobile */}
            <div className="flex items-center justify-center gap-2 mb-4 px-3 py-2 border border-orange-200 rounded-full bg-white/50 shadow-inner transition-all duration-300 hover:border-orange-300 hover:shadow-md">
              <img 
                src="https://hatscripts.github.io/circle-flags/flags/id.svg"
                alt="Indonesian"
                onClick={() => setLanguage('id')}
                className={`w-7 h-7 rounded-full shadow-sm object-cover transition-all cursor-pointer ${language === 'id' ? 'opacity-100 grayscale-0 scale-110' : 'opacity-50 grayscale hover:opacity-80 hover:grayscale-0'}`}
              />
              <div className="w-[1px] h-4 bg-orange-200/50" />
              <img 
                src="https://hatscripts.github.io/circle-flags/flags/gb.svg"
                alt="English"
                onClick={() => setLanguage('en')}
                className={`w-7 h-7 rounded-full shadow-sm object-cover transition-all cursor-pointer ${language === 'en' ? 'opacity-100 grayscale-0 scale-110' : 'opacity-50 grayscale hover:opacity-80 hover:grayscale-0'}`}
              />
            </div>

            {user ? (
              <div className="flex flex-col gap-4">
                {isAdmin && (
                  <Link className={`flex items-center justify-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-3 rounded-xl transition-colors border border-orange-100 ${jakarta.className}`} href="/admin">
                    <LayoutDashboard size={18}/>
                    <span>{t('navDashboardAdmin')}</span>
                  </Link>
                )}
                <div className="flex items-center gap-3 px-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm border border-primary-200 shadow-sm ${jakarta.className}`}>
                    {displayName ? displayName.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
                  </div>
                  <span className={`text-sm font-medium text-surface-900 truncate ${jakarta.className}`}>
                    {displayName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 ${jakarta.className}`}
                >
                  <LogOut className="h-4 w-4" />
                  {t('navLogout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 text-sm font-semibold text-white shadow-md ${jakarta.className}`}
              >
                <LogIn className="h-4 w-4" />
                {language === 'en' ? 'Sign In' : 'Masuk'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
