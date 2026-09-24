"use client";

import { useState, useEffect } from "react";
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
  Share2, 
  Music,
  X 
} from "lucide-react";
import { Poppins, Playfair_Display, Dancing_Script } from 'next/font/google';
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });

export interface TariItem {
  name: string;
  description?: string;
  image?: string;
  choreographer?: string;
  composer?: string;
  synopsis?: string;
}

export interface AchievementItem {
  title: string;
  organizer?: string;
  year?: string;
}

export interface ServiceItem {
  title: string;
  description?: string;
  titleEn?: string;
  descriptionEn?: string;
  icon?: string;
}

export interface SanggarDetailData {
  id: string | number;
  name: string;
  leader?: string;
  tagline: string;
  grade: string;
  wilayah: string;
  philosophy?: string;
  philosophyEn?: string;
  description: string[];
  descriptionEn?: string[];
  alamatSanggar: string;
  alamatLatihan: string;
  address?: string;
  logo?: string;
  whatsappNumber?: string;
  instagram?: string;
  whatsappUrl?: string | null;
  instagramUrl?: string | null;
  layanan: (string | ServiceItem)[];
  services?: ServiceItem[];
  tariUnggulan: TariItem[];
  danceSpecialties?: TariItem[];
  prestasi: (string | AchievementItem)[];
  achievements?: (string | AchievementItem)[];
  kontak: {
    ketua: string;
    pic: string;
    phone: string;
    email?: string;
    instagram?: string;
  };
  contacts?: {
    phone: string[];
    whatsapp?: string;
    instagram: string;
    youtube: string;
  };
  imageUrl: string;
  logoUrl?: string | null;
  fotoKetuaUrl?: string | null;
  youtubeUrl?: string | null;
  gallery: { type: string; url: string }[];
}

export default function SanggarDetailClient({ sanggar }: { sanggar: SanggarDetailData }) {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedService(null);
      }
    };
    if (selectedService) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedService]);

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
    isEn 
      ? `Hello, I saw the profile of ${studioName} on DKI Jakarta Art Catalog. I would like to inquire about dance class programs and performances.`
      : `Halo, saya melihat profil ${studioName} di Katalog Seni DKI Jakarta. Saya ingin berkonsultasi mengenai program kelas dan pementasan seni tari.`
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
            {isEn ? "← Back to Catalog" : "← Kembali ke Katalog"}
          </Link>
        </div>

        {/* Pengurus Sanggar Card immediately follows */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/80 shadow-sm transition-all duration-300">
          <div>
            <span className="text-xs font-semibold tracking-widest text-orange-600 uppercase">
              {isEn ? "Leadership & Management" : "Pimpinan & Manajemen"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800 tracking-tight flex items-center gap-2 flex-wrap mt-1">
              <span>{isEn ? "Studio Management —" : "Pengurus Sanggar —"}</span>
              <span className={`font-dancing text-3xl sm:text-4xl text-orange-600 font-normal ${dancingScript.className}`}>
                {sanggar.name || "Sinar Norray"}
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
                  src={sanggar.logo || sanggar.logoUrl || (sanggar.fotoKetuaUrl && !sanggar.fotoKetuaUrl.includes("penari1") ? sanggar.fotoKetuaUrl : "/profile-sanggar-2.webp")} 
                  alt={sanggar.leader || sanggar.kontak?.ketua || sanggar.name || (isEn ? "Studio Leader" : "Ketua Sanggar")} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/profile-sanggar-2.webp";
                  }}
                  className="w-full h-full object-cover object-center rounded-full"
                />
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-xs uppercase tracking-widest text-orange-600 font-semibold block">
                  {isEn ? "Studio Leader" : "Ketua Sanggar"}
                </span>
                <h4 className="text-xl font-bold text-zinc-900">
                  {sanggar.leader || sanggar.kontak?.ketua}
                </h4>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  {isEn 
                    ? "Responsible for dance curriculum quality development and studio policy direction."
                    : "Bertanggung jawab atas pembinaan mutu kurikulum tari dan arah kebijakan sanggar seni."}
                </p>
              </div>
            </div>

            {/* Right Column: PIC details & WhatsApp button */}
            <div className="mt-6 md:mt-0 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-xs uppercase text-zinc-400 font-medium">
                    {isEn ? "Contact Person (PIC):" : "Nama PIC Kontak:"}
                  </span>
                  <span className="text-sm font-semibold text-zinc-800">{sanggar.kontak?.pic || sanggar.leader || sanggar.kontak?.ketua}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-xs uppercase text-zinc-400 font-medium">
                    {isEn ? "WhatsApp Number:" : "Nomor WhatsApp:"}
                  </span>
                  <span className="text-sm font-semibold text-zinc-800">
                    {Array.isArray(sanggar.contacts?.phone) ? sanggar.contacts.phone.join(' / ') : (sanggar.whatsappNumber || sanggar.kontak?.phone)}
                  </span>
                </div>
                {sanggar.kontak?.email && (
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                    <span className="text-xs uppercase text-zinc-400 font-medium">Email:</span>
                    <span className="text-sm font-semibold text-zinc-800">{sanggar.kontak.email}</span>
                  </div>
                )}
              </div>

              {/* Dual Action Buttons: WhatsApp & Instagram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {/* WhatsApp Button */}
                {(() => {
                  const directWaUrl = sanggar.whatsappUrl || sanggar.contacts?.whatsapp;
                  let waLink = "";
                  if (directWaUrl && directWaUrl.startsWith("http")) {
                    waLink = directWaUrl;
                  } else {
                    const phoneNum = formatWaNumber(Array.isArray(sanggar.contacts?.phone) ? sanggar.contacts.phone[0] : (sanggar.whatsappNumber || sanggar.kontak?.phone || "6281310998647"));
                    waLink = `https://wa.me/${phoneNum}?text=${encodeURIComponent(isEn ? `Hello, I saw the profile of ${studioName} on DKI Jakarta Art Catalog and would like to ask about costume rental / performance services / dance classes.` : `Halo, saya melihat profil ${studioName} di Katalog Seni DKI Jakarta dan ingin bertanya mengenai sewa kostum / jasa pentas / kelas tari.`)}`;
                  }
                  return (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  );
                })()}

                {/* Instagram Button */}
                {(() => {
                  const igRaw = sanggar.instagramUrl || sanggar.contacts?.instagram || sanggar.instagram || (sanggar.kontak && sanggar.kontak.instagram) || "https://instagram.com/sinar_norray";
                  const igHref = igRaw.startsWith("http") ? igRaw : `https://instagram.com/${igRaw.replace('@', '')}`;
                  return (
                    <a
                      href={igHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:opacity-90 text-white font-medium text-xs sm:text-sm rounded-xl transition-opacity shadow-sm"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>Instagram</span>
                    </a>
                  );
                })()}
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
              <div>
                <h2 className={`text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                  {isEn ? "Studio Profile" : "Profil Sanggar"}
                </h2>
                <div className="w-16 h-0.5 bg-orange-600 mt-4 mb-8" />
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2 my-6 bg-orange-50/50 rounded-r-xl">
                <p className="text-lg md:text-xl font-serif italic text-zinc-800 leading-relaxed">
                  &ldquo;{sanggar.tagline || "Berbudaya, Berprestasi, Berkualitas, Santun dan Kreatif."}&rdquo;
                </p>
              </div>

              {/* Storytelling Paragraphs with Drop-Cap on first paragraph */}
              {(() => {
                const descList = (isEn && sanggar.descriptionEn && sanggar.descriptionEn.length > 0)
                  ? sanggar.descriptionEn
                  : (sanggar.description || []);

                if (!descList || descList.length === 0) return null;

                return (
                  <div className="text-zinc-700 text-base sm:text-lg leading-relaxed space-y-5 font-light">
                    <p className="text-justify">
                      <span className={`float-left text-5xl md:text-6xl text-zinc-900 leading-none pr-3 pt-1 font-normal select-none ${playfair.className}`}>
                        {descList[0].charAt(0)}
                      </span>
                      {descList[0].slice(1)}
                    </p>

                    {descList.slice(1).map((paragraph, idx) => (
                      <p key={idx} className="text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                );
              })()}

              {/* Philosophy Callout Quote */}
              {(sanggar.philosophy || sanggar.philosophyEn) && (
                <blockquote className="border-l-2 border-orange-500 pl-6 my-8 py-3 text-zinc-800 bg-orange-50/50 rounded-r-xl">
                  <p className={`font-serif italic text-lg sm:text-xl text-zinc-800 leading-relaxed ${playfair.className}`}>
                    &ldquo;{(isEn && sanggar.philosophyEn) ? sanggar.philosophyEn : sanggar.philosophy}&rdquo;
                  </p>
                  <footer className="text-xs uppercase tracking-widest text-zinc-400 font-sans mt-2 font-medium">
                    {isEn ? `— ${sanggar.name} Philosophy` : `— Filosofi ${sanggar.name}`}
                  </footer>
                </blockquote>
              )}

              {/* Architectural Dual Location Blocks */}
              <div className="border-t border-zinc-200 pt-8 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-orange-600 font-semibold">
                    <Building2 className="w-4 h-4" />
                    <span>{isEn ? "Studio / Secretariat Address" : "Alamat Sanggar / Sekretariat"}</span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed font-sans">
                    {sanggar.address || sanggar.alamatSanggar}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-orange-600 font-semibold">
                    <Clock className="w-4 h-4" />
                    <span>{isEn ? "Practice Venue & Schedule" : "Tempat & Jadwal Latihan"}</span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed font-sans">
                    {sanggar.alamatLatihan || sanggar.address || sanggar.alamatSanggar}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Layanan Sanggar Section (Structured Service Cards) */}
            {(() => {
              const serviceList = isEn 
                ? ((sanggar.services && sanggar.services.length > 0) ? sanggar.services : (sanggar.layanan || []))
                : ((sanggar.layanan && sanggar.layanan.length > 0) ? sanggar.layanan : (sanggar.services || []));

              return (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300">
                  <div>
                    <h3 className={`text-2xl sm:text-3xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                      {isEn ? "Studio Services" : "Layanan Sanggar"}
                    </h3>
                    <div className="w-12 h-0.5 bg-orange-600 mt-3 mb-4" />
                    <p className="text-xs text-zinc-500 font-sans tracking-wide">
                      {isEn 
                        ? "Official services managed directly by studio administration with certified instructors."
                        : "Layanan resmi yang dikelola langsung oleh pengurus sanggar dengan instruktur bersertifikat."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {serviceList.map((item, idx) => {
                      const isObj = typeof item === 'object' && item !== null;
                      const serviceObj: ServiceItem = isObj ? item : { title: item, description: '' };
                      const title = isObj ? ((isEn && item.titleEn) ? item.titleEn : item.title) : item;
                      const desc = isObj ? ((isEn && item.descriptionEn) ? item.descriptionEn : item.description) : null;

                      return (
                        <div 
                          key={idx}
                          onClick={() => setSelectedService(serviceObj)}
                          className="group relative bg-gradient-to-br from-zinc-50/80 to-orange-50/30 hover:to-orange-100/50 p-5 rounded-2xl border border-zinc-200/80 hover:border-orange-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
                        >
                          <div>
                            <div className="w-10 h-10 rounded-xl bg-orange-100/90 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              {idx % 3 === 0 ? (
                                <Sparkles className="w-5 h-5" />
                              ) : idx % 3 === 1 ? (
                                <Building2 className="w-5 h-5" />
                              ) : (
                                <Music className="w-5 h-5" />
                              )}
                            </div>
                            <h4 className="text-base font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors leading-snug">
                              {title}
                            </h4>
                            {desc && (
                              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed font-light line-clamp-3">
                                {desc}
                              </p>
                            )}
                          </div>
                          <div className="pt-4 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
                            <span>{isEn ? "View Details →" : "Lihat Detail →"}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 3. Karya Tari Unggulan (Specialized Dance Synopses) */}
            {(() => {
              const specialtiesList = isEn
                ? ((sanggar.danceSpecialties && sanggar.danceSpecialties.length > 0) ? sanggar.danceSpecialties : (sanggar.tariUnggulan || []))
                : ((sanggar.tariUnggulan && sanggar.tariUnggulan.length > 0) ? sanggar.tariUnggulan : (sanggar.danceSpecialties || []));

              if (!specialtiesList || specialtiesList.length === 0) return null;

              return (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300">
                  <div>
                    <h3 className={`text-2xl sm:text-3xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                      {isEn ? "Featured Dance Works" : "Karya Tari Unggulan"}
                    </h3>
                    <div className="w-12 h-0.5 bg-orange-600 mt-3 mb-4" />
                    <p className="text-xs text-zinc-500 font-sans tracking-wide">
                      {isEn 
                        ? "Featured choreography and cultural background synopses performed by the studio."
                        : "Koreografi unggulan dan sinopsis latar belakang seni budaya yang dibawakan oleh sanggar."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {specialtiesList.map((dance, idx) => (
                      <div 
                        key={idx}
                        className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-zinc-50/90 to-orange-50/20 border border-zinc-200/90 hover:border-orange-300 transition-all duration-300 space-y-3 shadow-sm hover:shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <h4 className="text-lg sm:text-xl font-bold text-zinc-900">
                              {dance.name}
                            </h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {dance.choreographer && (
                              <span className="px-2.5 py-1 rounded-full bg-orange-100/80 text-orange-800 font-medium">
                                {isEn ? "Choreographer:" : "Koreografer:"} <strong className="font-semibold">{dance.choreographer}</strong>
                              </span>
                            )}
                            {dance.composer && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-800 font-medium">
                                {isEn ? "Composer:" : "Komposer:"} <strong className="font-semibold">{dance.composer}</strong>
                              </span>
                            )}
                          </div>
                        </div>

                        {(dance.synopsis || dance.description) && (
                          <div className="pt-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                              {isEn ? "Work Synopsis:" : "Sinopsis Karya:"}
                            </p>
                            <p className="text-sm sm:text-base text-zinc-700 font-light leading-relaxed text-justify">
                              {dance.synopsis || dance.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 3. Prestasi & Penghargaan Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300">
              <div>
                <h2 className={`text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                  {isEn ? "Achievements & Awards" : "Prestasi & Penghargaan"}
                </h2>
                <div className="w-16 h-0.5 bg-orange-600 mt-4 mb-8" />
              </div>

              {(() => {
                const achievementList = isEn
                  ? ((sanggar.achievements && sanggar.achievements.length > 0) ? sanggar.achievements : (sanggar.prestasi || []))
                  : ((sanggar.prestasi && sanggar.prestasi.length > 0) ? sanggar.prestasi : (sanggar.achievements || []));

                return achievementList && achievementList.length > 0 ? (
                  <div className="max-h-[420px] overflow-y-auto pr-2 divide-y divide-zinc-100 border-y border-zinc-100">
                    {achievementList.map((item, idx) => {
                      const isObj = typeof item === 'object' && item !== null;
                      const title = isObj ? item.title : item;
                      const organizer = isObj && item.organizer ? item.organizer : (isEn ? "Official Artistic Achievement" : "Pencapaian Seni Resmi");
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
                    {isEn 
                      ? "Achievement data is currently being verified in department archives."
                      : "Data prestasi sedang dalam verifikasi arsip dinas."}
                  </p>
                );
              })()}
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar / Info Cards (Span 1) */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            
            {/* Card 1: Informasi Operasional & Jadwal */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm transition-all duration-300">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-4">
                {isEn ? "Practice Information" : "Informasi Latihan"}
              </h3>
              <div className="space-y-3 text-sm text-zinc-700">
                <div className="flex justify-between border-b border-zinc-100 pb-2.5">
                  <span className="text-zinc-500">{isEn ? "Routine Schedule:" : "Jadwal Rutin:"}</span>
                  <span className="font-semibold text-right text-zinc-800">{isEn ? "Saturday & Sunday" : "Sabtu & Minggu"}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2.5">
                  <span className="text-zinc-500">{isEn ? "Operating Hours:" : "Jam Operasional:"}</span>
                  <span className="font-semibold text-right text-zinc-800">09:00 - 16:00 WIB</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-zinc-500">{isEn ? "Studio Status:" : "Status Sanggar:"}</span>
                  <span className="font-semibold text-emerald-600">{isEn ? "Active & Verified" : "Aktif & Terverifikasi"}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Lokasi & Alamat */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm transition-all duration-300">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-4">
                {isEn ? "Studio Location" : "Lokasi Sanggar"}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                {sanggar.address || sanggar.alamatSanggar || "Jl. Daman 1 No.39 RT.008/002 Bambu Apus Cipayung Jakarta Timur"}
              </p>
              <div className="w-full h-44 sm:h-52 my-3 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                <iframe
                  title={isEn ? "Studio Location" : "Lokasi Sanggar"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(sanggar.address || sanggar.alamatSanggar || "Jl. Daman 1 No.39 RT.008/002 Bambu Apus Cipayung Jakarta Timur")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
              <a 
                href={sanggar.address || sanggar.alamatSanggar ? `https://maps.google.com/?q=${encodeURIComponent(sanggar.address || sanggar.alamatSanggar || "")}` : "https://maps.google.com"} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-all"
              >
                {isEn ? "Open in Google Maps ↗" : "Buka di Google Maps ↗"}
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
                  {isEn ? "VISUAL DOCUMENTATION" : "DOKUMENTASI VISUAL"}
                </span>
                <h2 className={`text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                  {isEn ? "Photo Gallery & Activities" : "Galeri Foto & Aktivitas"}
                </h2>
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-sans">
                {sanggar.gallery.length} {isEn ? "Selected Records" : "Dokumentasi Terpilih"}
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

      {/* Service Detail Modal */}
      {selectedService && (() => {
        const modalTitle = isEn 
          ? (selectedService.titleEn || selectedService.title) 
          : selectedService.title;
        const modalDesc = (isEn && selectedService.descriptionEn)
          ? selectedService.descriptionEn
          : (selectedService.description || (isEn 
              ? "In-depth studio training, performance programs, and cultural consultation guided by experienced mentors." 
              : "Program pelatihan terarah, pementasan kesenian, dan konsultasi budaya yang dibimbing langsung oleh instruktur berpengalaman."));
        
        const danceHighlights = isEn
          ? ((sanggar.danceSpecialties && sanggar.danceSpecialties.length > 0) ? sanggar.danceSpecialties : (sanggar.tariUnggulan || []))
          : ((sanggar.tariUnggulan && sanggar.tariUnggulan.length > 0) ? sanggar.tariUnggulan : (sanggar.danceSpecialties || []));

        const modalWaMessage = encodeURIComponent(
          isEn 
            ? `Hello, I saw the profile of ${studioName} on DKI Jakarta Art Catalog and would like to inquire about the service: "${modalTitle}".`
            : `Halo, saya melihat profil ${studioName} di Katalog Seni DKI Jakarta dan ingin berkonsultasi mengenai layanan: "${modalTitle}".`
        );
        const modalWaLink = `https://wa.me/${waNumber}?text=${modalWaMessage}`;

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedService(null)}
          >
            <div 
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-100 space-y-6 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                aria-label={isEn ? "Close modal" : "Tutup modal"}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-start gap-4 pr-8">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 block">
                    {isEn ? "Studio Service & Program" : "Layanan & Program Sanggar"}
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold text-zinc-900 mt-0.5 ${playfair.className}`}>
                    {modalTitle}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 bg-zinc-50/70 p-4 rounded-2xl border border-zinc-100">
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                  {isEn ? "Service Overview" : "Ringkasan Layanan"}
                </span>
                <p className="text-sm text-zinc-700 leading-relaxed font-sans">
                  {modalDesc}
                </p>
              </div>

              {/* Performance/Class Highlight Chips */}
              {danceHighlights && danceHighlights.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-orange-600 font-semibold">
                    <Music className="w-3.5 h-3.5" />
                    <span>{isEn ? "Related Dance & Performance Scope" : "Cakupan Materi & Pementasan Terkait"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {danceHighlights.slice(0, 5).map((dance, dIdx) => (
                      <span 
                        key={dIdx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-800 border border-orange-200/60"
                      >
                        {dance.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Targeted WhatsApp CTA */}
              <div className="pt-2">
                <a
                  href={modalWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>{isEn ? "Inquire on WhatsApp" : "Konsultasi via WhatsApp"}</span>
                </a>
              </div>
            </div>
          </div>
        );
      })()}

    </main>
  );
}
