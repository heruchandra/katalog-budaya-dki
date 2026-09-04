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
    { href: "#", label: t('footerAbout') },
    { href: "#", label: t('footerPrivacy') },
    { href: "#", label: t('footerTerms') },
  ];

  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <footer 
      className="relative mt-auto text-white border-t border-white/10 pt-14 pb-8 overflow-hidden"
      style={{
        background: 'radial-gradient(120% 120% at 10% 0%, #1e293b 0%, #111827 40%, #080b11 100%)'
      }}
    >
      {/* Subtle warm orange top border line accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-orange-500/40 via-white/10 to-transparent pointer-events-none" />

      {/* Batik pattern overlay */}
      <div className="batik-pattern pointer-events-none absolute inset-0 opacity-10" />

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
                priority
              />
              <div className="flex flex-col"> 
                <span className="text-base font-bold leading-tight text-white">
                  {brandTitle}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-500/90">
                  DKI Jakarta
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400 text-justify">
              {t('footerDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-gray-200 uppercase">
              {t('footerCatalog')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
    
          {/* Info Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-gray-200 uppercase">
              {t('footerInfo')}
            </h3>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-gray-200 uppercase">
              {t('footerContact')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 shrink-0 mt-1 text-orange-500/80" />
                <span className="text-sm leading-relaxed text-justify">
                  Jl. Gatot Subroto Kav. 40-41 Lt 11, 12, 14 dan 15, Kuningan, Kuningan Timur, Setiabudi, Jakarta Selatan, DKI Jakarta 12950
                </span>
              </li>
              <li>
                <a
                  href="tel:+62211234567" 
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <Phone className="w-5 h-5 shrink-0 text-orange-500/80" />
                  (021) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@disbud.jakarta.go.id"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <Mail className="w-5 h-5 shrink-0 text-orange-500/80" />
                  info@disbud.jakarta.go.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Dinas Kebudayaan Provinsi DKI Jakarta. {t('footerCopyright')}
          </p>
          <p className="text-xs text-gray-500">
            {t('footerBuiltWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}
