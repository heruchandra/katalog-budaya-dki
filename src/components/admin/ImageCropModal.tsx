"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Check, X, ZoomIn } from "lucide-react";
import { cropAndResize } from "@/lib/cropImage";
import { useLanguage } from "@/context/LanguageContext";

export const ASPECT_PRESETS = [
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:4", value: 3 / 4 },
] as const;

interface ImageCropModalProps {
  /** Data/object URL of the picked image */
  imageSrc: string;
  title: string;
  /** Aspect ratio selected when the modal opens */
  initialAspect: number;
  /** When true the ratio is fixed (e.g. the 3:4 catalog card) and the preset buttons are hidden */
  lockAspect?: boolean;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

/** Interactive crop + zoom with aspect presets. Returns a downscaled JPEG blob. */
export default function ImageCropModal({ imageSrc, title, initialAspect, lockAspect, onCancel, onConfirm }: ImageCropModalProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(initialAspect);
  const [area, setArea] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);

  const confirm = async () => {
    if (!area) return;
    setIsSaving(true);
    setError(null);
    try {
      const blob = await cropAndResize(imageSrc, area);
      if (!blob) throw new Error("empty");
      onConfirm(blob);
    } catch {
      setError(isEn ? "Could not crop this image. Try another file." : "Gagal memotong gambar. Coba berkas lain.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="bg-white rounded-sm overflow-hidden w-full max-w-2xl flex flex-col shadow-2xl">
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900">{isEn ? "Adjust image" : "Sesuaikan gambar"} · {title}</h3>
          <button type="button" onClick={onCancel} className="p-1.5 rounded-sm text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors" aria-label={isEn ? "Cancel" : "Batal"}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative w-full h-[46vh] sm:h-[54vh] bg-[#18191C]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 border-t border-zinc-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {!lockAspect && (
              <div className="flex items-center gap-1.5" role="group" aria-label={isEn ? "Aspect ratio" : "Rasio gambar"}>
                {ASPECT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setAspect(preset.value)}
                    aria-pressed={Math.abs(aspect - preset.value) < 0.001}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-sm border transition-colors ${
                      Math.abs(aspect - preset.value) < 0.001
                        ? "bg-[#18191C] text-white border-[#18191C]"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
            <label className="flex flex-1 items-center gap-3 text-xs font-medium text-zinc-500">
              <ZoomIn className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 appearance-none cursor-pointer accent-orange-600"
              />
            </label>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2.5">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-sm hover:bg-zinc-50 transition-colors">
              {isEn ? "Cancel" : "Batal"}
            </button>
            <button
              type="button"
              onClick={confirm}
              disabled={!area || isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-brand hover:bg-brand-deep rounded-sm shadow-xs transition-all disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              {isEn ? "Use this crop" : "Gunakan potongan ini"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
