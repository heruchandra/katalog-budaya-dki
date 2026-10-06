import type { SosialMedia, SosialPlatform } from "@/types/musik";

/** Brand marks (inline SVG: lucide-react v1 has no brand icons) */
export const SOCIAL_ICONS: Record<SosialPlatform, { label: string; color: string; path: string }> = {
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

export const WHATSAPP_PATH =
  "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z";


/**
 * Compact social media pills ([brand icon] + handle), shared by the sanggar and seniman musik detail pages.
 * Search links (no exact profile URL on record) are labelled as such for screen readers and in the tooltip.
 */
export function SocialPills({ items, isEn }: { items: SosialMedia[]; isEn: boolean }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label={isEn ? "Social media" : "Media sosial"}>
      {items.map((s) => {
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
  );
}

/** Full-width green "Hubungi via WhatsApp" button (direct wa.me link, no internal chat) */
export function WhatsAppButton({ href, isEn }: { href: string; isEn: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#059669] text-sm font-bold text-white shadow-xs transition-opacity hover:opacity-90"
    >
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d={WHATSAPP_PATH} />
      </svg>
      {isEn ? "Contact via WhatsApp" : "Hubungi via WhatsApp"}
    </a>
  );
}

// re-exported for pages that only need the type
export type { SosialPlatform };
