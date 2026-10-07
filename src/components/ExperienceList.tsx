"use client";

import { CalendarDays } from "lucide-react";
import { useRowCap } from "./useRowCap";

const MAX_UNSCROLLED = 5;

/**
 * Splits the year out of an experience line for the year pill: "Pagelaran … Betawi 2025 di Setu Babakan" →
 * { text: "Pagelaran … Betawi di Setu Babakan", year: "2025" }. A range ("2019–2022", "2019 - 2022") is kept
 * whole; only the first year (or range) is taken out. Lines without a year come back unchanged.
 */
export function splitYear(line: string): { text: string; year: string | null } {
  const match = line.match(/\b(?:19|20)\d{2}(?:\s*[-–]\s*(?:19|20)\d{2})?\b/);
  if (!match) return { text: line, year: null };
  const text = (line.slice(0, match.index) + line.slice(match.index! + match[0].length))
    .replace(/\(\s*\)/g, "")
    .replace(/\s+([,.;:)])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/[\s,;:–-]+$/, "")
    .trim();
  return { text: text || line, year: match[0].replace(/\s*[-–]\s*/, "–") };
}

/**
 * "Pengalaman Berkesenian" as timeline-style card rows: a calendar icon, the event, and its year in a pill on the right.
 * Up to 5 rows show at their natural height; with more, the list scrolls inside a box exactly 5 rows tall.
 */
export default function ExperienceList({ items, isEn, lang = "id" }: { items: string[]; isEn: boolean; lang?: string }) {
  const scrolls = items.length > MAX_UNSCROLLED;
  const { ref, maxHeight } = useRowCap<HTMLOListElement>(MAX_UNSCROLLED, scrolls);
  return (
    <ol
      ref={ref}
      lang={lang}
      // before the measurement (server render) the cap is a fixed 320px
      style={scrolls && maxHeight !== null ? { maxHeight } : undefined}
      className={`relative space-y-2.5 ${scrolls ? `overflow-y-auto pr-2 custom-scrollbar ${maxHeight === null ? "max-h-[320px]" : ""}` : ""}`}
      {...(scrolls
        ? { tabIndex: 0, "aria-label": isEn ? `Artistic experience (${items.length}, scrollable)` : `Pengalaman berkesenian (${items.length}, dapat digulir)` }
        : {})}
    >
      {items.map((line, idx) => {
        const { text, year } = splitYear(line);
        return (
          <li
            key={`${line}-${idx}`}
            className="flex items-start sm:items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 shadow-2xs transition-all hover:bg-amber-50/50"
          >
            <div className="flex min-w-0 items-start sm:items-center gap-3">
              {/* the same calendar icon on every row */}
              <span className="shrink-0 rounded-lg bg-amber-100/80 p-2 text-amber-800">
                <CalendarDays className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium leading-relaxed text-zinc-800">{text}</span>
            </div>
            {year && (
              <span className="shrink-0 whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-amber-800">
                {year}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
