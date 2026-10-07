"use client";

import { CheckCircle2 } from "lucide-react";
import { useRowCap } from "./useRowCap";

const MAX_UNSCROLLED = 5;

/**
 * "Layanan" as amber feature-card rows with a check badge. Up to 5 rows show at their natural height; with more,
 * the list scrolls inside a box exactly 5 rows tall, so a long service list doesn't stretch the page.
 */
export default function ServiceList({ items, isEn, lang = "id" }: { items: string[]; isEn: boolean; lang?: string }) {
  const scrolls = items.length > MAX_UNSCROLLED;
  const { ref, maxHeight } = useRowCap<HTMLUListElement>(MAX_UNSCROLLED, scrolls);
  return (
    <ul
      ref={ref}
      lang={lang}
      // before the measurement (server render) the cap is a fixed 320px
      style={scrolls && maxHeight !== null ? { maxHeight } : undefined}
      className={`relative space-y-2.5 ${scrolls ? `overflow-y-auto pr-2 custom-scrollbar ${maxHeight === null ? "max-h-[320px]" : ""}` : ""}`}
      {...(scrolls
        ? { tabIndex: 0, "aria-label": isEn ? `Services (${items.length}, scrollable)` : `Layanan (${items.length}, dapat digulir)` }
        : {})}
    >
      {items.map((service, idx) => (
        <li
          key={`${service}-${idx}`}
          className="flex items-center gap-3 rounded-xl border border-amber-100/80 bg-amber-50/50 p-3 shadow-2xs transition-all hover:bg-amber-100/60"
        >
          <span className="shrink-0 rounded-lg bg-amber-100 p-2 text-amber-700">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium leading-relaxed text-zinc-800">{service}</span>
        </li>
      ))}
    </ul>
  );
}
