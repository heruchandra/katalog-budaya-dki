"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type PageItem = number | "ellipsis-left" | "ellipsis-right";

/**
 * Page list with ellipses once there are more than 5 pages.
 * `siblings` = pages shown on each side of the current page (1 on desktop, 0 on phones).
 * An ellipsis that would hide exactly one page shows that page instead.
 */
export function getPageItems(current: number, total: number, siblings: number): PageItem[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const edgeWindow = 2 * siblings + 2;
  let pages: number[];
  if (current <= siblings + 2) {
    pages = [...Array.from({ length: edgeWindow }, (_, i) => i + 1), total];
  } else if (current >= total - siblings - 1) {
    pages = [1, ...Array.from({ length: edgeWindow }, (_, i) => total - edgeWindow + 1 + i)];
  } else {
    pages = [1, ...Array.from({ length: 2 * siblings + 1 }, (_, i) => current - siblings + i), total];
  }

  const items: PageItem[] = [];
  pages.forEach((page, i) => {
    const prev = pages[i - 1];
    if (prev !== undefined) {
      if (page - prev === 2) items.push(prev + 1);
      else if (page - prev > 2) items.push(i === 1 ? "ellipsis-left" : "ellipsis-right");
    }
    items.push(page);
  });
  return items;
}

function useIsNarrow() {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isNarrow;
}

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const SQUARE = "w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-md sm:rounded-lg text-sm font-bold transition-all";

export default function CatalogPagination({ currentPage, totalPages, onPageChange, className = "" }: CatalogPaginationProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const isNarrow = useIsNarrow();

  if (totalPages < 1) return null;

  const items = getPageItems(currentPage, totalPages, isNarrow ? 0 : 1);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const arrowClass = (disabled: boolean) =>
    `${SQUARE} bg-white border border-zinc-200 text-zinc-700 ${
      disabled
        ? "opacity-40 cursor-not-allowed hover:bg-white hover:border-zinc-200"
        : "hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.97]"
    }`;

  return (
    <nav
      aria-label={isEn ? "Catalog pages" : "Halaman katalog"}
      className={`flex items-center justify-center gap-1.5 sm:gap-2 w-full select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => !isFirst && onPageChange(currentPage - 1)}
        disabled={isFirst}
        className={arrowClass(isFirst)}
        aria-label={isEn ? "Previous page" : "Halaman sebelumnya"}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {items.map((item) => {
        if (typeof item !== "number") {
          return (
            <span key={item} className={`${SQUARE} text-zinc-400 font-semibold`} aria-hidden="true">
              …
            </span>
          );
        }
        const isActive = item === currentPage;
        return (
          <button
            key={item}
            type="button"
            onClick={() => !isActive && onPageChange(item)}
            aria-current={isActive ? "page" : undefined}
            aria-label={isEn ? `Page ${item}` : `Halaman ${item}`}
            className={`${SQUARE} ${
              isActive
                ? "bg-brand text-white shadow-md shadow-orange-500/20 border border-orange-600 z-10 cursor-default"
                : "bg-white text-zinc-700 border border-zinc-200 font-semibold hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 hover:shadow-xs active:scale-[0.97]"
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => !isLast && onPageChange(currentPage + 1)}
        disabled={isLast}
        className={arrowClass(isLast)}
        aria-label={isEn ? "Next page" : "Halaman selanjutnya"}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
