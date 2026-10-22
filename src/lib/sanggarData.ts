/**
 * Pure helpers for reading sanggar rows. No Supabase client here, so both server pages and the
 * admin (browser) code can import it.
 */

export interface GalleryItem {
  url: string;
  caption: string;
}

/**
 * A work under a service, e.g. one dance of "Karya Tari Unggulan Sanggar". Stored inside its layanan_items entry
 * (jsonb), so it needs no column of its own.
 */
export interface SubKarya {
  id?: string;
  judul: string;
  sinopsis: string;
  penata_tari?: string;
  penata_musik?: string;
  gambar_url?: string;
}

export interface LayananItem {
  title: string;
  description: string;
  image: string | null;
  /** Its works (dances), when the service groups some */
  sub_karya?: SubKarya[];
  /** KARYA_TARI_KIND marks the entry holding the sanggar's Karya Tari Unggulan (the admin form's own section) */
  kind?: string;
}

/** `kind` of the layanan_items entry that holds the Karya Tari Unggulan Sanggar as its sub_karya */
export const KARYA_TARI_KIND = "karya_tari_unggulan";

export interface PrestasiItem {
  title: string;
  organizer: string;
  year: string;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Parse a jsonb column that may come back as an array, a JSON string, or null. */
function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Gallery from the `galeri` column ({url, caption}); falls back to the legacy `list_foto` URL list. */
export function parseGallery(row: { galeri?: unknown; list_foto?: unknown }): GalleryItem[] {
  const fromGaleri = asArray(row.galeri)
    .map((item) => {
      if (typeof item === "string") return { url: item, caption: "" };
      const o = item as Record<string, unknown>;
      return { url: str(o?.url), caption: str(o?.caption) };
    })
    .filter((g) => g.url);
  if (fromGaleri.length > 0) return fromGaleri;
  return asArray(row.list_foto)
    .filter((u): u is string => typeof u === "string" && u.length > 0)
    .map((url) => ({ url, caption: "" }));
}

export function parseLayanan(row: { layanan_items?: unknown }): LayananItem[] {
  return asArray(row.layanan_items)
    .map((item) => {
      const o = item as Record<string, unknown>;
      const subKarya = asArray(o?.sub_karya)
        .map((sub): SubKarya => {
          const s = sub as Record<string, unknown>;
          return {
            ...(str(s?.id) ? { id: str(s?.id) } : {}),
            judul: str(s?.judul),
            sinopsis: str(s?.sinopsis),
            ...(str(s?.penata_tari) ? { penata_tari: str(s?.penata_tari) } : {}),
            ...(str(s?.penata_musik) ? { penata_musik: str(s?.penata_musik) } : {}),
            ...(str(s?.gambar_url) ? { gambar_url: str(s?.gambar_url) } : {}),
          };
        })
        .filter((s) => s.judul);
      return {
        title: str(o?.title),
        description: str(o?.description),
        image: str(o?.image) || null,
        ...(subKarya.length > 0 ? { sub_karya: subKarya } : {}),
        ...(str(o?.kind) ? { kind: str(o?.kind) } : {}),
      };
    })
    .filter((l) => l.title);
}

export function parsePrestasi(row: { prestasi_items?: unknown }): PrestasiItem[] {
  return asArray(row.prestasi_items)
    .map((item) => {
      if (typeof item === "string") return { title: item, organizer: "", year: "" };
      const o = item as Record<string, unknown>;
      return { title: str(o?.title), organizer: str(o?.organizer), year: str(o?.year) };
    })
    .filter((p) => p.title);
}

/** Drafts are hidden from every public page. Rows without a status (before the migration) are public. */
export const isDraft = (row: { status?: string | null }) => row.status === "draft";

/** The studio's dance-class service ("Kelas Tari Betawi", "Pelatihan Tari …", "Betawi Dance Classes") */
export const isDanceClassService = (title?: string | null, titleEn?: string | null) =>
  /kelas tari|pelatihan tari|latihan tari|dance class/i.test(`${title || ""} ${titleEn || ""}`);

/**
 * A sanggar's featured dance works that have a written synopsis (from its own form). Only these are presented as its
 * "Karya Tari Unggulan Sanggar"; a list of dance names with one-line blurbs is not.
 */
export const danceWorksOf = <T extends { synopsis?: string }>(list?: T[] | null): T[] =>
  (list || []).filter((t) => !!t.synopsis?.trim());

/** Title of the service card that opens a sanggar's featured dance works */
export const DANCE_WORKS_TITLE = { id: "Karya Tari Unggulan Sanggar", en: "Studio's Featured Dance Works" };

/**
 * The entry holding the Karya Tari Unggulan: marked by `kind`, or (rows saved before the mark) titled
 * "Karya Tari Unggulan Sanggar" with sub_karya
 */
export const isKaryaTariService = (l: Pick<LayananItem, "title" | "kind" | "sub_karya">) =>
  l.kind === KARYA_TARI_KIND ||
  ((l.sub_karya?.length ?? 0) > 0 && l.title.trim().toLowerCase() === DANCE_WORKS_TITLE.id.toLowerCase());

/** That entry with no works left: the admin removed them all, so no works card shows (curated works included) */
export const isClearedKaryaTari = (l: Pick<LayananItem, "kind" | "sub_karya">) =>
  l.kind === KARYA_TARI_KIND && !(l.sub_karya?.length);

/** Summary of a works card that has no description of its own: the works' titles */
export const danceWorksSummary = (names: string[]) => ({
  id: `Pertunjukan karya tari unggulan sanggar: ${names.join(", ")}.`,
  en: `Performances of the studio's featured dance works: ${names.join(", ")}.`,
});

/**
 * Splits a practice-venue text into venue and schedule. The data writes the schedule in trailing
 * parentheses: "Studio Sinar Norray, Jl. Daman 1 … (Rabu & Sabtu, 15.00 - 18.00 WIB)".
 */
export function splitPracticeInfo(text?: string | null): { venue: string; schedule: string | null } | null {
  const value = (text || "").trim();
  if (!value) return null;
  const match = value.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  return match && match[1] ? { venue: match[1].trim(), schedule: match[2].trim() } : { venue: value, schedule: null };
}
