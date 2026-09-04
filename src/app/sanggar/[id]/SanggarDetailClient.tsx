"use client";

import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Award, 
  Clock, 
  User, 
  ArrowUpRight, 
  ArrowLeft,
  MessageCircle, 
  Sparkles,
  Building2,
  Calendar,
  Share2
} from "lucide-react";
import { Dancing_Script, Poppins, Playfair_Display } from 'next/font/google';
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export interface TariItem {
  name: string;
  description: string;
  image: string;
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
  layanan: string[];
  tariUnggulan: TariItem[];
  prestasi: string[];
  kontak: {
    ketua: string;
    pic: string;
    phone: string;
    email?: string;
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
    <div className={`min-h-screen bg-white text-slate-900 pt-20 md:pt-24 selection:bg-orange-100 selection:text-orange-900 ${poppins.className}`}>
      
      {/* Top Breadcrumb / Return Link */}
      <div className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/sanggar" 
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-slate-600 hover:text-[#ea580c] transition-colors group font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>{t('backToCatalog') || 'KEMBALI KE KATALOG SANGGAR'}</span>
          </Link>
        </div>
      </div>

      {/* Cinematic Hero Media */}
      <section className="w-full relative h-[45vh] md:h-[65vh] bg-slate-950 overflow-hidden">
        <img 
          src={sanggar.imageUrl} 
          alt={sanggar.name} 
          className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        
        {/* Subtle Bottom Vignette Ribbon */}
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end text-white">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-400 font-medium">
              DIREKTORI SENI & BUDAYA JAKARTA
            </p>
            <p className="text-sm text-slate-300 font-light tracking-wide">
              {sanggar.wilayah} • Terdaftar Resmi Dinas Kebudayaan
            </p>
          </div>
        </div>
      </section>

      {/* Hero Header Extension: Title, Tagline & Sleek Metadata Ribbon */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          
          {/* Cursive Studio Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-5xl sm:text-6xl md:text-7xl font-normal text-slate-900 tracking-normal ${dancingScript.className}`}
          >
            {sanggar.name}
          </motion.h1>

          {/* Tagline in subtle serif italic */}
          {sanggar.tagline && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-lg sm:text-xl md:text-2xl text-slate-600 italic mt-4 max-w-3xl mx-auto leading-relaxed ${playfair.className}`}
            >
              “{sanggar.tagline}”
            </motion.p>
          )}

          {/* Sleek Metadata Ribbon flanked by hairline borders */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 pt-4 pb-4 border-y border-slate-200 flex flex-wrap items-center justify-center sm:justify-between gap-4 text-xs md:text-sm tracking-wider uppercase text-slate-500"
          >
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-700">
              <div className="flex items-center gap-2 font-medium normal-case font-sans">
                <User className="w-4 h-4 text-[#ea580c]" />
                <span className="text-slate-500 uppercase text-xs tracking-wider">Pimpinan:</span>
                <span className="font-semibold text-slate-800">{sanggar.kontak.ketua}</span>
              </div>
              <span className="hidden sm:inline text-slate-300">|</span>
              <div className="flex items-center gap-2 font-medium normal-case font-sans">
                <MapPin className="w-4 h-4 text-[#ea580c]" />
                <span className="text-slate-500 uppercase text-xs tracking-wider">Wilayah:</span>
                <span className="font-semibold text-slate-800">{sanggar.wilayah}</span>
              </div>
              <span className="hidden sm:inline text-slate-300">|</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold tracking-wider text-[#ea580c] bg-orange-50 border border-orange-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{sanggar.grade}</span>
              </div>
            </div>

            {/* Quick WhatsApp Booking CTA with brand orange accents */}
            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7b00] hover:bg-[#ea580c] text-white font-medium text-xs tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#ff7b00]" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* Split Editorial Grid: About & Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (60% / 7 cols): Long-form storytelling typography */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#ea580c] uppercase block mb-2">
                PROFIL & REKAM JEJAK
              </span>
              <h2 className={`text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight ${playfair.className}`}>
                Merawat Jiwa Seni Tradisi
              </h2>
              <div className="w-16 h-0.5 bg-[#ea580c] mt-4 mb-8" />
            </div>

            {/* Storytelling Paragraphs with Drop-Cap on first paragraph */}
            {sanggar.description && sanggar.description.length > 0 && (
              <div className="text-slate-700 text-base sm:text-lg leading-relaxed space-y-5 font-light">
                <p className="text-justify">
                  <span className={`float-left text-5xl md:text-6xl text-slate-900 leading-none pr-3 pt-1 font-normal select-none ${playfair.className}`}>
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
              <blockquote className="border-l-2 border-[#ea580c] pl-6 my-8 py-2 text-slate-800 bg-orange-50/30">
                <p className={`font-serif italic text-lg sm:text-xl text-slate-800 leading-relaxed ${playfair.className}`}>
                  &ldquo;{sanggar.philosophy}&rdquo;
                </p>
                <footer className="text-xs uppercase tracking-widest text-slate-400 font-sans mt-2 font-medium">
                  — Filosofi {sanggar.name}
                </footer>
              </blockquote>
            )}

            {/* Architectural Dual Location Blocks (No Bulky Cards) */}
            <div className="border-t border-slate-200 pt-8 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#ea580c] font-semibold">
                  <Building2 className="w-4 h-4" />
                  <span>Alamat Sanggar / Sekretariat</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  {sanggar.alamatSanggar}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#ea580c] font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Tempat & Jadwal Latihan</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  {sanggar.alamatLatihan}
                </p>
              </div>
            </div>

          </motion.div>

          {/* Right Column (40% / 5 cols): Bordered minimalist list for "Layanan Sanggar" */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 bg-slate-50/60 p-8 border border-slate-200/80 space-y-6"
          >
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#ea580c] uppercase block mb-2">
                PROGRAM & LAYANAN
              </span>
              <h3 className={`text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight ${playfair.className}`}>
                Layanan Sanggar
              </h3>
              <div className="w-12 h-0.5 bg-[#ea580c] mt-3 mb-6" />
              <p className="text-xs text-slate-500 font-sans tracking-wide">
                Layanan resmi yang dikelola oleh pengurus sanggar dengan instruktur bersertifikat.
              </p>
            </div>

            {/* Minimalist Bordered List */}
            <ul className="divide-y divide-slate-200 border-y border-slate-200">
              {sanggar.layanan && sanggar.layanan.map((item, idx) => (
                <li 
                  key={idx}
                  className="group py-4 flex items-center justify-between transition-all duration-200 hover:pl-2 cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ea580c] group-hover:scale-150 transition-transform"></span>
                    <span className="text-sm sm:text-base text-slate-800 font-medium group-hover:text-[#ea580c] transition-colors">
                      {item}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#ea580c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </li>
              ))}
            </ul>

            {/* Inquire CTA Box */}
            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-3">
                Memerlukan jadwal khusus atau pementasan tari untuk kegiatan korporasi / kenegaraan?
              </p>
              <a 
                href={waLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
              >
                <span>Konsultasi Layanan via WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </motion.div>

        </div>
      </section>

      {/* Accolades & Leadership: "Prestasi & Pengurus" */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left / Main (7 cols): Clean Chronological Accolades List with Hairline Borders */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#ea580c] uppercase block mb-2">
                REKAM JEJAK & PENGHARGAAN
              </span>
              <h2 className={`text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight ${playfair.className}`}>
                Prestasi & Penghargaan
              </h2>
              <div className="w-16 h-0.5 bg-[#ea580c] mt-4 mb-8" />
            </div>

            {sanggar.prestasi && sanggar.prestasi.length > 0 ? (
              <div className="divide-y divide-slate-200 border-y border-slate-200">
                {sanggar.prestasi.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="py-5 flex items-start gap-4 group hover:bg-slate-50/50 px-2 transition-colors"
                  >
                    <span className={`text-2xl sm:text-3xl font-normal text-slate-300 group-hover:text-[#ea580c] transition-colors leading-none font-serif ${playfair.className}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="space-y-1">
                      <p className="text-base sm:text-lg font-medium text-slate-800 leading-snug">
                        {item}
                      </p>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-sans">
                        Pencapaian Seni Resmi
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Data prestasi sedang dalam verifikasi arsip dinas.
              </p>
            )}
          </motion.div>

          {/* Right (5 cols): Leadership & Circular Portrait Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 bg-white border border-slate-200/90 p-8 space-y-8"
          >
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#ea580c] uppercase block mb-2">
                PIMPINAN & MANAJEMEN
              </span>
              <h3 className={`text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight ${playfair.className}`}>
                Pengurus Sanggar
              </h3>
              <div className="w-12 h-0.5 bg-[#ea580c] mt-3 mb-6" />
            </div>

            {/* Classic Circular Portrait Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-orange-500/40 p-1 shrink-0 bg-slate-50">
                <img 
                  src={sanggar.fotoKetuaUrl || "/penari1.webp"} 
                  alt={sanggar.kontak.ketua} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs uppercase tracking-widest text-[#ea580c] font-semibold block">
                  Ketua Sanggar
                </span>
                <h4 className={`text-xl font-medium text-slate-900 ${playfair.className}`}>
                  {sanggar.kontak.ketua}
                </h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Bertanggung jawab atas pembinaan mutu kurikulum tari dan arah kebijakan sanggar seni.
                </p>
              </div>
            </div>

            {/* PIC & Hubungan Masyarakat */}
            <div className="border-t border-slate-100 pt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-xs uppercase tracking-wider text-slate-400">Nama PIC Kontak:</span>
                <span className="font-medium text-slate-800">{sanggar.kontak.pic}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs uppercase tracking-wider text-slate-400">Nomor WhatsApp:</span>
                <span className="font-medium text-slate-800">{sanggar.kontak.phone}</span>
              </div>
              {sanggar.kontak.email && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs uppercase tracking-wider text-slate-400">Email:</span>
                  <span className="font-medium text-slate-800">{sanggar.kontak.email}</span>
                </div>
              )}
            </div>

            {/* Direct Booking CTA */}
            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#ff7b00] hover:bg-[#ea580c] text-white font-medium text-xs tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#ff7b00]" />
              <span>Hubungi Ketua / PIC Sanggar</span>
            </a>

          </motion.div>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {sanggar.gallery && sanggar.gallery.length > 0 && (
        <section className="bg-slate-900 text-white py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 border-b border-slate-800 pb-6 gap-4">
              <div>
                <span className="text-xs font-semibold tracking-[0.25em] text-orange-400 uppercase block mb-2">
                  DOKUMENTASI VISUAL
                </span>
                <h2 className={`text-3xl sm:text-4xl font-normal text-white tracking-tight ${playfair.className}`}>
                  Galeri Foto & Aktivitas
                </h2>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-sans">
                {sanggar.gallery.length} Dokumentasi Terpilih
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {sanggar.gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  className="group relative overflow-hidden bg-slate-800 aspect-[4/3] border border-slate-800 hover:border-orange-500/50 transition-all duration-300"
                >
                  <img 
                    src={img.url} 
                    alt={img.type} 
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
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

    </div>
  );
}
