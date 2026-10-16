"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Eye,
  FileText,
  GraduationCap,
  HeartHandshake,
  Info,
  Lock,
  MessageCircle,
  Music,
  PartyPopper,
  Search,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// The pages are server components, so an item names its icon instead of passing the component
const ITEM_ICONS = {
  "party-popper": PartyPopper,
  "heart-handshake": HeartHandshake,
  music: Music,
  "graduation-cap": GraduationCap,
  search: Search,
  eye: Eye,
  "message-circle": MessageCircle,
  "shield-check": ShieldCheck,
  lock: Lock,
  "file-text": FileText,
  "user-check": UserCheck,
} satisfies Record<string, LucideIcon>;

/** One point of a section, shown as an icon card */
export interface InfoItem {
  icon: keyof typeof ITEM_ICONS;
  title: string;
  text: string;
}

/** Content strings may mark key terms as **term**: they render in bold (see `Rich`) */
export interface InfoSection {
  heading: string;
  paragraphs: string[];
  /** The section's points as icon cards (instead of a plain bullet list) */
  items?: InfoItem[];
  /** "grid": 2 x 2 feature cards, "steps": numbered process cards, "list" (default): one card per row */
  layout?: "grid" | "steps" | "list";
  /** Key notice for the section, shown in a gold callout box after its text */
  callout?: string;
}

export interface InfoContent {
  title: string;
  subtitle: string;
  /** Shown under the title, e.g. "Terakhir diperbarui: 30 September 2026" */
  updated?: string;
  sections: InfoSection[];
  /** Optional closing paragraph after the last section */
  closing?: string;
}

const sectionId = (index: number) => `bagian-${index + 1}`;

// plain bold: no fill, padding or border, so the paragraph reads continuously
const HIGHLIGHT = "font-semibold text-gray-900";

/** Renders a content string with its **key terms** in bold */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? <strong key={i} className={HIGHLIGHT}>{part}</strong> : part
      )}
    </>
  );
}

// Card hover: lifts slightly, the border turns orange and the icon badge fills with the primary orange
const CARD_HOVER =
  "transition duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const ICON_BADGE =
  "flex shrink-0 items-center justify-center bg-primary-50 text-primary-600 ring-1 ring-primary-100 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:ring-primary-600";

/** A section's points as icon cards: a 2 x 2 feature grid, numbered process steps, or a list of cards */
function ItemCards({ items, layout = "list" }: { items: InfoItem[]; layout?: InfoSection["layout"] }) {
  // role="list": Safari drops list semantics from lists styled without bullets
  if (layout === "steps") {
    return (
      <ol role="list" className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-3">
        {items.map((item, i) => {
          const Icon = ITEM_ICONS[item.icon];
          return (
            <li key={item.title} className={`group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-5 ${CARD_HOVER}`}>
              <div className="flex items-center justify-between">
                <span className={`h-12 w-12 rounded-2xl ${ICON_BADGE}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span aria-hidden="true" className="text-3xl font-bold tabular-nums text-primary-200 transition-colors duration-300 group-hover:text-primary-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700"><Rich text={item.text} /></p>
              {/* arrow to the next step: in the gap below on phones, in the gap to the right from md up */}
              {i < items.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-[22px] left-1/2 z-10 flex h-7 w-7 -translate-x-1/2 rotate-90 items-center justify-center rounded-full bg-white text-primary-500 ring-1 ring-slate-200 md:top-1/2 md:bottom-auto md:left-auto md:-right-[22px] md:translate-x-0 md:-translate-y-1/2 md:rotate-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  if (layout === "grid") {
    return (
      <ul role="list" className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = ITEM_ICONS[item.icon];
          return (
            <li key={item.title} className={`group flex flex-col rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-primary-50/40 p-5 sm:p-6 ${CARD_HOVER}`}>
              <span className={`h-12 w-12 rounded-full ${ICON_BADGE}`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700"><Rich text={item.text} /></p>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul role="list" className="space-y-3 pt-1">
      {items.map((item) => {
        const Icon = ITEM_ICONS[item.icon];
        return (
          <li
            key={item.title}
            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50/50 sm:p-5"
          >
            <span className={`h-10 w-10 rounded-xl ${ICON_BADGE}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 sm:text-base">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-700 break-words"><Rich text={item.text} /></p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Shared layout for the footer "Informasi" pages (Tentang Kami, Kebijakan Privasi, Syarat & Ketentuan). */
export default function InfoPage({ content }: { content: { id: InfoContent; en: InfoContent } }) {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const isEn = language === "en";
  const c = isEn ? content.en : content.id;

  const infoPages = [
    { href: "/tentang-kami", label: t("footerAbout") },
    { href: "/kebijakan-privasi", label: t("footerPrivacy") },
    { href: "/syarat-ketentuan", label: t("footerTerms") },
  ];

  return (
    <div className="pt-16 bg-zinc-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left sidebar: official badge, last updated, section jump links (sticky on desktop) */}
          <aside className="lg:col-span-4 bg-white border border-zinc-200 p-6 rounded-sm shadow-xs lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <Image
                src="/logos/logo-disbud.webp"
                alt="Logo Dinas Kebudayaan DKI Jakarta"
                width={67}
                height={44}
                className="h-11 w-[67px] object-contain shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 leading-snug">
                  {isEn ? "Department of Culture" : "Dinas Kebudayaan"}
                </p>
                <p className="text-xs text-zinc-500 leading-snug">
                  {isEn ? "DKI Jakarta Province" : "Provinsi DKI Jakarta"}
                </p>
              </div>
            </div>

            {c.updated && (
              <p className="mt-4 pt-4 border-t border-zinc-100 text-xs text-zinc-500">{c.updated}</p>
            )}

            <nav aria-label={isEn ? "On this page" : "Daftar isi"} className="mt-4 pt-4 border-t border-zinc-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                {isEn ? "On This Page" : "Daftar Isi"}
              </p>
              <ol className="space-y-1">
                {c.sections.map((section, i) => (
                  <li key={section.heading}>
                    <a
                      href={`#${sectionId(i)}`}
                      className="flex gap-2 py-1.5 text-sm text-zinc-600 hover:text-[#F7941E] transition-colors"
                    >
                      <span className="text-zinc-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span>{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <nav aria-label={isEn ? "Information pages" : "Halaman informasi"} className="mt-4 pt-4 border-t border-zinc-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                {isEn ? "Information" : "Informasi"}
              </p>
              <ul className="space-y-1">
                {infoPages.map((page) => {
                  const isCurrent = pathname === page.href;
                  return (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`block py-1.5 pl-3 border-l-2 text-sm transition-colors ${
                          isCurrent
                            ? "border-[#F7941E] text-zinc-900 font-semibold"
                            : "border-transparent text-zinc-600 hover:text-[#F7941E]"
                        }`}
                      >
                        {page.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Right main content. Long-form paragraphs are justified from sm up; on phones they stay left-aligned, because
              browsers have no Indonesian hyphenation dictionary and justified narrow lines open wide gaps between words.
              lang follows the language shown (the <html> lang stays "id"), so hyphens-auto uses the right rules where a
              dictionary exists */}
          <article lang={isEn ? "en" : "id"} className="lg:col-span-8 relative overflow-hidden bg-white border border-zinc-200 p-6 sm:p-10 rounded-sm shadow-xs">
            {/* Dinas Kebudayaan logo-flame accent */}
            <div aria-hidden="true" className="h-1.5 w-full bg-gradient-to-r from-[#F7941E] via-[#E01A67] to-[#2B3990] absolute top-0 left-0" />

            <header className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">{c.title}</h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed text-left sm:text-justify hyphens-auto break-words"><Rich text={c.subtitle} /></p>
            </header>

            <div className="space-y-8">
              {c.sections.map((section, i) => (
                <section key={section.heading} id={sectionId(i)} className="scroll-mt-24">
                  {/* the page font (Plus Jakarta Sans, like the title and text): the theme font-sans would switch to Geist */}
                  <h2 className="my-4 border-l-4 border-amber-500 pl-3.5 text-lg sm:text-xl font-bold text-gray-900 tracking-tight">{section.heading}</h2>
                  <div className="space-y-3 text-sm sm:text-base text-zinc-700 leading-relaxed">
                    {section.paragraphs.map((p, j) => (
                      <p key={j} className="text-left sm:text-justify hyphens-auto break-words"><Rich text={p} /></p>
                    ))}
                    {section.items && <ItemCards items={section.items} layout={section.layout} />}
                    {section.callout && (
                      <div role="note" className="flex gap-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-amber-950 shadow-2xs">
                        <Info className="mt-1 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                        <p className="text-left sm:text-justify hyphens-auto break-words"><Rich text={section.callout} /></p>
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>

            {c.closing && (
              <p className="mt-4 pt-4 border-t border-zinc-100 text-sm sm:text-base text-zinc-600 leading-relaxed text-left sm:text-justify hyphens-auto break-words"><Rich text={c.closing} /></p>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
