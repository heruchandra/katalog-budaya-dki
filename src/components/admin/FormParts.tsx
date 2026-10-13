"use client";

import { useRef, useState } from "react";
import { ImagePlus, Info, Loader2, Trash2 } from "lucide-react";
import { resizeImageFile } from "@/lib/cropImage";
import { useLanguage } from "@/context/LanguageContext";
import type { GalleryFormItem } from "@/lib/sanggarAdmin";

// Building blocks shared by the admin Sanggar and Seniman Musik forms

export const inputClass =
  "w-full rounded-sm border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-orange-600 focus:ring-1 focus:ring-orange-600 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-sm border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 hover:border-orange-400 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export function FieldLabel({ children, required, tag }: { children: React.ReactNode; required?: boolean; tag?: string }) {
  return (
    <span className="mb-1.5 flex items-center text-sm font-semibold text-zinc-800">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
      {tag && (
        <span className="ml-2 inline-flex items-center rounded-sm bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
          {tag}
        </span>
      )}
    </span>
  );
}

export function SectionNotice({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-sm border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}

/**
 * Multi-photo gallery editor: add several photos at once (button or drag-and-drop; each is resized on the device
 * and uploaded when the form is saved), caption them, remove them.
 */
export function GalleryEditor({
  title,
  items,
  onChange,
  disabled = false,
  notice,
  max = 30,
}: {
  title: string;
  items: GalleryFormItem[];
  onChange: (items: GalleryFormItem[]) => void;
  disabled?: boolean;
  /** Shown under the header, e.g. the "needs the migration" notice */
  notice?: string;
  max?: number;
}) {
  const { language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);
  const [isBusy, setIsBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;
    setIsBusy(true);
    const room = max - items.length;
    const picked = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, Math.max(0, room));
    const added: GalleryFormItem[] = [];
    for (const file of picked) {
      try {
        const blob = await resizeImageFile(file);
        if (blob) added.push({ url: URL.createObjectURL(blob), blob, caption: "" });
      } catch {
        // skip files the browser cannot decode
      }
    }
    onChange([...items, ...added]);
    setIsBusy(false);
  };

  const dropProps = {
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      addFiles(e.dataTransfer.files);
    },
  };

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900">{title}</h2>
          <p className="text-xs text-zinc-500">
            {items.length}/{max} {tr("foto. Keterangan tampil di lightbox galeri.", "photos. Captions show in the gallery lightbox.")}
          </p>
        </div>
        <button type="button" disabled={disabled || isBusy || items.length >= max} onClick={() => inputRef.current?.click()} className={secondaryButtonClass}>
          {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {tr("Tambah Foto", "Add Photos")}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      </div>

      <div className="mt-3"><SectionNotice text={notice} /></div>

      {items.length === 0 ? (
        <div {...dropProps} className="mt-3 flex h-32 items-center justify-center rounded-sm border-2 border-dashed border-zinc-200 bg-zinc-50 px-4 text-center text-xs text-zinc-500">
          {tr("Belum ada foto. Seret beberapa foto ke sini atau klik “Tambah Foto”.", "No photos yet. Drop several photos here or click “Add Photos”.")}
        </div>
      ) : (
        <ul {...dropProps} className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((photo, i) => (
            <li key={photo.url ?? i} className="rounded-sm border border-zinc-200 bg-white p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-zinc-100">
                {photo.url && <img src={photo.url} alt={photo.caption || `Foto ${i + 1}`} className="h-full w-full object-cover" />}
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-sm bg-black/65 text-white hover:bg-red-600 transition-colors"
                  aria-label={tr(`Hapus foto ${i + 1}`, `Remove photo ${i + 1}`)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={photo.caption}
                onChange={(e) => onChange(items.map((g, j) => (j === i ? { ...g, caption: e.target.value } : g)))}
                placeholder={tr("Keterangan foto", "Photo caption")}
                aria-label={tr(`Keterangan foto ${i + 1}`, `Caption for photo ${i + 1}`)}
                className={`${inputClass} mt-2 px-2.5 py-1.5 text-xs`}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
