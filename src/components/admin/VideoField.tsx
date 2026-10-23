"use client";

import { useMemo, useRef, useState } from "react";
import { Film, Link2, RefreshCw, UploadCloud } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/admin/FormParts";
import { VIDEO_UPLOAD_MAX_MB, VIDEO_UPLOAD_TYPES, isVideoFile, youTubeId, type VideoValue } from "@/lib/video";

/** A video already in the media bucket or on the site, as opposed to a link to somewhere else */
const isStored = (url: string) => url.startsWith("/") || url.includes("/storage/v1/object/public/");
const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

/**
 * "Video Penampilan" for the sanggar and seniman musik forms, in two modes: upload a .mp4 / .webm file (dropped or
 * chosen; uploaded to the media bucket when the form is saved, like the images) or paste a YouTube / video link.
 * Once there is a video it shows a player (or the YouTube embed) with a "Hapus / Ganti Video" button.
 */
export default function VideoField({
  value,
  onChange,
  isEn,
  disabled,
  tag,
  notice,
  invalid,
}: {
  value: VideoValue;
  onChange: (value: VideoValue) => void;
  isEn: boolean;
  disabled?: boolean;
  /** Tag next to the label (e.g. "needs DB migration") */
  tag?: string;
  /** Notice shown under the label */
  notice?: React.ReactNode;
  /** The form refused the link on save */
  invalid?: boolean;
}) {
  const tr = (idText: string, enText: string) => (isEn ? enText : idText);
  const [mode, setMode] = useState<"upload" | "link">(() => (value.url && !isStored(value.url) ? "link" : "upload"));
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // local preview of a picked file (kept until the page is left, like the image fields' previews)
  const fileUrl = useMemo(() => (value.file ? URL.createObjectURL(value.file) : null), [value.file]);

  const url = value.url.trim();
  const ytId = youTubeId(url);
  const linkOk = !!url && (!!ytId || isVideoFile(url));

  const pick = (file?: File | null) => {
    if (!file) return;
    if (!VIDEO_UPLOAD_TYPES.includes(file.type)) {
      setFileError(tr("Hanya file video .mp4 atau .webm.", "Only .mp4 or .webm video files."));
      return;
    }
    if (file.size > VIDEO_UPLOAD_MAX_MB * 1024 * 1024) {
      setFileError(tr(`Ukuran maksimal ${VIDEO_UPLOAD_MAX_MB} MB (file ini ${mb(file.size)} MB).`, `Up to ${VIDEO_UPLOAD_MAX_MB} MB (this file is ${mb(file.size)} MB).`));
      return;
    }
    setFileError(null);
    onChange({ url: "", file });
  };
  const clear = () => {
    setFileError(null);
    onChange({ url: "", file: null });
  };
  // the field holds one video: going to upload drops a pasted link (a stored video is shown, never dropped here)
  const switchTo = (next: "upload" | "link") => {
    if (next === "upload" && url && !isStored(url)) onChange({ url: "", file: null });
    setMode(next);
  };

  const preview = (src: { kind: "youtube"; id: string } | { kind: "file"; url: string }, badge: string) => (
    <div className="max-w-xl space-y-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-zinc-200 bg-black">
        {src.kind === "youtube" ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${src.id}`}
            title={tr("Pratinjau video YouTube", "YouTube video preview")}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <video src={src.url} controls preload="metadata" className="absolute inset-0 h-full w-full object-contain" />
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-sm bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
          <Film className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{badge}</span>
        </span>
        <button
          type="button"
          onClick={clear}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> {tr("Hapus / Ganti Video", "Remove / Replace Video")}
        </button>
      </div>
    </div>
  );

  // a picked file, or a stored video (uploaded earlier / on the site)
  const storedOrPicked = value.file || (mode === "upload" && url);

  return (
    <div>
      <FieldLabel tag={tag}>{tr("Video Penampilan", "Performance Video")}</FieldLabel>
      {notice}
      {storedOrPicked ? (
        value.file && fileUrl
          ? preview({ kind: "file", url: fileUrl }, tr(`Video baru: ${value.file.name} (${mb(value.file.size)} MB) · diunggah saat Simpan`, `New video: ${value.file.name} (${mb(value.file.size)} MB) · uploaded on Save`))
          : ytId
            ? preview({ kind: "youtube", id: ytId }, tr("Video YouTube tersimpan", "Saved YouTube video"))
            : preview({ kind: "file", url }, tr(`Video tersimpan: ${decodeURIComponent(url.split("/").pop() || url)}`, `Saved video: ${decodeURIComponent(url.split("/").pop() || url)}`))
      ) : (
        <div className="space-y-3">
          {/* mode switch */}
          <div role="group" aria-label={tr("Cara menambah video", "How to add the video")} className="inline-flex rounded-sm border border-zinc-200 bg-zinc-50 p-0.5">
            {([
              ["upload", UploadCloud, tr("Unggah File", "Upload File")],
              ["link", Link2, tr("Tempel Link", "Paste Link")],
            ] as const).map(([key, Icon, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                disabled={disabled}
                onClick={() => switchTo(key)}
                className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                  mode === key ? "bg-white text-orange-600 shadow-xs ring-1 ring-zinc-200" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
              </button>
            ))}
          </div>

          {mode === "upload" ? (
            <div className="max-w-xl">
              <button
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled) pick(e.dataTransfer.files?.[0]); }}
                className={`flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-sm border-2 border-dashed px-3 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  dragging ? "border-orange-500 bg-orange-50" : "border-zinc-300 bg-white hover:border-orange-400 hover:bg-orange-50/40"
                }`}
              >
                <UploadCloud className="h-7 w-7 text-zinc-400" aria-hidden="true" />
                <span className="text-sm font-medium text-zinc-700">{tr("Seret video ke sini atau klik untuk memilih", "Drop a video here or click to choose")}</span>
                <span className="text-[11px] text-zinc-400">MP4 / WebM · max {VIDEO_UPLOAD_MAX_MB} MB</span>
              </button>
              <input
                ref={inputRef}
                type="file"
                accept={VIDEO_UPLOAD_TYPES.join(",")}
                className="hidden"
                onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }}
              />
              {fileError && <span role="alert" className="mt-1 block text-xs text-red-600">{fileError}</span>}
            </div>
          ) : (
            <div className="max-w-xl space-y-3">
              <input
                type="url"
                value={value.url}
                onChange={(e) => onChange({ url: e.target.value, file: null })}
                disabled={disabled}
                aria-label={tr("Link video", "Video link")}
                aria-invalid={invalid || (!!url && !linkOk)}
                className={`${inputClass} ${invalid || (url && !linkOk) ? "border-red-400 focus:border-red-500 focus:ring-red-500" : ""}`}
                placeholder="https://youtu.be/… · https://…/video.mp4"
              />
              {!url && <span className="block text-xs text-zinc-500">{tr("Link YouTube, atau link langsung ke file video (.mp4 / .webm).", "A YouTube link, or a direct link to a video file (.mp4 / .webm).")}</span>}
              {url && !linkOk && <span className="block text-xs text-red-600">{tr("Bukan link YouTube atau file video (.mp4 / .webm).", "Not a YouTube link or a video file (.mp4 / .webm).")}</span>}
              {linkOk && (ytId ? preview({ kind: "youtube", id: ytId }, tr("Link YouTube", "YouTube link")) : preview({ kind: "file", url }, tr("Link file video", "Video file link")))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
