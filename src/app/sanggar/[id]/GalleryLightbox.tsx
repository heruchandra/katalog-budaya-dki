"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Maximize2, X } from "lucide-react";
import FallbackImage from "@/components/FallbackImage";

export interface GalleryPhoto {
  type: string;
  url: string;
  typeEn?: string;
  /** Shown while `url` hasn't been uploaded yet (e.g. a galeri-N.webp not yet in the sanggar's galeri/ folder) */
  fallbackUrl?: string;
}

/** "Photo coming soon" tile for a gallery photo that can't be loaded (fills its positioned parent) */
export function GalleryPlaceholder({ isEn, dark = false }: { isEn: boolean; dark?: boolean }) {
  return (
    <span className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 ${dark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"}`}>
      <ImageOff className="w-7 h-7" aria-hidden="true" />
      <span className="text-xs font-medium">{isEn ? "Photo coming soon" : "Foto menyusul"}</span>
    </span>
  );
}

/**
 * The focused viewer's photo at its natural proportions (plain <img>), trying `fallbackUrl` and then a
 * placeholder when the file can't be loaded. Keyed by the photo index, so the attempt resets per photo.
 */
function ViewerPhoto({ photo, label, isEn }: { photo: GalleryPhoto; label: string; isEn: boolean }) {
  const sources = [photo.url, photo.fallbackUrl].filter((s): s is string => !!s);
  const [attempt, setAttempt] = useState(0);
  const src = sources[attempt];
  if (!src) {
    return (
      <div className="relative w-full max-w-2xl aspect-[4/3] min-h-0 max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <GalleryPlaceholder isEn={isEn} dark />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt={label}
      onError={() => setAttempt((a) => a + 1)}
      onClick={(e) => e.stopPropagation()}
      // any orientation (landscape, 4:5 portrait, square) fits whole: capped at the stage and 80vh, never cropped
      className="min-h-0 max-w-full max-h-[min(100%,80vh)] object-contain rounded-none shadow-2xl select-none animate-[lightbox-in_0.25s_ease-out]"
    />
  );
}

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  /** Index of the photo open in the focused viewer, or null for the grid */
  activeIndex: number | null;
  getLabel: (photo: GalleryPhoto) => string;
  /** Sanggar name, used in the photos' alt text (the cards carry no visible caption) */
  entityName: string;
  onSelect: (index: number) => void;
  onBackToGrid: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isEn: boolean;
}

/**
 * "Lihat Semua Foto" grid modal + focused single-photo viewer. Loaded with next/dynamic only when the
 * gallery is opened, so it isn't part of the detail page's initial JavaScript. Keyboard handling
 * (arrows / Escape) stays in the parent, which owns the state.
 */
export default function GalleryLightbox({
  photos,
  activeIndex,
  getLabel,
  entityName,
  onSelect,
  onBackToGrid,
  onClose,
  onPrev,
  onNext,
  isEn,
}: GalleryLightboxProps) {
  const photo = activeIndex !== null ? photos[activeIndex] : undefined;
  const photoLabel = photo ? getLabel(photo) : "";

  return (
    <>
      {/* Lightbox Gallery Modal (grid of all photos) */}
      <div
        className="fixed inset-0 bg-black/85 z-[99999] backdrop-blur-sm p-3 sm:p-6 lg:p-8 flex items-center justify-center"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={isEn ? "Studio photo gallery" : "Galeri foto sanggar"}
      >
        {/* Panel is the scroll container, so the sticky header always sits above the first row */}
        <div
          className="relative w-full max-w-7xl max-h-[82vh] sm:max-h-[88vh] overflow-y-auto custom-scrollbar bg-zinc-950/95 border border-zinc-800 rounded-none shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header & Close Button */}
          <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md pt-5 pb-4 px-6 sm:px-10 border-b border-zinc-800 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">
                {isEn ? "Studio Documentation & Activities" : "Dokumentasi & Aktivitas Sanggar"}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                {photos.length} {isEn ? "verified gallery photos" : "foto dokumentasi terverifikasi"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-2 rounded-none bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={isEn ? "Close gallery" : "Tutup galeri"}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Grid of rounded photo-only thumbnails (captions show in the focused viewer) */}
          <div className="pt-6 pb-8 px-6 sm:px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((img, idx) => {
              const label = getLabel(img);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onSelect(idx)}
                  aria-label={isEn ? `View photo: ${label}` : `Lihat foto: ${label}`}
                  className="group block w-full rounded-xl overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  <div className="relative aspect-[4/3] bg-zinc-800">
                    <FallbackImage
                      key={img.url}
                      src={img.url}
                      fallbackSrc={img.fallbackUrl}
                      alt={`${entityName} – ${label}`}
                      sizes="(min-width: 1024px) 300px, (min-width: 768px) 30vw, 45vw"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      placeholder={<GalleryPlaceholder isEn={isEn} dark />}
                    />
                    {/* Light dim on hover (no heavy full-card overlay) */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 group-focus-visible:bg-black/20 transition-colors duration-300 pointer-events-none" />
                    {/* Expand badge in the top-right corner, clear of the photo's subject */}
                    <div className="absolute top-3 right-3 z-10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-200 ease-out pointer-events-none">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 group-hover:bg-orange-600 text-white backdrop-blur-md border border-white/20 shadow-md transition-colors">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Focused Single Photo Viewer (sits above the grid modal) */}
      {photo && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100000] bg-black/95 flex flex-col"
          onClick={onBackToGrid}
          role="dialog"
          aria-modal="true"
          aria-label={photoLabel}
        >
          {/* Viewer top bar */}
          <div
            className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-8 pt-4 pb-3"
            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onBackToGrid}
              className="px-3.5 py-1.5 rounded-none bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition-colors"
            >
              {isEn ? "← Back to Grid" : "← Kembali ke Grid"}
            </button>
            <span className="text-xs sm:text-sm text-zinc-300 font-medium" aria-live="polite">
              {isEn ? `Photo ${activeIndex + 1} of ${photos.length}` : `Foto ${activeIndex + 1} dari ${photos.length}`}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-none bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={isEn ? "Close gallery" : "Tutup galeri"}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Image stage with Prev / Next */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-14 sm:px-24">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2.5 sm:p-3 rounded-none bg-white/10 hover:bg-brand text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110 active:scale-95"
              aria-label={isEn ? "Previous photo" : "Foto sebelumnya"}
            >
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>

            {/* Image + caption move together as one centred block. The image may shrink (min-h-0) so the
                caption always fits below it inside the stage. A plain <img> is used on purpose: the viewer
                shows the photo at its natural proportions, which drive the caption position. A photo that isn't uploaded yet shows its fallback, else a placeholder. */}
            <div className="flex h-full w-full min-h-0 flex-col items-center justify-center">
              <ViewerPhoto key={activeIndex} photo={photo} label={photoLabel} isEn={isEn} />
              <div
                className="mt-3 shrink-0 px-4 py-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 rounded-xl max-w-[85%] sm:max-w-md mx-auto text-center shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs sm:text-sm font-semibold text-zinc-100 tracking-wide line-clamp-2">{photoLabel}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2.5 sm:p-3 rounded-none bg-white/10 hover:bg-brand text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110 active:scale-95"
              aria-label={isEn ? "Next photo" : "Foto selanjutnya"}
            >
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>
          </div>

          {/* Bottom area: keyboard hint on desktop; on phones just safe-area spacing (the caption sits under the image) */}
          <div
            className="shrink-0 px-4 sm:px-8 pt-3 pb-5 text-center"
            style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] text-zinc-500 hidden sm:block">
              {isEn ? "Use ← → keys to navigate, Esc to go back" : "Gunakan tombol ← → untuk navigasi, Esc untuk kembali"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
