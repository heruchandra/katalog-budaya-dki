"use client";

import Image from "next/image";
import { CheckCheck, MessageCircle, Play, Search, SendHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export type StepIllustrationName = "search" | "profile" | "whatsapp";

// Photos already in the catalog (sanggar cards and gallery photos), shown small inside the mock-ups. No sanggar
// name or logo appears: the mock-ups stand for any listing
const RESULT_THUMBS = [
  "/images/sanggar/am-dance-studio/card/card-2.webp",
  "/images/sanggar/ayodya-pala/card/card-4.webp",
  "/images/sanggar/citra-art-studio/card/card-5.webp",
];
const PROFILE_COVER = "/images/sanggar/sinar-norray/galeri/galeri-3.webp";
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
    profileLabel: "Ilustrasi: profil sanggar dengan video penampilan dan galeri foto",
    video: "Video penampilan",
    chatLabel: "Ilustrasi: percakapan WhatsApp langsung dengan pengelola sanggar",
    chatName: "Pengelola Sanggar",
    chatOut: "Halo, kami ingin mengundang sanggar untuk acara peresmian kantor.",
    chatIn: "Terima kasih! Boleh info tanggal dan lokasinya?",
    times: ["10.12", "10.14"],
    chatInput: "Ketik pesan",
  },
  en: {
    searchLabel: "Illustration: a search box with category, grade and region filters, and studio results",
    search: "Search studios or music artists…",
    chips: ["Dance", "Grade A", "South Jakarta"],
    profileLabel: "Illustration: a studio profile with a performance video and a photo gallery",
    video: "Performance video",
    chatLabel: "Illustration: a direct WhatsApp chat with the studio manager",
    chatName: "Studio Manager",
    chatOut: "Hello, we'd like to invite your studio to our office inauguration.",
    chatIn: "Thank you! Could you share the date and venue?",
    times: ["10:12", "10:14"],
    chatInput: "Type a message",
  },
};

/** Placeholder sanggar avatar: an initial on the brand gradient */
function Avatar({ className }: { className: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-700 font-bold text-white ${className}`}>
      S
    </span>
  );
}

/**
 * Small mock-ups of the catalog for the "Mudah, Cepat, dan Langsung" steps. Each one is a single image for screen
 * readers (role="img" + a label describing it); its pieces are decoration.
 */
export default function StepIllustration({ name }: { name: StepIllustrationName }) {
  const { language } = useLanguage();
  const c = COPY[language];

  if (name === "search") {
    return (
      <div role="img" aria-label={c.searchLabel} className="mx-auto w-full max-w-xs space-y-3">
        <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-sm ring-1 ring-slate-200">
          <Search className="h-4 w-4 shrink-0 text-primary-600" />
          <span className="truncate text-xs text-slate-500">{c.search}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {c.chips.map((chip, i) => (
            <span
              key={chip}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i < 2 ? "bg-primary-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {RESULT_THUMBS.map((src) => (
            <div key={src} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="relative aspect-[4/5]">
                <Image src={src} alt="" fill sizes="112px" className="object-cover" />
              </div>
              <div className="space-y-1 p-2">
                <span className="block h-1.5 w-4/5 rounded-full bg-slate-200" />
                <span className="block h-1.5 w-1/2 rounded-full bg-primary-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (name === "profile") {
    return (
      <div role="img" aria-label={c.profileLabel} className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="relative aspect-[16/8] bg-slate-100">
          <Image src={PROFILE_COVER} alt="" fill sizes="320px" className="object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/15">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-primary-600 shadow-lg">
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </span>
          </span>
          <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white">{c.video}</span>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2.5">
            <Avatar className="relative -mt-7 h-11 w-11 text-base shadow ring-2 ring-white" />
            <span className="flex-1 space-y-1.5">
              <span className="block h-2 w-3/5 rounded-full bg-slate-300" />
              <span className="block h-1.5 w-2/5 rounded-full bg-slate-200" />
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">Grade A</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {PROFILE_GALLERY.map((src) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                <Image src={src} alt="" fill sizes="104px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div role="img" aria-label={c.chatLabel} className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-2.5 bg-[#075E54] px-3.5 py-2.5 text-white">
        <Avatar className="h-8 w-8 text-xs" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold">{c.chatName}</span>
          <span className="block text-[10px] text-white/75">online</span>
        </span>
        <MessageCircle className="h-4 w-4 shrink-0 text-white/80" />
      </div>
      <div className="space-y-2 bg-[#EFE7DD] px-3 py-3.5">
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-[#D9FDD3] px-3 py-2 text-[11px] leading-snug text-slate-800 shadow-sm">
          {c.chatOut}
          <span className="ml-1.5 inline-flex items-center gap-0.5 align-bottom text-[9px] text-slate-500">
            {c.times[0]} <CheckCheck className="h-3 w-3 text-sky-500" />
          </span>
        </p>
        <p className="w-fit max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3 py-2 text-[11px] leading-snug text-slate-800 shadow-sm">
          {c.chatIn}
          <span className="ml-1.5 align-bottom text-[9px] text-slate-500">{c.times[1]}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 bg-[#F0F2F5] px-3 py-2">
        <span className="flex-1 rounded-full bg-white px-3 py-1.5 text-[11px] text-slate-400">{c.chatInput}</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00A884] text-white">
          <SendHorizontal className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
