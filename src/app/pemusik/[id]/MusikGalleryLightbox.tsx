"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import type { MusikPhoto } from "@/types/musik";

interface MusikGalleryLightboxProps {
  photos: MusikPhoto[];
  startIndex: number;
  isEn: boolean;
  /** Photos are illustrations, not of this entry (shown with a label) */
  isDummyMedia: boolean;
  title: string;
  onClose: () => void;
}

/**
 * Full-screen photo slider for a seniman musik gallery: previous / next, "1 / 5" counter, close, keyboard
 * (← → Esc) and swipe. Slots whose photo hasn't been uploaded yet (`pending`) show a placeholder slide.
 * Loaded with next/dynamic only when the gallery is opened.
 */
export default function MusikGalleryLightbox({ photos, startIndex, isEn, isDummyMedia, title, onClose }: MusikGalleryLightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const count = photos.length;
  const photo = photos[index];
  const caption = (isEn && photo.captionEn) || photo.caption;
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const step = (delta: 1 | -1) => setIndex((i) => (i + delta + count) % count);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => (i + (e.key === "ArrowRight" ? 1 : -1) + count) % count);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, [count, onClose]);

  const navButton =
    "absolute top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-orange-600 transition-colors";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? `${title} photo gallery` : `Galeri foto ${title}`}
      className="fixed inset-0 z-[99999] flex flex-col bg-zinc-950"
      onClick={onClose}
    >
      {/* Top bar: counter + close */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-semibold tabular-nums" aria-live="polite">
          {index + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={isEn ? "Close gallery" : "Tutup galeri"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-orange-600 transition-colors"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Slide */}
      <div
        className="relative flex-1 min-h-0 mx-4 sm:mx-20"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {photo.pending ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-white/20 bg-white/5 text-center text-white/70">
            <ImageOff className="h-12 w-12 text-white/30" aria-hidden="true" />
            <p className="text-sm">{isEn ? "Photo coming soon" : "Foto menyusul"}</p>
          </div>
        ) : (
          <Image key={photo.url} src={photo.url} alt={caption} fill sizes="100vw" className="object-contain animate-[lightbox-in_0.25s_ease-out]" />
        )}
        {isDummyMedia && !photo.pending && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white">
            {isEn ? "Illustration" : "Foto ilustrasi"}
          </span>
        )}
        {count > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} aria-label={isEn ? "Previous photo" : "Foto sebelumnya"} className={`${navButton} -left-2 sm:-left-16`}>
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label={isEn ? "Next photo" : "Foto berikutnya"} className={`${navButton} -right-2 sm:-right-16`}>
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Caption + dots */}
      <div className="px-4 py-5 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="mx-auto inline-block max-w-2xl rounded-lg bg-white/10 border border-white/15 px-4 py-2 text-sm font-medium text-white">{caption}</p>
        {count > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {photos.map((p, i) => (
              <button
                key={p.url + i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${isEn ? "Photo" : "Foto"} ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-orange-500" : "w-2 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
