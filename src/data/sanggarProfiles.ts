// Curated sanggar profiles (from INFORMASI SANGGAR.docx and official survey data) and the fallback for a sanggar
// without one. Shared by the public catalog (/sanggar), the detail page (/sanggar/[id]) and the admin dashboard, so the
// three show the same facts for a sanggar.
import { ownCardImage, ownGallery } from "@/lib/sanggarImages";
import { resolveWilayah } from "@/lib/wilayah";
import type { SanggarDetailData, ServiceItem, TariItem } from "@/app/sanggar/[id]/SanggarDetailClient";

// 4 layanan inti Sinar Norray; kartu #4 menampung Karya Tari Unggulan di dalam modal
const SINAR_NORRAY_SERVICES: ServiceItem[] = [
  {
    title: "Kelas Tari Betawi",
    description: "Latihan dan pembinaan tari tradisional Betawi untuk berbagai tingkatan usia.",
    titleEn: "Betawi Dance Classes",
    descriptionEn: "Training and mentorship in traditional Betawi dance for all age groups.",
    image: "/images/latihan-tari-margasari.jpg",
  },
  {
    title: "Pentas Lenong Betawi",
    description: "Pementasan teater komedi dan sandiwara rakyat tradisional Betawi.",
    titleEn: "Lenong Betawi Shows",
    descriptionEn: "Traditional Betawi comedy theater and folk drama performances.",
    image: "/images/sanggar/sinar-norray/layanan/layanan-sanggar-sinarnorray-Pentas Lenong Betawi.webp",
  },
  {
    title: "Pentas Musik Gambang Kromong",
    description: "Pertunjukan musik tradisional khas Betawi pengiring acara adat & festival.",
    titleEn: "Gambang Kromong Music Performances",
    descriptionEn: "Traditional Betawi music performances accompanying customary ceremonies & festivals.",
    image: "/images/sanggar/sinar-norray/layanan/layanan-sanggar-sinarnorray-Pentas Musik Gambang Kromong.webp",
  },
  {
    title: "Karya Tari Unggulan Sanggar",
    description: "Pertunjukan tari kreasi khas Betawi (termasuk Tari Lenggok Dara & Tari Nindak Si None).",
    titleEn: "Studio's Featured Dance Works",
    descriptionEn: "Signature Betawi creative dance performances (including Tari Lenggok Dara & Tari Nindak Si None).",
    image: "/images/sanggar/sinar-norray/galeri/galeri-1.webp",
    featuresDanceWorks: true,
  },
];

// Known rich profiles based on INFORMASI SANGGAR.docx and official survey data
export const SPECIFIC_PROFILES: Record<string, Partial<SanggarDetailData>> = {
  // Sinar Norray (Grade B) - Founded by late Hj. Nori (Mpok Nori) in 1995
  "sinar-norray": {
    id: "sinar-norray",
    name: "Sinar Norray",
    leader: "Engkar Karmilasari",
    tagline: "Orang Nya Boleh Mati, Tapi Seni Nya Kaga Boleh Sampe mati",
    grade: "Grade B",
    wilayah: "Jakarta Timur",
    description: [
      "Sanggar Seni Sinar Norray didirikan pada tahun 1995 oleh almarhumah Hj. Nori (Mpok Nori). Berawal dari panggung pertunjukan Lenong Betawi, sanggar ini telah berkembang menjadi pusat pelestarian seni tradisi Betawi yang saat ini dipimpin oleh putri bungsu Hj. Nori.",
      "Berangkat dari panggung sandiwara rakyat Lenong Betawi yang melegenda, sanggar ini terus meregenerasi bakat-bakat seni tradisi mulai dari seni tari klasik hingga tabuhan irama musik Gambang Kromong.",
      "Kini di bawah kepemimpinan Engkar Karmilasari, Sinar Norray tetap setia menjaga orisinalitas kesenian Betawi seraya membuka diri pada kolaborasi panggung teater modern ibu kota."
    ],
    descriptionEn: [
      "Sinar Norray Art Studio was established in 1995 by the late Hj. Nori (Mpok Nori). Originally founded through Lenong Betawi performances, the studio has grown into a center for preserving traditional Betawi arts, currently led by Hj. Nori's youngest daughter.",
      "Originating from the legendary folk theater stage of Lenong Betawi, this studio continuously regenerates traditional artistic talents ranging from classical dance to the rhythmic beats of Gambang Kromong music.",
      "Now under the leadership of Engkar Karmilasari, Sinar Norray remains faithful to preserving the originality of Betawi art while embracing collaborations on modern theatrical stages in the capital."
    ],
    alamatSanggar: "Jl. Daman 1 No.39 RT.008/002 Bambu Apus Cipayung Jakarta Timur",
    alamatLatihan: "Studio Sinar Norray, Jl. Daman 1 No.39 RT.008/002 Bambu Apus, Cipayung, Jakarta Timur (Rabu & Sabtu, 15.00 - 18.00 WIB)",
    address: "Jl. Daman 1 No.39 RT.008/002 Bambu Apus Cipayung Jakarta Timur",
    logo: "/images/sanggar/sinar-norray/profile/profile-sanggar-2.webp",
    services: SINAR_NORRAY_SERVICES,
    layanan: SINAR_NORRAY_SERVICES,
    danceSpecialties: [
      {
        name: "Tari Lenggok Dara",
        choreographer: "Adinda Chamila",
        composer: "Sumitra Adi Kusuma Tohir",
        synopsis: "Lenggok means to walk or dance, while Dara means a young woman. This dance portrays the grace, elegance, and cheerfulness of Betawi women through beautiful movements accompanied by distinctive Betawi traditional music.",
        image: "/images/sanggar/sinar-norray/galeri/galeri-1.webp",
      },
      {
        name: "Tari Nindak Si None",
        choreographer: "Adinda Chamila",
        composer: "Sumitra Adi Kusuma Tohir",
        synopsis: "Nindak means to step forward, while Si None is inspired by the Betawi None, representing the cultural icon of Abang None Jakarta. This dance reflects the confidence, friendliness, and spirit of Betawi young women in preserving their cultural heritage.",
        image: "/images/sanggar/sinar-norray/galeri/galeri-2.webp",
      }
    ],
    tariUnggulan: [
      {
        name: "Tari Lenggok Dara",
        choreographer: "Adinda Chamila",
        composer: "Sumitra Adi Kusuma Tohir",
        synopsis: "Lenggok bermakna lenggang atau gerak berirama, sedangkan Dara adalah gadis muda. Tarian ini menggambarkan keluwesan, keanggunan, dan keceriaan gadis Betawi melalui gerak tari indah berpadu alunan musik tradisional khas Betawi.",
        image: "/images/sanggar/sinar-norray/galeri/galeri-1.webp",
      },
      {
        name: "Tari Nindak Si None",
        choreographer: "Adinda Chamila",
        composer: "Sumitra Adi Kusuma Tohir",
        synopsis: "Nindak bermakna melangkah maju, terinspirasi oleh sosok Si None Betawi sebagai representasi ikon budaya Abang None Jakarta. Tarian ini mencerminkan rasa percaya diri, keramahan, dan semangat gadis muda Betawi dalam melestarikan warisan budayanya.",
        image: "/images/sanggar/sinar-norray/galeri/galeri-2.webp",
      }
    ],
    achievements: [
      {
        title: "Grade B in Dance Studio Evaluation by Jakarta Provincial Department of Culture",
        organizer: "Dinas Kebudayaan Provinsi DKI Jakarta",
        year: "2025"
      },
      {
        title: "Mata Local Award 'Local Ace in Betawi Heritage Performance'",
        organizer: "Mata Local Award",
        year: "2025"
      },
      {
        title: "Collaboration with Abang None Theater Production 'Gelora Muda'",
        organizer: "Teater Abang None Jakarta",
        year: "2025"
      }
    ],
    prestasi: [
      {
        title: "Predikat Grade B Evaluasi Sanggar Seni Dinas Kebudayaan Provinsi DKI Jakarta",
        organizer: "Dinas Kebudayaan Provinsi DKI Jakarta",
        year: "2025"
      },
      {
        title: "Mata Local Award 'Local Ace in Betawi Heritage Performance'",
        organizer: "Mata Local Award",
        year: "2025"
      },
      {
        title: "Kolaborasi Produksi Teater Abang None Jakarta 'Gelora Muda'",
        organizer: "Teater Abang None Jakarta",
        year: "2025"
      }
    ],
    youtubeUrl: "https://youtube.com/@sinarnorray6913?si=oV-MbzLOy6alf8JJ",
    contacts: {
      phone: ["081310998647", "083895124557"],
      whatsapp: "https://wa.me/6281310998647",
      instagram: "https://instagram.com/sinar_norray",
      youtube: "https://youtube.com/@sinarnorray6913?si=oV-MbzLOy6alf8JJ"
    },
    kontak: {
      ketua: "Engkar Karmilasari",
      pic: "Engkar Karmilasari",
      phone: "081310998647",
      email: "sinarnorray.art@gmail.com",
      instagram: "@sinar_norray"
    },
    whatsappNumber: "6281310998647",
    whatsappUrl: "https://wa.me/6281310998647",
    instagram: "https://instagram.com/sinar_norray",
    instagramUrl: "https://instagram.com/sinar_norray",
    imageUrl: "/images/sanggar/sinar-norray/card/card-7.webp",
    fotoKetuaUrl: "/images/sanggar/sinar-norray/profile/profile-sanggar-2.webp",
    // public/images/sanggar/sinar-norray/galeri/ (galeri-3: landscape group photo; galeri-4, galeri-5: 4:5 portraits)
    gallery: [
      { type: "Tari Lenggok Dara", typeEn: "Lenggok Dara Dance", url: "/images/sanggar/sinar-norray/galeri/galeri-1.webp" },
      { type: "Tari Nindak Si None", typeEn: "Nindak Si None Dance", url: "/images/sanggar/sinar-norray/galeri/galeri-2.webp" },
      { type: "Penari Sanggar Sinar Norray", typeEn: "Sinar Norray Dancers", url: "/images/sanggar/sinar-norray/galeri/galeri-3.webp" },
      { type: "Penari Tari Betawi", typeEn: "Betawi Dancer", url: "/images/sanggar/sinar-norray/galeri/galeri-4.webp" },
      { type: "Penari Tari Betawi", typeEn: "Betawi Dancer", url: "/images/sanggar/sinar-norray/galeri/galeri-5.webp" }
    ]
  },
  "sandyakala": {
    // Replaced / Aliased to Sinar Norray
    id: "sinar-norray",
    name: "Sinar Norray",
    leader: "Engkar Karmilasari",
    tagline: "Orang Nya Boleh Mati, Tapi Seni Nya Kaga Boleh Sampe mati",
    grade: "Grade B",
    wilayah: "Jakarta Timur",
    description: [
      "Sanggar Seni Sinar Norray didirikan pada tahun 1995 oleh almarhumah Hj. Nori (Mpok Nori). Berawal dari panggung pertunjukan Lenong Betawi, sanggar ini telah berkembang menjadi pusat pelestarian seni tradisi Betawi yang saat ini dipimpin oleh putri bungsu Hj. Nori.",
      "Berangkat dari panggung sandiwara rakyat Lenong Betawi yang melegenda, sanggar ini terus meregenerasi bakat-bakat seni tradisi mulai dari seni tari klasik hingga tabuhan irama musik Gambang Kromong.",
      "Kini di bawah kepemimpinan Engkar Karmilasari, Sinar Norray tetap setia menjaga orisinalitas kesenian Betawi seraya membuka diri pada kolaborasi panggung teater modern ibu kota."
    ],
    descriptionEn: [
      "Sinar Norray Art Studio was established in 1995 by the late Hj. Nori (Mpok Nori). Originally founded through Lenong Betawi performances, the studio has grown into a center for preserving traditional Betawi arts, currently led by Hj. Nori's youngest daughter.",
      "Originating from the legendary folk theater stage of Lenong Betawi, this studio continuously regenerates traditional artistic talents ranging from classical dance to the rhythmic beats of Gambang Kromong music.",
      "Now under the leadership of Engkar Karmilasari, Sinar Norray remains faithful to preserving the originality of Betawi art while embracing collaborations on modern theatrical stages in the capital."
    ],
    alamatSanggar: "Jl. Daman 1 No.39 RT.008/002 Bambu Apus Cipayung Jakarta Timur",
    alamatLatihan: "Studio Sinar Norray, Jl. Daman 1 No.39 RT.008/002 Bambu Apus, Cipayung, Jakarta Timur (Rabu & Sabtu, 15.00 - 18.00 WIB)",
    address: "Jl. Daman 1 No.39 RT.008/002 Bambu Apus Cipayung Jakarta Timur",
    logo: "/images/sanggar/sinar-norray/profile/profile-sanggar-2.webp",
    services: [
      {
        title: "Betawi Dance Classes",
        description: "Teaching traditional Betawi dances for all age groups.",
        titleEn: "Betawi Dance Classes",
        descriptionEn: "Teaching traditional Betawi dances for all age groups."
      },
      {
        title: "Lenong Betawi Shows",
        description: "Presenting traditional Betawi theater for diverse audiences.",
        titleEn: "Lenong Betawi Shows",
        descriptionEn: "Presenting traditional Betawi theater for diverse audiences."
      },
      {
        title: "Traditional Music Performances (Gambang Kromong)",
        description: "Showcasing authentic Betawi music for cultural celebrations.",
        titleEn: "Traditional Music Performances (Gambang Kromong)",
        descriptionEn: "Showcasing authentic Betawi music for cultural celebrations."
      }
    ],
    layanan: [
      {
        title: "Kelas Tari Betawi",
        description: "Pelatihan tari tradisional Betawi untuk berbagai tingkatan usia dan kemahiran.",
        titleEn: "Betawi Dance Classes",
        descriptionEn: "Teaching traditional Betawi dances for all age groups."
      },
      {
        title: "Pentas Lenong Betawi",
        description: "Pementasan teater komedi dan sandiwara rakyat tradisional Betawi.",
        titleEn: "Lenong Betawi Shows",
        descriptionEn: "Presenting traditional Betawi theater for diverse audiences."
      },
      {
        title: "Pentas Musik Gambang Kromong",
        description: "Penyajian musik tradisional khas Betawi untuk berbagai acara perayaan.",
        titleEn: "Traditional Music Performances (Gambang Kromong)",
        descriptionEn: "Showcasing authentic Betawi music for cultural celebrations."
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
    tariUnggulan: [
      {
        name: "Tari Lenggok Dara",
        choreographer: "Adinda Chamila",
        composer: "Sumitra Adi Kusuma Tohir",
        synopsis: "Lenggok bermakna lenggang atau gerak berirama, sedangkan Dara adalah gadis muda. Tarian ini menggambarkan keluwesan, keanggunan, dan keceriaan gadis Betawi melalui gerak tari indah berpadu alunan musik tradisional khas Betawi."
      },
      {
        name: "Tari Nindak Si None",
        choreographer: "Adinda Chamila",
        composer: "Sumitra Adi Kusuma Tohir",
        synopsis: "Nindak bermakna melangkah maju, terinspirasi oleh sosok Si None Betawi sebagai representasi ikon budaya Abang None Jakarta. Tarian ini mencerminkan rasa percaya diri, keramahan, dan semangat gadis muda Betawi dalam melestarikan warisan budayanya."
      }
    ],
    achievements: [
      {
        title: "Grade B in Dance Studio Evaluation by Jakarta Provincial Department of Culture",
        organizer: "Dinas Kebudayaan Provinsi DKI Jakarta",
        year: "2025"
      },
      {
        title: "Mata Local Award 'Local Ace in Betawi Heritage Performance'",
        organizer: "Mata Local Award",
        year: "2025"
      },
      {
        title: "Collaboration with Abang None Theater Production 'Gelora Muda'",
        organizer: "Teater Abang None Jakarta",
        year: "2025"
      }
    ],
    prestasi: [
      {
        title: "Predikat Grade B Evaluasi Sanggar Seni Dinas Kebudayaan Provinsi DKI Jakarta",
        organizer: "Dinas Kebudayaan Provinsi DKI Jakarta",
        year: "2025"
      },
      {
        title: "Mata Local Award 'Local Ace in Betawi Heritage Performance'",
        organizer: "Mata Local Award",
        year: "2025"
      },
      {
        title: "Kolaborasi Produksi Teater Abang None Jakarta 'Gelora Muda'",
        organizer: "Teater Abang None Jakarta",
        year: "2025"
      }
    ],
    youtubeUrl: "https://youtube.com/@sinarnorray6913?si=oV-MbzLOy6alf8JJ",
    contacts: {
      phone: ["081310998647", "083895124557"],
      whatsapp: "https://wa.me/6281310998647",
      instagram: "https://instagram.com/sinar_norray",
      youtube: "https://youtube.com/@sinarnorray6913?si=oV-MbzLOy6alf8JJ"
    },
    kontak: {
      ketua: "Engkar Karmilasari",
      pic: "Engkar Karmilasari",
      phone: "081310998647",
      email: "sinarnorray.art@gmail.com",
      instagram: "@sinar_norray"
    },
    whatsappNumber: "6281310998647",
    whatsappUrl: "https://wa.me/6281310998647",
    instagram: "https://instagram.com/sinar_norray",
    instagramUrl: "https://instagram.com/sinar_norray",
    imageUrl: "/images/sanggar/sinar-norray/card/card-7.webp",
    fotoKetuaUrl: "/images/sanggar/sinar-norray/profile/profile-sanggar-2.webp",
    // public/images/sanggar/sinar-norray/galeri/ (galeri-3: landscape group photo; galeri-4, galeri-5: 4:5 portraits)
    gallery: [
      { type: "Tari Lenggok Dara", typeEn: "Lenggok Dara Dance", url: "/images/sanggar/sinar-norray/galeri/galeri-1.webp" },
      { type: "Tari Nindak Si None", typeEn: "Nindak Si None Dance", url: "/images/sanggar/sinar-norray/galeri/galeri-2.webp" },
      { type: "Penari Sanggar Sinar Norray", typeEn: "Sinar Norray Dancers", url: "/images/sanggar/sinar-norray/galeri/galeri-3.webp" },
      { type: "Penari Tari Betawi", typeEn: "Betawi Dancer", url: "/images/sanggar/sinar-norray/galeri/galeri-4.webp" },
      { type: "Penari Tari Betawi", typeEn: "Betawi Dancer", url: "/images/sanggar/sinar-norray/galeri/galeri-5.webp" }
    ]
  },

  // ID 21: Arunika Art Production (Grade B)
  "21": {
    name: "Arunika Art Production",
    tagline: "Menghidupkan Warisan Betawi Lewat Gerak Dinamis dan Jiwa Muda",
    grade: "Grade B",
    wilayah: "Jakarta Selatan",
    description: [
      "Arunika Art Production didirikan sebagai ruang eksplorasi gerak tari tradisional Betawi dan tari kreasi kontemporer Nusantara. Berangkat dari semangat generasi muda yang mencintai akar budaya, sanggar ini terus berinovasi dalam mengemas pertunjukan yang memukau tanpa menanggalkan pakem dan filosofi tradisi leluhur.",
      "Dengan kurikulum pembinaan yang terstruktur dan didampingi koreografer berpengalaman, Arunika telah melahirkan puluhan penari muda berprestasi yang aktif tampil dalam berbagai perhelatan kebudayaan tingkat daerah, nasional, hingga representasi seni antarprovinsi.",
      "Melalui program pembinaan rutin dan sanggar terbuka bagi masyarakat, kami berkomitmen menjaga keaslian seni Betawi sekaligus menghadirkannya secara anggun dan relevan dengan panggung seni modern di ibu kota."
    ],
    alamatSanggar: "Jl. Tebet Barat Dalam Raya No. 42, Kel. Tebet Barat, Kec. Tebet, Jakarta Selatan 12810",
    alamatLatihan: "Studio Tari Arunika & Balai Warga RW 04, Tebet Barat, Jakarta Selatan (Selasa & Sabtu, 15.30 - 18.00 WIB)",
    layanan: [
      "Kelas Tari Tradisional Anak & Remaja",
      "Pementasan & Event Organizer Budaya",
      "Penyewaan Kostum Tradisional Betawi & Nusantara",
      "Workshop Tari Kreasi Betawi & Olah Tubuh",
      "Koreografi Khusus Pernikahan & Resepsi Budaya"
    ],
    tariUnggulan: [
      {
        name: "Tari Sirih Kuning",
        description: "Tari pergaulan klasik khas Betawi yang anggun dan dinamis, dibawakan dengan selendang kuning keemasan sebagai simbol kehangatan silaturahmi masyarakat Jakarta.",
        image: "/images/sanggar/arunika-art-production/card/card-3.webp"
      },
      {
        name: "Tari Yapong",
        description: "Tari kreasi bernuansa riang gembira ciptaan maestro Bagong Kussudiardja yang memancarkan keceriaan dan dinamika gerak kaki serta tepuk tangan penari.",
      },
      {
        name: "Tari Nandak Ganjen",
        description: "Koreografi lincah remaja putri Betawi yang menggambarkan kecentilan dan kebebasan berekspresi dengan langkah kaki yang terampil dan bersahaja.",
      },
      {
        name: "Tari Lenggang Nyai",
        description: "Mengisahkan ketegaran tokoh Nyai Dasima dalam balutan busana peranakan dengan gerak luwes yang menyiratkan kekuatan emansipasi wanita Betawi.",
      }
    ],
    prestasi: [
      "Juara 1 Festival Tari Nusantara DKI Jakarta 2024",
      "Penampil Terbaik Parade Seni Budaya Daerah TMII 2023",
      "Penyaji Unggulan Pentas Kreativitas Seni Pemuda DKI Jakarta 2022",
      "Duta Seni Budaya Festival Pelajar Nusantara DKI Jakarta 2021"
    ],
    kontak: {
      ketua: "Siti Rahmawati, S.Sn.",
      pic: "Andika Pratama",
      phone: "+62 812-8921-4320",
      email: "info@arunika-art.com"
    },
    imageUrl: "/images/sanggar/arunika-art-production/card/card-3.webp",
    fotoKetuaUrl: null,
    gallery: ownGallery("Arunika Art Production"),
  },

  // ID 1 & 40: AE Production (Art Enthusiast Production) (Grade B)
  "1": {
    name: "Art Enthusiast Production",
    youtubeUrl: "https://www.youtube.com/@ae.production_",
    tagline: "Harmoni Seni Tradisi dan Ekspresi Panggung Spektakuler Jakarta",
    grade: "Grade B",
    wilayah: "Jakarta Timur",
    description: [
      "Sanggar kesenian di bidang seni tari dan musik yang mengusung seni budaya Betawi, Jawa Barat, dan seni daerah Nusantara lainnya. Resmi berdiri sejak 1 Mei 2023 dengan rekam jejak pembinaan sejak 2011.",
      "Dengan bimbingan koreografer profesional dan kurikulum pembinaan berkesinambungan, sanggar ini terus berinovasi dalam mengemas pertunjukan yang memukau tanpa menanggalkan pakem dan filosofi tradisi leluhur.",
      "Melalui program pembinaan rutin dan sanggar terbuka bagi masyarakat, kami berkomitmen menjaga keaslian seni Betawi sekaligus menghadirkannya secara anggun dan relevan dengan panggung seni modern di ibu kota."
    ],
    alamatSanggar: "Jl. Pondok Kelapa VIII Blok H2 No. 2, Kel. Pondok Kelapa, Kec. Duren Sawit, Jakarta Timur, 13450",
    alamatLatihan: "Studio AE Production, Jl. Pondok Kelapa VIII Blok H2 No. 2, Kel. Pondok Kelapa, Kec. Duren Sawit, Jakarta Timur, 13450 (Rabu & Minggu, 16.00 - 19.30 WIB)",
    layanan: [
      "Jasa Pentas Tari Tradisional (Betawi, Jaipong & Medley Nusantara)",
      "Pengiring Musik Tradisional (Kecapi, Suling & Musik Betawi)",
      "Pelatihan & Kursus Seni Tari & Musik Tradisional",
      "Sewa Kostum Tari Tradisional & Tata Rias Budaya"
    ],
    tariUnggulan: [
      {
        name: "Tari Kembang Lambang Sari",
        description: "Simbol keanggunan penari putri dengan ornamen bunga kembang goyang yang memukau serta formasi pola lantai geometris dinamis.",
        image: "/images/sanggar/ae-production/card/card-1.webp"
      },
      {
        name: "Tari Sirih Kuning",
        description: "Tari penyambutan klasik Betawi dengan selendang sutra keemasan yang menyimbolkan ketulusan dan penghormatan kepada tamu agung.",
        image: "/images/sanggar/ae-production/card/card-1.webp"
      },
      {
        name: "Tari Renggong Manis",
        description: "Koreografi penuh keceriaan perpaduan ritme kendang Betawi dengan sentuhan tari Sunda dan Melayu pesisir.",
      }
    ],
    achievements: [
      {
        title: "Juara III Lomba AKPJT Sudinpora Jakarta Timur",
        organizer: "Sudinpora Jakarta Timur",
        year: "2025"
      },
      {
        title: "Juara I Lomba Memperingati Hari Ibu Dursavaganza",
        organizer: "Kecamatan Duren Sawit Jakarta Timur",
        year: "2024"
      },
      {
        title: "Harapan I Lomba Karya Cipta Tari Betawi",
        organizer: "Dinas Kebudayaan Provinsi DKI Jakarta",
        year: "2024"
      },
      {
        title: "Juara I & Juara 2 Lomba Tari Kreasi Nusantara",
        organizer: "PN Production & Disbud Jak-Tim",
        year: "2024"
      },
      {
        title: "Juara I & Juara Umum Lomba Tari Kreasi Nusantara",
        organizer: "PN Production & Disbud Jak-Tim",
        year: "2023"
      },
      {
        title: "Juara I & Juara Umum 3 Lomba Tari Kreasi Nusantara",
        organizer: "Real Art & Disbud Jak-Ut",
        year: "2023"
      },
      {
        title: "Juara III Lomba Tari Kreasi Nusantara",
        organizer: "Real Art & Disbud Jak-Ut",
        year: "2023"
      },
      {
        title: "Lolos Kurasi Sanggar Seni Tari Tahap 1 Grade B",
        organizer: "Dinas Kebudayaan Provinsi DKI Jakarta",
        year: "2025"
      }
    ],
    prestasi: [
      "Juara III Lomba AKPJT Sudinpora Jakarta Timur (2025)",
      "Juara I Lomba Memperingati Hari Ibu Dursavaganza (2024)",
      "Harapan I Lomba Karya Cipta Tari Betawi - Dinas Kebudayaan DKI Jakarta (2024)",
      "Juara I & Juara 2 Lomba Tari Kreasi Nusantara (2024)",
      "Juara I & Juara Umum Lomba Tari Kreasi Nusantara (2023)",
      "Juara I & Juara Umum 3 Lomba Tari Kreasi Nusantara (2023)",
      "Juara III Lomba Tari Kreasi Nusantara (2023)",
      "Lolos Kurasi Sanggar Seni Tari Tahap 1 Grade B - Dinas Kebudayaan DKI Jakarta (2025)"
    ],
    kontak: {
      ketua: "Vini Nurmala Putri",
      pic: "Vini Nurmala Putri",
      phone: "6281318702623",
      email: "art.enthusiastproduction@gmail.com",
      instagram: "ae.pro_"
    },
    imageUrl: "/images/sanggar/ae-production/card/card-1.webp",
    fotoKetuaUrl: "/images/sanggar/ae-production/profile/profile-sanggar-1.webp",
    gallery: ownGallery("Art Enthusiast Production"),
  },
  "40": {
    name: "Art Enthusiast Production",
    youtubeUrl: "https://www.youtube.com/@ae.production_",
    tagline: "Harmoni Seni Tradisi dan Ekspresi Panggung Spektakuler Jakarta",
    grade: "Grade B",
    wilayah: "Jakarta Timur",
    description: [
      "Sanggar kesenian di bidang seni tari dan musik yang mengusung seni budaya Betawi, Jawa Barat, dan seni daerah Nusantara lainnya. Resmi berdiri sejak 1 Mei 2023 dengan rekam jejak pembinaan sejak 2011.",
      "Dengan bimbingan koreografer profesional dan kurikulum pembinaan berkesinambungan, sanggar ini terus berinovasi dalam mengemas pertunjukan yang memukau tanpa menanggalkan pakem dan filosofi tradisi leluhur.",
      "Melalui program pembinaan rutin dan sanggar terbuka bagi masyarakat, kami berkomitmen menjaga keaslian seni Betawi sekaligus menghadirkannya secara anggun dan relevan dengan panggung seni modern di ibu kota."
    ],
    alamatSanggar: "Jl. Pondok Kelapa VIII Blok H2 No. 2, Kel. Pondok Kelapa, Kec. Duren Sawit, Jakarta Timur, 13450",
    alamatLatihan: "Studio AE Production, Jl. Pondok Kelapa VIII Blok H2 No. 2, Kel. Pondok Kelapa, Kec. Duren Sawit, Jakarta Timur, 13450 (Rabu & Minggu, 16.00 - 19.30 WIB)",
    layanan: [
      "Jasa Pentas Tari Tradisional (Betawi, Jaipong & Medley Nusantara)",
      "Pengiring Musik Tradisional (Kecapi, Suling & Musik Betawi)",
      "Pelatihan & Kursus Seni Tari & Musik Tradisional",
      "Sewa Kostum Tari Tradisional & Tata Rias Budaya"
    ],
    tariUnggulan: [
      {
        name: "Tari Kembang Lambang Sari",
        description: "Simbol keanggunan penari putri dengan ornamen bunga kembang goyang yang memukau serta formasi pola lantai geometris dinamis.",
        image: "/images/sanggar/ae-production/card/card-1.webp"
      },
      {
        name: "Tari Sirih Kuning",
        description: "Tari penyambutan klasik Betawi dengan selendang sutra keemasan yang menyimbolkan ketulusan dan penghormatan kepada tamu agung.",
        image: "/images/sanggar/ae-production/card/card-1.webp"
      },
      {
        name: "Tari Renggong Manis",
        description: "Koreografi penuh keceriaan perpaduan ritme kendang Betawi dengan sentuhan tari Sunda dan Melayu pesisir.",
      }
    ],
    achievements: [
      {
        title: "Juara III Lomba AKPJT Sudinpora Jakarta Timur",
        organizer: "Sudinpora Jakarta Timur",
        year: "2025"
      },
      {
        title: "Juara I Lomba Memperingati Hari Ibu Dursavaganza",
        organizer: "Kecamatan Duren Sawit Jakarta Timur",
        year: "2024"
      },
      {
        title: "Harapan I Lomba Karya Cipta Tari Betawi",
        organizer: "Dinas Kebudayaan Provinsi DKI Jakarta",
        year: "2024"
      },
      {
        title: "Juara I & Juara 2 Lomba Tari Kreasi Nusantara",
        organizer: "PN Production & Disbud Jak-Tim",
        year: "2024"
      },
      {
        title: "Juara I & Juara Umum Lomba Tari Kreasi Nusantara",
        organizer: "PN Production & Disbud Jak-Tim",
        year: "2023"
      },
      {
        title: "Juara I & Juara Umum 3 Lomba Tari Kreasi Nusantara",
        organizer: "Real Art & Disbud Jak-Ut",
        year: "2023"
      },
      {
        title: "Juara III Lomba Tari Kreasi Nusantara",
        organizer: "Real Art & Disbud Jak-Ut",
        year: "2023"
      },
      {
        title: "Lolos Kurasi Sanggar Seni Tari Tahap 1 Grade B",
        organizer: "Dinas Kebudayaan Provinsi DKI Jakarta",
        year: "2025"
      }
    ],
    prestasi: [
      "Juara III Lomba AKPJT Sudinpora Jakarta Timur (2025)",
      "Juara I Lomba Memperingati Hari Ibu Dursavaganza (2024)",
      "Harapan I Lomba Karya Cipta Tari Betawi - Dinas Kebudayaan DKI Jakarta (2024)",
      "Juara I & Juara 2 Lomba Tari Kreasi Nusantara (2024)",
      "Juara I & Juara Umum Lomba Tari Kreasi Nusantara (2023)",
      "Juara I & Juara Umum 3 Lomba Tari Kreasi Nusantara (2023)",
      "Juara III Lomba Tari Kreasi Nusantara (2023)",
      "Lolos Kurasi Sanggar Seni Tari Tahap 1 Grade B - Dinas Kebudayaan DKI Jakarta (2025)"
    ],
    kontak: {
      ketua: "Vini Nurmala Putri",
      pic: "Vini Nurmala Putri",
      phone: "6281318702623",
      email: "art.enthusiastproduction@gmail.com",
      instagram: "ae.pro_"
    },
    imageUrl: "/images/sanggar/ae-production/card/card-1.webp",
    fotoKetuaUrl: "/images/sanggar/ae-production/profile/profile-sanggar-1.webp",
    gallery: ownGallery("Art Enthusiast Production"),
  },

  // ID 17: Ayodya Pala (Grade A) - Exact data from INFORMASI SANGGAR docx/pdf
  "17": {
    name: "Ayodya Pala Indonesia Art Center",
    tagline: "Membangun Bangsa Melalui Seni dan Budaya",
    grade: "Grade A",
    wilayah: "Jakarta Selatan",
    description: [
      "Yayasan Ayodya Pala dirintis mulai tahun 1978 dan resmi dibentuk menjadi yayasan pada tanggal 24 April 1980. Memiliki lebih dari 2.400 siswa aktif dengan semboyan 'Membangun Bangsa Melalui Seni dan Budaya', Ayodya Pala telah menjadi ikon pelestarian budaya bangsa selama lebih dari 45 tahun.",
      "Nama AYODYA diambil dari epos Ramayana yaitu kerajaan kelahiran Sri Rama yang makmur, aman, tentram, dan masyarakatnya berbudaya tinggi. Sedangkan kata PALA terinspirasi dari Sumpah Palapa Patih Gajah Mada dari Kerajaan Majapahit yang bersumpah mempersatukan seluruh kepulauan Nusantara.",
      "Kini dengan lebih dari 3.000 anggota terdaftar dan puluhan cabang latihan, Ayodya Pala telah mewakili Indonesia di panggung internasional, memecahkan rekor dunia, dan mendidik generasi muda agar bangga atas identitas seni tradisi nusantara."
    ],
    alamatSanggar: "Jalan Raya Lenteng Agung No. 1, Kel. Lenteng Agung, Kec. Jagakarsa, Jakarta Selatan 12610",
    alamatLatihan: "Jalan Raya Lenteng Agung No. 1, Kel. Lenteng Agung, Kec. Jagakarsa, Jakarta Selatan 12610",
    layanan: [
      "Pelatihan Tari Daerah Nusantara Lengkap",
      "Modelling Busana Adat Anak & Remaja",
      "Olah Vokal & Ansambel Musik Tradisional",
      "Penyewaan Kostum Adat Lengkap 38 Provinsi",
      "Pementasan Kebudayaan Skala Nasional & Mancanegara"
    ],
    tariUnggulan: [
      {
        name: "Tari Mpok Cantik",
        description: "Tari kreasi Betawi yang menggambarkan kecantikan, keluwesan, dan budi pekerti luhur putri Jakarta dalam balutan busana cerah nan mempesona.",
        image: "/images/sanggar/ayodya-pala/card/card-4.webp"
      },
      {
        name: "Tari Kembang Merona",
        description: "Koreografi rancak penuh keceriaan remaja Betawi yang menyiratkan semarak kembang mekar di bawah mentari ibu kota.",
      },
      {
        name: "Tari Goyang Ngamprok",
        description: "Gerak ritmis interaktif yang memadukan kelincahan langkah kaki dan hentakan irama kendang ronggeng Betawi.",
      },
      {
        name: "Tari Jari Manis",
        description: "Kelembutan gerak jemari dan lentiknya kiprah tangan dalam iringan alunan musik tradisi yang syahdu dan memikat.",
      },
      {
        name: "Tari Zapin Habibana",
        description: "Harmoni akulturasi budaya Melayu-Arab di pesisir Jakarta dengan ayunan langkah zapin yang khidmat dan bersahaja.",
      }
    ],
    prestasi: [
      "Pemegang Rekor MURI – 1.117 Penari dari Satu Sanggar (Tari Bhinneka di Depok Open Space 2025)",
      "Dipercaya Tampil di Berbagai Event Nasional: Jakarnaval, TRANS7, UNDP, dan Warta Kota Awards",
      "Pengembangan Seni Tari Nusantara Lintas 45 Tahun dengan Lebih dari 3.000 Anggota",
      "Penampil Resmi Delegasi Kebudayaan Republik Indonesia di Festival Seni Internasional"
    ],
    kontak: {
      ketua: "Dra. Budi Agustinah",
      pic: "Dra. Budi Agustinah",
      phone: "081399160062",
      email: "ayodyapala.art@gmail.com"
    },
    imageUrl: "/images/sanggar/ayodya-pala/card/card-4.webp",
    fotoKetuaUrl: null,
    gallery: ownGallery("Ayodya Pala"),
  },

  // ID 7: Daya Presta (Grade A)
  "7": {
    name: "Sanggar Tari Daya Presta",
    tagline: "Kemampuan bertindak untuk mencapai dan mencetak prestasi seni sejak 1985",
    grade: "Grade A",
    wilayah: "Jakarta Pusat",
    description: [
      "Sanggar Tari Daya Presta sudah berdiri, berkarya, dan menjadi salah satu wadah pengembangan seni tari tradisional di Jakarta sejak tahun 1985. Nama 'Daya Presta' diserap dari kata 'Daya' (daya cipta dan kemampuan bertindak) serta 'Presta' (prestasi dan dedikasi).",
      "Tidak hanya aktif berkembang di DKI Jakarta, Daya Presta telah melebarkan jejaring pembinaan ke Bandung hingga Yogyakarta, memperkuat rasa persaudaraan seniman antar-wilayah.",
      "Melalui pembinaan berjenjang, sanggar ini fokus menumbuhkan kecintaan terhadap nilai-nilai luhur budaya Betawi dan Nusantara pada generasi belia."
    ],
    alamatSanggar: "Jl. Cikini Raya No. 73, Kel. Cikini, Kec. Menteng, Jakarta Pusat 10330",
    alamatLatihan: "Pusat Kesenian Jakarta Taman Ismail Marzuki (TIM) & Sanggar Cikini (Senin & Kamis, 16.00 - 18.30 WIB)",
    layanan: [
      "Pelatihan Tari Klasik & Kreasi Betawi",
      "Drama Musikal Tari Tradisional",
      "Workshop Tata Rias & Kostum Tradisional",
      "Pementasan Kolaborasi Lintas Daerah",
      "Konsultasi Koreografi Panggung Budaya"
    ],
    tariUnggulan: [
      {
        name: "Tari Sirih Kuning",
        description: "Tari pergaulan yang menggambarkan rasa gembira dan silaturahmi yang erat di kalangan masyarakat Betawi.",
        image: "/images/sanggar/daya-presta/card/card-6.webp"
      },
      {
        name: "Tari Renggong Manis",
        description: "Perpaduan harmonis gerak tari Betawi dan Sunda yang memancarkan dinamika serta kelembutan penari wanita.",
      },
      {
        name: "Tari Golek Manis",
        description: "Tari klasik dengan keluwesan gerak selendang yang mencerminkan kedewasaan dan keanggunan putri Nusantara.",
      }
    ],
    prestasi: [
      "Penghargaan Pelestari Seni Tradisi Dinas Kebudayaan DKI Jakarta 2023",
      "Juara Umum Festival Tari Tradisional Se-Jabodetabek 2022",
      "Penyaji Tari Kreasi Terbaik Taman Mini Indonesia Indah 2020",
      "Apresiasi Karya Cipta Seni Budaya Kementerian Pendidikan dan Kebudayaan 2018"
    ],
    kontak: {
      ketua: "H. Sukirman, S.Pd.",
      pic: "Rina Setyowati",
      phone: "+62 812-9724-9285",
      email: "dayapresta14@gmail.com"
    },
    imageUrl: "/images/sanggar/daya-presta/card/card-6.webp",
    fotoKetuaUrl: null,
    gallery: ownGallery("Daya Presta"),
  }
};

export interface SanggarDbRow {
  id?: number | string;
  nama_sanggar?: string;
  nama?: string;
  nama_pimpinan?: string;
  ketua?: string;
  grade?: string;
  alamat?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota_kab?: string;
  no_hp?: string;
  kontak_pic?: string;
  nama_pic?: string;
  ketua_sanggar?: string;
  jenis_tarian?: string;
  tagline?: string;
  deskripsi?: string;
  alamat_tempat_latihan?: string;
  layanan?: string[];
  tari_unggulan?: TariItem[];
  prestasi?: string[];
  thumbnail_url?: string;
  foto_grup_url?: string;
  foto_unggulan_url?: string;
  foto_ketua_url?: string;
  logo_url?: string;
  list_foto?: string[];
  email?: string;
  instagram?: string;
  // Admin-managed columns added by supabase/migrations/20260930_admin_sanggar_fields.sql
  wilayah?: string | null;
  status?: string | null;
  youtube_url?: string | null;
  maps_url?: string | null;
  galeri?: unknown;
  layanan_items?: unknown;
  prestasi_items?: unknown;
}

/**
 * Profile of a sanggar without a curated profile: only what the database holds. Nothing is invented (no address,
 * contact, schedule, services, dances or awards that aren't on record): the page shows its empty states instead.
 */
export function generateFallbackSanggar(data: SanggarDbRow | null | undefined, id: string): SanggarDetailData {
  const name = data?.nama_sanggar || "";
  const rawGrade = data?.grade;
  const gradeStr = rawGrade ? (rawGrade.toLowerCase().includes("grade") ? rawGrade : `Grade ${rawGrade}`) : "";
  // same rule as the catalog card: a known city, else the province (never a guessed city)
  const wilayah = resolveWilayah({ ...(data ?? {}), id: data?.id ?? id }) ?? "DKI Jakarta";

  // Only this sanggar's own photo (uploaded, or its known card image); no photo at all rather than another
  // sanggar's picture
  const ownPhoto = data?.thumbnail_url || data?.foto_grup_url || ownCardImage(name);
  // Its galeri/ folder when it has one (showing the card photo until galeri-1 is uploaded)
  const ownGalleryPhotos = ownGallery(name);

  return {
    id,
    name,
    tagline: "",
    grade: gradeStr,
    wilayah,
    description: [],
    alamatSanggar: data?.alamat || "",
    alamatLatihan: data?.alamat_tempat_latihan || "",
    layanan: [],
    tariUnggulan: [],
    prestasi: [],
    kontak: {
      ketua: data?.ketua_sanggar || data?.nama_pimpinan || "",
      pic: data?.nama_pic || "",
      phone: data?.kontak_pic || data?.no_hp || "",
      email: data?.email || "",
    },
    imageUrl: ownPhoto || "",
    fotoKetuaUrl: data?.foto_ketua_url || null,
    gallery: ownGalleryPhotos.length > 0
      ? ownGalleryPhotos
      : ownPhoto ? [{ type: "Foto Sanggar", typeEn: "Studio Photo", url: ownPhoto }] : []
  };
}

/**
 * The curated profile of a sanggar: by its id, else by its name (database ids and names don't always match the keys).
 * The profile keyed "1" is Art Enthusiast Production (database id 40); database id 1 is a different sanggar.
 */
export function findCuratedProfile(id: string, name?: string | null): Partial<SanggarDetailData> | undefined {
  let profile: Partial<SanggarDetailData> | undefined = SPECIFIC_PROFILES[id];
  const n = (name || "").toLowerCase();
  if (id === "1" && n && !/ae production|art enthusiast/.test(n)) profile = undefined;
  if (!profile && (n.includes("ae production") || n.includes("art enthusiast"))) profile = SPECIFIC_PROFILES["1"];
  const key = id.toLowerCase();
  if (!profile && (n.includes("sinar norray") || n.includes("sandyakala") || key.includes("sinar-norray") || key.includes("sandyakala"))) {
    profile = SPECIFIC_PROFILES["sinar-norray"];
  }
  return profile;
}

/** First phone number of a curated profile (its contact list, else its kontak block) */
export const curatedPhoneOf = (profile?: Partial<SanggarDetailData>) =>
  (profile?.contacts?.phone ? profile.contacts.phone[0] : undefined) || profile?.kontak?.phone || undefined;
