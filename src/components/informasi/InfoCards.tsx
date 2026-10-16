"use client";

import { useId, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  GraduationCap,
  HeartHandshake,
  ImageIcon,
  Lock,
  MessageCircle,
  Music,
  PartyPopper,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Rich from "@/components/informasi/Rich";
import StepIllustration, { type StepIllustrationName } from "@/components/informasi/StepIllustration";

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

/** A photo revealed by a card of the "gallery" layout */
export interface InfoImage {
  src: string;
  alt: string;
  /** CSS object-position of the crop, e.g. "35% 50%" (centred by default) */
  position?: string;
}

/** One point of a section, shown as an icon card */
export interface InfoItem {
  icon: keyof typeof ITEM_ICONS;
  title: string;
  text: string;
  /** "gallery" layout: the photo shown while this card is selected */
  image?: InfoImage;
  /** "steps" layout: the mock-up shown while this step is selected */
  illustration?: StepIllustrationName;
}

/** "gallery": cards with a photo preview, "steps": numbered process with illustrations, "list" (default): one card per row */
export type InfoLayout = "gallery" | "steps" | "list";

/** Icon badge: a ring pulses out of it while its card is hovered, and it fills orange while the card is selected */
function IconBadge({ icon, selected = false, box, shape, iconSize }: {
  icon: keyof typeof ITEM_ICONS;
  selected?: boolean;
  box: string;
  shape: string;
  iconSize: string;
}) {
  const Icon = ITEM_ICONS[icon];
  return (
    <span className={`relative flex shrink-0 ${box}`}>
      <span aria-hidden="true" className={`absolute inset-0 ${shape} bg-primary-400/50 opacity-0 group-hover:animate-icon-pulse motion-reduce:group-hover:animate-none`} />
      <span
        className={`relative flex h-full w-full items-center justify-center ${shape} ring-1 transition-colors duration-300 ${
          selected
            ? "bg-primary-600 text-white ring-primary-600"
            : "bg-primary-50 text-primary-600 ring-primary-100 group-hover:bg-primary-600 group-hover:text-white group-hover:ring-primary-600"
        }`}
      >
        <Icon className={iconSize} aria-hidden="true" />
      </span>
    </span>
  );
}

/**
 * Transparent button over a whole card: hovering, focusing or clicking it selects the card. The card's heading and
 * text stay outside the button, so they keep their meaning for screen readers.
 */
function SelectButton({ label, selected, controls, onSelect }: { label: string; selected: boolean; controls: string; onSelect: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      aria-controls={controls}
      onClick={onSelect}
      onFocus={onSelect}
      onMouseEnter={onSelect}
      className="absolute inset-0 z-10 cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    />
  );
}

/** Opens below the selected card while the cards are stacked (narrow containers) */
function Reveal({ open, className, children }: { open: boolean; className: string; children: ReactNode }) {
  return (
    <div
      aria-hidden={!open}
      className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} ${className}`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

function PreviewBadge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-700 shadow-sm backdrop-blur-sm ${className}`}>
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * Cards + photo preview ("Hadir di Setiap Momen Istimewa"). Wide containers: the cards on the left, the selected
 * card's photo on the right (all photos are stacked there and cross-fade). Narrow ones: the photo opens below the
 * selected card. Hover, focus or a tap selects a card; the first one starts selected.
 */
function Gallery({ items }: { items: InfoItem[] }) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [active, setActive] = useState(0);
  const previewId = useId();
  const current = items[active];
  const badge = isEn ? "Art Moment Preview" : "Pratinjau Momen Seni";

  return (
    <div className="@container pt-1">
      <div className="@2xl:grid @2xl:grid-cols-2 @2xl:gap-5">
        <ul role="list" className="space-y-3">
          {items.map((item, i) => {
            const selected = i === active;
            return (
              <li
                key={item.title}
                className={`group relative rounded-3xl border p-4 transition duration-300 ease-in-out motion-reduce:transition-none ${
                  selected
                    ? "border-primary-500 bg-primary-50/60 shadow-md shadow-primary-500/10"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md motion-reduce:hover:translate-y-0"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <IconBadge icon={item.icon} selected={selected} box="h-11 w-11" shape="rounded-full" iconSize="h-5 w-5" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-bold leading-snug text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700"><Rich text={item.text} /></p>
                  </div>
                  {/* stacked: the photo opens below; side by side: points at the preview */}
                  <ChevronDown
                    aria-hidden="true"
                    className={`mt-0.5 h-5 w-5 shrink-0 transition duration-300 @2xl:hidden ${selected ? "rotate-180 text-primary-600" : "text-slate-400"}`}
                  />
                  <ChevronRight
                    aria-hidden="true"
                    className={`mt-0.5 hidden h-5 w-5 shrink-0 transition duration-300 @2xl:block ${selected ? "translate-x-1 text-primary-600" : "text-slate-300 group-hover:text-primary-400"}`}
                  />
                </div>
                {item.image && (
                  <Reveal open={selected} className="@2xl:hidden">
                    <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 @lg:aspect-video">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(min-width: 1024px) 640px, 80vw"
                        style={{ objectPosition: item.image.position }}
                        className="object-cover"
                      />
                      <PreviewBadge label={badge} className="absolute left-3 top-3" />
                    </div>
                  </Reveal>
                )}
                <SelectButton
                  label={isEn ? `View photo: ${item.title}` : `Lihat gambar: ${item.title}`}
                  selected={selected}
                  controls={previewId}
                  onSelect={() => setActive(i)}
                />
              </li>
            );
          })}
        </ul>

        <figure id={previewId} className="relative hidden min-h-80 overflow-hidden rounded-3xl bg-slate-100 shadow-lg shadow-slate-900/10 @2xl:block">
          {items.map((item, i) =>
            item.image ? (
              <Image
                key={item.image.src}
                src={item.image.src}
                alt={i === active ? item.image.alt : ""}
                aria-hidden={i !== active}
                fill
                sizes="(min-width: 1280px) 360px, 45vw"
                style={{ objectPosition: item.image.position }}
                className={`object-cover transition duration-500 ease-in-out motion-reduce:transition-none ${i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
              />
            ) : null
          )}
          {/* dark at the bottom so the white caption reads over bright costumes */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 via-30% to-transparent to-60%" />
          <PreviewBadge label={badge} className="absolute left-4 top-4" />
          <span className="absolute right-4 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
            {active + 1} / {items.length}
          </span>
          {/* re-mounted per card so it fades in again */}
          <figcaption key={active} className="absolute inset-x-0 bottom-0 p-5 text-white animate-[fade-in_0.4s_ease-out] motion-reduce:animate-none">
            <p className="text-lg font-bold leading-snug">{current.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-white/85">{current.text.replace(/\*\*/g, "")}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

// Left edge of the notch under step `i` of `n`: the centre of its column (columns are separated by gap-8 = 2rem)
const notchLeft = (i: number, n: number) => `calc(${i} * ((100% - ${n - 1} * 2rem) / ${n} + 2rem) + (100% - ${n - 1} * 2rem) / ${n * 2} - 0.5rem)`;

/**
 * Numbered process ("Mudah, Cepat, dan Langsung"). Wide containers: the steps side by side and the selected step's
 * illustration in a panel below, with a notch pointing at the step. Narrow ones: the illustration opens inside the
 * selected step. Hover, focus or a tap selects a step; the first one starts selected.
 */
function Steps({ items }: { items: InfoItem[] }) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [active, setActive] = useState(0);
  const panelId = useId();

  return (
    <div className="@container pt-1">
      <ol role="list" className="grid grid-cols-1 gap-8 @xl:grid-cols-3">
        {items.map((item, i) => {
          const selected = i === active;
          return (
            <li
              key={item.title}
              className={`group relative flex flex-col rounded-3xl border p-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                selected ? "border-primary-500 bg-primary-50/50 shadow-md shadow-primary-500/10" : "border-slate-200 bg-white hover:border-primary-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <IconBadge icon={item.icon} selected={selected} box="h-12 w-12" shape="rounded-2xl" iconSize="h-6 w-6" />
                <span
                  aria-hidden="true"
                  className={`text-3xl font-bold tabular-nums transition-colors duration-300 ${selected ? "text-primary-400" : "text-primary-200 group-hover:text-primary-400"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700"><Rich text={item.text} /></p>
              {item.illustration && (
                <>
                  {/* tells the card can be opened; reads "showing" on the selected one (kept at the card's bottom edge) */}
                  <div aria-hidden="true" className="mt-auto pt-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition-colors duration-300 ${
                        selected ? "bg-primary-600 text-white ring-primary-600" : "bg-white text-slate-600 ring-slate-200 group-hover:text-primary-700 group-hover:ring-primary-300"
                      }`}
                    >
                      {selected ? <Eye className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                      {selected ? (isEn ? "Showing" : "Ditampilkan") : isEn ? "View illustration" : "Lihat Ilustrasi"}
                    </span>
                  </div>
                  <Reveal open={selected} className="@xl:hidden">
                    <div className="mt-4 rounded-2xl bg-primary-50 p-3 ring-1 ring-primary-100">
                      <StepIllustration name={item.illustration} />
                    </div>
                  </Reveal>
                </>
              )}
              {/* arrow to the next step: in the gap below (stacked) or to the right (side by side) */}
              {i < items.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-7 left-1/2 z-20 flex h-6 w-6 -translate-x-1/2 rotate-90 items-center justify-center rounded-full bg-white text-primary-500 ring-1 ring-slate-200 @xl:top-1/2 @xl:bottom-auto @xl:left-auto @xl:-right-7 @xl:translate-x-0 @xl:-translate-y-1/2 @xl:rotate-0"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              )}
              <SelectButton
                label={isEn ? `View step ${i + 1} illustration: ${item.title}` : `Lihat ilustrasi langkah ${i + 1}: ${item.title}`}
                selected={selected}
                controls={panelId}
                onSelect={() => setActive(i)}
              />
            </li>
          );
        })}
      </ol>

      <div className="relative mt-6 hidden @xl:block">
        <span
          aria-hidden="true"
          className="absolute -top-2 z-10 h-4 w-4 rotate-45 border-l border-t border-primary-200 bg-primary-50 transition-[left] duration-300 ease-in-out motion-reduce:transition-none"
          style={{ left: notchLeft(active, items.length) }}
        />
        <div id={panelId} className="relative overflow-hidden rounded-3xl border border-primary-200 bg-primary-50 px-6 pb-6 pt-14">
          <div aria-hidden="true" className="batik-pattern pointer-events-none absolute inset-0" />
          <PreviewBadge label={isEn ? `Step ${active + 1} illustration` : `Ilustrasi Langkah ${active + 1}`} className="absolute left-5 top-4 ring-1 ring-primary-100" />
          {/* every illustration sits in the same grid cell (the panel keeps the tallest one's height) and cross-fades */}
          <div className="relative grid items-center">
            {items.map((item, i) =>
              item.illustration ? (
                <div
                  key={item.title}
                  aria-hidden={i !== active}
                  className={`[grid-area:1/1] transition duration-300 ease-in-out motion-reduce:transition-none ${i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
                >
                  <StepIllustration name={item.illustration} />
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Policy points: one card per row; it lifts and its border turns orange while hovered */
function List({ items }: { items: InfoItem[] }) {
  return (
    <ul role="list" className="space-y-3 pt-1">
      {items.map((item) => (
        <li
          key={item.title}
          className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:border-primary-500 hover:bg-primary-50/50 hover:shadow-md hover:shadow-primary-500/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
        >
          <IconBadge icon={item.icon} box="h-10 w-10" shape="rounded-xl" iconSize="h-5 w-5" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 sm:text-base">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-700 break-words"><Rich text={item.text} /></p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A section's points as icon cards (see `InfoLayout`) */
export default function ItemCards({ items, layout = "list" }: { items: InfoItem[]; layout?: InfoLayout }) {
  if (layout === "gallery") return <Gallery items={items} />;
  if (layout === "steps") return <Steps items={items} />;
  return <List items={items} />;
}
