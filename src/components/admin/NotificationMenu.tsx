"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BellOff, ChevronRight, Music, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** An entry saved as a draft, i.e. waiting for verification */
export interface PendingItem {
  key: string;
  type: "sanggar" | "musik";
  name: string;
  date?: string | null;
  /** Its edit page in the admin */
  href: string;
}

const MAX_ITEMS = 6;

/**
 * Admin header bell: a popover listing the sanggar and seniman musik drafts waiting for verification (newest first),
 * each linking to its edit page. `items` is null while loading or when the drafts can't be read. Closes on an outside
 * click, Escape (focus returns to the bell) or a route change, like the profile menu.
 */
export default function NotificationMenu({ items }: { items: PendingItem[] | null }) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const tr = (idText: string, enText: string) => (isEn ? enText : idText);
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

  const list = items ?? [];
  const count = list.length;
  const sanggarCount = list.filter((i) => i.type === "sanggar").length;
  // the list holding the drafts (sanggar first; seniman musik when only those wait)
  const allHref = sanggarCount === 0 && count > 0 ? "/admin/pemusik?status=draft" : "/admin/sanggar?status=draft";
  const formatDate = (iso?: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString(isEn ? "en-GB" : "id-ID", { day: "numeric", month: "short", year: "numeric" });
  };
  const summary = count
    ? tr(`${count} pengajuan menunggu verifikasi`, `${count} submissions awaiting verification`)
    : tr("Tidak ada notifikasi baru", "No new notifications");

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={`${tr("Notifikasi", "Notifications")}: ${summary}`}
        title={summary}
        className={`relative flex h-9 w-9 items-center justify-center rounded-sm transition-colors ${
          open ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        {count > 0 && (
          <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E01A67] px-1 text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={tr("Notifikasi", "Notifications")}
          // phones: full width under the header; from sm: anchored under the bell
          className="fixed inset-x-3 top-16 z-50 overflow-hidden rounded-2xl bg-white text-zinc-800 shadow-2xl shadow-zinc-900/15 ring-1 ring-zinc-200 animate-[fade-in_0.15s_ease-out] motion-reduce:animate-none sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80"
        >
          <div className="flex items-center justify-between gap-3 border-b border-zinc-100 bg-gradient-to-br from-orange-50/80 to-white px-4 py-3">
            <p className="text-sm font-bold text-zinc-900">{tr("Notifikasi", "Notifications")}</p>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${count ? "bg-[#E01A67]/10 text-[#B3124F]" : "bg-zinc-100 text-zinc-500"}`}>
              {count} {tr("menunggu verifikasi", "awaiting verification")}
            </span>
          </div>

          {items === null ? (
            <p className="px-4 py-6 text-center text-xs text-zinc-500">{tr("Memuat notifikasi…", "Loading notifications…")}</p>
          ) : count === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                <BellOff className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium text-zinc-600">{tr("Tidak ada notifikasi baru", "No new notifications")}</p>
              <p className="text-xs text-zinc-400">{tr("Semua data sudah terverifikasi.", "Everything has been verified.")}</p>
            </div>
          ) : (
            <ul className="max-h-80 divide-y divide-zinc-100 overflow-y-auto">
              {list.slice(0, MAX_ITEMS).map((item) => {
                const Icon = item.type === "sanggar" ? Users : Music;
                const date = formatDate(item.date);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-orange-50/60 focus-visible:bg-orange-50/60 focus-visible:outline-none"
                    >
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.type === "sanggar" ? "bg-[#F7941E]/15 text-[#C2410C]" : "bg-[#E01A67]/10 text-[#B3124F]"}`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-snug text-zinc-700">
                          {/* type first, unless the name already starts with it ("Sanggar Tari …") */}
                          {item.type === "sanggar"
                            ? /^sanggar\s/i.test(item.name) ? "" : "Sanggar "
                            : tr("Seniman musik ", "Music artist ")}
                          <span className="font-semibold text-zinc-900">{item.name}</span>
                          {tr(" menunggu verifikasi", " is awaiting verification")}
                        </span>
                        {date && <span className="mt-0.5 block text-[11px] text-zinc-400">{tr(`Disimpan ${date}`, `Saved ${date}`)}</span>}
                      </span>
                      <ChevronRight className="mt-1.5 h-4 w-4 shrink-0 text-zinc-300 group-hover:text-orange-500" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
              {count > MAX_ITEMS && (
                <li className="px-4 py-2 text-center text-[11px] text-zinc-400">
                  {tr(`+${count - MAX_ITEMS} pengajuan lainnya`, `+${count - MAX_ITEMS} more submissions`)}
                </li>
              )}
            </ul>
          )}

          <Link
            href={allHref}
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 border-t border-zinc-100 px-4 py-2.5 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-50/60"
          >
            {tr("Lihat Semua Pengajuan", "View All Submissions")}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
