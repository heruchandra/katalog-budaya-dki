/**
 * Each sanggar's own photos, under public/images/sanggar/<slug>/ (card/, profile/, galeri/, …), matched on its
 * name. A sanggar is only ever shown with its own photos: one without a photo gets a placeholder, never another
 * sanggar's picture.
 */
const OWN_SANGGARS: { match: RegExp; slug: string; card: number }[] = [
  { match: /art enthusiast|ae production/i, slug: "ae-production", card: 1 },
  { match: /am dance/i, slug: "am-dance-studio", card: 2 },
  { match: /arunika/i, slug: "arunika-art-production", card: 3 },
  { match: /ayodya/i, slug: "ayodya-pala", card: 4 },
  { match: /citra art/i, slug: "citra-art-studio", card: 5 },
  { match: /daya presta/i, slug: "daya-presta", card: 6 },
  { match: /sinar norray|sandyakala/i, slug: "sinar-norray", card: 7 },
];

const findOwn = (name?: string | null) => (name ? OWN_SANGGARS.find((s) => s.match.test(name)) : undefined);
const cardUrl = (s: { slug: string; card: number }) => `/images/sanggar/${s.slug}/card/card-${s.card}.webp`;

export const ownCardImage = (name?: string | null): string | undefined => {
  const own = findOwn(name);
  return own ? cardUrl(own) : undefined;
};

export interface OwnGalleryPhoto {
  type: string;
  typeEn?: string;
  url: string;
  /** Shown while `url` hasn't been uploaded yet */
  fallbackUrl?: string;
}

/**
 * Gallery from the sanggar's galeri/ folder (galeri-1.webp), showing its card photo until that file is uploaded.
 * Empty for a sanggar without its own folder.
 */
export function ownGallery(name?: string | null): OwnGalleryPhoto[] {
  const own = findOwn(name);
  if (!own) return [];
  return [{
    type: "Foto Grup Tari",
    typeEn: "Dance Group Photo",
    url: `/images/sanggar/${own.slug}/galeri/galeri-1.webp`,
    fallbackUrl: cardUrl(own),
  }];
}

const SN = "/images/sanggar/sinar-norray";

/** True for Sinar Norray's profile (also listed under its former name, Sandyakala) */
export const isSinarNorray = (s: { id?: string | number; name?: string | null }) =>
  s.id === "sinar-norray" || /sinar norray|sandyakala/i.test(s.name || "");

/** Sinar Norray's own photo for one of its services, matched on the service title; undefined for other sanggars */
export function ownServiceImage(sanggar: { id?: string | number; name?: string | null }, title?: string, titleEn?: string) {
  if (!isSinarNorray(sanggar)) return undefined;
  const t = `${title || ""} ${titleEn || ""}`.toLowerCase();
  if (/kelas tari|dance class|tari betawi/.test(t)) return `${SN}/layanan/layanan-sanggar-sinarnorray-Kelas Tari Betawi.webp`;
  if (/lenong/.test(t)) return `${SN}/layanan/layanan-sanggar-sinarnorray-Pentas Lenong Betawi.webp`;
  if (/gambang kromong|musik|music/.test(t)) return `${SN}/layanan/layanan-sanggar-sinarnorray-Pentas Musik Gambang Kromong.webp`;
  return undefined;
}

/** Sinar Norray's own photo of one of its dances (from its galeri/ folder); undefined for other sanggars */
export function ownDanceImage(sanggar: { id?: string | number; name?: string | null }, danceName?: string) {
  if (!isSinarNorray(sanggar)) return undefined;
  const n = (danceName || "").toLowerCase();
  if (n.includes("lenggok")) return `${SN}/galeri/galeri-1.webp`;
  if (n.includes("nindak")) return `${SN}/galeri/galeri-2.webp`;
  return undefined;
}
