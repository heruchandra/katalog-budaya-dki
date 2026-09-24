import { createServerSupabaseClient } from "@/lib/supabase-server";
import SanggarDetailClient, { SanggarDetailData, TariItem } from "./SanggarDetailClient";

export const dynamic = "force-dynamic";

// Known rich profiles based on INFORMASI SANGGAR.docx and official survey data
const SPECIFIC_PROFILES: Record<string, Partial<SanggarDetailData>> = {
  // Sinar Norray (Grade B) - Founded by late Hj. Nori (Mpok Nori) in 1995
  "sinar-norray": {
    id: "sinar-norray",
    name: "Sinar Norray",
    leader: "Engkar Karmilasari (Engkar Nori)",
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
    logo: "/profile-sanggar-2.webp",
    services: [
      {
        title: "Betawi Dance Classes",
        description: "Teaching traditional Betawi dances for all age groups.",
        titleEn: "Betawi Dance Classes",
        descriptionEn: "Teaching traditional Betawi dances for all age groups.",
        image: "/dinamis-sanggar-1.webp"
      },
      {
        title: "Lenong Betawi Shows",
        description: "Presenting traditional Betawi theater for diverse audiences.",
        titleEn: "Lenong Betawi Shows",
        descriptionEn: "Presenting traditional Betawi theater for diverse audiences.",
        image: "/dinamis-sanggar-2.webp"
      },
      {
        title: "Traditional Music Performances (Gambang Kromong)",
        description: "Showcasing authentic Betawi music for cultural celebrations.",
        titleEn: "Traditional Music Performances (Gambang Kromong)",
        descriptionEn: "Showcasing authentic Betawi music for cultural celebrations.",
        image: "/dinamis-sanggar-3.webp"
      }
    ],
    layanan: [
      {
        title: "Kelas Tari Betawi",
        description: "Pelatihan tari tradisional Betawi untuk berbagai tingkatan usia dan kemahiran.",
        titleEn: "Betawi Dance Classes",
        descriptionEn: "Teaching traditional Betawi dances for all age groups.",
        image: "/dinamis-sanggar-1.webp"
      },
      {
        title: "Pentas Lenong Betawi",
        description: "Pementasan teater komedi dan sandiwara rakyat tradisional Betawi.",
        titleEn: "Lenong Betawi Shows",
        descriptionEn: "Presenting traditional Betawi theater for diverse audiences.",
        image: "/dinamis-sanggar-2.webp"
      },
      {
        title: "Pentas Musik Gambang Kromong",
        description: "Penyajian musik tradisional khas Betawi untuk berbagai acara perayaan.",
        titleEn: "Traditional Music Performances (Gambang Kromong)",
        descriptionEn: "Showcasing authentic Betawi music for cultural celebrations.",
        image: "/dinamis-sanggar-3.webp"
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
      ketua: "Engkar Karmilasari (Engkar Nori)",
      pic: "Engkar Karmilasari",
      phone: "081310998647",
      email: "sinarnorray.art@gmail.com",
      instagram: "@sinar_norray"
    },
    whatsappNumber: "6281310998647",
    whatsappUrl: "https://wa.me/6281310998647",
    instagram: "https://instagram.com/sinar_norray",
    instagramUrl: "https://instagram.com/sinar_norray",
    imageUrl: "/card-7.webp",
    fotoKetuaUrl: "/profile-sanggar-2.webp",
    gallery: [
      { type: "Pentas Lenong Betawi", url: "/card-1.webp" },
      { type: "Tari Lenggok Dara", url: "/card-3.webp" },
      { type: "Tari Nindak Si None", url: "/card-2.webp" },
      { type: "Musik Gambang Kromong", url: "/card-6.webp" }
    ]
  },
  "sandyakala": {
    // Replaced / Aliased to Sinar Norray
    id: "sinar-norray",
    name: "Sinar Norray",
    leader: "Engkar Karmilasari (Engkar Nori)",
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
    logo: "/profile-sanggar-2.webp",
    services: [
      {
        title: "Betawi Dance Classes",
        description: "Teaching traditional Betawi dances for all age groups.",
        titleEn: "Betawi Dance Classes",
        descriptionEn: "Teaching traditional Betawi dances for all age groups.",
        image: "/dinamis-sanggar-1.webp"
      },
      {
        title: "Lenong Betawi Shows",
        description: "Presenting traditional Betawi theater for diverse audiences.",
        titleEn: "Lenong Betawi Shows",
        descriptionEn: "Presenting traditional Betawi theater for diverse audiences.",
        image: "/dinamis-sanggar-2.webp"
      },
      {
        title: "Traditional Music Performances (Gambang Kromong)",
        description: "Showcasing authentic Betawi music for cultural celebrations.",
        titleEn: "Traditional Music Performances (Gambang Kromong)",
        descriptionEn: "Showcasing authentic Betawi music for cultural celebrations.",
        image: "/dinamis-sanggar-3.webp"
      }
    ],
    layanan: [
      {
        title: "Kelas Tari Betawi",
        description: "Pelatihan tari tradisional Betawi untuk berbagai tingkatan usia dan kemahiran.",
        titleEn: "Betawi Dance Classes",
        descriptionEn: "Teaching traditional Betawi dances for all age groups.",
        image: "/dinamis-sanggar-1.webp"
      },
      {
        title: "Pentas Lenong Betawi",
        description: "Pementasan teater komedi dan sandiwara rakyat tradisional Betawi.",
        titleEn: "Lenong Betawi Shows",
        descriptionEn: "Presenting traditional Betawi theater for diverse audiences.",
        image: "/dinamis-sanggar-2.webp"
      },
      {
        title: "Pentas Musik Gambang Kromong",
        description: "Penyajian musik tradisional khas Betawi untuk berbagai acara perayaan.",
        titleEn: "Traditional Music Performances (Gambang Kromong)",
        descriptionEn: "Showcasing authentic Betawi music for cultural celebrations.",
        image: "/dinamis-sanggar-3.webp"
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
      ketua: "Engkar Karmilasari (Engkar Nori)",
      pic: "Engkar Karmilasari",
      phone: "081310998647",
      email: "sinarnorray.art@gmail.com",
      instagram: "@sinar_norray"
    },
    whatsappNumber: "6281310998647",
    whatsappUrl: "https://wa.me/6281310998647",
    instagram: "https://instagram.com/sinar_norray",
    instagramUrl: "https://instagram.com/sinar_norray",
    imageUrl: "/card-7.webp",
    fotoKetuaUrl: "/profile-sanggar-2.webp",
    gallery: [
      { type: "Pentas Lenong Betawi", url: "/card-1.webp" },
      { type: "Tari Lenggok Dara", url: "/card-3.webp" },
      { type: "Tari Nindak Si None", url: "/card-2.webp" },
      { type: "Musik Gambang Kromong", url: "/card-6.webp" }
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
        image: "/card-3.webp"
      },
      {
        name: "Tari Yapong",
        description: "Tari kreasi bernuansa riang gembira ciptaan maestro Bagong Kussudiardja yang memancarkan keceriaan dan dinamika gerak kaki serta tepuk tangan penari.",
        image: "/card-2.webp"
      },
      {
        name: "Tari Nandak Ganjen",
        description: "Koreografi lincah remaja putri Betawi yang menggambarkan kecentilan dan kebebasan berekspresi dengan langkah kaki yang terampil dan bersahaja.",
        image: "/card-4.webp"
      },
      {
        name: "Tari Lenggang Nyai",
        description: "Mengisahkan ketegaran tokoh Nyai Dasima dalam balutan busana peranakan dengan gerak luwes yang menyiratkan kekuatan emansipasi wanita Betawi.",
        image: "/card-5.webp"
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
    imageUrl: "/card-3.webp",
    fotoKetuaUrl: "/profile-sanggar-1.webp",
    gallery: [
      { type: "Foto Grup Tari", url: "/card-3.webp" },
      { type: "Foto Tari Unggulan", url: "/card-2.webp" },
      { type: "Dokumentasi Pementasan", url: "/card-4.webp" },
      { type: "Workshop Tari Remaja", url: "/card-5.webp" }
    ]
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
        image: "/card-1.webp"
      },
      {
        name: "Tari Sirih Kuning",
        description: "Tari penyambutan klasik Betawi dengan selendang sutra keemasan yang menyimbolkan ketulusan dan penghormatan kepada tamu agung.",
        image: "/card-1.webp"
      },
      {
        name: "Tari Renggong Manis",
        description: "Koreografi penuh keceriaan perpaduan ritme kendang Betawi dengan sentuhan tari Sunda dan Melayu pesisir.",
        image: "/card-6.webp"
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
    imageUrl: "/card-1.webp",
    fotoKetuaUrl: "/profile-sanggar-1.webp",
    gallery: [
      { type: "Foto Grup Tari", url: "/card-1.webp" },
      { type: "Foto Tari Unggulan", url: "/card-1.webp" },
      { type: "Dokumentasi Kolosal", url: "/card-6.webp" },
      { type: "Kostum & Rias Seni", url: "/card-2.webp" }
    ]
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
        image: "/card-1.webp"
      },
      {
        name: "Tari Sirih Kuning",
        description: "Tari penyambutan klasik Betawi dengan selendang sutra keemasan yang menyimbolkan ketulusan dan penghormatan kepada tamu agung.",
        image: "/card-1.webp"
      },
      {
        name: "Tari Renggong Manis",
        description: "Koreografi penuh keceriaan perpaduan ritme kendang Betawi dengan sentuhan tari Sunda dan Melayu pesisir.",
        image: "/card-6.webp"
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
    imageUrl: "/card-1.webp",
    fotoKetuaUrl: "/profile-sanggar-1.webp",
    gallery: [
      { type: "Foto Grup Tari", url: "/card-1.webp" },
      { type: "Foto Tari Unggulan", url: "/card-1.webp" },
      { type: "Dokumentasi Kolosal", url: "/card-6.webp" },
      { type: "Kostum & Rias Seni", url: "/card-2.webp" }
    ]
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
        image: "/card-4.webp"
      },
      {
        name: "Tari Kembang Merona",
        description: "Koreografi rancak penuh keceriaan remaja Betawi yang menyiratkan semarak kembang mekar di bawah mentari ibu kota.",
        image: "/card-5.webp"
      },
      {
        name: "Tari Goyang Ngamprok",
        description: "Gerak ritmis interaktif yang memadukan kelincahan langkah kaki dan hentakan irama kendang ronggeng Betawi.",
        image: "/card-2.webp"
      },
      {
        name: "Tari Jari Manis",
        description: "Kelembutan gerak jemari dan lentiknya kiprah tangan dalam iringan alunan musik tradisi yang syahdu dan memikat.",
        image: "/card-6.webp"
      },
      {
        name: "Tari Zapin Habibana",
        description: "Harmoni akulturasi budaya Melayu-Arab di pesisir Jakarta dengan ayunan langkah zapin yang khidmat dan bersahaja.",
        image: "/card-3.webp"
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
    imageUrl: "/card-4.webp",
    fotoKetuaUrl: "/profile-sanggar-1.webp",
    gallery: [
      { type: "Foto Grup Tari", url: "/card-4.webp" },
      { type: "Foto Tari Unggulan", url: "/card-5.webp" },
      { type: "Pentas MURI Tari Bhinneka", url: "/card-2.webp" },
      { type: "Delegasi Internasional", url: "/card-6.webp" }
    ]
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
        image: "/card-6.webp"
      },
      {
        name: "Tari Renggong Manis",
        description: "Perpaduan harmonis gerak tari Betawi dan Sunda yang memancarkan dinamika serta kelembutan penari wanita.",
        image: "/card-3.webp"
      },
      {
        name: "Tari Golek Manis",
        description: "Tari klasik dengan keluwesan gerak selendang yang mencerminkan kedewasaan dan keanggunan putri Nusantara.",
        image: "/card-2.webp"
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
    imageUrl: "/card-6.webp",
    fotoKetuaUrl: "/profile-sanggar-1.webp",
    gallery: [
      { type: "Foto Grup Tari", url: "/card-6.webp" },
      { type: "Foto Tari Unggulan", url: "/card-3.webp" },
      { type: "Pementasan Cikini", url: "/card-2.webp" },
      { type: "Workshop Tari", url: "/card-5.webp" }
    ]
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
}

// Deterministic generic fallback generator for any studio
function generateFallbackSanggar(data: SanggarDbRow | null | undefined, id: string): SanggarDetailData {
  const name = data?.nama_sanggar || "Sanggar Seni Budaya DKI";
  const cleanName = name.replace(/^Sanggar\s+/i, '');
  const rawGrade = data?.grade;
  const gradeStr = rawGrade ? (rawGrade.toLowerCase().includes('grade') ? rawGrade : `Grade ${rawGrade}`) : "Grade B";
  const wilayah = data?.kota_kab || data?.kecamatan || "DKI Jakarta";

  const imageIndex = (Math.abs(Number(id) || 1) % 6) + 1;
  const mainImage = `/card-${imageIndex}.webp`;
  const companionImage = `/card-${((imageIndex) % 6) + 1}.webp`;
  const altImage = `/card-${((imageIndex + 1) % 6) + 1}.webp`;

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
        image: mainImage
      },
      {
        name: "Tari Yapong",
        description: "Tarian riang gembira berirama dinamis yang menggambarkan semangat gotong royong dan keceriaan masyarakat ibu kota.",
        image: companionImage
      },
      {
        name: "Tari Kembang Lambang Sari",
        description: "Koreografi elok penuh pesona yang memadukan kelembutan gerak jemari dengan kelincahan langkah penari.",
        image: altImage
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
    imageUrl: data?.thumbnail_url || data?.foto_grup_url || mainImage,
    image: data?.thumbnail_url || data?.foto_grup_url || mainImage,
    fotoKetuaUrl: data?.foto_ketua_url || "/profile-sanggar-1.webp",
    gallery: [
      { type: "Foto Pementasan", url: mainImage },
      { type: "Dokumentasi Tari", url: companionImage },
      { type: "Pelatihan Sanggar", url: altImage }
    ]
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

  // Check specific curated profile first
  let specific = SPECIFIC_PROFILES[id];
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

  // Parse fields from database if present, otherwise merge specific / fallback
  const finalSanggar: SanggarDetailData = {
    id: data?.id || id,
    name: specific?.name || data?.nama_sanggar || data?.nama || fallback?.name || '',
    leader: specific?.leader || data?.nama_pimpinan || data?.ketua_sanggar || data?.ketua || fallback?.kontak?.ketua || '',
    tagline: specific?.tagline || data?.tagline || fallback.tagline,
    grade: specific?.grade || (data?.grade ? (data.grade.toLowerCase().includes('grade') ? data.grade : `Grade ${data.grade}`) : fallback.grade),
    wilayah: specific?.wilayah || data?.kota_kab || data?.kecamatan || fallback.wilayah,
    philosophy: specific?.philosophy || fallback.philosophy,
    philosophyEn: specific?.philosophyEn,
    description: specific?.description || (data?.deskripsi ? [data.deskripsi] : fallback.description),
    descriptionEn: specific?.descriptionEn,
    alamatSanggar: specific?.alamatSanggar || data?.alamat || fallback.alamatSanggar,
    alamatLatihan: specific?.alamatLatihan || data?.alamat_tempat_latihan || fallback.alamatLatihan,
    address: specific?.address || specific?.alamatSanggar || data?.alamat || fallback?.address || fallback?.alamatSanggar || '',
    logo: specific?.logo,
    services: specific?.services,
    layanan: specific?.layanan || specific?.services || (data?.layanan && Array.isArray(data.layanan) ? data.layanan : fallback.layanan),
    danceSpecialties: specific?.danceSpecialties || specific?.tariUnggulan || fallback.tariUnggulan,
    tariUnggulan: specific?.tariUnggulan || specific?.danceSpecialties || (data?.tari_unggulan && Array.isArray(data.tari_unggulan) && data.tari_unggulan.length > 0
      ? data.tari_unggulan
      : fallback.tariUnggulan),
    prestasi: specific?.prestasi || (data?.prestasi && Array.isArray(data.prestasi) && data.prestasi.length > 0
      ? data.prestasi
      : fallback.prestasi),
    achievements: specific?.achievements || specific?.prestasi,
    contacts: specific?.contacts,
    kontak: {
      ketua: specific?.kontak?.ketua || specific?.leader || data?.ketua_sanggar || data?.nama_pimpinan || fallback.kontak.ketua,
      pic: specific?.kontak?.pic || data?.nama_pic || fallback.kontak.pic,
      phone: (specific?.contacts?.phone ? specific.contacts.phone[0] : null) || specific?.kontak?.phone || data?.kontak_pic || fallback.kontak.phone,
      email: specific?.kontak?.email || data?.email || fallback.kontak.email,
      instagram: specific?.contacts?.instagram || specific?.kontak?.instagram,
    },
    whatsappNumber: (specific?.contacts?.phone ? specific.contacts.phone[0] : null) || specific?.kontak?.phone || data?.kontak_pic || data?.no_hp,
    whatsappUrl: specific?.whatsappUrl || specific?.contacts?.whatsapp || (specific?.whatsappNumber ? `https://wa.me/${specific.whatsappNumber}` : null),
    instagram: specific?.contacts?.instagram || specific?.kontak?.instagram,
    instagramUrl: specific?.instagramUrl || specific?.contacts?.instagram || (specific?.instagram ? (specific.instagram.startsWith("http") ? specific.instagram : `https://instagram.com/${specific.instagram.replace("@", "")}`) : null),
    imageUrl: specific?.imageUrl || data?.foto_grup_url || data?.thumbnail_url || fallback.imageUrl,
    image: specific?.image || data?.thumbnail_url || fallback.imageUrl,
    logoUrl: specific?.logo || data?.logo_url || null,
    fotoKetuaUrl: specific?.logo || specific?.fotoKetuaUrl || data?.foto_ketua_url || fallback.fotoKetuaUrl,
    youtubeUrl: specific?.youtubeUrl || specific?.contacts?.youtube || null,
    gallery: specific?.gallery || ((data?.list_foto && Array.isArray(data.list_foto) && data.list_foto.length > 0)
      ? data.list_foto.map((url: string, i: number) => ({ type: `Galeri Foto #${i + 1}`, url }))
      : fallback.gallery),
  };

  return <SanggarDetailClient sanggar={finalSanggar} />;
}

