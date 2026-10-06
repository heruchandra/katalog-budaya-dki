"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

export interface ArtistCardProps {
  /** Link destination for the detail page */
  href: string;
  /** Artist or group name */
  name: string;
  /** Optional subtitle (e.g. "Pimpinan: ...") */
  subtitle?: string;
  /** Image URL — falls back to placeholder icon */
  imageUrl?: string | null;
  /** Badge shown on the image corner (Grade A/B or Solo/Komunitas) */
  badge: {
    label: string;
    icon: LucideIcon;
    /** 'filled' = vibrant orange bg, 'outline' = white bg with orange text */
    variant: "filled" | "outline";
  };
  /** Tags rendered as small chips (e.g. dance types, music genres) */
  tags?: string[];
  /** Location string (kecamatan, kota) */
  location?: string;
  /** WhatsApp phone number (raw, with or without formatting) */
  phone?: string;
  /** Icon shown in the image placeholder area */
  PlaceholderIcon: LucideIcon;
}

const getWaLink = (phone?: string) => {
  if (!phone) return '#';
  const cleaned = phone.replace(/\D/g, ''); // Remove all non-numeric characters
  if (cleaned.startsWith('0')) {
    return `https://wa.me/62${cleaned.substring(1)}`;
  }
  return `https://wa.me/${cleaned}`;
};

export default function ArtistCard({
  href,
  name,
  subtitle,
  imageUrl,
  badge,
  tags,
  location,
  phone,
  PlaceholderIcon,
}: ArtistCardProps) {
  return (
    <div
      className="group relative flex flex-col h-full cursor-pointer overflow-hidden rounded-none border border-slate-200/60 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-surface-900/10"
    >
      {/* Clickable Overlay */}
      <Link href={href} className="absolute inset-0 z-0" aria-label={name}></Link>
      {/* Image Area */}
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden rounded-none">
        {imageUrl && typeof imageUrl === 'string' ? (
          <img
            src={imageUrl}
            alt={name || 'Foto Sanggar'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <img
            src="/images/cards/card-1.webp"
            alt={name || 'Foto Default'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 rounded-none px-2.5 py-1 text-xs font-bold shadow-sm ${
              badge.variant === "filled"
                ? "bg-primary-600 text-white"
                : "bg-white text-primary-700 ring-1 ring-primary-200"
            }`}
          >
            <badge.icon className="h-3 w-3" />
            {badge.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-surface-900 line-clamp-1">
          {name}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-surface-500 line-clamp-1">
            {subtitle}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-none bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-none bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta info */}
        <div className="mt-4 space-y-1.5">
          {location && (
            <p className="flex items-center gap-2 text-xs text-surface-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-surface-400" />
              {location}
            </p>
          )}
        </div>

        {/* WhatsApp Contact */}
        <a 
          href={getWaLink(phone || '[MASUKKAN_NOMOR_TES_DISINI]')} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="relative z-10 mt-auto w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1DA851] text-white py-2 px-4 rounded-none text-sm font-medium transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          Hubungi via WhatsApp
        </a>
      </div>
    </div>
  );
}
