"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Rich from "@/components/informasi/Rich";
import ItemCards, { type InfoItem, type InfoLayout } from "@/components/informasi/InfoCards";

/** Content strings may mark key terms as **term**: they render in bold (see `Rich`) */
export interface InfoSection {
  heading: string;
  paragraphs: string[];
  /** The section's points as icon cards (instead of a plain bullet list) */
  items?: InfoItem[];
  /** "gallery": cards with a photo preview, "steps": numbered process with illustrations, "list" (default): one card per row */
  layout?: InfoLayout;
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
