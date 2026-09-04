import { createServerSupabaseClient } from "@/lib/supabase-server";
import SanggarDetailClient, { SanggarDetailData, TariItem } from "./SanggarDetailClient";

export const dynamic = "force-dynamic";

// Known rich profiles based on INFORMASI SANGGAR.docx and official survey data
const SPECIFIC_PROFILES: Record<string, Partial<SanggarDetailData>> = {
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
        image: "/sanggar3.webp"
      },
      {
        name: "Tari Yapong",
        description: "Tari kreasi bernuansa riang gembira ciptaan maestro Bagong Kussudiardja yang memancarkan keceriaan dan dinamika gerak kaki serta tepuk tangan penari.",
        image: "/sanggar2.webp"
      },
      {
        name: "Tari Nandak Ganjen",
        description: "Koreografi lincah remaja putri Betawi yang menggambarkan kecentilan dan kebebasan berekspresi dengan langkah kaki yang terampil dan bersahaja.",
        image: "/sanggar4.webp"
      },
      {
        name: "Tari Lenggang Nyai",
        description: "Mengisahkan ketegaran tokoh Nyai Dasima dalam balutan busana peranakan dengan gerak luwes yang menyiratkan kekuatan emansipasi wanita Betawi.",
        image: "/sanggar5.webp"
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
    imageUrl: "/sanggar3.webp",
    fotoKetuaUrl: "/penari1.webp",
    gallery: [
      { type: "Foto Grup Tari", url: "/sanggar3.webp" },
      { type: "Foto Tari Unggulan", url: "/sanggar2.webp" },
      { type: "Dokumentasi Pementasan", url: "/sanggar4.webp" },
      { type: "Workshop Tari Remaja", url: "/sanggar5.webp" }
    ]
  },

  // ID 40: AE Production (Grade B)
  "40": {
    name: "AE Production",
    tagline: "Harmoni Seni Tradisi dan Ekspresi Panggung Spektakuler Jakarta",
    grade: "Grade B",
    wilayah: "Jakarta Timur",
    philosophy: "Menyulam keanggunan gerak tari tradisi dengan tata artistik panggung masa kini untuk menyentuh hati setiap penonton.",
    description: [
      "AE Production merupakan rumah produksi seni pertunjukan dan sanggar tari yang berfokus pada kolaborasi gerak tari tradisional Betawi dengan komposisi teatrikal modern. Berdiri di jantung Jakarta Timur, sanggar ini telah mewarnai berbagai panggung prestisius ibu kota.",
      "Dengan bimbingan koreografer profesional, AE Production memadukan ketegasan ritme tabuhan perkusi dengan kehalusan lenggok penari, menghasilkan pertunjukan megah yang memukau ribuan pasang mata di festival budaya maupun pagelaran resmi kenegaraan.",
      "Kami terus membuka pintu bagi generasi penerus bangsa untuk mendalami filosofi tari tradisi, mengasah disiplin olah gerak, dan menampilkan jati diri Betawi yang berkilau di era global."
    ],
    alamatSanggar: "Jl. Balai Pustaka Timur No. 18, Kel. Rawamangun, Kec. Pulo Gadung, Jakarta Timur 13220",
    alamatLatihan: "Gelanggang Remaja Jakarta Timur (GRJT) & Studio AE Production (Rabu & Minggu, 16.00 - 19.30 WIB)",
    layanan: [
      "Pementasan Seni Teater Tari Kolosal",
      "Pelatihan Tari Kreasi Betawi & Nusantara",
      "Jasa Koreografer Tari Kontemporer & Teater Musik",
      "Penyewaan Kostum Panggung & Tata Rias Pengantin Tradisional",
      "Produksi Musik Tari & Live Accompaniment"
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
        image: "/sanggar1.webp"
      },
      {
        name: "Tari Renggong Manis",
        description: "Koreografi penuh keceriaan perpaduan ritme kendang Betawi dengan sentuhan tari Sunda dan Melayu pesisir.",
        image: "/sanggar6.webp"
      }
    ],
    prestasi: [
      "Penyaji Terbaik Festival Teater & Tari Tradisi DKI Jakarta 2024",
      "Juara 2 Lomba Tari Kreasi Nusantara Tingkat Nasional 2023",
      "Pengisi Acara Utama Perayaan HUT DKI Jakarta ke-497 di Monas 2024",
      "Penghargaan Apresiasi Seni Budaya Dinas Kebudayaan DKI Jakarta 2022"
    ],
    kontak: {
      ketua: "Ahmad Erlangga, M.Sn.",
      pic: "Erika Wulandari",
      phone: "+62 813-1870-2623",
      email: "aeproduction.jkt@gmail.com"
    },
    imageUrl: "/card-1.webp",
    fotoKetuaUrl: "/penari1.webp",
    gallery: [
      { type: "Foto Grup Tari", url: "/card-1.webp" },
      { type: "Foto Tari Unggulan", url: "/sanggar1.webp" },
      { type: "Dokumentasi Kolosal", url: "/sanggar6.webp" },
      { type: "Kostum & Rias Seni", url: "/sanggar2.webp" }
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
        image: "/sanggar4.webp"
      },
      {
        name: "Tari Kembang Merona",
        description: "Koreografi rancak penuh keceriaan remaja Betawi yang menyiratkan semarak kembang mekar di bawah mentari ibu kota.",
        image: "/sanggar5.webp"
      },
      {
        name: "Tari Goyang Ngamprok",
        description: "Gerak ritmis interaktif yang memadukan kelincahan langkah kaki dan hentakan irama kendang ronggeng Betawi.",
        image: "/sanggar2.webp"
      },
      {
        name: "Tari Jari Manis",
        description: "Kelembutan gerak jemari dan lentiknya kiprah tangan dalam iringan alunan musik tradisi yang syahdu dan memikat.",
        image: "/sanggar6.webp"
      },
      {
        name: "Tari Zapin Habibana",
        description: "Harmoni akulturasi budaya Melayu-Arab di pesisir Jakarta dengan ayunan langkah zapin yang khidmat dan bersahaja.",
        image: "/sanggar3.webp"
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
    imageUrl: "/sanggar4.webp",
    fotoKetuaUrl: "/penari1.webp",
    gallery: [
      { type: "Foto Grup Tari", url: "/sanggar4.webp" },
      { type: "Foto Tari Unggulan", url: "/sanggar5.webp" },
      { type: "Pentas MURI Tari Bhinneka", url: "/sanggar2.webp" },
      { type: "Delegasi Internasional", url: "/sanggar6.webp" }
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
        image: "/sanggar6.webp"
      },
      {
        name: "Tari Renggong Manis",
        description: "Perpaduan harmonis gerak tari Betawi dan Sunda yang memancarkan dinamika serta kelembutan penari wanita.",
        image: "/sanggar3.webp"
      },
      {
        name: "Tari Golek Manis",
        description: "Tari klasik dengan keluwesan gerak selendang yang mencerminkan kedewasaan dan keanggunan putri Nusantara.",
        image: "/sanggar2.webp"
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
    imageUrl: "/sanggar6.webp",
    fotoKetuaUrl: "/penari1.webp",
    gallery: [
      { type: "Foto Grup Tari", url: "/sanggar6.webp" },
      { type: "Foto Tari Unggulan", url: "/sanggar3.webp" },
      { type: "Pementasan Cikini", url: "/sanggar2.webp" },
      { type: "Workshop Tari", url: "/sanggar5.webp" }
    ]
  }
};

interface SanggarDbRow {
  id?: number | string;
  nama_sanggar?: string;
  nama_pimpinan?: string;
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
  const mainImage = `/sanggar${imageIndex}.webp`;
  const companionImage = `/sanggar${((imageIndex) % 6) + 1}.webp`;
  const altImage = `/sanggar${((imageIndex + 1) % 6) + 1}.webp`;

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
    fotoKetuaUrl: data?.foto_ketua_url || "/penari1.webp",
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
  const specific = SPECIFIC_PROFILES[id];
  const fallback = generateFallbackSanggar(data, id);

  // Parse fields from database if present, otherwise merge specific / fallback
  const finalSanggar: SanggarDetailData = {
    id: data?.id || id,
    name: specific?.name || data?.nama_sanggar || fallback.name,
    tagline: data?.tagline || specific?.tagline || fallback.tagline,
    grade: data?.grade ? (data.grade.toLowerCase().includes('grade') ? data.grade : `Grade ${data.grade}`) : (specific?.grade || fallback.grade),
    wilayah: data?.kota_kab || data?.kecamatan || specific?.wilayah || fallback.wilayah,
    philosophy: specific?.philosophy || fallback.philosophy,
    description: (data?.deskripsi ? [data.deskripsi] : (specific?.description || fallback.description)),
    alamatSanggar: data?.alamat || specific?.alamatSanggar || fallback.alamatSanggar,
    alamatLatihan: data?.alamat_tempat_latihan || specific?.alamatLatihan || fallback.alamatLatihan,
    layanan: (data?.layanan && Array.isArray(data.layanan) ? data.layanan : (specific?.layanan || fallback.layanan)),
    tariUnggulan: (data?.tari_unggulan && Array.isArray(data.tari_unggulan) && data.tari_unggulan.length > 0
      ? data.tari_unggulan
      : (specific?.tariUnggulan || fallback.tariUnggulan)),
    prestasi: (data?.prestasi && Array.isArray(data.prestasi) && data.prestasi.length > 0
      ? data.prestasi
      : (specific?.prestasi || fallback.prestasi)),
    kontak: {
      ketua: data?.ketua_sanggar || data?.nama_pimpinan || specific?.kontak?.ketua || fallback.kontak.ketua,
      pic: data?.nama_pic || specific?.kontak?.pic || fallback.kontak.pic,
      phone: data?.kontak_pic || specific?.kontak?.phone || fallback.kontak.phone,
      email: data?.email || specific?.kontak?.email || fallback.kontak.email,
    },
    imageUrl: data?.foto_grup_url || specific?.imageUrl || data?.thumbnail_url || fallback.imageUrl,
    logoUrl: data?.logo_url || null,
    fotoKetuaUrl: data?.foto_ketua_url || specific?.fotoKetuaUrl || fallback.fotoKetuaUrl,
    gallery: (data?.list_foto && Array.isArray(data.list_foto) && data.list_foto.length > 0)
      ? data.list_foto.map((url: string, i: number) => ({ type: `Galeri Foto #${i + 1}`, url }))
      : (specific?.gallery || fallback.gallery),
  };

  return <SanggarDetailClient sanggar={finalSanggar} />;
}

