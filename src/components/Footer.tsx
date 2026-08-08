import Link from "next/link";
import { Landmark, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/sanggar", label: "Sanggar Tari" },
  { href: "/pemusik", label: "Pemusik" },
  { href: "/login", label: "Login" },
];

const infoLinks = [
  { href: "#", label: "Tentang Kami" },
  { href: "#", label: "Kebijakan Privasi" },
  { href: "#", label: "Syarat & Ketentuan" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden bg-surface-900 text-surface-300">
      {/* Decorative top gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600" />

      {/* Batik pattern overlay */}
      <div className="batik-pattern pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
                <Landmark className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold leading-tight text-white">
                  Katalog Seni
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-400">
                  DKI Jakarta
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-surface-400">
              Platform katalog digital pelaku seni dan budaya tradisional
              Jakarta. Memudahkan pencarian seniman, sanggar tari, dan pemusik
              berkualitas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-surface-400">
              Katalog
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-400 transition-colors duration-200 hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-surface-400">
              Informasi
            </h3>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-400 transition-colors duration-200 hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-surface-400">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-surface-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span>Jl. Kuningan Barat No.2, Jakarta Selatan</span>
              </li>
              <li>
                <a
                  href="tel:+62211234567"
                  className="flex items-center gap-2.5 text-sm text-surface-400 transition-colors hover:text-primary-400"
                >
                  <Phone className="h-4 w-4 shrink-0 text-primary-500" />
                  (021) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@disbud.jakarta.go.id"
                  className="flex items-center gap-2.5 text-sm text-surface-400 transition-colors hover:text-primary-400"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary-500" />
                  info@disbud.jakarta.go.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-700/50 pt-8 sm:flex-row">
          <p className="text-xs text-surface-500">
            &copy; {currentYear} Dinas Kebudayaan Provinsi DKI Jakarta. Hak
            Cipta Dilindungi.
          </p>
          <p className="text-xs text-surface-600">
            Dibangun dengan ❤️ untuk pelestarian seni budaya Betawi
          </p>
        </div>
      </div>
    </footer>
  );
}
