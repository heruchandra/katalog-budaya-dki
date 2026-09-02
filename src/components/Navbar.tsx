"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogIn, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
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
  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !scrolled;

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
    <header className={`flex items-center justify-center transition-all duration-300 ease-in-out ${jakarta.className} ${
      isTransparent 
        ? 'bg-transparent w-full py-6 absolute top-0 left-0 z-[9999] text-white' 
        : 'bg-white shadow-md py-4 w-full fixed top-0 left-0 z-[9999] text-slate-900'
    }`}>
      <nav className="relative flex items-center justify-between w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-1 text-sm gap-4 lg:gap-8">
        {/* Group 1: Left - Logos & Title */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
          >
          <div className="flex items-center gap-2.5 border-r border-slate-200 pr-3">
            <Image src="/logo-jayaraya.webp" alt="Logo Jaya Raya DKI Jakarta" width={32} height={32} className="h-8 w-auto object-contain" priority />
            <Image src={language === 'en' ? '/logo-5abad-english.webp' : '/logo-5abad.webp'} alt="Logo Jakarta 5 Abad" width={48} height={48} className="h-9 w-auto object-contain drop-shadow-sm" priority />
            <Image src="/logo-disbud.webp" alt="Logo Dinas Kebudayaan DKI Jakarta" width={32} height={32} className="h-8 w-auto object-contain" priority />
          </div>
          <div className={`flex flex-col justify-center items-start text-left whitespace-nowrap pl-1 ${jakarta.className}`}>
            <span className={`text-lg font-bold tracking-tight ${isTransparent ? 'text-white' : 'text-slate-900'}`}>Katalog Seni</span>
            <span className={`text-[9px] font-bold tracking-[0.2em] mt-0.5 uppercase ${isTransparent ? 'text-white/80' : 'text-orange-600'}`}>DKI Jakarta</span>
          </div>
          </Link>
        </div>

        {/* Group 2: Center - Nav Links */}
        <div className="hidden lg:flex items-center justify-center gap-4 lg:gap-6 z-10">
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
                className={`relative px-2 py-1 whitespace-nowrap text-[13px] tracking-wide transition-colors ${jakarta.className} ${
                  isActive 
                    ? (isTransparent ? "text-white font-semibold" : "text-orange-700 font-semibold")
                    : (isTransparent ? "text-white/80 hover:text-white font-medium" : "text-slate-600 hover:text-orange-600 font-medium")
                } after:content-[''] after:absolute after:bottom-0 after:left-2 after:h-[2px] after:transition-all after:duration-300 ${isActive ? "after:w-[calc(100%-16px)]" : "after:w-0 hover:after:w-[calc(100%-16px)]"} ${isTransparent ? "after:bg-white" : "after:bg-orange-600"}`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
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
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide shadow-md transition-all duration-200 whitespace-nowrap ${jakarta.className} ${isTransparent ? 'bg-white text-black hover:bg-white/90 border border-transparent' : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-primary-500/25 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/40'}`}
            >
              <LogIn className="h-3.5 w-3.5" />
              {language === 'en' ? 'Sign In' : 'Masuk'}
            </Link>
          )}

          {/* Standalone Language Switcher Pill */}
          <div className={`w-px h-5 mx-1 ${isTransparent ? 'bg-white/30' : 'bg-slate-300'} shrink-0`}></div>
          <button 
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className={`flex shrink-0 items-center justify-center gap-2 transition-colors rounded-full px-3 py-1.5 border cursor-pointer group ${jakarta.className} ${isTransparent ? 'bg-transparent border-white/30 hover:bg-white/10 text-white' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}
          >
            <span className={`text-xs font-semibold transition-colors ${isTransparent ? 'group-hover:text-white/80' : 'group-hover:text-orange-600'}`}>
              {language === 'id' ? 'Indonesia' : 'English'}
            </span>
            <img 
              src={language === 'id' ? 'https://flagcdn.com/id.svg' : 'https://flagcdn.com/gb.svg'} 
              alt={language === 'id' ? 'ID' : 'EN'} 
              className={`w-4 h-4 rounded-full object-cover shadow-sm ${isTransparent ? 'border-none' : 'border border-gray-300'}`}
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
