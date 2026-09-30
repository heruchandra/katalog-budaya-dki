"use client";

import { useRef, useState } from "react";
import { RefreshCw, Trash2, UploadCloud } from "lucide-react";
import ImageCropModal from "@/components/admin/ImageCropModal";
import { useLanguage } from "@/context/LanguageContext";
import type { ImageValue } from "@/lib/sanggarAdmin";

interface ImageFieldProps {
  label: string;
  hint?: string;
  value: ImageValue;
  /** Default crop ratio (width / height) */
  aspect: number;
  /** Fix the ratio instead of offering the 1:1 / 4:3 / 16:9 presets */
  lockAspect?: boolean;
  /** Tailwind aspect class for the preview box, e.g. "aspect-square" */
  previewClass?: string;
  onChange: (value: ImageValue) => void;
}

const MAX_BYTES = 10 * 1024 * 1024;

/** Single image input: click or drag-and-drop, then crop before it is accepted. Upload happens on form save. */
export default function ImageField({ label, hint, value, aspect, lockAspect, previewClass = "aspect-video", onChange }: ImageFieldProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(isEn ? "Only image files are supported." : "Hanya berkas gambar yang didukung.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(isEn ? "Image is larger than 10 MB." : "Ukuran gambar melebihi 10 MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setCropSrc(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-zinc-800">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>}

      <div className="mt-2">
        {value.url ? (
          <div className={`group relative w-full ${previewClass} overflow-hidden rounded-sm border border-zinc-200 bg-zinc-100`}>
            <img src={value.url} alt={label} className="w-full h-full object-cover" />
            {value.blob && (
              <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-zinc-900 rounded-sm">
                {isEn ? "Not saved yet" : "Belum disimpan"}
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
              <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-zinc-900 rounded-sm hover:bg-zinc-100">
                <RefreshCw className="w-3.5 h-3.5" /> {isEn ? "Replace" : "Ganti"}
              </button>
              <button type="button" onClick={() => onChange({ url: null, blob: null })} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-sm hover:bg-red-700">
                <Trash2 className="w-3.5 h-3.5" /> {isEn ? "Remove" : "Hapus"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); pick(e.dataTransfer.files?.[0]); }}
            className={`w-full ${previewClass} flex flex-col items-center justify-center gap-1.5 rounded-sm border-2 border-dashed px-3 text-center transition-colors ${
              isDragging ? "border-orange-500 bg-orange-50" : "border-zinc-300 bg-zinc-50 hover:border-orange-400 hover:bg-orange-50/50"
            }`}
          >
            <UploadCloud className={`w-6 h-6 ${isDragging ? "text-orange-600" : "text-zinc-400"}`} aria-hidden="true" />
            <span className="text-xs font-semibold text-zinc-700">
              {isEn ? "Drop an image here or click to choose" : "Seret gambar ke sini atau klik untuk memilih"}
            </span>
            <span className="text-[11px] text-zinc-400">JPG / PNG / WebP · max 10 MB</span>
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }}
      />

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          title={label}
          initialAspect={aspect}
          lockAspect={lockAspect}
          onCancel={() => setCropSrc(null)}
          onConfirm={(blob) => {
            onChange({ url: URL.createObjectURL(blob), blob });
            setCropSrc(null);
          }}
        />
      )}
    </div>
  );
}
