"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Camera, Check, ChevronDown, ImagePlus, Loader2, LogOut, Pencil, Trash2, UserRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MAX_PROFILE_NAME } from "@/lib/profileActions";

const SHORT_NAME = 15;

/** Round avatar: the photo, else the name's initial */
function Avatar({ url, name, size }: { url: string | null; name: string; size: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "h-12 w-12 text-base" : size === "md" ? "h-9 w-9 text-sm" : "h-7 w-7 text-xs";
  const [failed, setFailed] = useState<string | null>(null);
  const showPhoto = !!url && failed !== url;
  return (
    <span className={`${box} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-100 to-amber-100 font-bold text-orange-700 ring-1 ring-orange-200`}>
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" referrerPolicy="no-referrer" onError={() => setFailed(url)} className="h-full w-full object-cover" />
      ) : name ? (
        name.charAt(0).toUpperCase()
      ) : (
        <UserRound className="h-1/2 w-1/2" aria-hidden="true" />
      )}
    </span>
  );
}

type Mode = "menu" | "name" | "avatar";

/**
 * Signed-in user menu: avatar + (shortened) name as the trigger; the panel shows the profile with its role, and lets
 * the user change the display name (max 25 characters, with a counter) and the profile photo (upload or image URL),
 * or sign out. Saving goes through the callbacks, so the caller decides where the profile is stored. Closes on an
 * outside click, Escape and route changes.
 */
export default function ProfileDropdown({
  name,
  email,
  avatarUrl,
  role,
  variant = "solid",
  onSaveName,
  onSaveAvatar,
  onLogout,
}: {
  name: string;
  email?: string | null;
  avatarUrl: string | null;
  role: "admin" | "user";
  /** "transparent": white trigger text for the navbar over a hero image */
  variant?: "solid" | "transparent";
  onSaveName: (name: string) => Promise<void>;
  onSaveAvatar: (avatar: { file: File } | { url: string | null }) => Promise<void>;
  onLogout: () => void;
}) {
  const { language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("menu");
  const [draftName, setDraftName] = useState(name);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [avatarInput, setAvatarInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const reset = () => {
    setMode("menu");
    setError(null);
    setAvatarFile(null);
    setFilePreview(null);
    setAvatarInput("");
  };
  const close = (restoreFocus = false) => {
    setOpen(false);
    reset();
    if (restoreFocus) triggerRef.current?.focus();
  };

  // Route change: close (adjusted while rendering, React's alternative to setting state in an effect)
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
    reset();
  }

  // Outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        reset();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        reset();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Free the local preview of a picked photo
  useEffect(() => () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
  }, [filePreview]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  const run = async (action: () => Promise<void>, done: string) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      reset();
      setNotice(done);
    } catch (err) {
      setError(err instanceof Error ? err.message : tr("Gagal menyimpan.", "Could not save."));
    } finally {
      setBusy(false);
    }
  };

  const shortName = name.length > SHORT_NAME ? `${name.slice(0, SHORT_NAME).trimEnd()}…` : name;
  const nameLength = draftName.trim().length;
  const typedUrl = avatarInput.trim();
  const urlInvalid = !!typedUrl && !/^https:\/\/\S+$/i.test(typedUrl);
  const previewUrl = filePreview ?? (typedUrl && !urlInvalid ? typedUrl : avatarUrl);
  // colours are kept out of the base: two text-* classes on one element resolve by stylesheet order, not class order
  const itemBase = "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors";
  const item = `${itemBase} text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900`;
  const smallButton = "inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50";

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : (setOpen(true), setDraftName(name)))}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={tr(`Menu profil ${name}`, `Profile menu for ${name}`)}
        title={name}
        className={`flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-2 transition-colors ${
          variant === "transparent" ? "text-white hover:bg-white/10" : "text-zinc-800 hover:bg-zinc-100"
        }`}
      >
        <Avatar url={avatarUrl} name={name} size="sm" />
        <span className="hidden max-w-[120px] truncate text-xs font-medium xl:block">{shortName}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {notice && !open && (
        <span role="status" className="absolute right-0 top-full mt-2 whitespace-nowrap rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
          {notice}
        </span>
      )}

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={tr("Profil", "Profile")}
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl bg-white text-zinc-800 shadow-2xl shadow-zinc-900/15 ring-1 ring-zinc-200 animate-[fade-in_0.15s_ease-out] motion-reduce:animate-none"
        >
          {/* Profile header */}
          <div className="flex items-center gap-3 border-b border-zinc-100 bg-gradient-to-br from-orange-50/80 to-white p-4">
            <Avatar url={mode === "avatar" ? previewUrl : avatarUrl} name={name} size="lg" />
            <div className="min-w-0">
              <p className="break-words text-sm font-bold leading-snug text-zinc-900">{name}</p>
              {email && <p className="truncate text-xs text-zinc-500">{email}</p>}
              <span className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                role === "admin" ? "bg-orange-100 text-orange-700" : "bg-zinc-100 text-zinc-600"
              }`}>
                {role === "admin" ? "Admin" : tr("Pengguna", "User")}
              </span>
            </div>
          </div>

          <div className="p-2">
            {notice && <p role="status" className="mx-1 mb-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">{notice}</p>}
            {error && <p role="alert" className="mx-1 mb-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

            {mode === "menu" && (
              <>
                <button type="button" className={item} onClick={() => { setDraftName(name); setMode("name"); setError(null); }}>
                  <Pencil className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                  {tr("Ubah Nama", "Change Name")}
                </button>
                <button type="button" className={item} onClick={() => { setMode("avatar"); setError(null); }}>
                  <Camera className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                  {tr("Ubah Foto Profil", "Change Profile Photo")}
                </button>
                <div className="my-1.5 border-t border-zinc-100" />
                <button type="button" onClick={() => { close(); onLogout(); }} className={`${itemBase} text-red-600 hover:bg-red-50 hover:text-red-700`}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {tr("Keluar", "Sign Out")}
                </button>
              </>
            )}

            {mode === "name" && (
              <form
                className="space-y-2 p-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!nameLength) return setError(tr("Nama tidak boleh kosong.", "The name can't be empty."));
                  run(() => onSaveName(draftName.trim()), tr("Nama diperbarui", "Name updated"));
                }}
              >
                <label className="block">
                  <span className="mb-1 flex items-center justify-between text-xs font-semibold text-zinc-600">
                    {tr("Nama tampilan", "Display name")}
                    <span aria-live="polite" className={`tabular-nums ${draftName.length >= MAX_PROFILE_NAME ? "text-orange-600" : "text-zinc-400"}`}>
                      {draftName.length}/{MAX_PROFILE_NAME}
                    </span>
                  </span>
                  <input
                    type="text"
                    value={draftName}
                    maxLength={MAX_PROFILE_NAME}
                    autoFocus
                    onChange={(e) => setDraftName(e.target.value.slice(0, MAX_PROFILE_NAME))}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </label>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={reset} className={`${smallButton} text-zinc-600 hover:bg-zinc-100`}>{tr("Batal", "Cancel")}</button>
                  <button type="submit" disabled={busy || !nameLength || draftName.trim() === name} className={`${smallButton} bg-orange-600 text-white hover:bg-orange-700`}>
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    {tr("Simpan", "Save")}
                  </button>
                </div>
              </form>
            )}

            {mode === "avatar" && (
              <form
                className="space-y-2.5 p-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (avatarFile) return run(() => onSaveAvatar({ file: avatarFile }), tr("Foto profil diperbarui", "Photo updated"));
                  if (typedUrl && !urlInvalid) return run(() => onSaveAvatar({ url: typedUrl }), tr("Foto profil diperbarui", "Photo updated"));
                }}
              >
                <button type="button" onClick={() => fileRef.current?.click()} className={`${smallButton} w-full border border-dashed border-zinc-300 py-3 text-zinc-700 hover:border-orange-400 hover:text-orange-700`}>
                  <ImagePlus className="h-4 w-4" aria-hidden="true" />
                  {avatarFile ? avatarFile.name : tr("Unggah foto (maks. 5 MB)", "Upload a photo (max 5 MB)")}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    setAvatarFile(file);
                    setFilePreview(URL.createObjectURL(file));
                    setAvatarInput("");
                    setError(null);
                  }}
                />
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-zinc-600">{tr("atau tempel URL gambar", "or paste an image URL")}</span>
                  <input
                    type="url"
                    inputMode="url"
                    value={avatarInput}
                    onChange={(e) => { setAvatarInput(e.target.value); setAvatarFile(null); setFilePreview(null); }}
                    placeholder="https://…"
                    aria-invalid={urlInvalid}
                    className={`w-full rounded-xl border px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-1 ${urlInvalid ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-zinc-200 focus:border-orange-500 focus:ring-orange-500"}`}
                  />
                  {urlInvalid && <span className="mt-1 block text-[11px] text-red-600">{tr("URL harus diawali https://", "The URL must start with https://")}</span>}
                </label>
                <div className="flex items-center justify-between gap-2">
                  {avatarUrl ? (
                    <button type="button" disabled={busy} onClick={() => run(() => onSaveAvatar({ url: null }), tr("Foto profil dihapus", "Photo removed"))} className={`${smallButton} text-red-600 hover:bg-red-50`}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> {tr("Hapus foto", "Remove")}
                    </button>
                  ) : <span />}
                  <div className="flex gap-2">
                    <button type="button" onClick={reset} className={`${smallButton} text-zinc-600 hover:bg-zinc-100`}>{tr("Batal", "Cancel")}</button>
                    <button type="submit" disabled={busy || (!avatarFile && (!typedUrl || urlInvalid))} className={`${smallButton} bg-orange-600 text-white hover:bg-orange-700`}>
                      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      {tr("Simpan", "Save")}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
