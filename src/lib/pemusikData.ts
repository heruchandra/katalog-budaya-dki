import type { PemusikRow } from "@/lib/pemusikStats";
import type { KategoriMusik, MusikCategory } from "@/types/musik";

// Shared by the admin form and the public pages (no Supabase client here, so server pages can import it)

/** The only two Seniman Musik categories (admin filter + form, stored in pemusiks.jenis_seniman) */
export const KATEGORI_MUSIK_OPTIONS: readonly KategoriMusik[] = ["Komunitas Musik", "Pemusik"];

/** Category label of a profile's sub-category */
export const KATEGORI_OF: Record<MusikCategory, KategoriMusik> = { komunitas: "Komunitas Musik", pemusik: "Pemusik" };

/**
 * Map any stored value onto one of the two categories: groups of any kind (komunitas, sanggar musik, grup, orkes,
 * band, …) are "Komunitas Musik"; individuals (older rows: "Solo", "Perorangan", "Pemusik Perorangan") are "Pemusik".
 * "" when the value is empty or unrecognised.
 */
export function normalizeKategori(value?: string | null): KategoriMusik | "" {
  const v = (value || "").trim();
  if ((KATEGORI_MUSIK_OPTIONS as readonly string[]).includes(v)) return v as KategoriMusik;
  if (/komunitas|kelompok|sanggar|grup|group|orkes|band|ensemble/i.test(v)) return "Komunitas Musik";
  if (/solo|individu|perorangan|pemusik|musisi|musician/i.test(v)) return "Pemusik";
  return "";
}

export const isDraftRow = (row: { status?: string | null }) => row.status === "draft";

export interface PemusikGalleryItem {
  url: string;
  caption: string;
}

export interface PemusikKaryaItem {
  judul: string;
  deskripsi: string;
  tahun: string;
  link: string;
}

export interface PemusikPrestasiItem {
  title: string;
  organizer: string;
  year: string;
}

export interface PemusikPengalamanItem {
  kegiatan: string;
  tahun: string;
}

const asArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};
const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});

export const parsePemusikGaleri = (row: Pick<PemusikRow, "galeri">): PemusikGalleryItem[] =>
  asArray(row.galeri)
    .map((g) => (typeof g === "string" ? { url: g.trim(), caption: "" } : { url: str(obj(g).url), caption: str(obj(g).caption) }))
    .filter((g) => g.url);

export const parsePemusikLayanan = (row: Pick<PemusikRow, "layanan_items">): string[] =>
  asArray(row.layanan_items)
    .map((l) => (typeof l === "string" ? l.trim() : str(obj(l).title)))
    .filter(Boolean);

export const parsePemusikKarya = (row: Pick<PemusikRow, "karya_items">): PemusikKaryaItem[] =>
  asArray(row.karya_items)
    .map((k) => ({ judul: str(obj(k).judul), deskripsi: str(obj(k).deskripsi), tahun: str(obj(k).tahun), link: str(obj(k).link) }))
    .filter((k) => k.judul);

export const parsePemusikPrestasi = (row: Pick<PemusikRow, "prestasi_items">): PemusikPrestasiItem[] =>
  asArray(row.prestasi_items)
    .map((p) => (typeof p === "string" ? { title: p.trim(), organizer: "", year: "" } : { title: str(obj(p).title), organizer: str(obj(p).organizer), year: str(obj(p).year) }))
    .filter((p) => p.title);

/** Pengalaman list; rows saved before the migration have it in the legacy text column, one line per item */
export function parsePemusikPengalaman(row: Pick<PemusikRow, "pengalaman_items" | "pengalaman">): PemusikPengalamanItem[] {
  const items = asArray(row.pengalaman_items)
    .map((p) => (typeof p === "string" ? { kegiatan: p.trim(), tahun: "" } : { kegiatan: str(obj(p).kegiatan), tahun: str(obj(p).tahun) }))
    .filter((p) => p.kegiatan);
  if (items.length > 0) return items;
  return (row.pengalaman || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((kegiatan) => ({ kegiatan, tahun: "" }));
}

/** "Kegiatan 2025" for the public timeline (its year pill is read back from the text) */
export const pengalamanLine = (p: PemusikPengalamanItem) =>
  p.tahun && !p.kegiatan.includes(p.tahun) ? `${p.kegiatan} ${p.tahun}` : p.kegiatan;

/** Contact numbers as written ("0813… / 0859…", "0813…, 0859…") → one entry per number */
export const splitPhoneList = (value?: string | null) =>
  (value || "")
    .split(/[/,;|]|\s(?:dan|atau|or)\s/i)
    .map((s) => s.trim())
    .filter(Boolean);
