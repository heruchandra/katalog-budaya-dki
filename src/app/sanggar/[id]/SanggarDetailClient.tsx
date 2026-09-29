"use client";

import { useState, useEffect, useCallback } from "react";
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
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Images
} from "lucide-react";
import { Poppins, Playfair_Display, Dancing_Script, Plus_Jakarta_Sans } from 'next/font/google';
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });
// Same typeface as the Navbar "Masuk" button, for primary buttons on this page
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });

export interface TariItem {
  name: string;
  title?: string;
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
  image?: string;
  /** Tampilkan Karya Tari Unggulan sanggar di dalam modal layanan ini */
  featuresDanceWorks?: boolean;
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
  image?: string;
  coverImage?: string;
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
  gallery?: { type: string; url: string; typeEn?: string }[];
}

const DEFAULT_GALLERY_IMAGES = [
  { type: "Pentas Seni & Tari Betawi", typeEn: "Betawi Art & Dance Performance", url: "/dinamis-sanggar-1.webp" },
  { type: "Kelas & Pelatihan Rutin", typeEn: "Routine Classes & Training", url: "/dinamis-sanggar-2.webp" },
  { type: "Pentas Lenong Tradisional", typeEn: "Traditional Lenong Theater", url: "/dinamis-sanggar-3.webp" },
  { type: "Dokumentasi Tata Busana Betawi", typeEn: "Betawi Traditional Attire", url: "/dinamis-sanggar-4.webp" },
  { type: "Pentas Tari Lenggok Dara", typeEn: "Lenggok Dara Dance Show", url: "/dinamis-sanggar-5.webp" },
  { type: "Koreografi & Gerak Berirama", typeEn: "Choreography & Motion", url: "/dinamis-sanggar-6.webp" },
  { type: "Gladi Resik & Persiapan Pentas", typeEn: "Rehearsal & Stage Prep", url: "/dinamis-sanggar-7.webp" },
  { type: "Kolaborasi Musik Gambang Kromong", typeEn: "Gambang Kromong Collaboration", url: "/dinamis-sanggar-8.webp" },
  { type: "Pentas Teater Sandiwara Betawi", typeEn: "Betawi Folk Theater Show", url: "/dinamis-sanggar-9.webp" },
  { type: "Festival Budaya Nusantara", typeEn: "Cultural Heritage Festival", url: "/dinamis-sanggar-10.webp" },
  { type: "Apresiasi Tari Nindak Si None", typeEn: "Nindak Si None Presentation", url: "/dinamis-sanggar-11.webp" },
  { type: "Dokumentasi Generasi Muda Seni", typeEn: "Youth Performing Arts Archive", url: "/dinamis-sanggar-12.webp" },
  { type: "Gelar Seni Tradisi Jakarta", typeEn: "Jakarta Heritage Art Exhibition", url: "/dinamis-sanggar-13.webp" },
  { type: "Pembinaan Siswa Tari", typeEn: "Dance Mentorship Program", url: "/dinamis-sanggar-14.webp" },
  { type: "Penampilan Pentas Akbar", typeEn: "Grand Gala Showcase", url: "/dinamis-sanggar-15.webp" },
];

export default function SanggarDetailClient({ sanggar }: { sanggar: SanggarDetailData }) {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const galleryList = (sanggar.gallery && sanggar.gallery.length >= 15)
    ? sanggar.gallery
    : DEFAULT_GALLERY_IMAGES;

  const previewPhotos = galleryList.slice(0, 4);

  const getPhotoLabel = (img: { type: string; typeEn?: string }) =>
    (isEn && img.typeEn) ? img.typeEn : img.type;

  const galleryCount = galleryList.length;

  const showNextPhoto = useCallback(
    () => setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % galleryCount : 0)),
    [galleryCount]
  );

  const showPrevPhoto = useCallback(
    () => setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + galleryCount) % galleryCount : 0)),
    [galleryCount]
  );

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setActivePhotoIndex(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activePhotoIndex !== null) {
          setActivePhotoIndex(null);
        } else if (isGalleryOpen) {
          setIsGalleryOpen(false);
        } else if (selectedService) {
          setSelectedService(null);
        }
      } else if (isGalleryOpen && activePhotoIndex !== null) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          showNextPhoto();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          showPrevPhoto();
        }
      }
    };
    if (selectedService || isGalleryOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedService, isGalleryOpen, activePhotoIndex, showNextPhoto, showPrevPhoto]);

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

  const getServiceWaLink = (service: ServiceItem) => {
    const serviceTitle = isEn 
      ? (service.titleEn || service.title) 
      : service.title;
      
    const text = isEn
      ? `Hello, I saw the profile of ${studioName} on DKI Jakarta Art Catalog and would like to inquire about the service: "${serviceTitle}".`
      : `Halo, saya melihat profil ${studioName} di Katalog Seni DKI Jakarta dan ingin berkonsultasi mengenai layanan: "${serviceTitle}".`;

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <main className={`min-h-screen bg-zinc-50 text-zinc-900 pt-16 selection:bg-orange-100 selection:text-orange-900 ${poppins.className}`}>
      
      {/* Top Container: Pengurus Sanggar Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-4">
        {/* Pengurus Sanggar Card (first element under the navbar) */}
        <section className="bg-white rounded-none border border-zinc-200/80 pt-10 sm:pt-12 px-6 sm:px-8 pb-8 shadow-xs hover:border-zinc-300 transition-colors">
          {/* 2-column layout. Left = studio name + Ketua Sanggar profile; right = contact block,
              vertically centered (items-center) against the whole left side on desktop. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: studio name (the page's main heading) + Ketua Sanggar photo & info */}
            <div className="lg:col-span-7">
              <h1 className={`${dancingScript.className} text-3xl sm:text-4xl md:text-5xl md:font-bold text-orange-600 tracking-wide leading-tight text-center sm:text-left`}>
                {studioName}
              </h1>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-orange-100 shadow-sm shrink-0 bg-zinc-50">
                  <img 
                    src={sanggar.logo || sanggar.logoUrl || (sanggar.fotoKetuaUrl && !sanggar.fotoKetuaUrl.includes("penari1") ? sanggar.fotoKetuaUrl : "/profile-sanggar-2.webp")} 
                    alt={sanggar.leader || sanggar.kontak?.ketua || sanggar.name || (isEn ? "Studio Leader" : "Ketua Sanggar")} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/profile-sanggar-2.webp";
                    }}
                    className="w-full h-full object-cover object-center rounded-full"
                  />
                </div>

                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1 block">
                    {isEn ? "Studio Leader" : "Ketua Sanggar"}
                  </span>
                  <h4 className="text-lg font-bold text-zinc-900 tracking-tight mb-2">
                    {sanggar.leader || sanggar.kontak?.ketua}
                  </h4>
                  <p className="text-sm text-zinc-600 leading-relaxed max-w-md mx-auto sm:mx-0">
                    {isEn 
                      ? "Responsible for dance curriculum quality development and studio policy direction."
                      : "Bertanggung jawab atas pembinaan mutu kurikulum tari dan arah kebijakan sanggar seni."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: PIC details & WhatsApp button (inner content unchanged) */}
            <div className="lg:col-span-5 space-y-4">
              <dl className="space-y-3">
                {[
                  {
                    label: isEn ? "Contact Person (PIC)" : "Nama PIC Kontak",
                    value: sanggar.kontak?.pic || sanggar.leader || sanggar.kontak?.ketua,
                  },
                  {
                    label: isEn ? "WhatsApp Number" : "Nomor WhatsApp",
                    value: Array.isArray(sanggar.contacts?.phone) ? sanggar.contacts.phone.join(' / ') : (sanggar.whatsappNumber || sanggar.kontak?.phone),
                  },
                  ...(sanggar.kontak?.email ? [{ label: "Email", value: sanggar.kontak.email }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 first:pt-0 border-b border-zinc-100 last:border-none gap-1 sm:gap-4">
                    <dt className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{row.label}</dt>
                    <dd className="text-sm font-semibold text-zinc-900 sm:text-right break-words">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Dual Action Buttons: WhatsApp & Instagram */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
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
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-bold py-3 px-5 rounded-none shadow-xs hover:shadow-md flex items-center justify-center gap-2 transition-all"
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
                      className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 active:scale-[0.98] text-white text-sm font-bold py-3 px-5 rounded-none shadow-xs hover:shadow-md flex items-center justify-center gap-2 transition-all"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Narrative & Content (Span 2) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* 1. Tagline Quote & Deskripsi / Merawat Jiwa Seni Tradisi */}
            <div className="bg-white p-6 sm:p-8 rounded-none border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300">
              <div>
                <h2 className={`text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                  {isEn ? "Studio Profile" : "Profil Sanggar"}
                </h2>
                <div className="w-16 h-0.5 bg-orange-600 mt-4 mb-8" />
              </div>

              <div className="border-l-4 border-orange-600 pl-4 py-2 my-6 bg-orange-50/50 rounded-none">
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
                <blockquote className="border-l-2 border-orange-600 pl-6 my-8 py-3 text-zinc-800 bg-orange-50/50 rounded-none">
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
                <div className="bg-white p-6 sm:p-8 rounded-none border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {serviceList.map((item, idx) => {
                      const isObj = typeof item === 'object' && item !== null;
                      const serviceObj: ServiceItem = isObj ? { ...item } : { title: item, description: '' };
                      const tLower = (serviceObj.title || '').toLowerCase();
                      const tEnLower = (serviceObj.titleEn || '').toLowerCase();

                      if (!serviceObj.image) {
                        if (tLower.includes('kelas tari') || tEnLower.includes('dance class') || tLower.includes('tari betawi')) {
                          serviceObj.image = '/layanan-sanggar-sinarnorray-Kelas Tari Betawi.webp';
                        } else if (tLower.includes('lenong betawi') || tEnLower.includes('lenong betawi')) {
                          serviceObj.image = '/layanan-sanggar-sinarnorray-Pentas Lenong Betawi.webp';
                        } else if (tLower.includes('gambang kromong') || tEnLower.includes('gambang kromong') || tLower.includes('musik') || tEnLower.includes('music')) {
                          serviceObj.image = '/layanan-sanggar-sinarnorray-Pentas Musik Gambang Kromong.webp';
                        }
                      }
                      const title = isObj ? ((isEn && item.titleEn) ? item.titleEn : item.title) : item;
                      const desc = isObj ? ((isEn && item.descriptionEn) ? item.descriptionEn : item.description) : null;

                      const service = serviceObj;

                      return (
                        <div 
                          key={idx}
                          onClick={() => setSelectedService(service)}
                          className="group cursor-pointer bg-white border border-zinc-200/80 hover:border-orange-500/40 rounded-none p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                        >
                          <div>
                            {/* 16:9 Banner Image Header */}
                            <div className="w-full aspect-video rounded-none overflow-hidden bg-zinc-100 relative mb-4 border border-zinc-100">
                              <img
                                src={
                                  service.image ||
                                  (service.title.toLowerCase().includes("kelas")
                                    ? "/layanan-sanggar-sinarnorray-Kelas Tari Betawi.webp"
                                    : service.title.toLowerCase().includes("lenong")
                                    ? "/layanan-sanggar-sinarnorray-Pentas Lenong Betawi.webp"
                                    : "/layanan-sanggar-sinarnorray-Pentas Musik Gambang Kromong.webp")
                                }
                                alt={service.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            <h4 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-orange-600 transition-colors leading-snug">
                              {title}
                            </h4>
                            {desc && (
                              <p className="text-xs sm:text-sm text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                                {desc}
                              </p>
                            )}
                          </div>

                          <div className="text-xs font-semibold text-orange-600 flex items-center gap-1 mt-3">
                            <span>{isEn ? "View Details →" : "Lihat Detail →"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 3. Prestasi & Penghargaan Section */}
            <div className="bg-white p-6 sm:p-8 rounded-none border border-zinc-200/80 shadow-sm space-y-6 transition-all duration-300">
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
                          className="py-4 sm:py-5 flex items-start gap-4 group hover:bg-zinc-50/60 px-2 rounded-none transition-colors"
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
                                <span className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-none bg-orange-50 text-orange-600 border border-orange-200/60">
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
            <div className="bg-white p-6 rounded-none border border-zinc-200/80 shadow-sm transition-all duration-300">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-4">
                {isEn ? "Practice Information" : "Informasi Latihan"}
              </h3>
              {/* Every row uses the same fixed label column + colon column, so the colons line up vertically */}
              <dl className="text-sm text-zinc-700 divide-y divide-zinc-100">
                {[
                  { label: isEn ? "Routine Schedule" : "Jadwal Rutin", value: isEn ? "Saturday & Sunday" : "Sabtu & Minggu", valueClass: "text-zinc-900" },
                  { label: isEn ? "Operating Hours" : "Jam Operasional", value: "09:00 - 16:00 WIB", valueClass: "text-zinc-900" },
                  { label: isEn ? "Studio Status" : "Status Sanggar", value: isEn ? "Active & Verified" : "Aktif & Terverifikasi", valueClass: "text-emerald-600" },
                ].map((row) => (
                  <div key={row.label} className="grid grid-cols-[140px_auto_1fr] gap-x-3 items-center py-2.5 first:pt-0 last:pb-0">
                    <dt className="text-zinc-500 text-left">{row.label}</dt>
                    <span className="text-zinc-400 font-medium" aria-hidden="true">:</span>
                    <dd className={`font-bold text-right ${row.valueClass}`}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Card 2: Lokasi & Alamat */}
            <div className="bg-white p-6 rounded-none border border-zinc-200/80 shadow-sm transition-all duration-300">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-4">
                {isEn ? "Studio Location" : "Lokasi Sanggar"}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                {sanggar.address || sanggar.alamatSanggar || "Jl. Daman 1 No.39 RT.008/002 Bambu Apus Cipayung Jakarta Timur"}
              </p>
              <div className="w-full h-44 sm:h-52 my-3 rounded-none overflow-hidden border border-zinc-200 shadow-sm">
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
                className="block w-full text-center py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-none transition-all"
              >
                {isEn ? "Open in Google Maps ↗" : "Buka di Google Maps ↗"}
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Gallery Section */}
      <section className="mt-6 sm:mt-8 pt-0 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 border-b border-zinc-200 pb-4 sm:pb-6 gap-4">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight ${playfair.className}`}>
                {isEn ? "Photo Gallery & Activities" : "Galeri Foto & Aktivitas"}
              </h2>
            </div>
            
            {/* Top-Right Action Button with Total Count Badge */}
            <button
              type="button"
              onClick={() => {
                setIsGalleryOpen(true);
                setActivePhotoIndex(null);
              }}
              className={`${jakarta.className} bg-brand hover:bg-brand-deep active:scale-[0.98] text-white font-bold py-2 px-3.5 sm:py-2.5 sm:px-4 rounded-none shadow-md shadow-orange-600/20 flex items-center justify-between gap-2.5 transition-all cursor-pointer`}
            >
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-normal text-white">
                <Images className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
                {isEn ? "View All Photos" : "Lihat Semua Foto"}
              </span>
              <span className="text-[11px] font-semibold text-white bg-white/20 px-2 py-0.5 rounded-none border border-white/20">
                {galleryList.length} {isEn ? "Photos" : "Foto"}
              </span>
            </button>
          </div>

          {/* 4-photo preview row: image-only cards (captions live in the lightbox), click opens the viewer at that photo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {previewPhotos.map((img, idx) => {
              const label = getPhotoLabel(img);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setIsGalleryOpen(true);
                    setActivePhotoIndex(idx);
                  }}
                  aria-label={isEn ? `View photo: ${label}` : `Lihat foto: ${label}`}
                  className="block w-full rounded-none overflow-hidden border border-zinc-200/80 bg-zinc-50 shadow-sm hover:shadow-md transition-all duration-300 relative group cursor-pointer aspect-[4/3] outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  <img
                    src={img.url}
                    alt={label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/90 backdrop-blur-md text-zinc-900 rounded-none p-3 shadow-lg scale-90 group-hover:scale-100 group-focus-visible:scale-100 transition-transform duration-300">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Gallery Modal (grid of all photos) */}
      {isGalleryOpen && (
        <div
          className="fixed inset-0 bg-black/85 z-[99999] backdrop-blur-sm p-3 sm:p-6 lg:p-8 flex items-center justify-center"
          onClick={closeGallery}
          role="dialog"
          aria-modal="true"
          aria-label={isEn ? "Studio photo gallery" : "Galeri foto sanggar"}
        >
          {/* Panel is the scroll container, so the sticky header always sits above the first row */}
          <div
            className="relative w-full max-w-7xl max-h-[82vh] sm:max-h-[88vh] overflow-y-auto custom-scrollbar bg-zinc-950/95 border border-zinc-800 rounded-none shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Close Button */}
            <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md pt-5 pb-4 px-6 sm:px-10 border-b border-zinc-800 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">
                  {isEn ? "Studio Documentation & Activities" : "Dokumentasi & Aktivitas Sanggar"}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  {galleryList.length} {isEn ? "verified gallery photos" : "foto dokumentasi terverifikasi"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeGallery}
                className="shrink-0 p-2 rounded-none bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={isEn ? "Close gallery" : "Tutup galeri"}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Grid of framed thumbnails */}
            <div className="pt-6 pb-8 px-6 sm:px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryList.map((img, idx) => {
                const label = getPhotoLabel(img);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    aria-label={isEn ? `View photo: ${label}` : `Lihat foto: ${label}`}
                    className="text-left bg-zinc-900/90 border border-zinc-800 rounded-none p-2.5 hover:border-orange-500/50 transition-all cursor-pointer group"
                  >
                    <div className="relative aspect-[4/3] rounded-none overflow-hidden bg-zinc-800">
                      <img
                        src={img.url}
                        alt={label}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="w-10 h-10 rounded-none bg-white/15 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                    <p className="mt-2.5 px-1 text-xs font-medium text-zinc-300 group-hover:text-orange-400 transition-colors line-clamp-1">
                      {label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Focused Single Photo Viewer (sits above the grid modal) */}
      {isGalleryOpen && activePhotoIndex !== null && galleryList[activePhotoIndex] && (() => {
        const photo = galleryList[activePhotoIndex];
        const label = getPhotoLabel(photo);
        return (
          <div
            className="fixed inset-0 z-[100000] bg-black/95 flex flex-col"
            onClick={() => setActivePhotoIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={label}
          >
            {/* Viewer top bar */}
            <div
              className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-8 pt-4 pb-3"
              style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActivePhotoIndex(null)}
                className="px-3.5 py-1.5 rounded-none bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition-colors"
              >
                {isEn ? "← Back to Grid" : "← Kembali ke Grid"}
              </button>
              <span className="text-xs sm:text-sm text-zinc-300 font-medium" aria-live="polite">
                {isEn
                  ? `Photo ${activePhotoIndex + 1} of ${galleryList.length}`
                  : `Foto ${activePhotoIndex + 1} dari ${galleryList.length}`}
              </span>
              <button
                type="button"
                onClick={closeGallery}
                className="p-2 rounded-none bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={isEn ? "Close gallery" : "Tutup galeri"}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Image stage with Prev / Next */}
            <div className="relative flex-1 min-h-0 flex items-center justify-center px-14 sm:px-24">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevPhoto();
                }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2.5 sm:p-3 rounded-none bg-white/10 hover:bg-brand text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110 active:scale-95"
                aria-label={isEn ? "Previous photo" : "Foto sebelumnya"}
              >
                <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>

              <motion.img
                key={activePhotoIndex}
                src={photo.url}
                alt={label}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-full object-contain rounded-none shadow-2xl select-none"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNextPhoto();
                }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2.5 sm:p-3 rounded-none bg-white/10 hover:bg-brand text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110 active:scale-95"
                aria-label={isEn ? "Next photo" : "Foto selanjutnya"}
              >
                <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>
            </div>

            {/* Caption */}
            <div
              className="shrink-0 px-4 sm:px-8 pt-3 pb-5 text-center"
              style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm sm:text-base font-medium text-white">{label}</p>
              <p className="mt-1 text-[11px] text-zinc-500 hidden sm:block">
                {isEn ? "Use ← → keys to navigate, Esc to go back" : "Gunakan tombol ← → untuk navigasi, Esc untuk kembali"}
              </p>
            </div>
          </div>
        );
      })()}

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

      const getServiceImage = (service: any) => {
        if (service?.image) return service.image;
        const tLower = (service?.title || '').toLowerCase();
        const tEnLower = (service?.titleEn || '').toLowerCase();
        if (tLower.includes('kelas tari') || tEnLower.includes('dance class') || tLower.includes('tari betawi')) {
          return '/layanan-sanggar-sinarnorray-Kelas Tari Betawi.webp';
        }
        if (tLower.includes('lenong betawi') || tEnLower.includes('lenong betawi')) {
          return '/layanan-sanggar-sinarnorray-Pentas Lenong Betawi.webp';
        }
        if (tLower.includes('gambang kromong') || tEnLower.includes('gambang kromong') || tLower.includes('musik') || tEnLower.includes('music')) {
          return '/layanan-sanggar-sinarnorray-Pentas Musik Gambang Kromong.webp';
        }
        return (service as any)?.image || (sanggar as any)?.image || (sanggar as any)?.coverImage || "/card-7.webp";
      };

      const modalImage = getServiceImage(selectedService);

      // Karya Tari Unggulan hanya tampil penuh di layanan yang ditandai featuresDanceWorks.
      // Sanggar tanpa layanan bertanda tetap memakai chip "Pementasan Terkait" (perilaku lama).
      const showDanceWorks = !!selectedService.featuresDanceWorks && danceHighlights.length > 0;
      const hasDanceWorksService = [...(sanggar.layanan || []), ...(sanggar.services || [])]
        .some((s) => typeof s === 'object' && s !== null && s.featuresDanceWorks);
      const showDanceChips = !hasDanceWorksService && danceHighlights.length > 0;

      const getDanceImage = (dance: TariItem) => {
        if (dance.image) return dance.image;
        const n = (dance.name || dance.title || '').toLowerCase();
        if (n.includes('lenggok')) return '/tari-lenggok-dara.webp';
        if (n.includes('nindak')) return '/tari-nindak-si-none.webp';
        return '/card-7.webp';
      };

      return (
        <div
          className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedService(null)}
        >
          <div
            className={`relative w-full ${showDanceWorks ? 'max-w-2xl' : 'max-w-lg'} bg-white rounded-none p-6 sm:p-8 shadow-2xl border border-zinc-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Title & Close Button */}
            <div className="flex items-start justify-between gap-4 pb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-tight">
                {modalTitle}
              </h3>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1.5 rounded-none text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                aria-label={isEn ? "Close modal" : "Tutup modal"}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Featured Service Image Banner */}
            <div className="relative w-full aspect-video rounded-none overflow-hidden my-4 border border-zinc-200/80 shadow-sm bg-zinc-100">
              <img
                src={modalImage}
                alt={modalTitle}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Service Summary */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-none p-4 my-4">
              <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-1">
                {isEn ? "Service Summary" : "Ringkasan Layanan"}
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {modalDesc}
              </p>
            </div>

            {/* Karya Tari Unggulan (khusus layanan Pentas & Karya Tari) */}
            {showDanceWorks && (
              <div className="mb-6">
                <h4 className={`text-2xl sm:text-3xl text-zinc-900 leading-tight ${dancingScript.className}`}>
                  {isEn ? "Studio's Featured Dance Works" : "Karya Tari Unggulan Sanggar"}
                </h4>
                <div className="w-12 h-0.5 bg-orange-600 mt-2 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {danceHighlights.map((dance, idx) => {
                    const danceName = dance.name || dance.title || '';
                    return (
                      <div
                        key={idx}
                        className="rounded-none border border-zinc-200/80 bg-white shadow-sm overflow-hidden flex flex-col"
                      >
                        <div className="w-full aspect-video bg-zinc-100 overflow-hidden">
                          <img
                            src={getDanceImage(dance)}
                            alt={danceName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-none bg-brand text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <h5 className="text-base font-bold text-zinc-900 leading-snug">
                              {danceName}
                            </h5>
                          </div>
                          <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                            {isEn ? "Work Synopsis:" : "Sinopsis Karya:"}
                          </p>
                          <p className="text-zinc-600 text-sm leading-relaxed text-justify">
                            {dance.synopsis || dance.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Specialties (sanggar tanpa layanan Karya Tari) */}
            {showDanceChips && (
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-wider text-orange-600 uppercase mb-2.5 flex items-center gap-1.5">
                  <span>♫</span> {isEn ? "Related Performances" : "Cakupan Materi & Pementasan Terkait"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {danceHighlights.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center rounded-none bg-orange-50 text-orange-700 text-xs font-medium px-3.5 py-1.5 border border-orange-200/60">
                      {typeof item === 'string' ? item : item.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            <a
              href={`https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(
                isEn
                  ? `Hello, I saw the profile of ${studioName} on DKI Jakarta Art Catalog and would like to inquire about the service: "${modalTitle}".`
                  : `Halo, saya melihat profil ${studioName} di Katalog Seni DKI Jakarta dan ingin berkonsultasi mengenai layanan: "${modalTitle}".`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-none transition-all shadow-sm active:scale-[0.98]"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>{isEn ? "Consult via WhatsApp" : "Konsultasi via WhatsApp"}</span>
            </a>
          </div>
        </div>
      );
    })()}

    </main>
  );
}
