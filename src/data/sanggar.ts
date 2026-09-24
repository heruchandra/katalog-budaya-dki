export interface ServiceItem {
  title: string;
  description: string;
}

export interface DanceSpecialtyItem {
  name: string;
  choreographer?: string;
  composer?: string;
  synopsis: string;
  image?: string;
}

export interface TariItem {
  name: string;
  description?: string;
  image?: string;
  choreographer?: string;
  composer?: string;
  synopsis?: string;
}

export interface SanggarItem {
  id: string;
  name: string;
  leader: string;
  tagline: string;
  description: string;
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
  contacts: {
    phone: string[];
    whatsapp?: string;
    instagram: string;
    youtube: string;
  };
}

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

export const SINAR_NORRAY_DATA: SanggarItem = {
  id: "sinar-norray",
  name: "Sinar Norray",
  leader: "Engkar Karmilasari (Engkar Nori)",
  tagline: "Orang Nya Boleh Mati, Tapi Seni Nya Kaga Boleh Sampe mati",
  description: "Sinar Norray Art Studio was established in 1995 by the late Hj. Nori (Mpok Nori). Originally founded through Lenong Betawi performances, the studio has grown into a center for preserving traditional Betawi arts, currently led by Hj. Nori's youngest daughter.",
  address: "Jl. Daman 1 No.39 RT.008/002 Bambu Apus Cipayung Jakarta Timur",
  logo: "/profile-sanggar-2.webp",
  image: "/card-7.webp",
  coverImage: "/card-7.webp",
  thumbnail: "/card-7.webp",
  youtubeUrl: "https://youtube.com/@sinarnorray6913?si=oV-MbzLOy6alf8JJ",
  whatsappUrl: "https://wa.me/6281310998647",
  instagramUrl: "https://instagram.com/sinar_norray",
  grade: "B",
  services: [
    {
      title: "Betawi Dance Classes",
      description: "Teaching traditional Betawi dances for all age groups."
    },
    {
      title: "Lenong Betawi Shows",
      description: "Presenting traditional Betawi theater for diverse audiences."
    },
    {
      title: "Traditional Music Performances (Gambang Kromong)",
      description: "Showcasing authentic Betawi music for cultural celebrations."
    }
  ],
  danceSpecialties: [
    {
      name: "Tari Lenggok Dara",
      choreographer: "Adinda Chamila",
      composer: "Sumitra Adi Kusuma Tohir",
      synopsis: "Lenggok means to walk or dance, while Dara means a young woman. This dance portrays the grace, elegance, and cheerfulness of Betawi women through beautiful movements accompanied by distinctive Betawi traditional music."
    },
    {
      name: "Tari Nindak Si None",
      choreographer: "Adinda Chamila",
      composer: "Sumitra Adi Kusuma Tohir",
      synopsis: "Nindak means to step forward, while Si None is inspired by the Betawi None, representing the cultural icon of Abang None Jakarta. This dance reflects the confidence, friendliness, and spirit of Betawi young women in preserving their cultural heritage."
    }
  ],
  achievements: [
    "Grade B in Dance Studio Evaluation by Jakarta Provincial Department of Culture (2025)",
    "Mata Local Award 2025 'Local Ace in Betawi Heritage Performance'",
    "Collaboration with Abang None Theater Production 'Gelora Muda' (2025)"
  ],
  contacts: {
    phone: ["081310998647", "083895124557"],
    whatsapp: "https://wa.me/6281310998647",
    instagram: "https://instagram.com/sinar_norray",
    youtube: "https://youtube.com/@sinarnorray6913?si=oV-MbzLOy6alf8JJ"
  }
};

export const SANGGAR_DATA: Record<string, SanggarItem> = {
  "sinar-norray": SINAR_NORRAY_DATA
};

