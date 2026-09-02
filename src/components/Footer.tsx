"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

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
    <footer className="relative mt-auto overflow-hidden bg-gradient-to-tr from-[#2b3284] via-[#e51a62] to-[#fbb03b] text-white/90">
      {/* Batik pattern overlay */}
      <div className="batik-pattern pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-8 w-full">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image src="/logo-disbud.webp" alt="Logo Dinas Kebudayaan DKI Jakarta" width={40} height={40} className="object-contain" priority />
              <div className="flex flex-col"> 
                <span className="text-base font-bold leading-tight text-white">
                  Katalog Seni
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/90">
                  DKI Jakarta
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80 text-justify">
              {t('footerDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              {t('footerCatalog')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
    
          {/* Info Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              {t('footerInfo')}
            </h3>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              {t('footerContact')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/80">
                <MapPin className="w-5 h-5 shrink-0 mt-1 text-white" />
                <span className="text-sm leading-relaxed text-justify">
                  Jl. Gatot Subroto Kav. 40-41 Lt 11, 12, 14 dan 15, Kuningan, Kuningan Timur, Setiabudi, Jakarta Selatan, DKI Jakarta 12950
                </span>
              </li>
              <li>
                <a
                  href="tel:+62211234567" 
                  className="flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-white"
                >
                  <Phone className="w-5 h-5 shrink-0 text-white" />
                  (021) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@disbud.jakarta.go.id"
                  className="flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-white"
                >
                  <Mail className="w-5 h-5 shrink-0 text-white" />
                  info@disbud.jakarta.go.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 sm:flex-row">
          <p className="text-xs text-white/80">
            &copy; {currentYear} Dinas Kebudayaan Provinsi DKI Jakarta. {t('footerCopyright')}
          </p>
          <p className="text-xs text-white/70">
            {t('footerBuiltWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}
