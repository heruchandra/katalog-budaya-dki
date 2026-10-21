/**
 * Pure helpers for reading sanggar rows. No Supabase client here, so both server pages and the
 * admin (browser) code can import it.
 */

export interface GalleryItem {
  url: string;
  caption: string;
}

export interface LayananItem {
  title: string;
  description: string;
  image: string | null;
}

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
      return { title: str(o?.title), description: str(o?.description), image: str(o?.image) || null };
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
 * Splits a practice-venue text into venue and schedule. The data writes the schedule in trailing
 * parentheses: "Studio Sinar Norray, Jl. Daman 1 … (Rabu & Sabtu, 15.00 - 18.00 WIB)".
 */
export function splitPracticeInfo(text?: string | null): { venue: string; schedule: string | null } | null {
  const value = (text || "").trim();
  if (!value) return null;
  const match = value.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  return match && match[1] ? { venue: match[1].trim(), schedule: match[2].trim() } : { venue: value, schedule: null };
}
