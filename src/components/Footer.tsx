"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const isEnglish = language === "en";
  const brandTitle = isEnglish ? "Art Catalog" : "Katalog Seni";

  const quickLinks = [
    { href: "/sanggar", label: t('navSanggar') },
    { href: "/pemusik", label: t('navPemusik') },
  ];

  const infoLinks = [
    { href: "/tentang-kami", label: t('footerAbout') },
    { href: "/kebijakan-privasi", label: t('footerPrivacy') },
    { href: "/syarat-ketentuan", label: t('footerTerms') },
  ];

  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <footer className="relative mt-auto bg-[#18191C] text-zinc-300 shadow-2xl pt-14 pb-8 overflow-hidden">
      {/* Logo flame accent: Dinas Kebudayaan orange -> magenta -> royal blue */}
      <div aria-hidden="true" className="absolute top-0 inset-x-0 z-20 h-[3px] w-full bg-gradient-to-r from-[#F7941E] via-[#E01A67] to-[#2B3990]" />

      {/* Batik pattern overlay */}
      <div aria-hidden="true" className="batik-pattern pointer-events-none absolute inset-0 opacity-10" />

      {/* Main content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-8 w-full">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo-disbud.webp"
                alt="Logo Dinas Kebudayaan DKI Jakarta"
                width={40}
                height={40}
                className="object-contain"
              />
              <div className="flex flex-col"> 
                <span className="text-base font-bold leading-tight text-white">
                  {brandTitle}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#F7941E]">
                  DKI Jakarta
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400 text-justify">
              {t('footerDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-labelledby="footer-catalog-heading">
            <h3 id="footer-catalog-heading" className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              {t('footerCatalog')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-[#F7941E] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Info Links */}
          <nav aria-labelledby="footer-info-heading">
            <h3 id="footer-info-heading" className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              {t('footerInfo')}
            </h3>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-[#F7941E] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              {t('footerContact')}
            </h3>
            <address className="not-italic">
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <MapPin className="text-[#F7941E] w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-justify">
                  Jl. Gatot Subroto Kav. 40-41 Lt 11, 12, 14 dan 15, Kuningan, Kuningan Timur, Setiabudi, Jakarta Selatan, DKI Jakarta 12950
                </span>
              </li>
              <li>
                <a
                  href="tel:+62211234567" 
                  className="flex items-center gap-3 text-sm text-zinc-400 hover:text-[#F7941E] transition-colors duration-200"
                >
                  <Phone className="text-[#F7941E] w-4 h-4 shrink-0" aria-hidden="true" />
                  (021) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@disbud.jakarta.go.id"
                  className="flex items-center gap-3 text-sm text-zinc-400 hover:text-[#F7941E] transition-colors duration-200"
                >
                  <Mail className="text-[#F7941E] w-4 h-4 shrink-0" aria-hidden="true" />
                  info@disbud.jakarta.go.id
                </a>
              </li>
            </ul>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 mt-10 text-xs text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            &copy; {currentYear} Dinas Kebudayaan Provinsi DKI Jakarta. {t('footerCopyright')}
          </p>
          <p>
            {t('footerBuiltWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}
