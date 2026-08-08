import Link from "next/link";
import {
  Search,
  Music,
  Sparkles,
  ArrowRight,
  Star,
  Users,
  Award,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="batik-pattern relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36">
        {/* Gradient background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl" />
          <div className="absolute top-1/2 -left-24 h-80 w-80 rounded-full bg-magenta-200/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-accent-100/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="flex justify-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-primary-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Platform Resmi Dinas Kebudayaan DKI Jakarta
            </div>
          </div>

          {/* Heading */}
          <h1 className="mx-auto mt-6 max-w-4xl text-center text-3xl font-extrabold leading-tight tracking-tight text-surface-900 animate-fade-in sm:text-4xl md:text-5xl lg:text-6xl">
            Temukan Pelaku Seni{" "}
            <span className="text-gradient">Tradisional Terbaik</span>{" "}
            di Jakarta
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-surface-500 animate-fade-in sm:text-lg">
            Katalog digital resmi yang memudahkan Anda menemukan sanggar tari
            bersertifikat, pemusik tradisional, dan seniman budaya berkualitas
            untuk berbagai acara dan kebutuhan kesenian.
          </p>

          {/* ===== Search Bar ===== */}
          <div className="mx-auto mt-10 max-w-2xl animate-slide-up">
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-400 via-amber-400 to-primary-500 opacity-20 blur-lg transition-opacity duration-500 group-hover:opacity-40" />
              <div className="relative flex items-center overflow-hidden rounded-2xl bg-white shadow-xl shadow-surface-900/5 ring-1 ring-surface-200/60">
                <Search className="ml-5 h-5 w-5 shrink-0 text-surface-400" />
                <input
                  type="text"
                  placeholder='Cari sanggar, seniman, atau genre... (cth: "Tari Betawi")'
                  className="w-full border-0 bg-transparent px-4 py-4.5 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none sm:text-base"
                  disabled
                  aria-label="Cari pelaku seni"
                />
                <button
                  type="button"
                  disabled
                  className="mr-2 shrink-0 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg"
                >
                  Cari
                </button>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-surface-400">
              Fitur pencarian akan segera aktif — Cari berdasarkan nama, genre, atau lokasi
            </p>
          </div>

          {/* ===== Stats Row ===== */}
          <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 animate-fade-in sm:max-w-xl">
            {[
              { icon: Users, value: "150+", label: "Sanggar Tari" },
              { icon: Music, value: "200+", label: "Pemusik" },
              { icon: Award, value: "Grade A/B", label: "Bersertifikat" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="mt-2 text-xl font-bold text-surface-900 sm:text-2xl">
                  {stat.value}
                </p>
                <p className="text-xs text-surface-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Category Cards Section ===== */}
      <section className="relative -mt-6 pb-20 sm:-mt-8 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
            {/* Card: Sanggar Tari */}
            <Link
              href="/sanggar"
              className="group relative overflow-hidden rounded-2xl border border-surface-200/60 bg-white p-6 shadow-lg shadow-surface-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10 sm:p-8"
            >
              {/* Decorative gradient corner */}
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-primary-100 to-primary-200/50 transition-transform duration-500 group-hover:scale-150" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-magenta-100/30 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">
                {/* Icon Badge */}
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30 transition-transform duration-300 group-hover:scale-110">
                  <Star className="h-7 w-7" />
                </div>

                {/* Label Badge */}
                <div className="mb-3 inline-flex ml-3 items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700">
                  <Award className="h-3 w-3" />
                  Grade A &amp; B
                </div>

                <h2 className="text-xl font-bold text-surface-900 sm:text-2xl">
                  Jelajahi Sanggar Tari
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-surface-500">
                  Temukan sanggar tari tradisional bersertifikat di Jakarta.
                  Lengkap dengan profil, galeri foto, dan kontak langsung untuk
                  pemesanan pertunjukan.
                </p>

                {/* CTA */}
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
                  Lihat Semua Sanggar
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Card: Seniman Musik */}
            <Link
              href="/pemusik"
              className="group relative overflow-hidden rounded-2xl border border-surface-200/60 bg-white p-6 shadow-lg shadow-surface-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-magenta-900/10 sm:p-8"
            >
              {/* Decorative gradient corner */}
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-magenta-100 to-magenta-200/50 transition-transform duration-500 group-hover:scale-150" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-primary-100/30 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">
                {/* Icon Badge */}
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-magenta-500 to-magenta-700 text-white shadow-lg shadow-magenta-500/30 transition-transform duration-300 group-hover:scale-110">
                  <Music className="h-7 w-7" />
                </div>

                {/* Label Badge */}
                <div className="mb-3 inline-flex ml-3 items-center gap-1 rounded-full bg-magenta-100 px-3 py-1 text-xs font-bold text-magenta-700">
                  <Sparkles className="h-3 w-3" />
                  Musik Tradisional
                </div>

                <h2 className="text-xl font-bold text-surface-900 sm:text-2xl">
                  Jelajahi Seniman Musik
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-surface-500">
                  Cari pemusik tradisional Jakarta — dari gambang kromong hingga
                  tanjidor. Profil lengkap dengan spesialisasi alat musik dan
                  pengalaman tampil.
                </p>

                {/* CTA */}
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-magenta-600 transition-colors group-hover:text-magenta-700">
                  Lihat Semua Pemusik
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Feature Highlights ===== */}
      <section className="border-t border-surface-200/60 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-surface-900 sm:text-3xl">
              Kenapa Menggunakan{" "}
              <span className="text-gradient">Katalog Seni DKI?</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-surface-500 sm:text-base">
              Platform terpercaya dari Dinas Kebudayaan untuk menghubungkan
              masyarakat dengan pelaku seni terbaik Jakarta.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Award,
                title: "Terverifikasi Resmi",
                description:
                  "Setiap sanggar dan seniman telah melalui proses grading dan verifikasi oleh Dinas Kebudayaan DKI Jakarta.",
              },
              {
                icon: Search,
                title: "Pencarian Mudah",
                description:
                  "Cari berdasarkan kategori, genre, lokasi, atau nama. Temukan seniman yang tepat dalam hitungan detik.",
              },
              {
                icon: Users,
                title: "Hubungi Langsung",
                description:
                  "Setiap profil dilengkapi kontak WhatsApp PIC untuk memudahkan komunikasi dan pemesanan langsung.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-surface-100 bg-surface-50/50 p-6 transition-all duration-300 hover:border-primary-200 hover:bg-white hover:shadow-lg hover:shadow-primary-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-surface-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-500">
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
