"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Clock, Headset, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { dancingScript } from "@/lib/fonts";
import { WHATSAPP_PATH } from "@/components/SocialPills";
import { toWaNumber } from "@/lib/phone";

/**
 * The catalog's contact person, shown in the corner popup. `whatsapp` is shown as written on the WhatsApp button
 * and linked as wa.me/62… (the popup's only contact option). Without a `name` the popup names the agency itself.
 * `role` is the line under the name (the contact person's position); `hours` (e.g. { id: "Senin–Jumat,
 * 08.00–16.00 WIB", en: "Monday–Friday, 08:00–16:00 WIB" }) is an optional line.
 */
type Bilingual = { id: string; en: string };
const CONTACT_PERSON: { name: string; role: Bilingual | null; whatsapp: string; hours: Bilingual | null } = {
  name: "Adityo Wibisono",
  role: { id: "Ketua Subkelompok Promosi Seni dan Budaya", en: "Head of the Arts and Culture Promotion Subgroup" },
  whatsapp: "+62 812-8645-8884",
  hours: null,
};

// Admin screens have their own bottom action bars and toasts; sign-in pages don't need it
const HIDDEN_ON = /^\/(admin|login|register)(\/|$)/;

/**
 * Floating "contact person" button (icon-only circle) in the bottom-right corner of the public pages. It opens a small
 * popup with the contact person and a direct WhatsApp link (CLAUDE.md: no internal chat). Esc, the close button or a
 * click outside closes it; focus moves into the popup and back to the button.
 */
export default function ContactWidget() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isEn = language === "en";
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  if (pathname && HIDDEN_ON.test(pathname)) return null;

  const waNumber = toWaNumber(CONTACT_PERSON.whatsapp);
  const hasPerson = !!CONTACT_PERSON.name;
  const waLink = waNumber ? `https://wa.me/${waNumber}` : null;

  return (
    <div ref={rootRef} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] flex flex-col items-end gap-3">
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-zinc-900/15 ring-1 ring-zinc-200/80 origin-bottom-right animate-[fade-in_0.2s_ease-out] motion-reduce:animate-none"
        >
          {/* Header: warm orange gradient with the script title */}
          <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-5 pt-5 pb-6 text-white">
            <button
              ref={closeRef}
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label={isEn ? "Close" : "Tutup"}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <h2 id={titleId} className={`text-3xl leading-tight ${dancingScript.className}`}>
              {isEn ? "Need help?" : "Butuh bantuan?"}
            </h2>
            <p className="mt-1 pr-8 text-xs leading-relaxed text-orange-50">
              {isEn
                ? "Questions about the catalog, registering a sanggar or music artist, or partnerships? Get in touch."
                : "Pertanyaan seputar katalog, pendaftaran sanggar atau seniman musik, maupun kerja sama? Hubungi kami."}
            </p>
          </div>

          <div className="space-y-4 p-5">
            {/* Contact person: small tracked label + name (sans, like the label) + position, left-aligned text only */}
            <div className="min-w-0 text-left">
              {/* full amber-700: at /90 this 10px label drops to 4.25:1, under WCAG AA 4.5:1 */}
              <p className="text-[10px] font-bold tracking-[0.2em] text-amber-700 uppercase font-sans">Contact person</p>
              <p className="mt-1 font-sans font-bold text-gray-900 text-lg sm:text-xl leading-tight tracking-tight break-words">
                {hasPerson ? CONTACT_PERSON.name : isEn ? "Jakarta Culture Agency" : "Dinas Kebudayaan DKI Jakarta"}
              </p>
              {hasPerson && CONTACT_PERSON.role && (
                <p className="mt-1 text-xs font-medium leading-snug text-gray-500">{isEn ? CONTACT_PERSON.role.en : CONTACT_PERSON.role.id}</p>
              )}
            </div>

            {CONTACT_PERSON.hours && (
              <p className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                <Clock className="h-3.5 w-3.5 shrink-0 text-orange-600" aria-hidden="true" />
                {isEn ? CONTACT_PERSON.hours.en : CONTACT_PERSON.hours.id}
              </p>
            )}

            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${CONTACT_PERSON.whatsapp}${isEn ? " (opens in a new tab)" : " (buka di tab baru)"}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium transition-all shadow-2xs"
              >
                <svg className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={WHATSAPP_PATH} />
                </svg>
                <span className="tabular-nums">{CONTACT_PERSON.whatsapp}</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Corner button: icon only (the aria-label names it) — headset when closed, X when open */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? (isEn ? "Close contact person" : "Tutup contact person") : "Contact person"}
        className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Headset className="h-6 w-6" aria-hidden="true" />}
      </button>
    </div>
  );
}
