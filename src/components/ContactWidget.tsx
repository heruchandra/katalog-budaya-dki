"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Clock, X } from "lucide-react";
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
 * A contact person: a solid silhouette of a representative wearing headphones, matching the reference artwork chosen
 * for the button (traced from it onto a 24px grid, 20 units tall and centred). The head, the headphones (band and
 * ear cups) and the shoulders are separate shapes with clear space between them, as in the reference.
 */
function ContactPersonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {/* headphones: band and ear cups */}
      <path d="M11.33 2.02L13.05 2.07L14.07 2.3L14.81 2.58L15.7 3.05L16.58 3.7L17.33 4.44L17.88 5.19L18.35 6.02L18.72 7L18.91 7.79L19 8.58L19.42 9L19.7 9.42L19.98 10.21L19.98 10.58L20.02 10.63L19.98 11.19L19.74 11.88L19.42 12.4L18.81 12.95L18.4 13.19L17.98 13.33L17.19 13.37L16.86 13.19L16.63 12.81L16.63 8.58L16.67 8.44L16.91 8.16L17.33 8.02L17.37 7.93L16.95 6.67L16.49 5.88L16.16 5.47L15.56 4.86L14.63 4.21L13.51 3.74L12.53 3.56L11.47 3.56L11.42 3.6L10.86 3.65L10.07 3.88L9.47 4.16L8.44 4.86L7.84 5.47L7.14 6.49L6.81 7.23L6.63 7.98L7.09 8.16L7.28 8.35L7.42 8.77L7.42 12.63L7.37 12.86L7.23 13.09L6.81 13.33L5.84 13.37L5.19 13.14L4.91 12.95L4.58 12.63L4.21 11.98L4.07 11.51L4.02 10.81L3.98 10.77L4.02 10.21L4.3 9.42L4.63 8.95L5 8.58L5.09 7.79L5.28 7L5.65 6.02L6.12 5.19L6.67 4.44L7.42 3.7L8.3 3.05L9.65 2.4L10.26 2.21L10.95 2.07L11.28 2.07Z" />
      {/* head */}
      <path d="M11.47 5.74L12.81 5.79L13.65 6.07L14.26 6.44L14.86 7.05L15.19 7.56L15.42 8.12L15.6 9L15.6 10.02L15.42 11L15.09 11.88L14.67 12.63L14.4 13L13.6 13.74L13.14 14.02L12.4 14.26L11.6 14.26L10.86 14.02L10.21 13.6L9.6 13L9.23 12.49L8.77 11.56L8.49 10.63L8.44 10.07L8.4 10.02L8.4 9L8.44 8.95L8.49 8.44L8.77 7.65L9.14 7.05L9.74 6.44L10.26 6.12L10.81 5.88Z" />
      {/* shoulders */}
      <path d="M9.93 15.09L14.07 15.09L14.12 15.14L14.58 15.14L15.28 15.28L16.07 15.56L17.09 16.16L18.16 17.23L18.53 17.79L18.95 18.72L19.19 19.7L19.23 20.63L19.14 21L18.91 21.42L18.49 21.79L17.98 21.98L6.02 21.98L5.7 21.88L5.33 21.65L5.09 21.42L4.86 21L4.77 20.63L4.77 20.12L4.81 20.07L4.86 19.42L5.09 18.58L5.7 17.42L6.02 17L6.67 16.35L7.56 15.74L8.72 15.28L9.42 15.14L9.88 15.14Z" />
    </svg>
  );
}

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
              <p className="text-[10px] font-bold tracking-[0.2em] text-amber-700 uppercase font-sans">{isEn ? "Contact person" : "Narahubung"}</p>
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

      {/* Corner button: icon only (the aria-label names it) — a person with a headset when closed, X when open.
          While closed, hovering or keyboard focus shows a "Narahubung" label beside it. */}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={open ? (isEn ? "Close contact person" : "Tutup narahubung") : isEn ? "Contact person" : "Narahubung"}
          className="peer w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
        >
          {/* same size as the hero's music button (w-10 / sm:w-12); the icon fills half of it */}
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <ContactPersonIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
        </button>
        {!open && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow-md opacity-0 transition-all duration-200 peer-hover:translate-x-0 peer-hover:opacity-100 peer-focus-visible:translate-x-0 peer-focus-visible:opacity-100 motion-reduce:transition-none"
          >
            {isEn ? "Contact person" : "Narahubung"}
          </span>
        )}
      </div>
    </div>
  );
}
