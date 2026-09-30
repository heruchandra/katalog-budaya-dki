import { supabase } from "@/lib/supabase";
import { GalleryItem, LayananItem, PrestasiItem, isDraft, parseGallery, parseLayanan, parsePrestasi } from "@/lib/sanggarData";

export { isDraft, parseGallery, parseLayanan, parsePrestasi };
export type { GalleryItem, LayananItem, PrestasiItem };

export const SANGGAR_TABLE = "sanggars";
export const MEDIA_BUCKET = "katalog-media";
/** Same rule the public Navbar uses to show the admin link. Real enforcement must be Supabase RLS. */
export const ADMIN_EMAIL = "admindisbud@gmail.com";

export const GRADE_OPTIONS = ["A", "B", "C"] as const;
export const KATEGORI_OPTIONS = ["Seni Tari", "Seni Musik", "Seni Teater", "Seni Rupa", "Kerajinan", "Lainnya"] as const;
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

export interface LayananFormItem {
  title: string;
  description: string;
  price: string;
  image: ImageValue;
}

export interface SanggarFormValues {
  // Tab 1: Informasi Umum
  nama_sanggar: string;
  kategori: string;
  grade: string;
  wilayah: string;
  status: SanggarStatus;
  tagline: string;
  jenis_tarian: string;
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
  prestasi: PrestasiItem[];
}

export const EMPTY_FORM: SanggarFormValues = {
  nama_sanggar: "",
  kategori: "Seni Tari",
  grade: "",
  wilayah: "",
  status: "terverifikasi",
  tagline: "",
  jenis_tarian: "",
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
  prestasi: [],
};

const str = (v: unknown) => (typeof v === "string" ? v : "");

export function rowToForm(row: SanggarRow): SanggarFormValues {
  return {
    nama_sanggar: str(row.nama_sanggar),
    kategori: str(row.kategori) || "Seni Tari",
    grade: str(row.grade).replace(/grade/i, "").trim().toUpperCase(),
    wilayah: str(row.wilayah),
    status: isDraft(row) ? "draft" : "terverifikasi",
    tagline: str(row.tagline),
    jenis_tarian: str(row.jenis_tarian),
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
    layanan: parseLayanan(row).map((l) => ({ title: l.title, description: l.description, price: l.price, image: { url: l.image } })),
    prestasi: parsePrestasi(row),
  };
}

/** Column names of the sanggars table, read from an existing row (null when the table is empty or unreadable). */
export async function getSanggarColumns(): Promise<Set<string> | null> {
  const { data, error } = await supabase.from(SANGGAR_TABLE).select("*").limit(1);
  if (error || !data || data.length === 0) return null;
  return new Set(Object.keys(data[0]));
}

/** Upload a cropped/resized image and return its public URL. */
export async function uploadImage(blob: Blob, prefix: string): Promise<string> {
  const ext = blob.type.split("/")[1] || "jpg";
  const path = `sanggar/${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, { contentType: blob.type, upsert: false });
  if (error) {
    throw new Error(`Gagal mengunggah gambar ke bucket "${MEDIA_BUCKET}": ${error.message}`);
  }
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

const resolveImage = async (image: ImageValue, prefix: string): Promise<string | null> =>
  image.blob ? uploadImage(image.blob, prefix) : image.url;

const nullable = (v: string) => (v.trim() ? v.trim() : null);

/** Upload any pending images, then build the full row payload (all columns, including migration ones). */
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
      price: item.price.trim(),
      image: await resolveImage(item.image, "layanan"),
    });
  }

  const prestasi_items = values.prestasi
    .filter((p) => p.title.trim())
    .map((p) => ({ title: p.title.trim(), organizer: p.organizer.trim(), year: p.year.trim() }));

  return {
    nama_sanggar: values.nama_sanggar.trim(),
    grade: nullable(values.grade),
    tagline: nullable(values.tagline),
    jenis_tarian: nullable(values.jenis_tarian),
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

export interface SaveResult {
  id: number | string;
  /** Columns that could not be saved because they don't exist in the database yet */
  skipped: string[];
}

/**
 * Insert or update a sanggar. Columns missing from the database are left out (and reported) instead of
 * failing the whole save, so the form works before and after the migration is applied.
 */
export async function saveSanggar(
  id: number | string | null,
  payload: Record<string, unknown>,
  knownColumns: Set<string> | null
): Promise<SaveResult> {
  const body = { ...payload };
  const skipped: string[] = [];

  if (knownColumns) {
    for (const column of Object.keys(body)) {
      if (!knownColumns.has(column)) {
        delete body[column];
        skipped.push(column);
      }
    }
  }

  // Safety net when columns couldn't be detected up front: drop the column PostgREST rejects and retry
  for (let attempt = 0; attempt < 12; attempt++) {
    const query = id === null
      ? supabase.from(SANGGAR_TABLE).insert([body]).select("id").single()
      : supabase.from(SANGGAR_TABLE).update(body).eq("id", id).select("id").single();
    const { data, error } = await query;

    if (!error) return { id: data?.id ?? id!, skipped };

    const missing = error.code === "PGRST204" ? /'([^']+)' column/.exec(error.message)?.[1] : undefined;
    if (missing && missing in body) {
      delete body[missing];
      skipped.push(missing);
      continue;
    }
    throw new Error(error.message);
  }
  throw new Error("Gagal menyimpan data sanggar.");
}

export async function deleteSanggar(id: number | string): Promise<void> {
  const { error } = await supabase.from(SANGGAR_TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
