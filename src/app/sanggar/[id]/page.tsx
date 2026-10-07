import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isDraft, parseGallery, parseLayanan, parsePrestasi } from "@/lib/sanggarData";
import { ownCardImage, ownGallery } from "@/lib/sanggarImages";
import SanggarDetailClient, { SanggarDetailData, ServiceItem, TariItem } from "./SanggarDetailClient";

export const dynamic = "force-dynamic";

// 4 layanan inti Sinar Norray; kartu #4 menampung Karya Tari Unggulan di dalam modal
const SINAR_NORRAY_SERVICES: ServiceItem[] = [
  {
    title: "Kelas Tari Betawi",
    description: "Latihan dan pembinaan tari tradisional Betawi untuk berbagai tingkatan usia.",
    titleEn: "Betawi Dance Classes",
    descriptionEn: "Training and mentorship in traditional Betawi dance for all age groups.",
    image: "/images/sanggar/sinar-norray/layanan/layanan-sanggar-sinarnorray-Kelas Tari Betawi.webp",
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
const SPECIFIC_PROFILES: Record<string, Partial<SanggarDetailData>> = {
  // Sinar Norray (Grade B) - Founded by late Hj. Nori (Mpok Nori) in 1995
  "sinar-norray": {
    id: "sinar-norray",
    name: "Sinar Norray",
    leader: "Engkar Karmilasari",
    tagline: "Orang Nya Boleh Mati, Tapi Seni Nya Kaga Boleh Sampe mati",
    grade: "Grade B",
    wilayah: "Jakarta Timur",
    philosophy: "Seni Betawi adalah nafas dan marwah masyarakat Jakarta. Boleh orangnya tiada, namun warisan seni dan budayanya harus tetap hidup dan berkobar di hati generasi penerus.",
    philosophyEn: "Betawi art is the breath and dignity of Jakarta's people. A person may pass away, but the artistic and cultural heritage must remain alive and burning in the hearts of future generations.",
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
    philosophy: "Seni Betawi adalah nafas dan marwah masyarakat Jakarta. Boleh orangnya tiada, namun warisan seni dan budayanya harus tetap hidup dan berkobar di hati generasi penerus.",
    philosophyEn: "Betawi art is the breath and dignity of Jakarta's people. A person may pass away, but the artistic and cultural heritage must remain alive and burning in the hearts of future generations.",
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
    philosophy: "Arunika—seperti fajar yang merekah—menghadirkan nafas segar pada tari tradisi, membuktikan bahwa warisan leluhur senantiasa hidup di dada generasi muda.",
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
    tagline: "Harmoni Seni Tradisi dan Ekspresi Panggung Spektakuler Jakarta",
    grade: "Grade B",
    wilayah: "Jakarta Timur",
    philosophy: "Seni tari dan musik sebagai wahana ekspresi generasi muda dalam melestarikan serta mengembangkan kekayaan tradisi Betawi dan Nusantara.",
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
    tagline: "Harmoni Seni Tradisi dan Ekspresi Panggung Spektakuler Jakarta",
    grade: "Grade B",
    wilayah: "Jakarta Timur",
    philosophy: "Seni tari dan musik sebagai wahana ekspresi generasi muda dalam melestarikan serta mengembangkan kekayaan tradisi Betawi dan Nusantara.",
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
    philosophy: "AYODYA melambangkan negeri yang aman, makmur, dan berbudaya luhur, sementara PALA mewarisi sumpah pemersatu Nusantara dari Patih Gajah Mada.",
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
    philosophy: "Daya adalah kemampuan untuk bertindak dengan ketulusan hati, dan Presta adalah pencapaian keluhuran budi melalui gerak seni.",
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

interface SanggarDbRow {
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

// Deterministic generic fallback generator for any studio
function generateFallbackSanggar(data: SanggarDbRow | null | undefined, id: string): SanggarDetailData {
  const name = data?.nama_sanggar || "Sanggar Seni Budaya DKI";
  const cleanName = name.replace(/^Sanggar\s+/i, '');
  const rawGrade = data?.grade;
  const gradeStr = rawGrade ? (rawGrade.toLowerCase().includes('grade') ? rawGrade : `Grade ${rawGrade}`) : "Grade B";
  const wilayah = data?.kota_kab || data?.kecamatan || "DKI Jakarta";

  // Only this sanggar's own photo (uploaded, or its known card image); no photo at all rather than another
  // sanggar's picture. The dance works below have no photos of their own, so they show without one.
  const ownPhoto = data?.thumbnail_url || data?.foto_grup_url || ownCardImage(name);
  // Its galeri/ folder when it has one (showing the card photo until galeri-1 is uploaded)
  const ownGalleryPhotos = ownGallery(name);

  return {
    id,
    name,
    tagline: `Menjaga Kemurnian Seni Tradisi, Menginspirasi Gerak Budaya Nusantara`,
    grade: gradeStr,
    wilayah,
    philosophy: `Seni tari bukan sekadar olah raga dan kelenturan tubuh, melainkan laku jiwa dalam menghormati peradaban leluhur Betawi.`,
    description: [
      `${name} merupakan salah satu sanggar seni tari tradisional terkemuka yang terdaftar resmi di Dinas Kebudayaan Provinsi DKI Jakarta. Berbasis di kawasan ${wilayah}, sanggar ini telah mengabdikan diri dalam merawat, melatih, dan meregenerasi kekayaan seni pertunjukan tari khas Betawi dan Nusantara.`,
      `Dengan metode pengajaran yang berakar pada pakem klasik namun terbuka pada sentuhan estetika kontemporer, ${cleanName} secara berkesinambungan mendidik generasi penerus dari tingkat anak-anak hingga dewasa. Setiap penari dibekali keterampilan olah tubuh, kepekaan rasa, serta wawasan filosofis di balik setiap ragam gerak.`,
      `Konsistensi sanggar ini terbukti lewat berbagai partisipasi aktif dalam festival seni daerah, upacara adat, penyambutan kenegaraan, serta program pembinaan seni budaya di ruang-ruang publik ibu kota.`
    ],
    alamatSanggar: data?.alamat || `Jl. Budaya Nusantara No. ${id}, Kel. ${data?.kelurahan || "Menteng"}, Kec. ${data?.kecamatan || "Jakarta Pusat"}, ${wilayah}`,
    alamatLatihan: data?.alamat_tempat_latihan || `Gedung Kesenian & Balai Latihan Sanggar ${cleanName}, ${wilayah} (Selasa & Jumat, 16.00 - 18.30 WIB)`,
    layanan: [
      "Pelatihan Tari Tradisional Betawi Berjenjang",
      "Pementasan Tari & Penyambutan Tamu Kehormatan",
      "Penyewaan Busana Tari Tradisional & Aksesoris Adat",
      "Workshop Apresiasi Budaya untuk Sekolah & Komunitas",
      "Jasa Penata Tari (Koreografer) untuk Acara Khusus"
    ],
    tariUnggulan: [
      {
        name: "Tari Sirih Kuning",
        description: "Tari penyambutan legendaris khas Betawi yang anggun, melambangkan kehangatan sambutan dan penghormatan tulus kepada tamu.",
      },
      {
        name: "Tari Yapong",
        description: "Tarian riang gembira berirama dinamis yang menggambarkan semangat gotong royong dan keceriaan masyarakat ibu kota.",
      },
      {
        name: "Tari Kembang Lambang Sari",
        description: "Koreografi elok penuh pesona yang memadukan kelembutan gerak jemari dengan kelincahan langkah penari.",
      }
    ],
    prestasi: [
      "Penghargaan Partisipasi Aktif Pekan Seni Budaya DKI Jakarta 2024",
      "Penyaji Tari Tradisi Berbakat Tingkat Kotamadya 2023",
      "Pengisi Acara Pentas Budaya Nusantara 2022",
      "Sertifikasi Mutu Pembinaan Sanggar Kesenian Dinas Kebudayaan DKI Jakarta"
    ],
    kontak: {
      ketua: data?.nama_pimpinan || data?.ketua_sanggar || "Pimpinan Sanggar " + cleanName,
      pic: data?.nama_pic || "Staf Manajemen Sanggar",
      phone: data?.kontak_pic || data?.no_hp || "+62 812-9000-8800",
      email: data?.email || `kontak@${cleanName.toLowerCase().replace(/\s+/g, '')}.id`
    },
    imageUrl: ownPhoto || "",
    fotoKetuaUrl: data?.foto_ketua_url || null,
    gallery: ownGalleryPhotos.length > 0
      ? ownGalleryPhotos
      : ownPhoto ? [{ type: "Foto Sanggar", typeEn: "Studio Photo", url: ownPhoto }] : []
  };
}

export default async function SanggarDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sanggars")
    .select("*")
    .eq("id", id)
    .single();

  if (error && !SPECIFIC_PROFILES[id]) {
    console.error("Supabase fetch sanggar error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <p className="text-xl text-slate-500">Sanggar tidak ditemukan.</p>
      </div>
    );
  }

  // Drafts are hidden from the public site
  if (data && isDraft(data)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <p className="text-xl text-slate-500">Sanggar tidak ditemukan.</p>
      </div>
    );
  }

  // Check specific curated profile first
  let specific: Partial<SanggarDetailData> | undefined = SPECIFIC_PROFILES[id];
  // The curated profile keyed "1" is Art Enthusiast Production (database id 40). Database id 1 is a
  // different sanggar, so don't show AE's name and contacts on its page.
  if (id === "1" && data?.nama_sanggar && !/ae production|art enthusiast/i.test(data.nama_sanggar)) {
    specific = undefined;
  }
  if (!specific && (data?.nama_sanggar?.toLowerCase().includes("ae production") || data?.nama_sanggar?.toLowerCase().includes("art enthusiast"))) {
    specific = SPECIFIC_PROFILES["1"];
  }
  if (!specific && (
    data?.nama_sanggar?.toLowerCase().includes("sinar norray") ||
    data?.nama_sanggar?.toLowerCase().includes("sandyakala") ||
    id?.toLowerCase().includes("sinar-norray") ||
    id?.toLowerCase().includes("sandyakala")
  )) {
    specific = SPECIFIC_PROFILES["sinar-norray"];
  }
  const fallback = generateFallbackSanggar(data, id);

  // ---- Data saved through the admin panel ----
  // Anything the admin has filled in wins over the curated demo profile and the generated fallback.
  // (Name stays curated-first: several database names differ from the curated display names.)
  const dbGallery = data ? parseGallery(data) : [];
  const dbLayanan = data ? parseLayanan(data) : [];
  const dbPrestasi = data ? parsePrestasi(data) : [];
  const dbDescription: string[] | null = data?.deskripsi
    ? String(data.deskripsi).split(/\r?\n\s*\r?\n|\r?\n/).map((p: string) => p.trim()).filter(Boolean)
    : null;
  const dbInstagramUrl = data?.instagram
    ? (data.instagram.startsWith("http") ? data.instagram : `https://instagram.com/${data.instagram.replace("@", "")}`)
    : null;
  const dbGrade = data?.grade ? (data.grade.toLowerCase().includes('grade') ? data.grade : `Grade ${data.grade}`) : null;
  const curatedPhone = (specific?.contacts?.phone ? specific.contacts.phone[0] : null) || specific?.kontak?.phone;

  const finalSanggar: SanggarDetailData = {
    id: data?.id || id,
    name: specific?.name || data?.nama_sanggar || data?.nama || fallback?.name || '',
    leader: data?.ketua_sanggar || specific?.leader || data?.nama_pimpinan || data?.ketua || fallback?.kontak?.ketua || '',
    tagline: data?.tagline || specific?.tagline || fallback.tagline,
    grade: dbGrade || specific?.grade || fallback.grade,
    wilayah: data?.wilayah || specific?.wilayah || data?.kota_kab || data?.kecamatan || fallback.wilayah,
    philosophy: specific?.philosophy || fallback.philosophy,
    philosophyEn: specific?.philosophyEn,
    description: dbDescription || specific?.description || fallback.description,
    descriptionEn: dbDescription ? undefined : specific?.descriptionEn,
    alamatSanggar: data?.alamat || specific?.alamatSanggar || fallback.alamatSanggar,
    alamatLatihan: data?.alamat_tempat_latihan || specific?.alamatLatihan || fallback.alamatLatihan,
    address: data?.alamat || specific?.address || specific?.alamatSanggar || fallback?.address || fallback?.alamatSanggar || '',
    logo: data?.logo_url || specific?.logo,
    services: dbLayanan.length > 0 ? undefined : specific?.services,
    layanan: dbLayanan.length > 0
      ? dbLayanan.map((l) => ({ title: l.title, description: l.description, image: l.image || undefined, price: l.price || undefined }))
      : specific?.layanan || specific?.services || (data?.layanan && Array.isArray(data.layanan) ? data.layanan : fallback.layanan),
    danceSpecialties: specific?.danceSpecialties || specific?.tariUnggulan || fallback.tariUnggulan,
    tariUnggulan: specific?.tariUnggulan || specific?.danceSpecialties || (data?.tari_unggulan && Array.isArray(data.tari_unggulan) && data.tari_unggulan.length > 0
      ? data.tari_unggulan
      : fallback.tariUnggulan),
    prestasi: dbPrestasi.length > 0
      ? dbPrestasi.map((p) => ({ title: p.title, organizer: p.organizer || undefined, year: p.year || undefined }))
      : specific?.prestasi || (data?.prestasi && Array.isArray(data.prestasi) && data.prestasi.length > 0
        ? data.prestasi
        : fallback.prestasi),
    achievements: dbPrestasi.length > 0 ? undefined : specific?.achievements || specific?.prestasi,
    // The curated contact block (phone list, WhatsApp link) is dropped once the admin saves a WhatsApp number
    contacts: data?.kontak_pic ? undefined : specific?.contacts,
    kontak: {
      ketua: data?.ketua_sanggar || specific?.kontak?.ketua || specific?.leader || data?.nama_pimpinan || fallback.kontak.ketua,
      pic: data?.nama_pic || specific?.kontak?.pic || fallback.kontak.pic,
      phone: data?.kontak_pic || curatedPhone || fallback.kontak.phone,
      email: data?.email || specific?.kontak?.email || fallback.kontak.email,
      instagram: dbInstagramUrl || specific?.contacts?.instagram || specific?.kontak?.instagram,
    },
    whatsappNumber: data?.kontak_pic || curatedPhone || data?.no_hp,
    whatsappUrl: data?.kontak_pic
      ? null
      : specific?.whatsappUrl || specific?.contacts?.whatsapp || (specific?.whatsappNumber ? `https://wa.me/${specific.whatsappNumber}` : null),
    instagram: dbInstagramUrl || specific?.contacts?.instagram || specific?.kontak?.instagram,
    instagramUrl: dbInstagramUrl || specific?.instagramUrl || specific?.contacts?.instagram || (specific?.instagram ? (specific.instagram.startsWith("http") ? specific.instagram : `https://instagram.com/${specific.instagram.replace("@", "")}`) : null),
    imageUrl: data?.foto_grup_url || data?.thumbnail_url || specific?.imageUrl || fallback.imageUrl,
    logoUrl: data?.logo_url || specific?.logo || null,
    fotoKetuaUrl: data?.foto_ketua_url || specific?.logo || specific?.fotoKetuaUrl || fallback.fotoKetuaUrl,
    youtubeUrl: data?.youtube_url || specific?.youtubeUrl || specific?.contacts?.youtube || null,
    mapsUrl: data?.maps_url || null,
    videoUrl: specific?.videoUrl || null,
    videoPoster: specific?.videoPoster || null,
    gallery: dbGallery.length > 0
      ? dbGallery.map((g, i) => ({ type: g.caption || `Foto ${i + 1}`, url: g.url }))
      : specific?.gallery || fallback.gallery,
    galleryIsUploaded: dbGallery.length > 0,
  };

  return <SanggarDetailClient sanggar={finalSanggar} />;
}

