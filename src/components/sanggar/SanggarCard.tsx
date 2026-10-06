"use client";

import React from "react";
import Link from "next/link";

export interface SanggarCardData {
  id: string | number;
  nama_sanggar?: string;
  name?: string;
  nama_pimpinan?: string;
  leader?: string;
  grade?: string;
  alamat?: string;
  wilayah?: string;
  kota_kab?: string;
  whatsapp?: string;
  whatsappNumber?: string;
  whatsappUrl?: string;
  instagram?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  thumbnail_url?: string | null;
  coverImage?: string;
  image?: string;
  contacts?: {
    phone?: string[];
    whatsapp?: string;
    instagram?: string;
    youtube?: string;
  };
}

interface SanggarCardProps {
  sanggar: SanggarCardData;
}

export default function SanggarCard({ sanggar }: SanggarCardProps) {
  const name = sanggar.nama_sanggar || sanggar.name || "Sanggar Seni";
  const image = sanggar.thumbnail_url || sanggar.coverImage || sanggar.image || "/images/cards/card-1.webp";
  const grade = sanggar.grade ? (sanggar.grade.toLowerCase().includes("grade") ? sanggar.grade : `Grade ${sanggar.grade}`) : null;
  const location = sanggar.kota_kab || sanggar.wilayah || "DKI Jakarta";

  // Resolve direct WhatsApp link
  const getWhatsAppLink = () => {
    if (sanggar.whatsappUrl) return sanggar.whatsappUrl;
    if (sanggar.contacts?.whatsapp) return sanggar.contacts.whatsapp;
    const rawNumber = sanggar.whatsappNumber || sanggar.whatsapp || (sanggar.contacts?.phone && sanggar.contacts.phone[0]) || "6281310998647";
    if (rawNumber.startsWith("http")) return rawNumber;
    const cleaned = rawNumber.replace(/\D/g, "");
    const formatted = cleaned.startsWith("0") ? "62" + cleaned.substring(1) : cleaned;
    return `https://wa.me/${formatted}`;
  };

  // Resolve direct YouTube link
  const getYouTubeLink = () => {
    return sanggar.youtubeUrl || sanggar.contacts?.youtube || "https://www.youtube.com";
  };

  // Resolve direct Instagram link
  const getInstagramLink = () => {
    if (sanggar.instagramUrl) return sanggar.instagramUrl;
    if (sanggar.contacts?.instagram) {
      return sanggar.contacts.instagram.startsWith("http")
        ? sanggar.contacts.instagram
        : `https://instagram.com/${sanggar.contacts.instagram.replace("@", "")}`;
    }
    if (sanggar.instagram) {
      return sanggar.instagram.startsWith("http")
        ? sanggar.instagram
        : `https://instagram.com/${sanggar.instagram.replace("@", "")}`;
    }
    return null;
  };

  return (
    <div className="group relative flex flex-col rounded-none overflow-hidden bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-all">
      {/* Poster Image Container */}
      <Link
        href={`/sanggar/${sanggar.id}`}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-slate-100 block cursor-pointer"
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover Overlay Container */}
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto flex flex-col justify-end p-3.5 sm:p-4">
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/80 to-transparent -z-10 pointer-events-none" />

          {/* Action Buttons */}
          <div className="flex gap-2 items-center justify-between">
            {/* YouTube TONTON Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(getYouTubeLink(), "_blank", "noopener,noreferrer");
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-none py-2.5 px-3 text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Tonton</span>
            </button>

            {/* WhatsApp Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(getWhatsAppLink(), "_blank", "noopener,noreferrer");
              }}
              className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-none py-2.5 px-3 text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.12.553 4.108 1.519 5.84L.16 23.479l5.774-1.513a11.97 11.97 0 006.097 1.665c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm.016 21.986a9.92 9.92 0 01-5.06-1.385l-.363-.216-3.763.987.1004-3.669-.237-.377A9.924 9.924 0 012.05 12.03c0-5.503 4.478-9.981 9.981-9.981 5.503 0 9.981 4.478 9.981 9.981 0 5.503-4.478 9.981-9.981 9.981zm5.474-7.481c-.301-.15-1.782-.879-2.057-.979-.275-.1-.475-.15-.675.15-.2.3-.775.979-.95 1.179-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.489-.893-.796-1.495-1.78-1.67-2.08-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.582-.492-.503-.675-.512-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.898 1.225 3.1 2.113 3.227 5.118 4.524c.714.309 1.272.494 1.707.632.716.228 1.368.196 1.883.119.575-.086 1.782-.729 2.032-1.43.25-.701.25-1.301.175-1.43-.075-.129-.275-.204-.575-.354z"/>
              </svg>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </Link>

      {/* Card Info Area */}
      <div className="p-4 pt-3 text-left">
        <Link href={`/sanggar/${sanggar.id}`}>
          <h3 className="text-lg text-slate-900 truncate font-medium hover:text-orange-600 transition-colors cursor-pointer">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 truncate mt-0.5">
          {location}
        </p>

        {grade && (
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-none bg-orange-50 text-orange-600 border border-orange-200/60">
              {grade}
            </span>
            {getInstagramLink() && (
              <a
                href={getInstagramLink()!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-zinc-400 hover:text-pink-600 transition-colors font-medium"
              >
                Instagram ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

