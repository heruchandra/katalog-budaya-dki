import { deleteRow, getTableColumns, saveRow, uploadImage } from "@/lib/adminDb";
import { toWaNumber } from "@/lib/phone";
import { resolveWilayah } from "@/lib/wilayah";
import { splitYear } from "@/components/ExperienceList";
import type { MusikEntity, SosialPlatform } from "@/types/musik";
import type { PemusikRow } from "@/lib/pemusikStats";
import {
  KATEGORI_MUSIK_OPTIONS,
  KATEGORI_OF,
  PemusikKaryaItem,
  PemusikPengalamanItem,
  PemusikPrestasiItem,
  isDraftRow,
  normalizeKategori,
  parsePemusikGaleri,
  parsePemusikKarya,
  parsePemusikLayanan,
  parsePemusikPengalaman,
  parsePemusikPrestasi,
  splitPhoneList,
} from "@/lib/pemusikData";
import { STATUS_OPTIONS, type GalleryFormItem, type ImageValue, type SanggarStatus } from "@/lib/sanggarAdmin";

export { KATEGORI_MUSIK_OPTIONS, STATUS_OPTIONS, isDraftRow };
export type { PemusikRow };

export const PEMUSIK_TABLE = "pemusiks";
export const PEMUSIK_MIGRATION_FILE = "supabase/migrations/20261013_admin_pemusik_fields.sql";

/** Columns created by the Seniman Musik migration, with the form label they belong to */
export const PEMUSIK_MIGRATION_COLUMNS: Record<string, string> = {
  nama_panggung: "Nama Panggung / Grup",
  wilayah: "Wilayah",
  status: "Status",
  tahun_berdiri: "Tahun Berdiri / Aktif",
  jumlah_anggota: "Jumlah Anggota",
  ketua: "Ketua",
  nama_pic: "Nama PIC",
  jenis_musik: "Jenis Musik",
  kontak: "Nomor Kontak",
  whatsapp: "Nomor WhatsApp",
  email: "Email",
  instagram: "Instagram",
  youtube_url: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  alamat: "Alamat",
  logo_url: "Logo / Foto Profil",
  foto_card_url: "Foto Cover Card",
  galeri: "Galeri Foto",
  video_url: "Video Penampilan",
  layanan_items: "Layanan",
  karya_items: "Karya Unggulan",
  prestasi_items: "Prestasi",
  pengalaman_items: "Pengalaman Berkesenian",
};

export interface PemusikFormValues {
  // Tab 1: Informasi Utama
  nama_seniman: string;
  nama_panggung: string;
  kategori: string;
  wilayah: string;
  status: SanggarStatus;
  tahun_berdiri: string;
  jumlah_anggota: string;
  ketua: string;
  nama_pic: string;
  jenis_musik: string;
  genre_musik: string;
  instrumen: string;
  deskripsi: string;
  // Tab 2: Kontak & Sosial Media
  kontak: string;
  whatsapp: string;
  email: string;
  instagram: string;
  youtube_url: string;
  tiktok: string;
  facebook: string;
  alamat: string;
  // Tab 3: Media & Galeri
  logo: ImageValue;
  foto_card: ImageValue;
  galeri: GalleryFormItem[];
  video_url: string;
  // Tab 4: Layanan & Karya
  layanan: string[];
  karya: PemusikKaryaItem[];
  prestasi: PemusikPrestasiItem[];
  // Tab 5: Pengalaman Berkesenian
  pengalaman: PemusikPengalamanItem[];
}

export const EMPTY_PEMUSIK_FORM: PemusikFormValues = {
  nama_seniman: "",
  nama_panggung: "",
  kategori: "",
  wilayah: "",
  status: "terverifikasi",
  tahun_berdiri: "",
  jumlah_anggota: "",
  ketua: "",
  nama_pic: "",
  jenis_musik: "",
  genre_musik: "",
  instrumen: "",
  deskripsi: "",
  kontak: "",
  whatsapp: "",
  email: "",
  instagram: "",
  youtube_url: "",
  tiktok: "",
  facebook: "",
  alamat: "",
  logo: { url: null },
  foto_card: { url: null },
  galeri: [],
  video_url: "",
  layanan: [],
  karya: [],
  prestasi: [],
  pengalaman: [],
};

const str = (v: unknown) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");

export function pemusikRowToForm(row: PemusikRow): PemusikFormValues {
  return {
    nama_seniman: str(row.nama_seniman),
    nama_panggung: str(row.nama_panggung),
    kategori: normalizeKategori(row.jenis_seniman),
    wilayah: str(row.wilayah),
    status: isDraftRow(row) ? "draft" : "terverifikasi",
    tahun_berdiri: str(row.tahun_berdiri),
    jumlah_anggota: row.jumlah_anggota ? String(row.jumlah_anggota) : "",
    ketua: str(row.ketua),
    nama_pic: str(row.nama_pic),
    jenis_musik: str(row.jenis_musik),
    genre_musik: str(row.genre_musik),
    instrumen: str(row.instrumen),
    deskripsi: str(row.deskripsi),
    kontak: str(row.kontak),
    whatsapp: str(row.whatsapp),
    email: str(row.email),
    instagram: str(row.instagram),
    youtube_url: str(row.youtube_url),
    tiktok: str(row.tiktok),
    facebook: str(row.facebook),
    alamat: str(row.alamat),
    logo: { url: str(row.logo_url) || null },
    foto_card: { url: str(row.foto_card_url) || null },
    galeri: parsePemusikGaleri(row).map((g) => ({ url: g.url, caption: g.caption })),
    video_url: str(row.video_url),
    layanan: parsePemusikLayanan(row),
    karya: parsePemusikKarya(row),
    prestasi: parsePemusikPrestasi(row),
    pengalaman: parsePemusikPengalaman(row),
  };
}

/** Form values from a master-data profile (src/data/musikData.ts). Illustration photos are left out, so they are
 *  never saved as the entry's own photos. */
export function masterToForm(m: MusikEntity): PemusikFormValues {
  const social = (platform: SosialPlatform) => {
    const s = m.sosialMedia.find((x) => x.platform === platform);
    return s ? (s.isSearch || !s.url ? s.handle : s.url) : "";
  };
  const ownPhotos = !m.isDummyMedia;
  return {
    ...EMPTY_PEMUSIK_FORM,
    nama_seniman: m.nama,
    nama_panggung: m.namaPanggung ?? "",
    kategori: KATEGORI_OF[m.category],
    wilayah: m.wilayah ?? resolveWilayah({ alamat: m.alamat }) ?? "",
    tahun_berdiri: m.tahunBerdiri ? String(m.tahunBerdiri) : m.tahunAktif ?? "",
    jumlah_anggota: m.jumlahAnggota ? String(m.jumlahAnggota) : "",
    ketua: m.ketua ?? "",
    nama_pic: m.pic ?? "",
    jenis_musik: m.jenisMusik.join(", "),
    genre_musik: m.genre.join(", "),
    instrumen: m.instrumen.join(", "),
    deskripsi: m.deskripsi.join("\n\n"),
    kontak: m.nomorKontak.join(" / "),
    whatsapp: m.nomorWhatsapp ?? "",
    email: m.email ?? "",
    instagram: social("instagram"),
    youtube_url: social("youtube"),
    tiktok: social("tiktok"),
    facebook: social("facebook"),
    alamat: m.alamat ?? "",
    logo: { url: m.fotoProfil ?? null },
    foto_card: { url: ownPhotos ? m.fotoCard ?? null : null },
    galeri: ownPhotos ? m.fotoGallery.filter((p) => !p.pending).map((p) => ({ url: p.url, caption: p.caption })) : [],
    video_url: m.videoUrl ?? "",
    layanan: [...m.layanan],
    karya: m.karyaUnggulan.map((k) => ({ judul: k.judul, deskripsi: k.deskripsi ?? "", tahun: k.tahun ?? "", link: k.link ?? "" })),
    prestasi: m.prestasi.map((p) => (typeof p === "string" ? { title: p, organizer: "", year: "" } : { title: p.title, organizer: p.organizer ?? "", year: p.year ?? "" })),
    pengalaman: m.pengalamanBerkesenian.map((line) => {
      const { text, year } = splitYear(line);
      return { kegiatan: text, tahun: year ?? "" };
    }),
  };
}

const isEmptyValue = (v: unknown) =>
  v === "" || (Array.isArray(v) && v.length === 0) || (!!v && typeof v === "object" && "url" in v && !(v as ImageValue).url);

/**
 * The row's values, with every field the row leaves empty taken from the master profile (what the public page
 * shows today). Returns the keys that were filled in, so the form can say where they came from.
 */
export function fillFromMaster(fromRow: PemusikFormValues, master: PemusikFormValues) {
  const values = { ...fromRow };
  const filled: (keyof PemusikFormValues)[] = [];
  for (const key of Object.keys(master) as (keyof PemusikFormValues)[]) {
    if (isEmptyValue(values[key]) && !isEmptyValue(master[key])) {
      (values as Record<string, unknown>)[key] = master[key];
      filled.push(key);
    }
  }
  return { values, filled };
}

/**
 * The WhatsApp number to save, as 62…: the WhatsApp field, else the first of the contact numbers (a field holding
 * two numbers, "0813… / 0859…", yields the first). Empty when neither has a number.
 */
export const whatsappOf = (values: Pick<PemusikFormValues, "whatsapp" | "kontak">) => toWaNumber(values.whatsapp || values.kontak);

/**
 * What was typed for WhatsApp (the WhatsApp field, else the first contact number), normalised to 62… even when it
 * is too short or too long to be a real number, so the form flags it instead of silently saving no number
 */
export function typedWaDigits(values: Pick<PemusikFormValues, "whatsapp" | "kontak">): string {
  const first = splitPhoneList(values.whatsapp.trim() || values.kontak)[0] ?? "";
  const digits = first.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

/** A usable Indonesian WhatsApp number: 62 followed by 8–13 digits */
export const isValidWaNumber = (wa: string) => /^62\d{8,13}$/.test(wa);

const nullable = (v: string) => (v.trim() ? v.trim() : null);

/** Upload any pending images, then build the full row payload (all columns, including the migration ones). */
export async function buildPemusikPayload(values: PemusikFormValues): Promise<Record<string, unknown>> {
  const resolve = (image: ImageValue, prefix: string) => (image.blob ? uploadImage(image.blob, prefix, "musik") : Promise.resolve(image.url));
  const [logo_url, foto_card_url] = await Promise.all([resolve(values.logo, "logo"), resolve(values.foto_card, "card")]);

  const galeri: { url: string; caption: string }[] = [];
  for (const item of values.galeri) {
    const url = await resolve(item, "galeri");
    if (url) galeri.push({ url, caption: item.caption.trim() });
  }

  const pengalaman_items = values.pengalaman
    .filter((p) => p.kegiatan.trim())
    .map((p) => ({ kegiatan: p.kegiatan.trim(), tahun: p.tahun.trim() }));
  const anggota = parseInt(values.jumlah_anggota, 10);
  const whatsapp = whatsappOf(values);

  return {
    nama_seniman: values.nama_seniman.trim(),
    jenis_seniman: nullable(values.kategori),
    genre_musik: nullable(values.genre_musik),
    instrumen: nullable(values.instrumen),
    deskripsi: nullable(values.deskripsi),
    // legacy text column, one line per item: keeps the experience list when the migration isn't run yet
    pengalaman: pengalaman_items.length ? pengalaman_items.map((p) => (p.tahun ? `${p.kegiatan} ${p.tahun}` : p.kegiatan)).join("\n") : null,
    // (migration) columns
    nama_panggung: nullable(values.nama_panggung),
    wilayah: nullable(values.wilayah),
    status: values.status,
    tahun_berdiri: nullable(values.tahun_berdiri),
    jumlah_anggota: Number.isFinite(anggota) && anggota > 0 ? anggota : null,
    ketua: nullable(values.ketua),
    nama_pic: nullable(values.nama_pic),
    jenis_musik: nullable(values.jenis_musik),
    kontak: nullable(values.kontak),
    whatsapp: whatsapp || null,
    email: nullable(values.email),
    instagram: nullable(values.instagram),
    youtube_url: nullable(values.youtube_url),
    tiktok: nullable(values.tiktok),
    facebook: nullable(values.facebook),
    alamat: nullable(values.alamat),
    logo_url,
    foto_card_url,
    galeri,
    video_url: nullable(values.video_url),
    layanan_items: values.layanan.map((l) => l.trim()).filter(Boolean),
    karya_items: values.karya
      .filter((k) => k.judul.trim())
      .map((k) => ({ judul: k.judul.trim(), deskripsi: k.deskripsi.trim(), tahun: k.tahun.trim(), link: k.link.trim() })),
    prestasi_items: values.prestasi
      .filter((p) => p.title.trim())
      .map((p) => ({ title: p.title.trim(), organizer: p.organizer.trim(), year: p.year.trim() })),
    pengalaman_items,
  };
}

export const getPemusikColumns = () => getTableColumns(PEMUSIK_TABLE);

export const savePemusik = (id: number | string | null, payload: Record<string, unknown>, knownColumns: Set<string> | null) =>
  saveRow(PEMUSIK_TABLE, id, payload, knownColumns);

export const deletePemusik = (id: number | string) => deleteRow(PEMUSIK_TABLE, id);
