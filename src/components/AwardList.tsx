"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Award, Trophy } from "lucide-react";

export interface AwardItem {
  title: string;
  organizer?: string;
  year?: string;
}

const VISIBLE = 3;

// Grades, evaluations and certifications get a quieter warm tone; wins and awards get the gold card
const isAssessment = (title: string) => /\bgrade\b|evaluasi|evaluation|sertifikasi|certification|akreditasi|accreditation/i.test(title);

/**
 * "Prestasi & Penghargaan" list shared by the sanggar and seniman musik detail pages: gold highlight cards with a
 * trophy badge. Up to 3 cards show at their natural height; with more, the list scrolls inside a box exactly 3
 * cards tall (the height is measured, so wrapped titles still show 3 whole cards).
 */
export default function AwardList({ items, isEn }: { items: AwardItem[]; isEn: boolean }) {
  const listRef = useRef<HTMLOListElement>(null);
  const scrolls = items.length > VISIBLE;
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!scrolls || !list) return;
    // the list is `relative`, so offsetTop is measured from its top edge (and isn't affected by scrolling).
    // ResizeObserver calls back once on observe, then on every resize (wrapping titles change the height).
    const ro = new ResizeObserver(() => {
      const third = list.children[VISIBLE - 1] as HTMLElement | undefined;
      if (third) setMaxHeight(third.offsetTop + third.offsetHeight);
    });
    ro.observe(list);
    return () => ro.disconnect();
  }, [scrolls, items]);

  return (
    <ol
      ref={listRef}
      // before the measurement (server render) the cap is a fixed ~3 cards
      style={scrolls && maxHeight !== null ? { maxHeight } : undefined}
      className={`relative space-y-3 ${scrolls ? `overflow-y-auto pr-2 custom-scrollbar ${maxHeight === null ? "max-h-[320px]" : ""}` : ""}`}
      {...(scrolls
        ? { tabIndex: 0, "aria-label": isEn ? `Achievements (${items.length}, scrollable)` : `Prestasi (${items.length}, dapat digulir)` }
        : {})}
    >
      {items.map((item, idx) => {
        const quiet = isAssessment(item.title);
        const Icon = quiet ? Award : Trophy;
        return (
          <li
            key={`${item.title}-${idx}`}
            className={`flex items-center gap-4 rounded-xl border p-4 ${
              quiet ? "bg-orange-50/40 border-orange-100" : "bg-amber-50/60 border-amber-200/80"
            }`}
          >
            <span className={`shrink-0 rounded-full p-3 ${quiet ? "bg-orange-100/70 text-orange-600" : "bg-amber-100 text-amber-600"}`}>
              <Icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-zinc-900 leading-snug">{item.title}</p>
              {item.organizer && <p className="mt-1 text-xs text-zinc-500">{item.organizer}</p>}
            </div>
            {/* Year badge: orange-700 keeps white 12px text above WCAG AA 4.5:1 */}
            {item.year && (
              <span className="shrink-0 self-start rounded-lg bg-orange-700 px-3 py-1 text-xs font-semibold tabular-nums text-white shadow-sm">
                {item.year}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
