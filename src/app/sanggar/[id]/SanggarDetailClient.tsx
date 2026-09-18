"use client";

import Link from "next/link";
import { 
  Phone, 
  Mail, 
  Award, 
  Clock, 
  ArrowUpRight, 
  Sparkles,
  Building2,
  Calendar,
  Share2
} from "lucide-react";
import { Poppins, Playfair_Display, Dancing_Script } from 'next/font/google';
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });

export interface TariItem {
  name: string;
  description: string;
  image: string;
}

export interface AchievementItem {
  title: string;
  organizer?: string;
  year?: string;
}

export interface SanggarDetailData {
  id: string | number;
  name: string;
  tagline: string;
  grade: string;
  wilayah: string;
  philosophy?: string;
  description: string[];
  alamatSanggar: string;
  alamatLatihan: string;
  address?: string;
  whatsappNumber?: string;
  instagram?: string;
  layanan: string[];
  tariUnggulan: TariItem[];
  prestasi: (string | AchievementItem)[];
  achievements?: AchievementItem[];
  kontak: {
    ketua: string;
    pic: string;
    phone: string;
    email?: string;
    instagram?: string;
  };
  imageUrl: string;
  logoUrl?: string | null;
  fotoKetuaUrl?: string | null;
  gallery: { type: string; url: string }[];
}

export default function SanggarDetailClient({ sanggar }: { sanggar: SanggarDetailData }) {
  const { t } = useLanguage();

  // Safely format phone number for WhatsApp API
  const formatWaNumber = (phone?: string) => {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
  };

  const rawNumber = sanggar?.kontak?.phone || '081399160062'; 
  const waNumber = formatWaNumber(rawNumber);
  
  const studioName = sanggar?.name || 'Sanggar Seni';
  const waMessage = encodeURIComponent(
    `Halo, saya melihat profil ${studioName} di Katalog Seni DKI Jakarta. Saya ingin berkonsultasi mengenai program kelas dan pementasan seni tari.`
  );
  
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <main className={`min-h-screen bg-zinc-50 text-zinc-900 pt-16 selection:bg-orange-100 selection:text-orange-900 ${poppins.className}`}>
      
      {/* Top Container: Back Button & Pengurus Sanggar Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-4">
        {/* Subtle, elegant back link */}
        <div className="mb-4">
          <Link 
            href="/sanggar" 
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 hover:text-orange-600 uppercase transition-colors"
          >
            ← Kembali ke Katalog
          </Link>
        </div>

        {/* Pengurus Sanggar Card immediately follows */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/80 shadow-sm transition-all duration-300">
          <div>
            <span className="text-xs font-semibold tracking-widest text-orange-600 uppercase">
              Pimpinan & Manajemen
            </span>
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800 tracking-tight flex items-center gap-2 flex-wrap mt-1">
              <span>Pengurus Sanggar —</span>
              <span className={`font-dancing text-3xl sm:text-4xl text-orange-600 font-normal ${dancingScript.className}`}>
                {sanggar.name || "Art Enthusiast Production"}
              </span>
            </h1>
          </div>

          {/* Internal Divider */}
          <div className="border-t border-zinc-100 my-6" />

          <div className="md:grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column: Ketua Sanggar photo & info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-orange-500/40 p-1 shrink-0 bg-zinc-50">
                <img 
                  src={(sanggar.fotoKetuaUrl && !sanggar.fotoKetuaUrl.includes("penari1")) ? sanggar.fotoKetuaUrl : "/profile-sanggar-1.webp"} 
                  alt={sanggar.kontak.ketua} 
                  className="w-full h-full object-cover object-center rounded-full"
                />
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-xs uppercase tracking-widest text-orange-600 font-semibold block">
                  Ketua Sanggar
                </span>
                <h4 className="text-xl font-bold text-zinc-900">
                  {sanggar.kontak.ketua}
                </h4>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  Bertanggung jawab atas pembinaan mutu kurikulum tari dan arah kebijakan sanggar seni.
                </p>
              </div>
            </div>

            {/* Right Column: PIC details & WhatsApp button */}
            <div className="mt-6 md:mt-0 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-xs uppercase text-zinc-400 font-medium">Nama PIC Kontak:</span>
                  <span className="text-sm font-semibold text-zinc-800">{sanggar.kontak.pic}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-xs uppercase text-zinc-400 font-medium">Nomor WhatsApp:</span>
                  <span className="text-sm font-semibold text-zinc-800">{sanggar.kontak.phone}</span>
                </div>
                {sanggar.kontak.email && (
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-xs uppercase text-zinc-400 font-medium">Email:</span>
                    <span className="text-sm font-semibold text-zinc-800">{sanggar.kontak.email}</span>
                  </div>
                )}
              </div>

              {/* Dual Action Buttons: WhatsApp & Instagram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${sanggar.whatsappNumber || (sanggar.kontak && sanggar.kontak.phone ? formatWaNumber(sanggar.kontak.phone) : "") || "6281318702623"}?text=${encodeURIComponent("Halo, saya melihat profil sanggar di Katalog Seni DKI Jakarta dan ingin bertanya mengenai sewa kostum / jasa pentas / kelas tari.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>

                {/* Instagram Button */}
                <a
                  href={`https://instagram.com/${(sanggar.instagram || (sanggar.kontak && sanggar.kontak.instagram) || "ae.pro_").replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:opacity-90 text-white font-medium text-xs sm:text-sm rounded-xl transition-opacity shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 2-Column Grid: Main Content & Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Narrative & Content (Span 2) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Tagline Quote & Deskripsi / Merawat Jiwa Seni Tradisi */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300 group">
              <div>
                <h2 className={`text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                  Profil Sanggar
                </h2>
                <div className="w-16 h-0.5 bg-orange-600 mt-4 mb-8" />
                <div className="relative inline-block mb-4">
                  <h2 className={`text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                    Profil Sanggar
                  </h2>
                  {/* Expandable Accent Line */}
                  <span className="block h-[3px] bg-orange-600 rounded-full w-12 group-hover:w-full transition-all duration-300 ease-in-out mt-1.5" />
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2 my-6 bg-orange-50/50 rounded-r-xl">
                <p className="text-lg md:text-xl font-serif italic text-zinc-800 leading-relaxed">
                  "Berbudaya, Berprestasi, Berkualitas, Santun dan Kreatif."
                </p>
              </div>

              {/* Storytelling Paragraphs with Drop-Cap on first paragraph */}
              {sanggar.description && sanggar.description.length > 0 && (
                <div className="text-zinc-700 text-base sm:text-lg leading-relaxed space-y-5 font-light">
                  <p className="text-justify">
                    <span className={`float-left text-5xl md:text-6xl text-zinc-900 leading-none pr-3 pt-1 font-normal select-none ${playfair.className}`}>
                      {sanggar.description[0].charAt(0)}
                    </span>
                    {sanggar.description[0].slice(1)}
                  </p>

                  {sanggar.description.slice(1).map((paragraph, idx) => (
                    <p key={idx} className="text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Philosophy Callout Quote */}
              {sanggar.philosophy && (
                <blockquote className="border-l-2 border-orange-500 pl-6 my-8 py-3 text-zinc-800 bg-orange-50/50 rounded-r-xl">
                  <p className={`font-serif italic text-lg sm:text-xl text-zinc-800 leading-relaxed ${playfair.className}`}>
                    &ldquo;{sanggar.philosophy}&rdquo;
                  </p>
                  <footer className="text-xs uppercase tracking-widest text-zinc-400 font-sans mt-2 font-medium">
                    — Filosofi {sanggar.name}
                  </footer>
                </blockquote>
              )}

              {/* Architectural Dual Location Blocks */}
              <div className="border-t border-zinc-200 pt-8 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-orange-600 font-semibold">
                    <Building2 className="w-4 h-4" />
                    <span>Alamat Sanggar / Sekretariat</span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed font-sans">
                    {sanggar.alamatSanggar}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-orange-600 font-semibold">
                    <Clock className="w-4 h-4" />
                    <span>Tempat & Jadwal Latihan</span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed font-sans">
                    {sanggar.alamatLatihan}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Layanan Sanggar Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300 group">
              <div>
                <h3 className={`text-2xl sm:text-3xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                  Layanan Sanggar
                </h3>
                <div className="w-12 h-0.5 bg-orange-600 mt-3 mb-6" />
                <div className="relative inline-block mb-3">
                  <h3 className={`text-2xl sm:text-3xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                    Layanan Sanggar
                  </h3>
                  {/* Expandable Accent Line */}
                  <span className="block h-[3px] bg-orange-600 rounded-full w-12 group-hover:w-full transition-all duration-300 ease-in-out mt-1.5" />
                </div>
                <p className="text-xs text-zinc-500 font-sans tracking-wide">
                  Layanan resmi yang dikelola oleh pengurus sanggar dengan instruktur bersertifikat.
                </p>
              </div>

              {/* Minimalist Bordered List */}
              <ul className="divide-y divide-zinc-100 border-y border-zinc-100">
                {sanggar.layanan && sanggar.layanan.map((item, idx) => (
                  <li 
                    key={idx}
                    className="group py-4 flex items-center justify-between transition-all duration-200 hover:pl-2 cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-orange-600 group-hover:scale-150 transition-transform rounded-full"></span>
                      <span className="text-sm sm:text-base text-zinc-800 font-medium group-hover:text-orange-600 transition-colors">
                        {item}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Prestasi & Penghargaan Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300 group">
              <div>
                <h2 className={`text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                  Prestasi & Penghargaan
                </h2>
                <div className="w-16 h-0.5 bg-orange-600 mt-4 mb-8" />
                <div className="relative inline-block mb-4">
                  <h2 className={`text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                    Prestasi & Penghargaan
                  </h2>
                  {/* Expandable Accent Line */}
                  <span className="block h-[3px] bg-orange-600 rounded-full w-12 group-hover:w-full transition-all duration-300 ease-in-out mt-1.5" />
                </div>
              </div>

              {(() => {
                const achievementList = (sanggar.achievements && sanggar.achievements.length > 0)
                  ? sanggar.achievements
                  : (sanggar.prestasi || []);

                return achievementList && achievementList.length > 0 ? (
                  <div className="max-h-[420px] overflow-y-auto pr-2 divide-y divide-zinc-100 border-y border-zinc-100">
                    {achievementList.map((item, idx) => {
                      const isObj = typeof item === 'object' && item !== null;
                      const title = isObj ? item.title : item;
                      const organizer = isObj && item.organizer ? item.organizer : "Pencapaian Seni Resmi";
                      const year = isObj ? item.year : null;

                      return (
                        <div 
                          key={idx} 
                          className="py-4 sm:py-5 flex items-start gap-4 group hover:bg-zinc-50/60 px-2 rounded-xl transition-colors"
                        >
                          <span className={`text-2xl sm:text-3xl font-normal text-zinc-300 group-hover:text-orange-600 transition-colors leading-none font-serif shrink-0 ${playfair.className}`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-base sm:text-lg font-medium text-zinc-800 leading-snug">
                                {title}
                              </p>
                              {year && (
                                <span className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60">
                                  {year}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 uppercase tracking-wider font-sans">
                              {organizer}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 italic">
                    Data prestasi sedang dalam verifikasi arsip dinas.
                  </p>
                );
              })()}
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar / Info Cards (Span 1) */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            
            {/* Card 1: Informasi Operasional & Jadwal */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm transition-all duration-300">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-4">Informasi Latihan</h3>
              <div className="space-y-3 text-sm text-zinc-700">
                <div className="flex justify-between border-b border-zinc-100 pb-2.5">
                  <span className="text-zinc-500">Jadwal Rutin:</span>
                  <span className="font-semibold text-right text-zinc-800">Sabtu & Minggu</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2.5">
                  <span className="text-zinc-500">Jam Operasional:</span>
                  <span className="font-semibold text-right text-zinc-800">09:00 - 16:00 WIB</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-zinc-500">Status Sanggar:</span>
                  <span className="font-semibold text-emerald-600">Aktif & Terverifikasi</span>
                </div>
              </div>
            </div>

            {/* Card 2: Lokasi & Alamat */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm transition-all duration-300">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-4">Lokasi Sanggar</h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                {sanggar.alamatSanggar || sanggar.address || "Jl. Balai Pustaka Timur No. 18, Kel. Rawamangun, Kec. Pulo Gadung, Jakarta Timur 13220"}
              </p>
              <div className="w-full h-44 sm:h-52 my-3 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                <iframe
                  title="Lokasi Sanggar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(sanggar.alamatSanggar || sanggar.address || "Jl. Balai Pustaka Timur No. 18, Kel. Rawamangun, Kec. Pulo Gadung, Jakarta Timur 13220")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
              <a 
                href={sanggar.alamatSanggar || sanggar.address ? `https://maps.google.com/?q=${encodeURIComponent(sanggar.alamatSanggar || sanggar.address || "")}` : "https://maps.google.com"} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-all"
              >
                Buka di Google Maps ↗
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Gallery Section */}
      {sanggar.gallery && sanggar.gallery.length > 0 && (
        <section className="border-t border-zinc-200 bg-white py-16 lg:py-20 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 border-b border-zinc-200 pb-6 gap-4">
              <div>
                <span className="text-xs font-semibold tracking-[0.25em] text-orange-600 uppercase block mb-2">
                  DOKUMENTASI VISUAL
                </span>
                <h2 className={`text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                  Galeri Foto & Aktivitas
                </h2>
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-sans">
                {sanggar.gallery.length} Dokumentasi Terpilih
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {sanggar.gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  className="group relative overflow-hidden bg-zinc-100 rounded-2xl aspect-[4/3] border border-zinc-200 shadow-sm hover:border-orange-500/50 transition-all duration-300"
                >
                  <img 
                    src={img.url} 
                    alt={img.type} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-xs font-medium text-white tracking-wide">
                      {img.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
