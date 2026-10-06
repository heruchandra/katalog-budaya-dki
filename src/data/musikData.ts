import type { MusikCardData, MusikCategory, MusikEntity } from "@/types/musik";
import type { PemusikRow } from "@/lib/pemusikStats";
import { resolveWilayah } from "@/lib/wilayah";

/**
 * Seniman Musik master data from the registration documents (formulir pendaftaran) of each entry.
 * An entry whose `id` matches a `pemusiks` row is merged with that row; the others are listed from here only.
 *
 * TODO: the two descriptions below are cut short in the source brief ("…"); replace them with the full text
 * from the registration documents. Pengalaman berkesenian and layanan were not included and are left empty
 * (their sections stay hidden until filled).
 */
export const MUSIK_MASTER_DATA: MusikEntity[] = [
  {
    id: "betawi-section",
    category: "komunitas",
    nama: "Komunitas Betawi Section",
    namaPanggung: "Orkes Gambang Kromong Suara Lama",
    tahunBerdiri: 2015,
    jumlahAnggota: 150,
    deskripsi: [
      "Komunitas Betawi Section merupakan perkumpulan musisi Betawi yang mengulas kembali lagu-lagu Dalem yang hampir punah.",
    ],
    alamat: "Jl. Raya Hankam TMII RT.01 RW.02, Kelurahan Ceger, Kecamatan Cipayung, Jakarta Timur",
    ketua: "Sumitra Adi Kusuma",
    nomorKontak: ["081384071949", "085939836744"],
    email: "sumitraadikusuma12@gmail.com",
    sosialMedia: [
      { platform: "instagram", handle: "@Kombes.gksl", url: "https://www.instagram.com/kombes.gksl" },
      { platform: "tiktok", handle: "@Kombes.gksl", url: "https://www.tiktok.com/@kombes.gksl" },
      { platform: "facebook", handle: "Kombes gksl", url: "https://www.facebook.com/search/top?q=Kombes%20gksl", isSearch: true },
      {
        platform: "youtube",
        handle: "Orkes Gambang Kromong Suara Lama",
        url: "https://www.youtube.com/results?search_query=Orkes+Gambang+Kromong+Suara+Lama",
        isSearch: true,
      },
    ],
    genre: [],
    jenisMusik: ["Gambang Kromong Klasik", "Gambang Kromong Modern", "Tanjidor", "Nusantara"],
    instrumen: [
      "Gambang", "Kromong", "Kongahyan", "Tehyan", "Jihyan", "Sukong", "Samhyan", "Ciotaw", "Gendang", "Kecrek",
      "Gambang Besi", "Gong Enam", "Selukat", "Kemor", "Perkusi", "Drum", "Brass Section", "Suling",
    ],
    karyaUnggulan: [{ judul: "Jakarta Dulu" }],
    pengalamanBerkesenian: [],
    layanan: [],
    prestasi: ["Juara Pertama Lomba Aransemen Lagu Gambang Kromong Tingkat Nasional"],
    // The banner in this photo reads "Orkes Gambang Kromong Suara Lama": a photo of the community itself
    fotoGallery: [
      {
        url: "/dinamis-musik-4.webp",
        caption: "Penampilan Orkes Gambang Kromong Suara Lama",
        captionEn: "Orkes Gambang Kromong Suara Lama performing",
      },
    ],
    isDummyMedia: false,
  },
  {
    // pemusiks row 1
    id: "1",
    category: "pemusik",
    nama: "Sumitra Adi Kusuma",
    namaPanggung: "Mitra",
    deskripsi: [
      "Sumitra Adi Kusuma, yang dikenal dengan nama panggung Mitra, merupakan seniman musik yang memiliki kepedulian kuat terhadap pelestarian musik tradisi Betawi.",
    ],
    alamat: "Jl. Buni Gg. Mangga RT.02 RW.04, Kelurahan Munjul, Kecamatan Cipayung, Jakarta Timur",
    nomorKontak: ["081384071940", "085939836744"],
    email: "sumitraadikusuma12@gmail.com",
    sosialMedia: [
      { platform: "instagram", handle: "@Sumitraadi", url: "https://www.instagram.com/sumitraadi" },
      {
        platform: "facebook",
        handle: "Sumitra Adi Kusuma Tohir",
        url: "https://www.facebook.com/search/top?q=Sumitra%20Adi%20Kusuma%20Tohir",
        isSearch: true,
      },
      { platform: "tiktok", handle: "@Sumitraadikusuma", url: "https://www.tiktok.com/@sumitraadikusuma" },
    ],
    genre: ["All Genre"],
    jenisMusik: [],
    instrumen: [
      "Gambang Kromong", "Samhyan", "Kongahyan", "Tehyan", "Jihyan", "Sukong", "Trombone", "Conga & Bongo",
      "Vokal Tradisi Betawi",
    ],
    karyaUnggulan: [
      {
        judul: "Jawara Ngotek",
        deskripsi: "Gambang Kromong kekinian",
        tahun: "2019",
        durasi: "7 menit",
        link: "https://drive.google.com/drive/folders/1CN6v_RaBA4NSifQMRmjhRoqYhkdlzt00?usp=sharing",
      },
    ],
    pengalamanBerkesenian: [],
    layanan: [],
    prestasi: ["Pemain Tehyan Terbaik 2019", "Penata Musik Terbaik 2019", "Penata Musik Terbaik Parade Musik TMII 2022"],
    // No photo of Sumitra himself yet: the community he leads, marked as an illustration
    fotoGallery: [
      {
        url: "/dinamis-musik-4.webp",
        caption: "Foto ilustrasi: penampilan Orkes Gambang Kromong Suara Lama, komunitas yang dipimpin Sumitra",
        captionEn: "Illustration: Orkes Gambang Kromong Suara Lama, the community Sumitra leads",
      },
    ],
    isDummyMedia: true,
  },
];

export const findMusikMaster = (id: string) => MUSIK_MASTER_DATA.find((m) => m.id === id);

/** Sub-category of a bare `pemusiks` row, from its jenis_seniman ("Solo", "Komunitas", "Grup", …) */
export function categoryOfRow(row: Pick<PemusikRow, "jenis_seniman">): MusikCategory {
  return /komunitas|grup|group|orkes|kelompok|sanggar|band|ensemble/i.test(row.jenis_seniman || "") ? "komunitas" : "pemusik";
}

const splitList = (value?: string | null) =>
  (value || "")
    .split(/[,/]|\s&\s|\sdan\s/i)
    .map((s) => s.trim())
    .filter(Boolean);

/** Profile for a bare `pemusiks` row (no master data): whatever the row has */
export function profileFromRow(row: PemusikRow): MusikEntity {
  return {
    id: String(row.id),
    category: categoryOfRow(row),
    nama: row.nama_seniman,
    deskripsi: row.deskripsi ? row.deskripsi.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : [],
    nomorKontak: [],
    sosialMedia: [],
    genre: splitList(row.genre_musik),
    jenisMusik: [],
    instrumen: splitList(row.instrumen),
    karyaUnggulan: [],
    pengalamanBerkesenian: row.pengalaman ? [row.pengalaman] : [],
    layanan: [],
    prestasi: [],
    fotoGallery: [],
    isDummyMedia: false,
  };
}

/** Master data, with gaps filled from the database row when there is one */
export function mergeProfile(master: MusikEntity | undefined, row: PemusikRow | null): MusikEntity | null {
  if (!master) return row ? profileFromRow(row) : null;
  if (!row) return master;
  const fromRow = profileFromRow(row);
  return {
    ...master,
    deskripsi: master.deskripsi.length ? master.deskripsi : fromRow.deskripsi,
    genre: master.genre.length ? master.genre : fromRow.genre,
    instrumen: master.instrumen.length ? master.instrumen : fromRow.instrumen,
    pengalamanBerkesenian: master.pengalamanBerkesenian.length ? master.pengalamanBerkesenian : fromRow.pengalamanBerkesenian,
  };
}

export function toCardData(m: MusikEntity): MusikCardData {
  const subtitle = [...m.jenisMusik, ...m.genre].join(", ");
  return {
    id: m.id,
    category: m.category,
    nama: m.nama,
    namaPanggung: m.namaPanggung,
    subtitle: subtitle || undefined,
    instrumen: m.instrumen.join(", ") || undefined,
    // An illustration as the card photo would make two different entries look like the same one
    foto: m.isDummyMedia ? undefined : m.fotoGallery[0]?.url,
    isDummyMedia: m.isDummyMedia,
    hasProfile: !!findMusikMaster(m.id),
    alamat: m.alamat,
    wilayah: resolveWilayah({ alamat: m.alamat }),
    searchText: [m.nama, m.namaPanggung, subtitle, m.instrumen.join(" ")].filter(Boolean).join(" ").toLowerCase(),
  };
}

/** Catalog list: every database row (merged with its master data) plus master entries not in the database */
export function buildMusikCatalog(rows: PemusikRow[]): MusikCardData[] {
  const rowIds = new Set(rows.map((r) => String(r.id)));
  const fromRows = rows.map((row) => mergeProfile(findMusikMaster(String(row.id)), row)!);
  const masterOnly = MUSIK_MASTER_DATA.filter((m) => !rowIds.has(m.id));
  return [...masterOnly, ...fromRows].map(toCardData);
}

/** WhatsApp number (62…) from the first contact number, for wa.me links */
export function toWaNumber(phone?: string) {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}
