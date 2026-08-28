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

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-[1600px] px-6 py-3 bg-white/75 backdrop-blur-lg border border-white/50 rounded-full shadow-2xl shadow-orange-900/10 flex items-center justify-between transition-all duration-500 ${jakarta.className}`}>
      <nav className="relative flex w-full items-center justify-between">
        {/* Group 1: Left - Logos & Title */}
        <div className="flex items-center gap-3 z-10">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
          >
          <div className="flex items-center gap-3 border-r border-slate-200 pr-3">
            <Image src="/logo-jayaraya.webp" alt="Logo Jaya Raya DKI Jakarta" width={36} height={36} className="h-9 w-auto object-contain" priority />
            <Image src="/logo-5abad.webp" alt="Logo Jakarta 5 Abad" width={56} height={56} className="h-10 w-auto object-contain drop-shadow-sm" priority />
            <Image src="/logo-disbud.webp" alt="Logo Dinas Kebudayaan DKI Jakarta" width={36} height={36} className="h-9 w-auto object-contain" priority />
          </div>
          <div className="flex flex-col justify-center items-start text-left whitespace-nowrap">
            <span className="text-xl font-bold tracking-tight text-slate-900">Katalog Seni</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-orange-600 mt-0.5 uppercase">DKI Jakarta</span>
          </div>
          </Link>
        </div>

        {/* Group 2: Center - Nav Links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-8 z-10">
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
                className={`relative whitespace-nowrap text-sm tracking-wide transition-colors ${jakarta.className} ${
                  isActive 
                    ? "text-orange-700 font-semibold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[3px] after:bg-orange-600 after:rounded-full" 
                    : "relative text-slate-500 font-medium hover:text-slate-900 transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-orange-600 after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </div>

        {/* Group 3: Right - Actions & Auth */}
        <div className="hidden lg:flex items-center justify-end gap-5 z-10">
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link className="flex items-center gap-1.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors border border-orange-100 whitespace-nowrap" href="/admin">
                  <LayoutDashboard size={15}/>
                  <span className="hidden xl:inline">{t('navDashboard')}</span>
                </Link>
              )}
              <div className="flex items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-xs border border-primary-200 shadow-sm">
                  {displayName ? displayName.charAt(0).toUpperCase() : <UserIcon className="h-3.5 w-3.5" />}
                </div>
                <span className="text-sm font-medium text-surface-700 hidden xl:block max-w-[120px] truncate whitespace-nowrap">
                  {displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 whitespace-nowrap"
              >
                <LogOut className="h-4 w-4" />
                {t('navLogout')}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 text-sm font-semibold tracking-wide text-white shadow-md shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/40 whitespace-nowrap"
            >
              <LogIn className="h-4 w-4" />
              {t('navLogin')}
            </Link>
          )}

          {/* Standalone Language Switcher Pill */}
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button 
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className="flex items-center gap-2 group p-1.5 rounded-md hover:bg-slate-200/50 transition-colors"
          >
            <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">
              {language === 'id' ? 'Indonesia' : 'English'}
            </span>
            <img 
              src={language === 'id' ? 'https://flagcdn.com/id.svg' : 'https://flagcdn.com/gb.svg'} 
              alt={language === 'id' ? 'ID' : 'EN'} 
              className="w-5 h-5 rounded-full object-cover border border-gray-300 shadow-sm"
            />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-xl p-2.5 text-surface-600 transition-colors hover:bg-surface-100 lg:hidden"
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
                  <Link className="flex items-center justify-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-3 rounded-xl transition-colors border border-orange-100" href="/admin">
                    <LayoutDashboard size={18}/>
                    <span>{t('navDashboardAdmin')}</span>
                  </Link>
                )}
                <div className="flex items-center gap-3 px-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm border border-primary-200 shadow-sm">
                    {displayName ? displayName.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
                  </div>
                  <span className="text-sm font-medium text-surface-900 truncate">
                    {displayName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  {t('navLogout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 text-sm font-semibold text-white shadow-md"
              >
                <LogIn className="h-4 w-4" />
                {t('navLogin')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
