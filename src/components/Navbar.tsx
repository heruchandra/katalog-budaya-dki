"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogIn, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Plus_Jakarta_Sans } from 'next/font/google';

type NavMenu = null | "kategori" | "info";

/**
 * Closes the desktop dropdowns. They also open through CSS (hover / keyboard focus), so closing the state isn't
 * enough while the pointer is still over a menu or focus is still on one of its links: focus is released, and
 * `setHoverLock` switches the CSS opening off until the pointer leaves that menu.
 */
function dismissNavMenus(setOpenMenu: (m: NavMenu) => void, setHoverLock: (locked: boolean) => void) {
  setOpenMenu(null);
  let hovered = false;
  document.querySelectorAll<HTMLElement>("[data-nav-menu]").forEach((menu) => {
    if (menu.matches(":hover")) hovered = true;
    if (document.activeElement instanceof HTMLElement && menu.contains(document.activeElement)) document.activeElement.blur();
  });
  if (hovered) setHoverLock(true);
}

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

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  // Desktop dropdown opened by click/tap (hover and keyboard focus open it too, via CSS)
  const [openMenu, setOpenMenu] = useState<NavMenu>(null);
  // true right after a pick / route change / scroll: hover & focus no longer open the dropdowns until the pointer
  // leaves the menu (see dismissNavMenus)
  const [hoverLock, setHoverLock] = useState(false);
  const dismissMenus = () => dismissNavMenus(setOpenMenu, setHoverLock);

  // Route change: reset every menu (desktop dropdown, mobile drawer and its accordions). Adjusted while rendering
  // when the path changes (React's recommended alternative to setting state in an effect)
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
    setIsCategoryOpen(false);
    setIsInfoOpen(false);
  }
  // "Informasi" menu (desktop dropdown + mobile accordion); labels shared with the footer
  const infoLinks = [
    { href: "/tentang-kami", label: t('footerAbout') },
    { href: "/kebijakan-privasi", label: t('footerPrivacy') },
    { href: "/syarat-ketentuan", label: t('footerTerms') },
  ];

  const isEnglish = language === 'en';
  const brandTitle = isEnglish ? "Art Catalog" : "Katalog Seni";

  const isAdmin = user?.email === 'admindisbud@gmail.com';
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  // The Supabase client is loaded lazily: the navbar is on every page but only needs it for the login state,
  // so supabase-js stays out of the initial JavaScript of public pages. It is also only fetched once the page
  // has loaded and the browser is idle, so it doesn't compete with the hero for bandwidth and CPU.
  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const connect = () => import("@/lib/supabase").then(({ supabase }) => {
      if (cancelled) return;
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!cancelled) setUser(session?.user || null);
      });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
      unsubscribe = () => subscription.unsubscribe();
    });

    const schedule = () => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(connect, { timeout: 1500 });
      else timeoutId = setTimeout(connect, 200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // Close a click-opened dropdown on an outside click/tap or Escape
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest?.(`[data-nav-menu="${openMenu}"]`)) setOpenMenu(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      // scrolling closes an open desktop dropdown (opened by click, hover or keyboard focus)
      const anyOpen = [...document.querySelectorAll<HTMLElement>("[data-nav-panel]")].some((p) => getComputedStyle(p).display !== "none");
      if (anyOpen) dismissNavMenus(setOpenMenu, setHoverLock);
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

  // After a route change, release focus still sitting on a dropdown link (it would keep the menu open via CSS)
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement && document.activeElement.closest("[data-nav-menu]")) {
      document.activeElement.blur();
    }
  }, [pathname]);

  if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <>
      <header className={`flex items-center justify-center transition-all duration-300 ease-in-out fixed w-full top-0 z-[9999] h-16 ${jakarta.className} border-none ${
        isTransparent
          ? 'shadow-none text-white'
          : 'shadow-sm text-zinc-900'
      }`}>
        {/* Header glass lives on this layer, not on <header>: a backdrop-filter on the header would make it a
            backdrop root, and the Kategori dropdown's own blur would then only see the header, not the page */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 pointer-events-none transition-colors duration-300 ${
            isTransparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md'
          }`}
        />
        <nav aria-label={t('navMainLabel')} className="relative flex items-center justify-between w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12 text-sm">
          {/* Group 1: Left - Logos & Title */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-nowrap shrink-0 z-10 min-w-0">
            <Link
              href="/"
              aria-label={t('navHomeLinkLabel')}
              className="group flex items-center gap-1.5 sm:gap-3 flex-nowrap transition-transform duration-200 hover:scale-[1.02] min-w-0"
            >
              <div className="flex items-center gap-1.5 sm:gap-3 flex-nowrap shrink-0">
                <Image
                  src="/logos/logo-jayaraya.webp"
                  alt="Logo Jaya Raya DKI Jakarta"
                  width={40}
                  height={40}
                  className="h-6 sm:h-9 w-auto object-contain translate-y-[1px]"
                  loading="eager"
                />
                <Image
                  src={language === 'en' ? '/logos/logo-5abad-english.webp' : '/logos/logo-5abad.webp'}
                  alt="Logo Jakarta 5 Abad"
                  width={40}
                  height={40}
                  className="h-6 sm:h-9 w-auto object-contain drop-shadow-sm"
                  loading="eager"
                />
                <Image
                  src="/logos/logo-disbud.webp"
                  alt="Logo Dinas Kebudayaan DKI Jakarta"
                  width={49}
                  height={32}
                  className="h-5 w-[30px] sm:h-8 sm:w-[49px] object-contain"
                  loading="eager"
                />
              </div>

              {/* Vertical divider line */}
              <div className={`h-5 sm:h-7 w-[1px] my-auto mx-0.5 shrink-0 transition-colors duration-300 ${
                isTransparent ? 'bg-white/40' : 'bg-slate-200'
              }`} />

              {/* gap + leading-snug keep "DKI JAKARTA" from sitting tight under the title; the column stays
                  vertically centred against the logos because the parent link is items-center */}
              <div className={`flex flex-col justify-center items-start gap-0.5 sm:gap-1 text-left whitespace-nowrap min-w-0 ${jakarta.className}`}>
                <span className="text-xs sm:text-base font-bold leading-tight whitespace-nowrap truncate text-orange-500">
                  {brandTitle}
                </span>
                {/* not rendered (flex column); keeps "Katalog Seni DKI Jakarta" as words for the link's accessible name */}
                {" "}
                <span className={`text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase ml-[1px] leading-snug transition-colors duration-300 ${
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
                  } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:rounded-none after:bg-gradient-to-r after:from-orange-600 after:to-orange-700 after:transition-all after:duration-300 ${
                    isActive ? "after:w-[calc(100%-16px)]" : "after:w-0 hover:after:w-[calc(100%-16px)]"
                  }`}
                >
                  {t('navHome')}
                </Link>
              );
            })()}

            {/* Kategori Dropdown */}
            {(() => {
              const isActive = pathname.startsWith("/sanggar") || pathname.startsWith("/pemusik");
              return (
                <div
                  data-nav-menu="kategori"
                  // a mouse leaving the menu re-enables hover opening (a touch "leave" doesn't: tap hover sticks)
                  onPointerLeave={(e) => { if (e.pointerType !== "touch") setHoverLock(false); }}
                  className="relative group flex items-center h-full"
                >
                  <button
                    type="button"
                    aria-expanded={openMenu === "kategori"}
                    aria-controls="nav-menu-kategori"
                    onClick={() => setOpenMenu((m) => (m === "kategori" ? null : "kategori"))}
                    className={`relative flex items-center gap-1 px-2 py-1 whitespace-nowrap text-[13px] tracking-wide transition-colors duration-300 ${jakarta.className} ${
                      isActive
                        ? (isTransparent ? "text-white font-semibold" : "text-orange-600 font-bold")
                        : (isTransparent ? "text-white/80 hover:text-white font-medium" : "text-zinc-700 hover:text-orange-600 font-medium")
                    } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:rounded-none after:bg-gradient-to-r after:from-orange-600 after:to-orange-700 after:transition-all after:duration-300 ${
                      isActive || openMenu === "kategori" ? "after:w-[calc(100%-16px)]" : hoverLock ? "after:w-0" : "after:w-0 group-hover:after:w-[calc(100%-16px)] group-focus-within:after:w-[calc(100%-16px)]"
                    }`}
                  >
                    {language === 'en' ? 'Category' : 'Kategori'}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${hoverLock ? "" : "group-hover:rotate-180 group-focus-within:rotate-180"} ${openMenu === "kategori" ? "rotate-180" : ""}`} />
                  </button>
                  {/* Dropdown Panel: left edge flush with the "Kategori" text/underline (the trigger has px-2, so left-2).
                      pt-2 (not mt-2) is an invisible hover bridge,
                      so moving the cursor down from "Kategori" doesn't cross a gap and close the menu.
                      Opens on hover, and on click/keyboard via focus-within.
                      Closed = display:none (not opacity-0/invisible): Safari can keep painting a hidden element's
                      backdrop-blur and shadow, which showed up as a dark bar under the navbar. */}
                  <div id="nav-menu-kategori" data-nav-panel className={`absolute left-2 top-full pt-2 w-max min-w-[190px] z-50 ${openMenu === "kategori" ? "block" : "hidden"} ${hoverLock ? "" : "group-hover:block group-focus-within:block"}`}>
                    <div className="bg-black/85 backdrop-blur-xl border border-white/20 shadow-2xl rounded-none p-1.5 overflow-hidden">
                      {[
                        { href: "/sanggar", label: t('navSanggar') },
                        { href: "/pemusik", label: t('navPemusik') },
                      ].map((item) => {
                        const isItemActive = pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={dismissMenus}
                            aria-current={isItemActive ? "page" : undefined}
                            className={`block px-3.5 py-2 text-sm whitespace-nowrap rounded-md cursor-pointer transition-colors ${jakarta.className} ${
                              isItemActive
                                ? "text-orange-400 bg-orange-600/20 font-bold"
                                : "font-medium text-zinc-200 hover:text-orange-400 hover:bg-zinc-800/80"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Informasi Dropdown (same trigger + panel styling as Kategori) */}
            {(() => {
              const isActive = infoLinks.some((item) => pathname === item.href);
              return (
                <div
                  data-nav-menu="info"
                  // a mouse leaving the menu re-enables hover opening (a touch "leave" doesn't: tap hover sticks)
                  onPointerLeave={(e) => { if (e.pointerType !== "touch") setHoverLock(false); }}
                  className="relative group flex items-center h-full"
                >
                  <button
                    type="button"
                    aria-expanded={openMenu === "info"}
                    aria-controls="nav-menu-info"
                    onClick={() => setOpenMenu((m) => (m === "info" ? null : "info"))}
                    className={`relative flex items-center gap-1 px-2 py-1 whitespace-nowrap text-[13px] tracking-wide transition-colors duration-300 ${jakarta.className} ${
                      isActive
                        ? (isTransparent ? "text-white font-semibold" : "text-orange-600 font-bold")
                        : (isTransparent ? "text-white/80 hover:text-white font-medium" : "text-zinc-700 hover:text-orange-600 font-medium")
                    } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:rounded-none after:bg-gradient-to-r after:from-orange-600 after:to-orange-700 after:transition-all after:duration-300 ${
                      isActive || openMenu === "info" ? "after:w-[calc(100%-16px)]" : hoverLock ? "after:w-0" : "after:w-0 group-hover:after:w-[calc(100%-16px)] group-focus-within:after:w-[calc(100%-16px)]"
                    }`}
                  >
                    {t('navInfo')}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${hoverLock ? "" : "group-hover:rotate-180 group-focus-within:rotate-180"} ${openMenu === "info" ? "rotate-180" : ""}`} />
                  </button>
                  <div id="nav-menu-info" data-nav-panel className={`absolute left-2 top-full pt-2 w-max min-w-[190px] z-50 ${openMenu === "info" ? "block" : "hidden"} ${hoverLock ? "" : "group-hover:block group-focus-within:block"}`}>
                    <div className="bg-black/85 backdrop-blur-xl border border-white/20 shadow-2xl rounded-none p-1.5 overflow-hidden">
                      {infoLinks.map((item) => {
                        const isItemActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={dismissMenus}
                            aria-current={isItemActive ? "page" : undefined}
                            className={`block px-3.5 py-2 text-sm whitespace-nowrap rounded-md cursor-pointer transition-colors ${jakarta.className} ${
                              isItemActive
                                ? "text-orange-400 bg-orange-600/20 font-bold"
                                : "font-medium text-zinc-200 hover:text-orange-400 hover:bg-zinc-800/80"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
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
                    className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-none transition-colors whitespace-nowrap ${jakarta.className} ${
                      isTransparent 
                        ? 'text-white hover:bg-white/10 border border-white/30' 
                        : 'text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-100'
                    }`} 
                    href="/admin"
                    aria-label={t('navDashboard')}
                  >
                    <LayoutDashboard size={14} aria-hidden="true" />
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
                  type="button"
                  onClick={handleLogout}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-none px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap ${jakarta.className} ${
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
                    : 'bg-brand hover:bg-brand-deep text-white shadow-orange-600/20'
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
              type="button"
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              aria-label={t('navSwitchLanguage')}
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
                src={language === 'id' ? '/flags/id.svg' : '/flags/gb.svg'}
                alt=""
                className="w-6 h-4 rounded-none object-cover shadow-sm"
              />
            </button>
          </div>

          {/* Group 4: Mobile Hamburger Button - ONLY on mobile (< md) */}
          <div className="flex items-center md:hidden ml-auto shrink-0 z-10">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className={`inline-flex items-center justify-center rounded-none p-2 transition-colors duration-300 ${
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
        inert={!isMobileMenuOpen}
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
          className={`fixed top-0 right-0 w-[85%] max-w-xs h-full bg-white/98 backdrop-blur-xl z-[10001] p-6 flex flex-col justify-between gap-6 overflow-y-auto shadow-2xl rounded-none transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } ${jakarta.className}`}
        >
          <div>
            {/* Drawer Header: Logo + Branding + Close */}
            <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src="/logos/logo-disbud.webp"
                  alt="Logo Dinas Kebudayaan DKI Jakarta"
                  width={55}
                  height={36}
                  className="h-9 w-[55px] object-contain shrink-0"
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
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-none text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                aria-label={t('navCloseMenu')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav aria-label={t('navMobileLabel')} className="pt-6 flex flex-col gap-1.5 text-left">
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
                    ? "bg-orange-50 text-orange-600 border-l-4 border-orange-600 font-bold px-4 py-3 rounded-none transition-all flex items-center justify-between"
                    : "rounded-none px-4 py-3 text-zinc-800 font-semibold hover:bg-zinc-100 transition-all flex items-center justify-between"
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
                      aria-controls="mobile-menu-kategori"
                      className={`w-full text-sm tracking-wide uppercase px-4 py-3 rounded-none flex items-center justify-between transition-all ${
                        isCategoryActive
                          ? "bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-600"
                          : "text-zinc-800 font-semibold hover:bg-zinc-100"
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
                      id="mobile-menu-kategori"
                      inert={!isCategoryOpen}
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
                              className={`block px-3 py-2 rounded-none text-sm transition-colors ${
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

              {/* Informasi (accordion, same styling as Art Categories) */}
              {(() => {
                const isInfoActive = infoLinks.some((item) => pathname === item.href);
                return (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsInfoOpen(!isInfoOpen)}
                      aria-expanded={isInfoOpen}
                      aria-controls="mobile-menu-info"
                      className={`w-full text-sm tracking-wide uppercase px-4 py-3 rounded-none flex items-center justify-between transition-all ${
                        isInfoActive
                          ? "bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-600"
                          : "text-zinc-800 font-semibold hover:bg-zinc-100"
                      }`}
                    >
                      <span>{t('navInfo')}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isInfoOpen ? "rotate-180 text-orange-600" : "text-zinc-400"
                        }`}
                      />
                    </button>

                    <div
                      id="mobile-menu-info"
                      inert={!isInfoOpen}
                      className={`overflow-hidden transition-all duration-200 ${
                        isInfoOpen ? "max-h-56 opacity-100 mt-1" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-l-2 border-orange-200 ml-6 pl-4 py-1 space-y-2">
                        {infoLinks.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              aria-current={isSubActive ? "page" : undefined}
                              className={`block px-3 py-2 rounded-none text-sm transition-colors ${
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
              <div className="grid grid-cols-2 gap-1 bg-zinc-100 p-1 rounded-none border border-zinc-200/60">
                {([
                  { code: 'id', label: 'Indonesia', flag: '/flags/id-circle.svg' },
                  { code: 'en', label: 'English', flag: '/flags/gb-circle.svg' },
                ] as const).map((lang) => {
                  const isActiveLang = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      aria-pressed={isActiveLang}
                      className={`py-2 px-3 flex items-center justify-center gap-2 text-xs border transition-all ${
                        isActiveLang
                          ? "bg-white text-orange-600 font-bold shadow-xs rounded-none border-zinc-200/80"
                          : "text-zinc-600 hover:text-zinc-900 font-medium border-transparent"
                      }`}
                    >
                      <img
                        src={lang.flag}
                        alt=""
                        loading="lazy"
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
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 py-3 rounded-none transition-all"
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
                  className="w-full flex items-center justify-center gap-2 rounded-none bg-red-50 hover:bg-red-100 py-3 text-sm font-semibold text-red-600 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('navLogout')}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-brand hover:bg-brand-deep active:scale-[0.99] text-white font-bold py-3.5 rounded-none shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all"
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
