"use client";

import { useState, useEffect, useCallback } from "react";
import { Maximize2, Images, UserRound } from "lucide-react";
import { Poppins, Plus_Jakarta_Sans } from 'next/font/google';
import { playfair } from '@/lib/fonts';
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { isDanceClassService, splitPracticeInfo } from "@/lib/sanggarData";
import PracticeInfo from "./PracticeInfo";
import { SocialPills, WhatsAppButton } from "@/components/SocialPills";
import type { SosialMedia } from "@/types/musik";
import { ownServiceImage } from "@/lib/sanggarImages";
import { toWaNumber } from "@/lib/phone";
import AwardList from "@/components/AwardList";
import FallbackImage from "@/components/FallbackImage";
import { GalleryPlaceholder, type GalleryPhoto } from "./GalleryLightbox";

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
}

export interface SanggarDetailData {
  id: string | number;
  name: string;
  leader?: string;
  tagline: string;
  grade: string;
  wilayah: string;
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
  gallery?: GalleryPhoto[];
  /** True when `gallery` holds photos uploaded through the admin panel (always shown, whatever the count) */
  galleryIsUploaded?: boolean;
  /** Google Maps link saved in the admin panel; falls back to a search for the address */
  mapsUrl?: string | null;
}

export default function SanggarDetailClient({ sanggar }: { sanggar: SanggarDetailData }) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [leaderPhotoFailed, setLeaderPhotoFailed] = useState(false);
  // This sanggar's own logo / leader photo only; without one (or if it fails to load) a placeholder is shown
  const leaderPhoto =
    sanggar.logo || sanggar.logoUrl ||
    (sanggar.fotoKetuaUrl && !sanggar.fotoKetuaUrl.includes("penari1") ? sanggar.fotoKetuaUrl : null);
  const showLeaderPhoto = !!leaderPhoto && !leaderPhotoFailed;

  // The sanggar's own photos only (uploaded in the admin panel, or curated). No stock photos of other groups:
  // a sanggar without photos shows the "not available yet" note instead.
  const galleryList = sanggar.gallery ?? [];

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


  const studioName = sanggar?.name || 'Sanggar Seni';
  const studioAddress = sanggar.address || sanggar.alamatSanggar || "";

  // Header contact: WhatsApp link (direct link, else built from the number) and social media pills
  const waDirect = sanggar.whatsappUrl || sanggar.contacts?.whatsapp;
  const waPhone = Array.isArray(sanggar.contacts?.phone) ? sanggar.contacts.phone[0] : (sanggar.whatsappNumber || sanggar.kontak?.phone);
  const waLink = waDirect && waDirect.startsWith("http")
    ? waDirect
    : toWaNumber(waPhone)
      ? `https://wa.me/${toWaNumber(waPhone)}?text=${encodeURIComponent(isEn ? `Hello, I saw the profile of ${studioName} on DKI Jakarta Art Catalog and would like to ask about costume rental / performance services / dance classes.` : `Halo, saya melihat profil ${studioName} di Katalog Seni DKI Jakarta dan ingin bertanya mengenai sewa kostum / jasa pentas / kelas tari.`)}`
      : null;
  // Same number for the service modal's "Konsultasi via WhatsApp" (empty when none is on record: no button)
  const waNumber = toWaNumber(waPhone);
  // shown where a value isn't on record (never another sanggar's data or an invented one)
  const notAvailable = isEn ? "Not available yet" : "Belum tersedia";
  const igRaw = sanggar.instagramUrl || sanggar.contacts?.instagram || sanggar.instagram || sanggar.kontak?.instagram;
  const igName = igRaw?.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/[/?#].*$/, "").replace(/^@/, "");
  // a bare youtube.com link is a placeholder, not a channel
  const ytUrl = sanggar.youtubeUrl && !/^https?:\/\/(www\.)?youtube\.com\/?$/i.test(sanggar.youtubeUrl) ? sanggar.youtubeUrl : null;
  const socialItems: SosialMedia[] = [
    ...(igName ? [{ platform: "instagram" as const, handle: `@${igName}`, url: `https://www.instagram.com/${igName}` }] : []),
    ...(ytUrl ? [{ platform: "youtube" as const, handle: ytUrl.match(/youtube\.com\/(@[\w.-]+)/i)?.[1] || "YouTube", url: ytUrl }] : []),
  ];


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
              {/* Same title style as the seniman musik page; leading-normal leaves room for the script's swashes */}
              <h1 className="font-script text-3xl sm:text-4xl lg:text-5xl text-orange-600 leading-normal font-normal text-center sm:text-left">
                {studioName}
              </h1>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-orange-100 shadow-sm shrink-0 bg-zinc-50 flex items-center justify-center">
                  {showLeaderPhoto ? (
                    <Image
                      src={leaderPhoto}
                      alt={sanggar.leader || sanggar.kontak?.ketua || sanggar.name || (isEn ? "Studio Leader" : "Ketua Sanggar")}
                      fill
                      sizes="80px"
                      onError={() => setLeaderPhotoFailed(true)}
                      className="object-cover object-center rounded-full"
                    />
                  ) : (
                    <UserRound className="w-9 h-9 text-orange-300" aria-hidden="true" />
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1 block">
                    {isEn ? "Studio Leader" : "Ketua Sanggar"}
                  </span>
                  <h4 className="text-lg font-bold text-zinc-900 tracking-tight mb-2">
                    {sanggar.leader || sanggar.kontak?.ketua || <span className="font-medium text-zinc-400">{notAvailable}</span>}
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
                    <dd className="mt-0.5 sm:mt-0 text-sm font-semibold sm:font-bold text-zinc-900 sm:text-right [overflow-wrap:anywhere]">
                      {row.value || <span className="font-medium text-zinc-400">{notAvailable}</span>}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Direct WhatsApp button + social media pills, the same design as the seniman musik page. Only this
                  sanggar's own contacts: no fallback to another sanggar's number or account */}
              <div className="pt-3 space-y-3">
                {waLink && <WhatsAppButton href={waLink} isEn={isEn} />}
                <SocialPills items={socialItems} isEn={isEn} />
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

              {sanggar.tagline && (
                <div className="border-l-4 border-orange-600 pl-4 py-2 my-6 bg-orange-50/50 rounded-none">
                  <p className="text-lg md:text-xl font-serif italic text-zinc-800 leading-relaxed">
                    &ldquo;{sanggar.tagline}&rdquo;
                  </p>
                </div>
              )}

              {/* Storytelling Paragraphs with Drop-Cap on first paragraph */}
              {(() => {
                const showsEnglish = !!(isEn && sanggar.descriptionEn && sanggar.descriptionEn.length > 0);
                const descList = showsEnglish ? sanggar.descriptionEn! : (sanggar.description || []);

                if (!descList || descList.length === 0) {
                  return (
                    <p className="text-sm text-zinc-500 italic">
                      {isEn ? "The studio profile is still being compiled by the department." : "Profil sanggar sedang dalam pendataan dinas."}
                    </p>
                  );
                }

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

                  {serviceList.length === 0 && (
                    <p className="text-sm text-zinc-500 italic">
                      {isEn ? "Service data is still being compiled by the department." : "Data layanan sedang dalam pendataan dinas."}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {serviceList.map((item, idx) => {
                      const isObj = typeof item === 'object' && item !== null;
                      const serviceObj: ServiceItem = isObj ? { ...item } : { title: item, description: '' };

                      // Only the sanggar's own service photo (Sinar Norray's are matched by title); none otherwise
                      if (!serviceObj.image) serviceObj.image = ownServiceImage(sanggar, serviceObj.title, serviceObj.titleEn);
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
                            <div className="w-full aspect-video rounded-none overflow-hidden bg-zinc-100 relative mb-4 border border-zinc-100 flex items-center justify-center">
                              {service.image ? (
                                <Image
                                  src={service.image}
                                  alt={service.title}
                                  fill
                                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 90vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <Images className="w-8 h-8 text-zinc-300" aria-hidden="true" />
                              )}
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

                // strings and {title, organizer, year} objects alike; only a real organizer/year is shown
                const awards = (achievementList || []).map((item) =>
                  typeof item === 'object' && item !== null
                    ? { title: item.title, organizer: item.organizer, year: item.year }
                    : { title: String(item) }
                );

                return awards.length > 0 ? (
                  <AwardList items={awards} isEn={isEn} />
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
              {studioAddress ? (
                <>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-3">{studioAddress}</p>
                  <div className="w-full h-44 sm:h-52 my-3 rounded-none overflow-hidden border border-zinc-200 shadow-sm">
                    <iframe
                      title={isEn ? "Studio Location" : "Lokasi Sanggar"}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(studioAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-zinc-500 italic mb-3">{isEn ? "The studio address is not available yet." : "Alamat sanggar belum tersedia."}</p>
              )}
              {(sanggar.mapsUrl || studioAddress) && (
                <a
                  // the Google Maps link saved in the admin panel when there is one, otherwise a search for the address
                  href={sanggar.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(studioAddress)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-none transition-all"
                >
                  {isEn ? "Open in Google Maps ↗" : "Buka di Google Maps ↗"}
                </a>
              )}
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
            
            {/* Top-Right Action Button with Total Count Badge (only when there are photos) */}
            {galleryList.length > 0 && (
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
            )}
          </div>

          {/* 4-photo preview row on a soft gradient panel: rounded photo-only cards (no visible captions; the alt
              text names the sanggar and the photo); clicking a card opens the viewer at that photo */}
          <div className="p-4 sm:p-6 bg-zinc-50/60 border border-zinc-200/80 rounded-none">
          {galleryList.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Images className="w-8 h-8 text-zinc-300" aria-hidden="true" />
              <p className="text-sm text-zinc-500">
                {isEn ? "This studio's photos are not available yet." : "Foto sanggar ini belum tersedia."}
              </p>
            </div>
          )}
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
                  className="group relative block w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  <FallbackImage
                    key={img.url}
                    src={img.url}
                    fallbackSrc={img.fallbackUrl}
                    alt={`${studioName} – ${label}`}
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    placeholder={<GalleryPlaceholder isEn={isEn} />}
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
          entityName={studioName}
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
