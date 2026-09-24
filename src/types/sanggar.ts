export interface Sanggar {
  id: string;
  nama_sanggar?: string;
  name?: string;
  nama_pimpinan?: string;
  leader?: string;
  grade?: string;
  alamat?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota_kab?: string;
  wilayah?: string;
  no_hp?: string;
  kontak_pic?: string;
  whatsapp?: string;
  whatsappNumber?: string;
  whatsappUrl?: string;
  instagram?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  youtube?: string;
  jenis_tarian?: string;
  thumbnail_url?: string | null;
  coverImage?: string;
  image?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
  icon?: string;
}

export interface TariItem {
  name: string;
  description?: string;
  image?: string;
  choreographer?: string;
  composer?: string;
  synopsis?: string;
}

export interface DanceSpecialtyItem {
  name: string;
  choreographer?: string;
  composer?: string;
  synopsis: string;
  image?: string;
}

export interface SanggarContacts {
  phone: string[];
  whatsapp?: string;
  instagram: string;
  youtube: string;
}

export interface SanggarItem {
  id: string;
  name: string;
  leader: string;
  tagline: string;
  description: string;
  descriptionEn?: string;
  address: string;
  logo: string;
  image?: string;
  coverImage?: string;
  thumbnail?: string;
  youtubeUrl?: string;
  whatsappUrl?: string;
  instagramUrl?: string;
  grade: string;
  services: ServiceItem[];
  danceSpecialties: DanceSpecialtyItem[];
  achievements: string[];
  contacts: SanggarContacts;
}

