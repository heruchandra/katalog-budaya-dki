"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SHORT_NAME = 15;

/** Round avatar: the photo, else the name's initial */
function Avatar({ url, name, size }: { url: string | null; name: string; size: "sm" | "lg" }) {
  const box = size === "lg" ? "h-12 w-12 text-base" : "h-7 w-7 text-xs";
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

/**
 * Signed-in user menu: avatar + (shortened) name as the trigger; the panel shows the profile read-only, as it comes
 * from the sign-in session (name, email, photo, role), and the sign-out action. Closes on an outside click, Escape
 * and route changes.
 */
export default function ProfileDropdown({
  name,
  email,
  avatarUrl,
  role,
  variant = "solid",
  onLogout,
}: {
  name: string;
  email?: string | null;
  avatarUrl: string | null;
  role: "admin" | "user";
  /** "transparent": white trigger text for the navbar over a hero image */
  variant?: "solid" | "transparent";
  onLogout: () => void;
}) {
  const { language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // Route change: close (adjusted while rendering, React's alternative to setting state in an effect)
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // Outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
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

  const shortName = name.length > SHORT_NAME ? `${name.slice(0, SHORT_NAME).trimEnd()}…` : name;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
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

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={tr("Profil", "Profile")}
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl bg-white text-zinc-800 shadow-2xl shadow-zinc-900/15 ring-1 ring-zinc-200 animate-[fade-in_0.15s_ease-out] motion-reduce:animate-none"
        >
          {/* Profile card (read-only, from the sign-in session) */}
          <div className="flex items-center gap-3 border-b border-zinc-100 bg-gradient-to-br from-orange-50/80 to-white p-4">
            <Avatar url={avatarUrl} name={name} size="lg" />
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
            <button
              type="button"
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {tr("Keluar", "Sign Out")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
