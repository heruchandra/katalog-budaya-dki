import { MEDIA_BUCKET, SaveResult, deleteRow, getTableColumns, saveRow, uploadImage as uploadToBucket } from "@/lib/adminDb";
import {
  DANCE_WORKS_TITLE,
  GalleryItem,
  KARYA_TARI_KIND,
  LayananItem,
  PrestasiItem,
  SubKarya,
  isClearedKaryaTari,
  isDraft,
  isKaryaTariService,
  parseGallery,
  parseLayanan,
  parsePrestasi,
} from "@/lib/sanggarData";

export { isDraft, parseGallery, parseLayanan, parsePrestasi };
export type { GalleryItem, LayananItem, PrestasiItem };

export const SANGGAR_TABLE = "sanggars";
export { MEDIA_BUCKET };
export type { SaveResult };

/** The only grades offered in the admin filter and form */
export const GRADE_OPTIONS = ["A", "B"] as const;
// The catalog only lists dance studios and music artists
export const KATEGORI_OPTIONS = ["Seni Tari", "Seni Musik"] as const;
export const STATUS_OPTIONS = ["terverifikasi", "draft"] as const;
export type SanggarStatus = (typeof STATUS_OPTIONS)[number];

/** A row of the `sanggars` table. Columns marked (migration) only exist after the SQL migration is run. */
export interface SanggarRow {
  id: number | string;
  created_at?: string;
  nama_sanggar: string;
  grade?: string | null;
  tagline?: string | null;
  deskripsi?: string | null;
  jenis_tarian?: string | null;
  alamat?: string | null;
  alamat_tempat_latihan?: string | null;
  ketua_sanggar?: string | null;
  nama_pic?: string | null;
  kontak_pic?: string | null;
  email?: string | null;
  instagram?: string | null;
  logo_url?: string | null;
  thumbnail_url?: string | null;
  foto_ketua_url?: string | null;
  foto_grup_url?: string | null;
  list_foto?: unknown;
  // (migration)
  kategori?: string | null;
  wilayah?: string | null;
  status?: string | null;
  youtube_url?: string | null;
  maps_url?: string | null;
  galeri?: unknown;
  layanan_items?: unknown;
  prestasi_items?: unknown;
}

/** Columns created by supabase/migrations/20260930_admin_sanggar_fields.sql, with the form label they belong to. */
export const MIGRATION_COLUMNS: Record<string, string> = {
  kategori: "Kategori Seni",
  wilayah: "Wilayah",
  status: "Status",
  youtube_url: "Link YouTube",
  maps_url: "Link Google Maps",
  galeri: "Galeri Foto",
  layanan_items: "Layanan / Karya",
  prestasi_items: "Prestasi & Penghargaan",
};

/** An image in the form: an already-saved URL, or a freshly cropped blob waiting to be uploaded on save. */
export interface ImageValue {
  url: string | null;
  blob?: Blob | null;
}

export interface GalleryFormItem extends ImageValue {
  caption: string;
}

/**
 * One Karya Tari Unggulan (a dance), as edited in the form; `id` keeps it stable while the list changes. Penata tari /
 * musik aren't edited in the form any more: a value saved earlier is carried through and saved back unchanged.
 */
export interface SubKaryaFormItem {
  id: string;
  judul: string;
  sinopsis: string;
  penata_tari: string;
  penata_musik: string;
  image: ImageValue;
}

export interface LayananFormItem {
  /** Form-only key, never saved: keeps each card's state with it when cards are added at the top or removed */
  uid: string;
  title: string;
  description: string;
  image: ImageValue;
}

/** An id for a new form item (crypto.randomUUID needs a secure context, so plain http on a LAN address falls back) */
export const newFormId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const emptyLayanan = (): LayananFormItem => ({
  uid: newFormId(),
  title: "",
  description: "",
  image: { url: null },
});

export const emptySubKarya = (): SubKaryaFormItem => ({
  id: newFormId(),
  judul: "",
  sinopsis: "",
  penata_tari: "",
  penata_musik: "",
  image: { url: null },
});

/** A Prestasi row in the sanggar and seniman musik forms; `uid` is form-only (never saved), so rows added at the top
 *  keep their keys */
export interface PrestasiFormItem {
  uid: string;
  title: string;
  organizer: string;
  year: string;
}

export const emptyPrestasi = (): PrestasiFormItem => ({ uid: newFormId(), title: "", organizer: "", year: "" });

/** Saved prestasi items as form rows */
export const toPrestasiForm = (items: { title: string; organizer: string; year: string }[]): PrestasiFormItem[] =>
  items.map((p) => ({ uid: newFormId(), title: p.title, organizer: p.organizer, year: p.year }));

export interface SanggarFormValues {
  // Tab 1: Informasi Umum
  nama_sanggar: string;
  kategori: string;
  grade: string;
  wilayah: string;
  status: SanggarStatus;
  tagline: string;
  alamat: string;
  alamat_tempat_latihan: string;
  deskripsi: string;
  // Tab 2: PIC & Kontak / Medsos
  ketua_sanggar: string;
  nama_pic: string;
  kontak_pic: string;
  email: string;
  instagram: string;
  youtube_url: string;
  maps_url: string;
  // Tab 3: Media
  thumbnail: ImageValue;
  logo: ImageValue;
  foto_ketua: ImageValue;
  foto_grup: ImageValue;
  // Tab 4: Galeri & Layanan
  galeri: GalleryFormItem[];
  layanan: LayananFormItem[];
  /**
   * Karya Tari Unggulan Sanggar (its own section). Saved as one layanan_items entry (kind KARYA_TARI_KIND) holding the
   * dances as sub_karya, which the detail page shows as its "Karya Tari Unggulan Sanggar" card.
   */
  karya_tari: SubKaryaFormItem[];
  /** That entry's own card text and image: not edited in the form, saved back as they were */
  karya_tari_card: { description: string; image: ImageValue };
  /** The row had that entry (or the list was pre-filled): an emptied list is then saved as "all removed" */
  karya_tari_tracked: boolean;
  /** The list was filled from the curated profile and isn't in the database yet */
  karya_tari_prefilled: boolean;
  prestasi: PrestasiFormItem[];
}

export const EMPTY_FORM: SanggarFormValues = {
  nama_sanggar: "",
  kategori: "Seni Tari",
  grade: "",
  wilayah: "",
  status: "terverifikasi",
  tagline: "",
  alamat: "",
  alamat_tempat_latihan: "",
  deskripsi: "",
  ketua_sanggar: "",
  nama_pic: "",
  kontak_pic: "",
  email: "",
  instagram: "",
  youtube_url: "",
  maps_url: "",
  thumbnail: { url: null },
  logo: { url: null },
  foto_ketua: { url: null },
  foto_grup: { url: null },
  galeri: [],
  layanan: [],
  karya_tari: [],
  karya_tari_card: { description: "", image: { url: null } },
  karya_tari_tracked: false,
  karya_tari_prefilled: false,
  prestasi: [],
};

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** A curated featured dance (src/data/sanggarProfiles.ts), as far as the form needs it */
export interface CuratedWork {
  name: string;
  synopsis?: string;
  choreographer?: string;
  composer?: string;
  image?: string;
}

const slugId = (name: string) =>
  name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || newFormId();

const subKaryaToForm = (s: SubKarya): SubKaryaFormItem => ({
  id: s.id || newFormId(),
  judul: s.judul,
  sinopsis: s.sinopsis,
  penata_tari: s.penata_tari ?? "",
  penata_musik: s.penata_musik ?? "",
  image: { url: s.gambar_url ?? null },
});

/**
 * A row as form values. layanan_items is split: the normal services, and the Karya Tari Unggulan (the sub_karya of
 * its own entry; works that an older form saved under a normal service move into the list too). When the row has
 * services but no Karya Tari Unggulan yet, the list starts from `curatedWorks` (what the public page shows from the
 * curated profile), so saving moves them into the database. Without services in the database the public page shows
 * the curated services, which saving only the works would replace, so nothing is pre-filled then.
 */
export function rowToForm(row: SanggarRow, curatedWorks: CuratedWork[] = []): SanggarFormValues {
  const services = parseLayanan(row);
  const worksEntries = services.filter(isKaryaTariService);
  const standard = services.filter((l) => !isKaryaTariService(l));
  const saved = services.flatMap((l) => (l.sub_karya ?? []).map(subKaryaToForm));
  const cleared = services.some(isClearedKaryaTari);
  const prefill = saved.length === 0 && worksEntries.length === 0 && !cleared && standard.length > 0 && curatedWorks.length > 0;
  const card = worksEntries[0];
  return {
    nama_sanggar: str(row.nama_sanggar),
    kategori: str(row.kategori) || "Seni Tari",
    grade: str(row.grade).replace(/grade/i, "").trim().toUpperCase(),
    wilayah: str(row.wilayah),
    status: isDraft(row) ? "draft" : "terverifikasi",
    tagline: str(row.tagline),
    alamat: str(row.alamat),
    alamat_tempat_latihan: str(row.alamat_tempat_latihan),
    deskripsi: str(row.deskripsi),
    ketua_sanggar: str(row.ketua_sanggar),
    nama_pic: str(row.nama_pic),
    kontak_pic: str(row.kontak_pic),
    email: str(row.email),
    instagram: str(row.instagram),
    youtube_url: str(row.youtube_url),
    maps_url: str(row.maps_url),
    thumbnail: { url: str(row.thumbnail_url) || null },
    logo: { url: str(row.logo_url) || null },
    foto_ketua: { url: str(row.foto_ketua_url) || null },
    foto_grup: { url: str(row.foto_grup_url) || null },
    galeri: parseGallery(row).map((g) => ({ url: g.url, caption: g.caption })),
    layanan: standard.map((l) => ({ uid: newFormId(), title: l.title, description: l.description, image: { url: l.image } })),
    karya_tari: prefill
      ? curatedWorks.map((w) => ({
          id: slugId(w.name),
          judul: w.name,
          sinopsis: w.synopsis ?? "",
          penata_tari: w.choreographer ?? "",
          penata_musik: w.composer ?? "",
          image: { url: w.image ?? null },
        }))
      : saved,
    karya_tari_card: { description: card?.description ?? "", image: { url: card?.image ?? null } },
    karya_tari_tracked: worksEntries.length > 0 || saved.length > 0 || prefill,
    karya_tari_prefilled: prefill,
    prestasi: toPrestasiForm(parsePrestasi(row)),
  };
}

/** Column names of the sanggars table, read from an existing row (null when the table is empty or unreadable). */
export const getSanggarColumns = () => getTableColumns(SANGGAR_TABLE);

/** Upload a cropped/resized image (to sanggar/ in the media bucket) and return its public URL. */
export const uploadImage = (blob: Blob, prefix: string) => uploadToBucket(blob, prefix, "sanggar");

const resolveImage = async (image: ImageValue, prefix: string): Promise<string | null> =>
  image.blob ? uploadImage(image.blob, prefix) : image.url;

const nullable = (v: string) => (v.trim() ? v.trim() : null);

/**
 * Upload any pending images, then build the full row payload (all columns, including migration ones).
 * `jenis_tarian` is no longer edited in the form, so it is left out: an update keeps the stored value.
 */
export async function buildPayload(values: SanggarFormValues): Promise<Record<string, unknown>> {
  const [thumbnail_url, logo_url, foto_ketua_url, foto_grup_url] = await Promise.all([
    resolveImage(values.thumbnail, "thumbnail"),
    resolveImage(values.logo, "logo"),
    resolveImage(values.foto_ketua, "ketua"),
    resolveImage(values.foto_grup, "grup"),
  ]);

  const galeri: GalleryItem[] = [];
  for (const item of values.galeri) {
    const url = await resolveImage(item, "galeri");
    if (url) galeri.push({ url, caption: item.caption.trim() });
  }

  const layanan_items: LayananItem[] = [];
  for (const item of values.layanan) {
    if (!item.title.trim()) continue;
    layanan_items.push({
      title: item.title.trim(),
      description: item.description.trim(),
      image: await resolveImage(item.image, "layanan"),
    });
  }

  // Karya Tari Unggulan: one entry after the services, holding the dances (a dance needs a title, like a service;
  // empty optional fields are left out). An emptied list that the row had is kept as an entry with no works, which
  // tells the detail page they were removed (rather than never added), so curated works don't come back either.
  const sub_karya: SubKarya[] = [];
  for (const sub of values.karya_tari) {
    if (!sub.judul.trim()) continue;
    const gambar_url = await resolveImage(sub.image, "karya");
    sub_karya.push({
      id: sub.id,
      judul: sub.judul.trim(),
      sinopsis: sub.sinopsis.trim(),
      ...(sub.penata_tari.trim() ? { penata_tari: sub.penata_tari.trim() } : {}),
      ...(sub.penata_musik.trim() ? { penata_musik: sub.penata_musik.trim() } : {}),
      ...(gambar_url ? { gambar_url } : {}),
    });
  }
  if (sub_karya.length > 0 || values.karya_tari_tracked) {
    layanan_items.push({
      title: DANCE_WORKS_TITLE.id,
      kind: KARYA_TARI_KIND,
      description: values.karya_tari_card.description.trim(),
      image: await resolveImage(values.karya_tari_card.image, "layanan"),
      sub_karya,
    });
  }

  const prestasi_items = values.prestasi
    .filter((p) => p.title.trim())
    .map((p) => ({ title: p.title.trim(), organizer: p.organizer.trim(), year: p.year.trim() }));

  return {
    nama_sanggar: values.nama_sanggar.trim(),
    grade: nullable(values.grade),
    tagline: nullable(values.tagline),
    alamat: nullable(values.alamat),
    alamat_tempat_latihan: nullable(values.alamat_tempat_latihan),
    deskripsi: nullable(values.deskripsi),
    ketua_sanggar: nullable(values.ketua_sanggar),
    nama_pic: nullable(values.nama_pic),
    kontak_pic: nullable(values.kontak_pic),
    email: nullable(values.email),
    instagram: nullable(values.instagram),
    thumbnail_url,
    logo_url,
    foto_ketua_url,
    foto_grup_url,
    // (migration) columns
    kategori: nullable(values.kategori),
    wilayah: nullable(values.wilayah),
    status: values.status,
    youtube_url: nullable(values.youtube_url),
    maps_url: nullable(values.maps_url),
    galeri,
    layanan_items,
    prestasi_items,
  };
}

/**
 * Insert or update a sanggar. Columns missing from the database are left out (and reported) instead of
 * failing the whole save, so the form works before and after the migration is applied.
 */
export const saveSanggar = (id: number | string | null, payload: Record<string, unknown>, knownColumns: Set<string> | null) =>
  saveRow(SANGGAR_TABLE, id, payload, knownColumns);

export const deleteSanggar = (id: number | string) => deleteRow(SANGGAR_TABLE, id);
