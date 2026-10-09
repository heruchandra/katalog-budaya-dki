import type { MusikCardData, MusikCategory, MusikEntity } from "@/types/musik";
import type { PemusikRow } from "@/lib/pemusikStats";
import { youTubeId } from "@/lib/video";
import { toWaNumber } from "@/lib/phone";

// re-exported: pages import the WhatsApp number helper from here
export { toWaNumber };
import { resolveWilayah } from "@/lib/wilayah";

/**
 * Seniman Musik master data from the registration documents (formulir pendaftaran) of each entry.
 * An entry whose `id` matches a `pemusiks` row is merged with that row; the others are listed from here only.
 *
 * Komunitas Betawi Section: complete, from the community's registration document.
 * TODO (Sumitra Adi Kusuma): the description is cut short in the source brief ("…"); replace it with the full text.
 * Pengalaman berkesenian and layanan were not included for him and are left empty (sections stay hidden).
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
      "Komunitas Betawi Section merupakan perkumpulan musisi Betawi yang mengulas kembali lagu-lagu Dalem yang hampir punah. Anggota yang tergabung di komunitas ini adalah anak-anak dari berbagai grup Gambang Kromong yang ada di Jakarta dan sekitarnya.",
    ],
    alamat: "Jl. Raya Hankam TMII RT.01 RW.02, Kelurahan Ceger, Kecamatan Cipayung, Jakarta Timur",
    ketua: "Sumitra Adi Kusuma",
    nomorKontak: ["081384071949", "085939836744"],
    // the WhatsApp line (the first number isn't on WhatsApp); both numbers stay on display
    nomorWhatsapp: "085939836744",
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
    jenisMusik: ["Gambang Kromong Classic", "Gambang Kromong Modern", "Tanjidor", "Nusantara"],
    instrumen: [
      "Gambang", "Kromong", "Kongahyan", "Tehyan", "Jihyan", "Sukong", "Samhyan", "Ciotaw", "Gendang", "Kecrek",
      "Gambang Besi", "Gong Enam", "Selukat", "Kemor", "Perkusi", "Drum", "Brass Section", "Suling",
    ],
    instrumenLainnya: true,
    karyaUnggulan: [
      {
        judul: "Jakarta Dulu",
        deskripsi:
          "Sebuah karya musik yang mengangkat tentang wajah Jakarta pada masa lampau ketika kehidupan kota terasa lebih sederhana. Melalui perpaduan nuansa musik Betawi, karya ini menggambarkan suasana di kampung pada jaman dahulu sebelum era pembangunan.",
      },
    ],
    pengalamanBerkesenian: [
      "Pagelaran kesenian budaya tradisional Betawi 2025 di Setu Babakan",
      "Pagelaran kesenian budaya tradisional Betawi 2026 di Setu Babakan",
      "Abang None Kepulauan Seribu 2026",
      "Perayaan Shejit Y.M Kongco Cheng Goan Cheng Kun dan Y.M Kongco Thian Kauw Ciong Kun di Vihara Dharma Jaya Toasebio 2026",
      "Pengiring musik Belajar Bersama Maestro Jaja Mihardja 2026",
    ],
    layanan: [
      "Pertunjukan musik tradisional untuk acara formal maupun nonformal",
      "Pengisi acara pada kegiatan budaya, festival, seminar, dan kegiatan masyarakat",
      "Workshop dan pelatihan musik tradisional bagi pelajar, mahasiswa, maupun masyarakat umum",
      "Edukasi dan pengenalan musik tradisional Betawi",
      "Kolaborasi musik dengan komunitas seni, musisi, sekolah, perguruan tinggi, dan lembaga kebudayaan",
      "Dokumentasi dan pertunjukan karya musik tradisional",
      "Pengembangan serta pelestarian seni dan musik tradisional melalui kegiatan kreatif dan pertunjukan",
    ],
    prestasi: ["Juara Pertama Lomba Aransemen Lagu Gambang Kromong Tingkat Nasional"],
    // Upload folders: /images/musik/komunitas-betawi-section/profile/ and /images/musik/komunitas-betawi-section/galeri/. Until a file is there, the page falls back gracefully:
    // initials instead of the profile photo, the community's existing performance photo for galeri-1, a placeholder
    // slide for the others.
    fotoProfil: "/images/musik/komunitas-betawi-section/profile/profile-komunitas-betawi-section.webp",
    // The banner in this photo reads "Orkes Gambang Kromong Suara Lama": the community itself
    fotoCard: "/images/musik/komunitas-betawi-section/card/card.webp",
    // Upload folder /images/musik/komunitas-betawi-section/video/; until video.mp4 is there the page shows the
    // "not available yet" placeholder (with the channel link). The poster is the profile photo.
    videoUrl: "/images/musik/komunitas-betawi-section/video/video.mp4",
    fotoGallery: [
      { url: "/images/musik/komunitas-betawi-section/galeri/galeri-1.webp", fallbackUrl: "/images/musik/komunitas-betawi-section/card/card.webp", caption: "Dokumentasi Komunitas Betawi Section", captionEn: "Komunitas Betawi Section documentation" },
      { url: "/images/musik/komunitas-betawi-section/galeri/galeri-2.webp", caption: "Dokumentasi Komunitas Betawi Section", captionEn: "Komunitas Betawi Section documentation" },
      { url: "/images/musik/komunitas-betawi-section/galeri/galeri-3.webp", caption: "Dokumentasi Komunitas Betawi Section", captionEn: "Komunitas Betawi Section documentation" },
      { url: "/images/musik/komunitas-betawi-section/galeri/galeri-4.webp", caption: "Dokumentasi Komunitas Betawi Section", captionEn: "Komunitas Betawi Section documentation" },
      { url: "/images/musik/komunitas-betawi-section/galeri/galeri-5.webp", caption: "Dokumentasi Komunitas Betawi Section", captionEn: "Komunitas Betawi Section documentation" },
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
    // No photo of Sumitra himself yet (his own folder, images/musik/sumitra-adi-kusuma/, is for when one arrives):
    // the community he leads, marked as an illustration
    fotoGallery: [
      {
        url: "/images/musik/komunitas-betawi-section/card/card.webp",
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
    foto: m.isDummyMedia ? undefined : m.fotoCard ?? m.fotoGallery.find((p) => !p.pending)?.url,
    isDummyMedia: m.isDummyMedia,
    hasProfile: !!findMusikMaster(m.id),
    alamat: m.alamat,
    wilayah: resolveWilayah({ alamat: m.alamat }),
    waNumber: waNumberOf(m) || undefined,
    // the card's "Tonton" button opens YouTube: a YouTube demo video, else the YouTube account (a video file
    // plays on the detail page instead)
    youtubeUrl: (youTubeId(m.videoUrl) ? m.videoUrl : undefined) || m.sosialMedia.find((s) => s.platform === "youtube")?.url,
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
/** The entry's WhatsApp number: its designated WhatsApp line, else its first contact number */
export function waNumberOf(m: Pick<MusikEntity, "nomorWhatsapp" | "nomorKontak">) {
  return toWaNumber(m.nomorWhatsapp || m.nomorKontak[0]);
}
