"use client";

import { MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ArtistCardProps {
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

export default function ArtistCard({
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
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-surface-900/10">
      {/* Image Area */}
      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200/80">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <PlaceholderIcon className="h-12 w-12 text-slate-300" />
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm ${
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
      <div className="p-5">
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
                className="rounded-md bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-md bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-500">
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
          {phone && (
            <a
              href={`https://wa.me/${phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              Hubungi via WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
