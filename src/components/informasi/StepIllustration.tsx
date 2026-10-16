"use client";

import Image from "next/image";
import { CheckCheck, MapPin, MoreVertical, Search, SendHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export type StepIllustrationName = "search" | "profile" | "whatsapp";

// Step 1: catalog card photos under made-up names (the results stand for any listing). Step 2: a real profile,
// Sanggar Seni Sinar Norray, with its own logo and gallery; its facts match its catalog profile (sanggar/[id])
const RESULT_THUMBS = [
  "/images/sanggar/am-dance-studio/card/card-2.webp",
  "/images/sanggar/ayodya-pala/card/card-4.webp",
  "/images/sanggar/citra-art-studio/card/card-5.webp",
];
const PROFILE_LOGO = "/images/sanggar/sinar-norray/profile/profile-sanggar-2.webp";
const PROFILE_GALLERY = [
  "/images/sanggar/sinar-norray/galeri/galeri-1.webp",
  "/images/sanggar/sinar-norray/galeri/galeri-4.webp",
  "/images/sanggar/sinar-norray/galeri/galeri-2.webp",
];

const COPY = {
  id: {
    searchLabel: "Ilustrasi: kolom pencarian dengan filter kategori, grade, dan wilayah, beserta hasil sanggar",
    search: "Cari sanggar atau seniman musik…",
    chips: ["Seni Tari", "Grade A", "Jakarta Selatan"],
    // every result matches all three active filters (Seni Tari, Grade A, Jakarta Selatan)
    results: [
      { name: "Sanggar Tari Betawi", region: "Jakarta Selatan" },
      { name: "Sanggar Nusantara", region: "Jakarta Selatan" },
      { name: "Sanggar Seni Kreasi", region: "Jakarta Selatan" },
    ],
    profileLabel: "Ilustrasi: profil Sanggar Seni Sinar Norray dengan kutipan khas, layanan, dan galeri foto",
    profile: {
      name: "Sanggar Seni Sinar Norray",
      leader: "Ketua",
      region: "Jakarta Timur",
      about: "Pusat pelestarian seni tradisi & Lenong Betawi · sejak 1995",
      services: ["Tari Betawi", "Lenong Betawi", "Musik Gambang Kromong", "Kelas Tari"],
    },
    chatLabel: "Ilustrasi: percakapan WhatsApp langsung dengan pengelola sanggar",
    chatName: "Pengelola Sanggar",
    chat: [
      { out: true, text: "Halo, kami ingin mengundang sanggar untuk acara peresmian kantor.", time: "10.12" },
      { out: false, text: "Terima kasih! Boleh info tanggal dan lokasinya?", time: "10.14" },
      { out: true, text: "Tanggal 20 Desember, di Balai Kota Jakarta.", time: "10.15" },
      { out: false, text: "Siap! Kami kirimkan pilihan tarian dan penawarannya, ya.", time: "10.17" },
    ],
    chatInput: "Ketik pesan",
  },
  en: {
    searchLabel: "Illustration: a search box with category, grade and region filters, and studio results",
    search: "Search studios or music artists…",
    chips: ["Dance", "Grade A", "South Jakarta"],
    results: [
      { name: "Betawi Dance Studio", region: "South Jakarta" },
      { name: "Nusantara Studio", region: "South Jakarta" },
      { name: "Creative Arts Studio", region: "South Jakarta" },
    ],
    profileLabel: "Illustration: the Sinar Norray Art Studio profile with its motto, services and photo gallery",
    profile: {
      name: "Sinar Norray Art Studio",
      leader: "Leader",
      region: "East Jakarta",
      about: "A home of traditional Betawi arts & Lenong · since 1995",
      services: ["Betawi Dance", "Lenong Betawi", "Gambang Kromong Music", "Dance Classes"],
    },
    chatLabel: "Illustration: a direct WhatsApp chat with the studio manager",
    chatName: "Studio Manager",
    chat: [
      { out: true, text: "Hello, we'd like to invite your studio to our office inauguration.", time: "10:12" },
      { out: false, text: "Thank you! Could you share the date and venue?", time: "10:14" },
      { out: true, text: "December 20, at Jakarta City Hall.", time: "10:15" },
      { out: false, text: "Great! We'll send you our dance options and a quote.", time: "10:17" },
    ],
    chatInput: "Type a message",
  },
};

/** Placeholder sanggar avatar: an initial on the brand orange */
function Avatar({ className }: { className: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-500 font-bold text-white ${className}`}>
      S
    </span>
  );
}

function RegionPill({ region }: { region: string }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700 ring-1 ring-primary-100">
      <MapPin className="h-3 w-3" />
      {region}
    </span>
  );
}

const GRADE_PILL = "rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800";

// Sinar Norray facts shared by both languages (as in its catalog profile: Grade B, motto in Betawi)
const PROFILE_LEADER = "Engkar Karmilasari";
const PROFILE_GRADE = "Grade B";
const PROFILE_MOTTO = "Orang Nya Boleh Mati, Tapi Seni Nya Kaga Boleh Sampe Mati";

/**
 * Mock-ups of the catalog for the "Mudah, Cepat, dan Langsung" steps. Each one is a single image for screen readers
 * (role="img" + a label describing it); its pieces are decoration. They fill the width they get: the full preview
 * panel on wide screens, the narrow step card on phones (container queries, so the same mock-up adapts to both).
 */
export default function StepIllustration({ name }: { name: StepIllustrationName }) {
  const { language } = useLanguage();
  const c = COPY[language];

  if (name === "search") {
    return (
      <div role="img" aria-label={c.searchLabel} className="@container w-full space-y-4">
        <div className="mx-auto w-full max-w-xl space-y-3">
          <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-sm ring-1 ring-slate-200">
            <Search className="h-4 w-4 shrink-0 text-primary-600" />
            <span className="truncate text-xs text-slate-500 @sm:text-sm">{c.search}</span>
          </div>
          {/* all three filters are active: the results below match each of them */}
          <div className="flex flex-wrap gap-1.5 @sm:justify-center">
            {c.chips.map((chip) => (
              <span key={chip} className="rounded-full bg-primary-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                {chip}
              </span>
            ))}
          </div>
        </div>
        {/* results: compact rows in a narrow card, three full cards across the wide panel */}
        <div className="grid w-full grid-cols-1 gap-2.5 @sm:grid-cols-3 @sm:gap-4">
          {c.results.map((result, i) => (
            <div key={result.name} className="flex items-center gap-3 overflow-hidden rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200 @sm:block @sm:p-0">
              <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-xl @sm:w-full @sm:rounded-none">
                <Image src={RESULT_THUMBS[i]} alt="" fill sizes="220px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1 @sm:p-3">
                <p className="truncate text-xs font-bold text-slate-900 @sm:text-sm">{result.name}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <RegionPill region={result.region} />
                  <span className={GRADE_PILL}>Grade A</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (name === "profile") {
    return (
      <div role="img" aria-label={c.profileLabel} className="@container mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />
        <div className="space-y-3 p-4 @lg:space-y-4 @lg:p-5">
          {/* header: logo, name, leader, location + grade */}
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm ring-1 ring-primary-100 @lg:h-14 @lg:w-14">
              <Image src={PROFILE_LOGO} alt="" fill sizes="56px" className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight text-slate-900 @lg:text-base">{c.profile.name}</p>
              <p className="mt-0.5 text-[11px] text-slate-500 @lg:text-xs">
                {c.profile.leader}: <span className="font-semibold text-slate-700">{PROFILE_LEADER}</span>
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <RegionPill region={c.profile.region} />
                <span className={GRADE_PILL}>{PROFILE_GRADE}</span>
              </div>
            </div>
          </div>
          {/* the studio's motto */}
          <div className="rounded-xl border-l-4 border-primary-500 bg-primary-50 px-3 py-2 @lg:px-4 @lg:py-2.5">
            <p className="text-xs italic leading-snug text-slate-800 @lg:text-[13px]">&ldquo;{PROFILE_MOTTO}&rdquo;</p>
            <p className="mt-1 text-[10px] font-semibold text-primary-700 @lg:text-[11px]">{c.profile.about}</p>
          </div>
          {/* services */}
          <div className="flex flex-wrap gap-1.5">
            {c.profile.services.map((service) => (
              <span key={service} className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                {service}
              </span>
            ))}
          </div>
          {/* gallery */}
          <div className="grid grid-cols-3 gap-2 @lg:gap-3">
            {PROFILE_GALLERY.map((src) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-100 bg-slate-100">
                <Image src={src} alt="" fill sizes="220px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div role="img" aria-label={c.chatLabel} className="@container mx-auto w-full max-w-2xl overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-2.5 bg-[#075E54] px-3.5 py-2.5 text-white @lg:px-4 @lg:py-3">
        <Avatar className="h-8 w-8 text-xs @lg:h-10 @lg:w-10 @lg:text-sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold @lg:text-sm">{c.chatName}</span>
          <span className="block text-[10px] text-white/75 @lg:text-xs">online</span>
        </span>
        {/* the chat's menu button, as in WhatsApp's header */}
        <MoreVertical className="h-4 w-4 shrink-0 text-white/90 @lg:h-5 @lg:w-5" />
      </div>
      <div className="space-y-2 bg-[#EFE7DD] px-3 py-3.5 @lg:space-y-2.5 @lg:px-5 @lg:py-5">
        {c.chat.map((message) => (
          <p
            key={message.time}
            className={`w-fit max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-snug text-slate-800 shadow-sm @lg:max-w-[65%] @lg:text-[13px] ${
              message.out ? "ml-auto rounded-tr-md bg-[#D9FDD3]" : "rounded-tl-md bg-white"
            }`}
          >
            {message.text}
            <span className="ml-1.5 inline-flex items-center gap-0.5 align-bottom text-[9px] text-slate-500 @lg:text-[10px]">
              {message.time}
              {message.out && <CheckCheck className="h-3 w-3 text-sky-500" />}
            </span>
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-[#F0F2F5] px-3 py-2 @lg:px-4 @lg:py-2.5">
        <span className="flex-1 rounded-full bg-white px-3 py-1.5 text-[11px] text-slate-400 @lg:text-xs">{c.chatInput}</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00A884] text-white @lg:h-8 @lg:w-8">
          <SendHorizontal className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
