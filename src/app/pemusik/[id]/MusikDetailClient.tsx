"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, CalendarDays, Users, UserRound, Music2, PlayCircle, ExternalLink, Clock, Images, ZoomIn, MapPin, CheckCircle2, Trophy } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { dancingScript, playfair } from "@/lib/fonts";
import { toWaNumber } from "@/data/musikData";
import type { MusikEntity, SosialPlatform } from "@/types/musik";

// Photo slider, loaded only when the gallery is opened
const MusikGalleryLightbox = dynamic(() => import("./MusikGalleryLightbox"), { ssr: false });

/** Brand marks (inline SVG: lucide-react v1 has no brand icons) */
const SOCIAL_ICONS: Record<SosialPlatform, { label: string; color: string; path: string }> = {
  instagram: {
    label: "Instagram",
    color: "#E1306C",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  tiktok: {
    label: "TikTok",
    color: "#111111",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
  facebook: {
    label: "Facebook",
    color: "#1877F2",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z",
  },
  youtube: {
    label: "YouTube",
    color: "#DC2626",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
};

const WHATSAPP_PATH =
  "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z";

/** YouTube video id from a watch / youtu.be / embed / shorts URL */
const youTubeId = (url?: string) =>
  url?.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? null;

const BADGE = "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium";

export default function MusikDetailClient({ profile }: { profile: MusikEntity }) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const isKomunitas = profile.category === "komunitas";

  // Gallery: every photo slot (uploaded or pending); the cover is the first uploaded photo
  const photos = profile.fotoGallery;
  const coverIndex = Math.max(0, photos.findIndex((p) => !p.pending));
  const cover = photos[coverIndex];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const initials = profile.nama.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  // Direct WhatsApp contact (no internal chat), pre-filled message
  const waNumber = toWaNumber(profile.nomorKontak[0]);
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        isEn
          ? `Hello, I saw the profile of ${profile.nama} on the DKI Jakarta Art Catalog and would like to ask about music performance services.`
          : `Halo, saya melihat profil ${profile.nama} di Katalog Seni DKI Jakarta dan ingin bertanya mengenai jasa pentas musik.`
      )}`
    : null;

  const videoId = youTubeId(profile.videoUrl);
  const documentationLinks = profile.karyaUnggulan.filter((k) => k.link);
  const youtubeChannel = profile.sosialMedia.find((s) => s.platform === "youtube");

  const facts = [
    profile.tahunBerdiri && { icon: CalendarDays, label: isEn ? "Founded" : "Tahun Berdiri", value: String(profile.tahunBerdiri) },
    profile.tahunAktif && { icon: CalendarDays, label: isEn ? "Active Since" : "Aktif Sejak", value: profile.tahunAktif },
    profile.jumlahAnggota && {
      icon: Users,
      label: isEn ? "Members" : "Jumlah Anggota",
      value: `${profile.jumlahAnggota} ${isEn ? "members" : "anggota"}`,
    },
    profile.ketua && { icon: UserRound, label: isEn ? "Leader" : "Ketua", value: profile.ketua },
    profile.pic && { icon: UserRound, label: "PIC", value: profile.pic },
  ].filter(Boolean) as { icon: typeof Users; label: string; value: string }[];

  const musicGroups = [
    { label: isEn ? "Music Types" : "Jenis Musik", items: profile.jenisMusik, tone: "bg-orange-50 border-orange-200 text-orange-800" },
    { label: "Genre", items: profile.genre, tone: "bg-orange-50 border-orange-200 text-orange-800" },
    {
      label: isKomunitas ? (isEn ? "Instruments Played" : "Instrumen yang Dimainkan") : isEn ? "Instruments Mastered" : "Alat Musik yang Dikuasai",
      items: profile.instrumen,
      tone: "bg-white border-zinc-200 text-zinc-700",
      more: profile.instrumenLainnya,
    },
  ].filter((g) => g.items.length > 0);

  const sectionTitle = `text-2xl sm:text-3xl font-normal text-zinc-900 tracking-tight ${playfair.className}`;
  const card = "bg-white p-6 sm:p-8 rounded-none border border-zinc-200/80 shadow-sm";
  const accent = <div className="w-12 h-0.5 bg-orange-600 mt-3 mb-6" />;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
        <Link
          href="/pemusik"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-orange-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {isEn ? "Back to Music Artists" : "Kembali ke Seniman Musik"}
        </Link>

        {/* Header: identity + contact */}
        <section className={`${card} grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-center`}>
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-700">
              {isKomunitas ? (isEn ? "Music Community" : "Komunitas Musik") : isEn ? "Musician" : "Pemusik"}
            </span>
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Profile photo / logo; initials until one is uploaded */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full overflow-hidden border-2 border-orange-100 bg-orange-50 shadow-sm flex items-center justify-center">
                {profile.fotoProfil ? (
                  <Image src={profile.fotoProfil} alt={isEn ? `${profile.nama} profile photo` : `Foto profil ${profile.nama}`} fill sizes="96px" className="object-cover" />
                ) : (
                  <span className={`text-3xl sm:text-4xl text-orange-500 ${dancingScript.className}`} aria-hidden="true">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <h1 className={`text-4xl sm:text-5xl text-orange-600 leading-tight ${dancingScript.className}`}>{profile.nama}</h1>
                {profile.namaPanggung && (
                  <p className="mt-1 text-base sm:text-lg font-semibold text-zinc-800">
                    {isKomunitas ? profile.namaPanggung : `${isEn ? "Stage name" : "Nama panggung"}: ${profile.namaPanggung}`}
                  </p>
                )}
              </div>
            </div>
            {facts.length > 0 && (
              <dl className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-orange-600 shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</dt>
                      <dd className="text-sm font-semibold text-zinc-900">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}
            {profile.alamat && (
              <p className="flex items-start gap-2.5 text-sm text-zinc-700 leading-relaxed">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{isEn ? "Address" : "Alamat"}</span>
                  {profile.alamat}
                </span>
              </p>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            {(profile.nomorKontak.length > 0 || profile.email) && (
              <dl className="divide-y divide-zinc-100 text-sm">
                {profile.nomorKontak.length > 0 && (
                  <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr] sm:gap-x-3 py-2.5 first:pt-0">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:pt-0.5">{isEn ? "Contact" : "Nomor Kontak"}</dt>
                    <dd className="font-bold text-zinc-900 sm:text-right">{profile.nomorKontak.join(" / ")}</dd>
                  </div>
                )}
                {profile.email && (
                  <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr] sm:gap-x-3 py-2.5 last:pb-0">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:pt-0.5">Email</dt>
                    <dd className="font-bold text-zinc-900 sm:text-right break-all">
                      <a href={`mailto:${profile.email}`} className="hover:text-orange-700 transition-colors">{profile.email}</a>
                    </dd>
                  </div>
                )}
              </dl>
            )}

            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#059669] text-sm font-bold text-white shadow-xs transition-opacity hover:opacity-90"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={WHATSAPP_PATH} />
                </svg>
                {isEn ? "Contact via WhatsApp" : "Hubungi via WhatsApp"}
              </a>
            ) : (
              <p className="text-sm text-zinc-500">{isEn ? "Contact details are being completed." : "Data kontak sedang dilengkapi."}</p>
            )}

            {profile.sosialMedia.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label={isEn ? "Social media" : "Media sosial"}>
                {profile.sosialMedia.map((s) => {
                  const icon = SOCIAL_ICONS[s.platform];
                  const content = (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill={icon.color} aria-hidden="true">
                        <path d={icon.path} />
                      </svg>
                      <span className="truncate max-w-[14rem]">{s.handle}</span>
                    </>
                  );
                  const chip = "inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700";
                  return (
                    <li key={`${s.platform}-${s.handle}`}>
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={s.isSearch ? `${isEn ? "Search on" : "Cari di"} ${icon.label}` : icon.label}
                          aria-label={`${icon.label}: ${s.handle}${s.isSearch ? (isEn ? " (search)" : " (pencarian)") : ""}`}
                          className={`${chip} hover:border-orange-300 hover:text-orange-700 transition-colors`}
                        >
                          {content}
                        </a>
                      ) : (
                        <span className={chip} aria-label={`${icon.label}: ${s.handle}`}>{content}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Profile text: justified from sm up, left-aligned on phones (no Indonesian hyphenation in browsers) */}
            <section className={card}>
              <h2 className={sectionTitle}>{isKomunitas ? (isEn ? "Community Profile" : "Profil Komunitas") : isEn ? "Musician Profile" : "Profil Pemusik"}</h2>
              {accent}
              {profile.deskripsi.length > 0 ? (
                <div lang="id" className="space-y-4 text-base sm:text-lg leading-relaxed text-zinc-700 font-light">
                  {profile.deskripsi.map((p, i) => (
                    <p key={i} className="text-left sm:text-justify hyphens-auto break-words">{p}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 italic">
                  {isEn ? "The full profile is being completed by the Department of Culture." : "Profil lengkap sedang dilengkapi oleh Dinas Kebudayaan."}
                </p>
              )}
            </section>

            {musicGroups.length > 0 && (
              <section className={card}>
                <h2 className={sectionTitle}>{isEn ? "Music & Instruments" : "Musik & Instrumen"}</h2>
                {accent}
                <div className="space-y-5">
                  {musicGroups.map((g) => (
                    <div key={g.label}>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2.5">{g.label}</h3>
                      <ul className="flex flex-wrap gap-2">
                        {g.items.map((item) => (
                          <li key={item} className={`${BADGE} ${g.tone}`}>{item}</li>
                        ))}
                        {"more" in g && g.more && (
                          <li className={`${BADGE} border-dashed border-zinc-300 bg-zinc-50 text-zinc-500`}>{isEn ? "and more" : "dll."}</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {profile.karyaUnggulan.length > 0 && (
              <section className={card}>
                <h2 className={sectionTitle}>{isEn ? "Featured Works" : "Karya Unggulan"}</h2>
                {accent}
                <ul className={`grid grid-cols-1 gap-4 ${profile.karyaUnggulan.length > 1 ? "sm:grid-cols-2" : ""}`}>
                  {profile.karyaUnggulan.map((k) => (
                    // Highlight card
                    <li key={k.judul} className="border border-orange-200/70 border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50/80 to-white p-5 sm:p-6 flex flex-col gap-2.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                          <Music2 className="w-5 h-5" aria-hidden="true" />
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 leading-snug">&ldquo;{k.judul}&rdquo;</h3>
                      </div>
                      {(k.tahun || k.durasi) && (
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-zinc-500 pl-12">
                          {k.tahun && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                              {k.tahun}
                            </span>
                          )}
                          {k.durasi && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                              {k.durasi}
                            </span>
                          )}
                        </p>
                      )}
                      {k.deskripsi && (
                        <p lang="id" className="text-sm sm:text-base text-zinc-700 leading-relaxed pl-12 text-left sm:text-justify hyphens-auto">{k.deskripsi}</p>
                      )}
                      {k.link && (
                        <a
                          href={k.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 ml-12 inline-flex items-center gap-1 self-start text-xs font-semibold text-orange-700 hover:text-orange-800"
                        >
                          {isEn ? "View documentation" : "Lihat dokumentasi"}
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {profile.pengalamanBerkesenian.length > 0 && (
              <section className={card}>
                <h2 className={sectionTitle}>{isEn ? "Artistic Experience" : "Pengalaman Berkesenian"}</h2>
                {accent}
                <ul lang="id" className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-700 marker:text-orange-600">
                  {profile.pengalamanBerkesenian.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </section>
            )}

            {profile.layanan.length > 0 && (
              <section className={card}>
                <h2 className={sectionTitle}>{isEn ? "Services" : "Layanan"}</h2>
                {accent}
                <ul lang="id" className="space-y-2.5">
                  {profile.layanan.map((l) => (
                    <li key={l} className="flex items-start gap-3 text-sm sm:text-base text-zinc-700 leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {profile.prestasi.length > 0 && (
              <section className={card}>
                <h2 className={sectionTitle}>{isEn ? "Achievements & Awards" : "Prestasi & Penghargaan"}</h2>
                {accent}
                <ol className="space-y-3">
                  {profile.prestasi.map((p) => (
                    // Highlight card
                    <li key={p} className="flex items-center gap-4 border border-amber-200/80 bg-gradient-to-r from-amber-50 to-white p-4 sm:p-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <Trophy className="w-5 h-5" aria-hidden="true" />
                      </span>
                      <span className="text-base sm:text-lg font-semibold text-zinc-900 leading-snug">{p}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          {/* Sidebar: location */}
          {profile.alamat && (
            <aside className="lg:col-span-1 lg:sticky lg:top-24">
              <section className="bg-white p-6 rounded-none border border-zinc-200/80 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-4">{isEn ? "Location" : "Lokasi"}</h2>
                <p className="text-sm text-zinc-600 leading-relaxed mb-3">{profile.alamat}</p>
                <div className="w-full h-44 sm:h-52 my-3 rounded-none overflow-hidden border border-zinc-200 shadow-sm">
                  <iframe
                    title={isEn ? `Location of ${profile.nama}` : `Lokasi ${profile.nama}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(profile.alamat)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(profile.alamat)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-none transition-all"
                >
                  {isEn ? "Open in Google Maps ↗" : "Buka di Google Maps ↗"}
                </a>
              </section>
            </aside>
          )}
        </div>

        {/* Photo gallery: one cover card; clicking it opens the slider with every photo slot */}
        <section className={card}>
          <h2 className={sectionTitle}>{isEn ? "Photo Gallery" : "Galeri Foto"}</h2>
          {accent}
          {photos.length > 0 ? (
            <figure className="max-w-3xl">
              <button
                type="button"
                onClick={() => setLightboxIndex(coverIndex)}
                className="group relative block w-full aspect-video overflow-hidden border border-zinc-200 bg-zinc-100"
                aria-label={isEn ? `Open the photo gallery (${photos.length} photos)` : `Buka galeri foto (${photos.length} foto)`}
              >
                {cover && !cover.pending ? (
                  <Image
                    src={cover.url}
                    alt={(isEn && cover.captionEn) || cover.caption}
                    fill
                    sizes="(min-width: 1024px) 768px, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Images className="w-10 h-10 text-zinc-300" aria-hidden="true" />
                  </span>
                )}
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                {profile.isDummyMedia && (
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white">
                    {isEn ? "Illustration" : "Foto ilustrasi"}
                  </span>
                )}
                <span className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-lg bg-black/65 px-3 py-2 text-xs font-bold text-white backdrop-blur-md group-hover:bg-orange-600 transition-colors">
                  <ZoomIn className="w-4 h-4" aria-hidden="true" />
                  {isEn ? `View ${photos.length} Gallery Photos` : `Lihat ${photos.length} Foto Galeri`}
                </span>
              </button>
              {cover && (
                <figcaption className="mt-2 text-xs text-zinc-500 leading-relaxed">{(isEn && cover.captionEn) || cover.caption}</figcaption>
              )}
            </figure>
          ) : (
            <p className="text-sm text-zinc-500 italic">{isEn ? "Photos are not available yet." : "Foto belum tersedia."}</p>
          )}
        </section>

        {/* Performance video: its own section (the photo gallery holds photos only) */}
        <section className={card}>
          <h2 className={sectionTitle}>{isEn ? "Performance Video" : "Video Penampilan"}</h2>
          {accent}
          <div className="max-w-3xl">
              {videoId ? (
                <div className="relative w-full aspect-video overflow-hidden border border-zinc-200 bg-black">
                  <iframe
                    title={isEn ? `Performance video of ${profile.nama}` : `Video penampilan ${profile.nama}`}
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 aspect-video border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
                  <PlayCircle className="w-10 h-10 text-zinc-300" aria-hidden="true" />
                  <p className="text-sm text-zinc-500">{isEn ? "A performance video is not available yet." : "Video penampilan belum tersedia."}</p>
                  {(documentationLinks.length > 0 || youtubeChannel?.url) && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {documentationLinks.map((k) => (
                        <a
                          key={k.link}
                          href={k.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                        >
                          {isEn ? `Documentation: ${k.judul}` : `Dokumentasi: ${k.judul}`}
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      ))}
                      {youtubeChannel?.url && (
                        <a
                          href={youtubeChannel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d={SOCIAL_ICONS.youtube.path} />
                          </svg>
                          {isEn ? "YouTube channel" : "Kanal YouTube"}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
          </div>
        </section>
      </div>

      {lightboxIndex !== null && (
        <MusikGalleryLightbox
          photos={photos}
          startIndex={lightboxIndex}
          isEn={isEn}
          isDummyMedia={profile.isDummyMedia}
          title={profile.nama}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
