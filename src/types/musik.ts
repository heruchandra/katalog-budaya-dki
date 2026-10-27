/** Seniman Musik sub-category: a music group / community, or an individual musician */
export type MusikCategory = "komunitas" | "pemusik";

/** The two Seniman Musik categories as shown in the admin and the catalog, and stored in pemusiks.jenis_seniman */
export type KategoriMusik = "Komunitas Musik" | "Pemusik";

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

/** An achievement: a plain line, or with its organizer / year (shown as a year badge) */
export type MusikPrestasi = string | { title: string; organizer?: string; year?: string };

export interface MusikPhoto {
  url: string;
  caption: string;
  captionEn?: string;
  /** Planned slot: the file at `url` hasn't been uploaded yet, so a placeholder is shown instead */
  pending?: boolean;
  /** Shown when `url` can't be loaded (not uploaded yet); a placeholder when this fails too */
  fallbackUrl?: string;
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
  /** Administrative city set in the admin (otherwise derived from the address) */
  wilayah?: string;
  /** Leader (komunitas) */
  ketua?: string;
  /** Contact person, when different from the leader */
  pic?: string;
  nomorKontak: string[];
  /** The number that is on WhatsApp, when it isn't the first of `nomorKontak` (all numbers stay on display) */
  nomorWhatsapp?: string;
  email?: string;
  sosialMedia: SosialMedia[];
  genre: string[];
  jenisMusik: string[];
  /** Instruments played by the community (instrumen dimainkan) / mastered by the musician (instrumen dikuasai) */
  instrumen: string[];
  /** The registration lists more instruments than named ("dll."): shown as "and others" */
  instrumenLainnya?: boolean;
  /** Number of members (komunitas) */
  jumlahAnggota?: number;
  karyaUnggulan: KaryaUnggulan[];
  pengalamanBerkesenian: string[];
  layanan: string[];
  prestasi: MusikPrestasi[];
  /** Profile photo / logo (images/musik/<slug>/profile/); a placeholder is shown without one */
  fotoProfil?: string;
  /** Catalog card photo, when it isn't simply the first gallery photo */
  fotoCard?: string;
  fotoGallery: MusikPhoto[];
  /** true when the photos are illustrations, not photos of this entry itself (shown with a "Foto ilustrasi" note) */
  isDummyMedia: boolean;
  /** Video demo: a video file (site path such as /images/musik/<slug>/video/video.mp4, or a .mp4 / .webm URL)
   *  played natively, or a YouTube watch / youtu.be URL shown as an embed */
  videoUrl?: string;
  /** Poster thumbnail for a video file (defaults to the profile photo, then the card photo) */
  videoPoster?: string;
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
  /** WhatsApp number (62…) for the card quick action, when a contact number is on record */
  waNumber?: string;
  /** YouTube video, or the channel / channel search, for the card "Tonton" quick action */
  youtubeUrl?: string;
  /** Direct YouTube link alias */
  youtube?: string;
  /** Extra text the catalog search matches on */
  searchText: string;
}
