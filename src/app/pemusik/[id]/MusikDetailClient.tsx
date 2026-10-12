"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { CalendarDays, Music, Users, UserRound, Music2, ExternalLink, Clock, Images, ZoomIn } from "lucide-react";
import AwardList from "@/components/AwardList";
import ExperienceList from "@/components/ExperienceList";
import ServiceList from "@/components/ServiceList";
import PerformanceVideo from "@/components/PerformanceVideo";
import { useLanguage } from "@/context/LanguageContext";
import { dancingScript, playfair } from "@/lib/fonts";
import FallbackImage from "@/components/FallbackImage";
import { waNumberOf } from "@/data/musikData";
import type { MusikEntity } from "@/types/musik";
import { SOCIAL_ICONS, SocialPills, WhatsAppButton } from "@/components/SocialPills";

// Photo slider, loaded only when the gallery is opened
const MusikGalleryLightbox = dynamic(() => import("./MusikGalleryLightbox"), { ssr: false });

const BADGE = "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium";

export default function MusikDetailClient({ profile }: { profile: MusikEntity }) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const isKomunitas = profile.category === "komunitas";

  // Gallery: every photo slot (uploaded or pending); the cover is the first uploaded photo
  const photos = profile.fotoGallery;
  const coverIndex = Math.max(0, photos.findIndex((p) => !p.pending));
  const cover = photos[coverIndex];
  // the cover shows no visible caption: its alt text names the entity (and the photo, when the caption doesn't)
  const coverCaption = cover ? (isEn && cover.captionEn) || cover.caption : "";
  const coverAlt = !coverCaption || coverCaption.includes(profile.nama) ? coverCaption || profile.nama : `${profile.nama} – ${coverCaption}`;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const initials = profile.nama.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  // Direct WhatsApp contact (no internal chat), pre-filled message
  const waNumber = waNumberOf(profile);
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        isEn
          ? `Hello, I saw the profile of ${profile.nama} on the DKI Jakarta Art Catalog and would like to ask about music performance services.`
          : `Halo, saya melihat profil ${profile.nama} di Katalog Seni DKI Jakarta dan ingin bertanya mengenai jasa pentas musik.`
      )}`
    : null;

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

  // Users for a community / group, a music note for an individual musician
  const CategoryIcon = isKomunitas ? Users : Music;

  const sectionTitle = `text-2xl sm:text-3xl font-normal text-zinc-900 tracking-tight ${playfair.className}`;
  const card = "bg-white p-6 sm:p-8 rounded-none border border-zinc-200/80 shadow-sm";
  const accent = <div className="w-12 h-0.5 bg-orange-600 mt-3 mb-6" />;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
        {/* Header: identity + contact */}
        <section className={`${card} grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-center`}>
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Profile photo / logo; initials until one is uploaded */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full overflow-hidden border-2 border-orange-100 bg-orange-50 shadow-sm flex items-center justify-center">
                {/* initials when there is no profile photo, or it hasn't been uploaded yet */}
                <FallbackImage
                  src={profile.fotoProfil}
                  alt={isEn ? `${profile.nama} profile photo` : `Foto profil ${profile.nama}`}
                  sizes="96px"
                  className="object-cover"
                  placeholder={<span className={`text-3xl sm:text-4xl text-orange-500 ${dancingScript.className}`} aria-hidden="true">{initials}</span>}
                />
              </div>
              <div className="min-w-0">
                {/* Category badge: right of the avatar, directly above the name */}
                <span className="flex w-fit items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 shadow-2xs">
                  <CategoryIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {isKomunitas ? (isEn ? "Music Community" : "Komunitas Musik") : isEn ? "Musician" : "Pemusik"}
                </span>
                {/* Same title style as the sanggar page; leading-normal leaves room for the script's swashes */}
                <h1 className="mt-1.5 font-script text-3xl sm:text-4xl lg:text-5xl text-orange-600 leading-normal font-normal">{profile.nama}</h1>
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
              <WhatsAppButton href={waLink} isEn={isEn} />
            ) : (
              <p className="text-sm text-zinc-500">{isEn ? "Contact details are being completed." : "Data kontak sedang dilengkapi."}</p>
            )}

            <SocialPills items={profile.sosialMedia} isEn={isEn} />
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
                <ExperienceList items={profile.pengalamanBerkesenian} isEn={isEn} />
              </section>
            )}

            {profile.layanan.length > 0 && (
              <section className={card}>
                <h2 className={sectionTitle}>{isEn ? "Services" : "Layanan"}</h2>
                {accent}
                <ServiceList items={profile.layanan} isEn={isEn} />
              </section>
            )}

            {profile.prestasi.length > 0 && (
              <section className={card}>
                <h2 className={sectionTitle}>{isEn ? "Achievements & Awards" : "Prestasi & Penghargaan"}</h2>
                {accent}
                <AwardList items={profile.prestasi.map((title) => ({ title }))} isEn={isEn} />
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

        {/* Galeri Foto (left) and Video Penampilan (right) side by side from lg up, stacked below that. Both cards
            stretch to the row height and hold a 16:9 media box, so they line up */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Photo gallery: one cover card; clicking it opens the slider with every photo slot */}
        <section className={`${card} flex flex-col`}>
          <h2 className={sectionTitle}>{isEn ? "Photo Gallery" : "Galeri Foto"}</h2>
          {accent}
          {photos.length > 0 ? (
            <div>
              <button
                type="button"
                onClick={() => setLightboxIndex(coverIndex)}
                className="group relative block w-full aspect-video rounded-xl overflow-hidden bg-zinc-100"
                aria-label={isEn ? `Open the photo gallery (${photos.length} photos)` : `Buka galeri foto (${photos.length} foto)`}
              >
                <FallbackImage
                  src={cover && !cover.pending ? cover.url : undefined}
                  fallbackSrc={cover?.fallbackUrl}
                  alt={coverAlt}
                  sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  placeholder={
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Images className="w-10 h-10 text-zinc-300" aria-hidden="true" />
                    </span>
                  }
                />
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 aspect-video rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
              <Images className="w-10 h-10 text-zinc-300" aria-hidden="true" />
              <p className="text-sm text-zinc-500">{isEn ? "Photos are not available yet." : "Foto belum tersedia."}</p>
            </div>
          )}
        </section>

        {/* Performance video: its own card (the photo gallery holds photos only) */}
        <section id="video-penampilan" className={`${card} flex flex-col`}>
          <h2 className={sectionTitle}>{isEn ? "Performance Video" : "Video Penampilan"}</h2>
          {accent}
          {/* Video file (e.g. /images/musik/<slug>/video/video.mp4) → native player; YouTube link → embed;
              none / not uploaded yet → placeholder with the documentation and channel links */}
          <PerformanceVideo
            videoUrl={profile.videoUrl}
            // light thumbnail until play: the profile photo, else the card / first gallery photo
            poster={profile.videoPoster || profile.fotoProfil || profile.fotoCard || cover?.url}
            title={isEn ? `Performance video of ${profile.nama}` : `Video penampilan ${profile.nama}`}
            isEn={isEn}
            placeholderActions={
              (documentationLinks.length > 0 || youtubeChannel?.url) && (
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
              )
            }
          />
        </section>
        </div>
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
