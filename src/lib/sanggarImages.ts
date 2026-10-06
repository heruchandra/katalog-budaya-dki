/**
 * Each sanggar's own card photo (public/images/sanggar/<slug>/card/), matched on its name. A sanggar is only ever
 * shown with its own photos: one without a photo gets a placeholder, never another sanggar's picture.
 */
const OWN_CARD_IMAGES: { match: RegExp; url: string }[] = [
  { match: /art enthusiast|ae production/i, url: "/images/sanggar/ae-production/card/card-1.webp" },
  { match: /am dance/i, url: "/images/sanggar/am-dance-studio/card/card-2.webp" },
  { match: /arunika/i, url: "/images/sanggar/arunika-art-production/card/card-3.webp" },
  { match: /ayodya/i, url: "/images/sanggar/ayodya-pala/card/card-4.webp" },
  { match: /citra art/i, url: "/images/sanggar/citra-art-studio/card/card-5.webp" },
  { match: /daya presta/i, url: "/images/sanggar/daya-presta/card/card-6.webp" },
  { match: /sinar norray|sandyakala/i, url: "/images/sanggar/sinar-norray/card/card-7.webp" },
];

export const ownCardImage = (name?: string | null): string | undefined =>
  name ? OWN_CARD_IMAGES.find((c) => c.match.test(name))?.url : undefined;

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

/** Sinar Norray's own photo of one of its dances; undefined for other sanggars */
export function ownDanceImage(sanggar: { id?: string | number; name?: string | null }, danceName?: string) {
  if (!isSinarNorray(sanggar)) return undefined;
  const n = (danceName || "").toLowerCase();
  if (n.includes("lenggok")) return `${SN}/tari/tari-lenggok-dara.webp`;
  if (n.includes("nindak")) return `${SN}/tari/tari-nindak-si-none.webp`;
  return undefined;
}
