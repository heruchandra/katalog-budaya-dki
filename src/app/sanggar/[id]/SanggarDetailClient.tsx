"use client";

import { useState, useEffect, useCallback } from "react";
import { Maximize2, Images } from "lucide-react";
import { Poppins, Plus_Jakarta_Sans } from 'next/font/google';
import { dancingScript, playfair } from '@/lib/fonts';
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { isDanceClassService, splitPracticeInfo } from "@/lib/sanggarData";
import PracticeInfo from "./PracticeInfo";
import GoogleMapsIcon from "@/components/icons/GoogleMapsIcon";

// Modals are split out of the initial page bundle and fetched the first time they open
const GalleryLightbox = dynamic(() => import("./GalleryLightbox"), { ssr: false });
const ServiceModal = dynamic(() => import("./ServiceModal"), { ssr: false });

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });
// Same typeface as the Navbar "Masuk" button, for primary buttons on this page
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

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
  /** Price / rate text entered in the admin panel, e.g. "Mulai Rp 2.500.000" */
  price?: string;
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
  /** True when `gallery` holds photos uploaded through the admin panel (always shown, whatever the count) */
  galleryIsUploaded?: boolean;
  /** Google Maps link saved in the admin panel; falls back to a search for the address */
  mapsUrl?: string | null;
}

const DEFAULT_GALLERY_IMAGES = [
  { type: "Pentas Seni & Tari Betawi", typeEn: "Betawi Art & Dance Performance", url: "/images/sanggar/dinamis-sanggar-1.webp" },
  { type: "Kelas & Pelatihan Rutin", typeEn: "Routine Classes & Training", url: "/images/sanggar/dinamis-sanggar-2.webp" },
  { type: "Pentas Lenong Tradisional", typeEn: "Traditional Lenong Theater", url: "/images/sanggar/dinamis-sanggar-3.webp" },
  { type: "Dokumentasi Tata Busana Betawi", typeEn: "Betawi Traditional Attire", url: "/images/sanggar/dinamis-sanggar-4.webp" },
  { type: "Pentas Tari Lenggok Dara", typeEn: "Lenggok Dara Dance Show", url: "/images/sanggar/dinamis-sanggar-5.webp" },
  { type: "Koreografi & Gerak Berirama", typeEn: "Choreography & Motion", url: "/images/sanggar/dinamis-sanggar-6.webp" },
  { type: "Gladi Resik & Persiapan Pentas", typeEn: "Rehearsal & Stage Prep", url: "/images/sanggar/dinamis-sanggar-7.webp" },
  { type: "Kolaborasi Musik Gambang Kromong", typeEn: "Gambang Kromong Collaboration", url: "/images/sanggar/dinamis-sanggar-8.webp" },
  { type: "Pentas Teater Sandiwara Betawi", typeEn: "Betawi Folk Theater Show", url: "/images/sanggar/dinamis-sanggar-9.webp" },
  { type: "Festival Budaya Nusantara", typeEn: "Cultural Heritage Festival", url: "/images/sanggar/dinamis-sanggar-10.webp" },
  { type: "Apresiasi Tari Nindak Si None", typeEn: "Nindak Si None Presentation", url: "/images/sanggar/dinamis-sanggar-11.webp" },
  { type: "Dokumentasi Generasi Muda Seni", typeEn: "Youth Performing Arts Archive", url: "/images/sanggar/dinamis-sanggar-12.webp" },
  { type: "Gelar Seni Tradisi Jakarta", typeEn: "Jakarta Heritage Art Exhibition", url: "/images/sanggar/dinamis-sanggar-13.webp" },
  { type: "Pembinaan Siswa Tari", typeEn: "Dance Mentorship Program", url: "/images/sanggar/dinamis-sanggar-14.webp" },
  { type: "Penampilan Pentas Akbar", typeEn: "Grand Gala Showcase", url: "/images/sanggar/dinamis-sanggar-15.webp" },
];

export default function SanggarDetailClient({ sanggar }: { sanggar: SanggarDetailData }) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [leaderPhotoFailed, setLeaderPhotoFailed] = useState(false);
  const leaderPhoto =
    sanggar.logo || sanggar.logoUrl ||
    (sanggar.fotoKetuaUrl && !sanggar.fotoKetuaUrl.includes("penari1") ? sanggar.fotoKetuaUrl : "/images/sanggar/profile-sanggar-2.webp");

  // Uploaded galleries are always used; otherwise only a full (15+) curated set replaces the default photos
  const galleryList = (sanggar.gallery && sanggar.gallery.length > 0 && (sanggar.galleryIsUploaded || sanggar.gallery.length >= 15))
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

  // Google Maps search link from the studio address (there is no dedicated maps URL field in the data)
  const studioAddress = sanggar.address || sanggar.alamatSanggar;
  const mapsSearchUrl = sanggar.mapsUrl
    ? sanggar.mapsUrl
    : studioAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studioAddress)}`
      : null;

  return (
    <div className={`min-h-screen bg-zinc-50 text-zinc-900 pt-16 selection:bg-orange-100 selection:text-orange-900 ${poppins.className}`}>
      
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
                  <Image
                    src={leaderPhotoFailed ? "/images/sanggar/profile-sanggar-2.webp" : leaderPhoto}
                    alt={sanggar.leader || sanggar.kontak?.ketua || sanggar.name || (isEn ? "Studio Leader" : "Ketua Sanggar")}
                    fill
                    sizes="80px"
                    onError={() => setLeaderPhotoFailed(true)}
                    className="object-cover object-center rounded-full"
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
              {/* Phones: label stacked above the value, no colon. From sm: a fixed label column + colon column,
                  so the three colons line up vertically */}
              <dl className="divide-y divide-zinc-100">
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
                  <div key={row.label} className="flex flex-col sm:grid sm:grid-cols-[150px_auto_1fr] sm:gap-x-3 sm:items-center py-2.5 first:pt-0 last:pb-0">
                    <dt className="text-[10px] sm:text-[11px] font-bold sm:font-semibold text-zinc-500 uppercase tracking-wider">{row.label}</dt>
                    <span className="hidden sm:inline-block text-zinc-400 font-medium" aria-hidden="true">:</span>
                    <dd className="mt-0.5 sm:mt-0 text-sm font-semibold sm:font-bold text-zinc-900 sm:text-right [overflow-wrap:anywhere]">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Icon-only contact tiles, one full-width row in this order: WhatsApp, Instagram, Gmail,
                  YouTube, Google Maps. Gmail / YouTube / Maps only appear when the data exists, and the
                  row always has as many columns as tiles shown. All tiles share size and corners; WhatsApp,
                  Instagram and YouTube are solid brand colours with a white mark, while Gmail and Maps keep their
                  multi-colour logos on a soft tint of their brand colour. */}
              <div className={`grid ${
                ({ 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" } as Record<number, string>)[
                  2 + (sanggar.kontak?.email ? 1 : 0) + (sanggar.youtubeUrl ? 1 : 0) + (mapsSearchUrl ? 1 : 0)
                ]
              } gap-2 sm:gap-2.5 pt-3 w-full`}>
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
                      title="WhatsApp"
                      aria-label="WhatsApp"
                      className="bg-[#059669] text-white h-11 w-full flex items-center justify-center rounded-lg shadow-xs transition-opacity hover:opacity-90"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
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
                      title="Instagram"
                      aria-label="Instagram"
                      className="bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white h-11 w-full flex items-center justify-center rounded-lg shadow-xs transition-opacity hover:opacity-90"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  );
                })()}

                {/* Gmail Button */}
                {sanggar.kontak?.email && (
                  <a
                    href={`mailto:${sanggar.kontak.email}`}
                    title="Email"
                    aria-label="Email"
                    className="bg-rose-50 border border-rose-200/80 hover:bg-rose-100 h-11 w-full flex items-center justify-center rounded-lg shadow-xs transition-colors"
                  >
                    {/* Official multi-colour Gmail logo (2020) */}
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" viewBox="52 42 88 66" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
                      <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
                      <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
                      <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
                      <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
                    </svg>
                  </a>
                )}

                {/* YouTube Button (inline SVG: lucide-react v1 has no brand icons) */}
                {sanggar.youtubeUrl && (
                  <a
                    href={sanggar.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="YouTube"
                    aria-label="YouTube"
                    className="bg-[#dc2626] text-white h-11 w-full flex items-center justify-center rounded-lg shadow-xs transition-opacity hover:opacity-90"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}

                {/* Google Maps Button (shared rainbow-ring pin, same mark as the footer) */}
                {mapsSearchUrl && (
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Google Maps"
                    aria-label="Google Maps"
                    className="bg-blue-50 border border-blue-200/80 hover:bg-blue-100 h-11 w-full flex items-center justify-center rounded-lg shadow-xs transition-colors"
                  >
                    {/* one size step larger than the other tile icons: the pin only fills ~60% of its box */}
                    <GoogleMapsIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
                  </a>
                )}
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
                const showsEnglish = !!(isEn && sanggar.descriptionEn && sanggar.descriptionEn.length > 0);
                const descList = showsEnglish ? sanggar.descriptionEn! : (sanggar.description || []);

                if (!descList || descList.length === 0) return null;

                return (
                  // Justified from sm up, left-aligned on phones (no Indonesian hyphenation in browsers, so narrow justified
                  // lines open wide gaps). lang = the language of the text actually shown (studios without an English
                  // text show Indonesian), so hyphens-auto uses the right rules where a dictionary exists
                  <div lang={showsEnglish ? "en" : "id"} className="text-zinc-700 text-base sm:text-lg leading-relaxed space-y-5 font-light">
                    <p className="text-left sm:text-justify hyphens-auto break-words">
                      <span className={`float-left text-5xl md:text-6xl text-zinc-900 leading-none pr-3 pt-1 font-normal select-none ${playfair.className}`}>
                        {descList[0].charAt(0)}
                      </span>
                      {descList[0].slice(1)}
                    </p>

                    {descList.slice(1).map((paragraph, idx) => (
                      <p key={idx} className="text-left sm:text-justify hyphens-auto break-words">
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
            </div>

            {/* 2. Layanan Sanggar Section (Structured Service Cards) */}
            {(() => {
              const serviceList = isEn 
                ? ((sanggar.services && sanggar.services.length > 0) ? sanggar.services : (sanggar.layanan || []))
                : ((sanggar.layanan && sanggar.layanan.length > 0) ? sanggar.layanan : (sanggar.services || []));
              // Practice schedule + venue are shown only in the dance-class service's "Lihat Detail" modal (the card stays
              // minimal), so the page has one address section ("Lokasi Sanggar") and no second, conflicting schedule.
              // Studios without a dance-class service get them once, under the service cards.
              const practiceInfo = splitPracticeInfo(sanggar.alamatLatihan || sanggar.address || sanggar.alamatSanggar);
              const classIndex = serviceList.findIndex((item) =>
                typeof item === 'object' && item !== null ? isDanceClassService(item.title, item.titleEn) : isDanceClassService(item)
              );

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
                          serviceObj.image = '/images/sanggar/layanan-sanggar-sinarnorray-Kelas Tari Betawi.webp';
                        } else if (tLower.includes('lenong betawi') || tEnLower.includes('lenong betawi')) {
                          serviceObj.image = '/images/sanggar/layanan-sanggar-sinarnorray-Pentas Lenong Betawi.webp';
                        } else if (tLower.includes('gambang kromong') || tEnLower.includes('gambang kromong') || tLower.includes('musik') || tEnLower.includes('music')) {
                          serviceObj.image = '/images/sanggar/layanan-sanggar-sinarnorray-Pentas Musik Gambang Kromong.webp';
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
                              <Image
                                src={
                                  service.image ||
                                  (service.title.toLowerCase().includes("kelas")
                                    ? "/images/sanggar/layanan-sanggar-sinarnorray-Kelas Tari Betawi.webp"
                                    : service.title.toLowerCase().includes("lenong")
                                    ? "/images/sanggar/layanan-sanggar-sinarnorray-Pentas Lenong Betawi.webp"
                                    : "/images/sanggar/layanan-sanggar-sinarnorray-Pentas Musik Gambang Kromong.webp")
                                }
                                alt={service.title}
                                fill
                                sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 90vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                            {service.price && (
                              <p className="text-xs sm:text-sm font-semibold text-zinc-900 mt-2">{service.price}</p>
                            )}
                          </div>

                          <div className="text-xs font-semibold text-orange-600 flex items-center gap-1 mt-3">
                            <span>{isEn ? "View Details →" : "Lihat Detail →"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {classIndex === -1 && practiceInfo && (
                    <div className="border-t border-zinc-200 pt-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3">
                        {isEn ? "Practice Venue & Schedule" : "Tempat & Jadwal Latihan"}
                      </h4>
                      <PracticeInfo info={practiceInfo} isEn={isEn} />
                    </div>
                  )}
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
                              {/* Year badge: solid brand orange. orange-700 (the deep end of bg-brand) keeps white 12px text
                                  above WCAG AA 4.5:1, which orange-600 (3.6:1) does not */}
                              {year && (
                                <span className="shrink-0 text-xs font-semibold tabular-nums px-3 py-1 rounded-lg bg-orange-700 text-white shadow-sm">
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
            
            {/* Lokasi & Alamat: the page's only address section */}
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
              {/* Same accent bar as "Prestasi & Penghargaan"; its mb-8 is left off because this header row's
                  own pb/border already provide the spacing below */}
              <div className="w-16 h-0.5 bg-orange-600 mt-4" />
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

          {/* 4-photo preview row on a soft gradient panel: sharp white-framed image cards (captions live in the
              lightbox); clicking a card opens the viewer at that photo */}
          <div className="p-4 sm:p-6 bg-zinc-50/60 border border-zinc-200/80 rounded-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
                  className="block w-full rounded-none overflow-hidden bg-white border border-zinc-200 shadow-xs hover:border-orange-500 transition-all duration-200 relative group cursor-pointer aspect-[4/3] outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  <Image
                    src={img.url}
                    alt={label}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  {/* Light dim on hover (no heavy full-card overlay) */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 group-focus-visible:bg-black/20 transition-colors duration-300 pointer-events-none" />
                  {/* Expand badge in the top-right corner, clear of the photo's subject */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-200 ease-out pointer-events-none">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 group-hover:bg-orange-600 text-white backdrop-blur-md border border-white/20 shadow-md transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          </div>
        </div>
      </section>

      {/* Gallery lightbox + focused viewer (code-split: loaded only when opened) */}
      {isGalleryOpen && (
        <GalleryLightbox
          photos={galleryList}
          activeIndex={activePhotoIndex}
          getLabel={getPhotoLabel}
          onSelect={setActivePhotoIndex}
          onBackToGrid={() => setActivePhotoIndex(null)}
          onClose={closeGallery}
          onPrev={showPrevPhoto}
          onNext={showNextPhoto}
          isEn={isEn}
        />
      )}

      {/* Service detail modal (code-split: loaded only when a service is opened) */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          sanggar={sanggar}
          isEn={isEn}
          waNumber={waNumber}
          studioName={studioName}
          onClose={() => setSelectedService(null)}
        />
      )}

    </div>
  );
}
