/** Seniman Musik sub-category: a music group / community, or an individual musician */
export type MusikCategory = "komunitas" | "pemusik";

export type SosialPlatform = "instagram" | "tiktok" | "facebook" | "youtube";

export interface SosialMedia {
  platform: SosialPlatform;
  /** As written in the registration form, e.g. "@kombes.gksl" or a channel name */
  handle: string;
  /** Profile URL when the handle maps to one exactly; otherwise a search URL for the handle (see `isSearch`) */
  url?: string;
  /** true when `url` is a platform search for `handle` (no exact profile link was given) */
  isSearch?: boolean;
}

export interface KaryaUnggulan {
  judul: string;
  deskripsi?: string;
  tahun?: string;
  durasi?: string;
  /** Recording / documentation link */
  link?: string;
}

export interface MusikPhoto {
  url: string;
  caption: string;
  captionEn?: string;
}

/** Full profile of a Seniman Musik entry (komunitas or pemusik), as submitted in the registration documents */
export interface MusikEntity {
  /** URL id: the `pemusiks` row id when the entry exists in the database, otherwise a slug */
  id: string;
  category: MusikCategory;
  nama: string;
  /** Stage name (pemusik) or performing / ensemble name (komunitas) */
  namaPanggung?: string;
  /** Year founded (komunitas) */
  tahunBerdiri?: number;
  /** Active since (pemusik) */
  tahunAktif?: string;
  /** Biography / profile, one string per paragraph */
  deskripsi: string[];
  alamat?: string;
  /** Leader (komunitas) */
  ketua?: string;
  /** Contact person, when different from the leader */
  pic?: string;
  nomorKontak: string[];
  email?: string;
  sosialMedia: SosialMedia[];
  genre: string[];
  jenisMusik: string[];
  /** Instruments played by the community (instrumen dimainkan) / mastered by the musician (instrumen dikuasai) */
  instrumen: string[];
  /** Number of members (komunitas) */
  jumlahAnggota?: number;
  karyaUnggulan: KaryaUnggulan[];
  pengalamanBerkesenian: string[];
  layanan: string[];
  prestasi: string[];
  fotoGallery: MusikPhoto[];
  /** true when the photos are illustrations, not photos of this entry itself (shown with a "Foto ilustrasi" note) */
  isDummyMedia: boolean;
  /** YouTube video (watch or youtu.be URL) for the video demo slot */
  videoUrl?: string;
}

/** What a catalog card needs (built from MusikEntity or from a bare `pemusiks` row) */
export interface MusikCardData {
  id: string;
  category: MusikCategory;
  nama: string;
  namaPanggung?: string;
  /** Genre / jenis musik line */
  subtitle?: string;
  instrumen?: string;
  /** Card photo: only a photo of this entry itself (illustration photos stay on the detail page, labelled) */
  foto?: string;
  isDummyMedia: boolean;
  /** Has a full profile from the master data (listed first in the catalog) */
  hasProfile: boolean;
  alamat?: string;
  /** Administrative city from the address, or null when unknown (never guessed) */
  wilayah: string | null;
  /** Extra text the catalog search matches on */
  searchText: string;
}
