"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Language = "id" | "en";

const translations: Record<string, Record<Language, string>> = {
  // ── Navbar ──
  navHome: { id: "Beranda", en: "Home" },
  navSanggar: { id: "Sanggar Tari", en: "Dance Studios" },
  navPemusik: { id: "Seniman Musik", en: "Music Artists" },
  navDashboard: { id: "Dasbor", en: "Dashboard" },
  navDashboardAdmin: { id: "Dasbor Admin", en: "Admin Dashboard" },
  navLogout: { id: "Keluar", en: "Sign Out" },
  login: { id: "Masuk", en: "Login" },

  // ── Login ──
  loginBackToHome: { id: "Kembali ke Beranda", en: "Back to Home" },
  loginWelcomeTitle: { id: "Selamat Datang", en: "Welcome" },
  loginWelcomeSubtitle: { id: "Masuk ke Katalog Seni DKI Jakarta", en: "Sign in to Katalog Seni DKI Jakarta" },
  loginEmailLabel: { id: "Email", en: "Email" },
  loginEmailPlaceholder: { id: "nama@email.com", en: "name@email.com" },
  loginPasswordLabel: { id: "Password", en: "Password" },
  loginPasswordPlaceholder: { id: "Masukkan password", en: "Enter password" },
  loginButton: { id: "Masuk", en: "Sign In" },
  loginOr: { id: "Atau", en: "Or" },
  loginGoogleButton: { id: "Masuk dengan Google", en: "Sign in with Google" },
  loginNoAccount: { id: "Belum punya akun?", en: "Don't have an account?" },
  loginRegisterHere: { id: "Daftar di sini", en: "Register here" },
  loginDisclaimer: { id: "Hanya untuk staf Dinas Kebudayaan DKI Jakarta yang terdaftar. Hubungi administrator jika Anda memerlukan akses.", en: "Only for registered Jakarta Culture Agency staff. Contact administrator if you need access." },

  // ── Sanggar Detail Page ──
  backToCatalog: { id: "KEMBALI KE KATALOG", en: "BACK TO CATALOG" },
  verified: { id: "TERVERIFIKASI", en: "VERIFIED" },
  descSanggar: { id: "DESKRIPSI SANGGAR", en: "STUDIO DESCRIPTION" },
  est: { id: "BERDIRI SEJAK", en: "ESTABLISHED" },
  members: { id: "ANGGOTA", en: "MEMBERS" },
  featuredDances: { id: "TARI UNGGULAN", en: "FEATURED DANCES" },
  profileContact: { id: "PROFIL & INFORMASI KONTAK", en: "PROFILE & CONTACT INFO" },
  studioHead: { id: "KETUA SANGGAR", en: "STUDIO HEAD" },
  secretariat: { id: "SEKRETARIAT", en: "SECRETARIAT" },
  trainingVenue: { id: "TEMPAT LATIHAN", en: "TRAINING VENUE" },
  picName: { id: "NAMA PIC", en: "PIC NAME" },
  phone: { id: "TELEPON", en: "PHONE" },
  contactBtn: { id: "HUBUNGI", en: "CONTACT" },
  services: { id: "LAYANAN SANGGAR", en: "STUDIO SERVICES" },
  achievements: { id: "PRESTASI", en: "ACHIEVEMENTS" },
  gallery: { id: "GALERI & DOKUMENTASI", en: "GALLERY & DOCUMENTATION" },
  sanggarNotFound: { id: "Sanggar tidak ditemukan.", en: "Studio not found." },

  // ── Hero (Home) ──
  heroDiscover: { id: "Temukan", en: "Discover" },
  heroArtists: { id: "Pelaku Seni", en: "Traditional Artists" },
  heroBestIn: { id: "Tradisional Terbaik di Jakarta", en: "The Best in Jakarta" },
  searchAllCat: { id: "Semua Kategori", en: "All Categories" },
  searchDanceCat: { id: "Sanggar Tari", en: "Dance Studios" },
  searchMusicCat: { id: "Seniman Musik", en: "Music Artists" },
  searchHeroPlaceholder: {
    id: 'Cari seniman, genre... (cth: "Tari Betawi")',
    en: 'Search artist, genre... (e.g. "Tari Betawi")',
  },
  searchBtn: { id: "Cari", en: "Search" },
  searchPlaceholder: {
    id: 'Cari seniman, genre... (cth: "Tari Betawi")',
    en: 'Search artists, genres... (e.g. "Tari Betawi")',
  },
  btnSearch: { id: "Cari", en: "Search" },
  categoryAll: { id: "Semua Kategori", en: "All Categories" },
  categorySanggar: { id: "Sanggar Tari", en: "Dance Studios" },
  categoryPemusik: { id: "Seniman Musik", en: "Music Artists" },
  searchLoading: { id: "Mencari...", en: "Searching..." },
  searchNoResults: { id: "Tidak ada hasil ditemukan.", en: "No results found." },
  searchAriaLabel: { id: "Cari pelaku seni", en: "Search artists" },

  // ── Editorial Banner ──
  bannerSoul: { id: "Jiwa", en: "Soul" },
  bannerJakarta: { id: "Jakarta.", en: "of Jakarta." },
  bannerArt: { id: "Seni", en: "Art" },
  bannerOurs: { id: "Kita.", en: "of Ours." },

  // ── Category Grid (Home) ──
  viewSanggar: { id: "Lihat Sanggar", en: "View Studios" },
  viewPemusik: { id: "Lihat Pemusik", en: "View Musicians" },
  categorySenimanMusik: { id: "Seniman Musik", en: "Music Artists" },

  // ── Features Section (Home) ──
  featuresTitle: { id: "Kenapa Menggunakan", en: "Why Use" },
  featuresSubtitle: {
    id: "Platform terpercaya dari Dinas Kebudayaan untuk menghubungkan masyarakat dengan pelaku seni terbaik Jakarta.",
    en: "A trusted platform by the Department of Culture connecting the public with Jakarta's finest artists.",
  },
  featureVerifiedTitle: { id: "Terverifikasi Resmi", en: "Officially Verified" },
  featureVerifiedDesc: {
    id: "Setiap sanggar dan seniman telah melalui proses grading dan verifikasi oleh Dinas Kebudayaan DKI Jakarta.",
    en: "Every studio and artist has been graded and verified by the DKI Jakarta Department of Culture.",
  },
  featureSearchTitle: { id: "Pencarian Mudah", en: "Easy Search" },
  featureSearchDesc: {
    id: "Cari berdasarkan kategori, genre, lokasi, atau nama. Temukan seniman yang tepat dalam hitungan detik.",
    en: "Search by category, genre, location, or name. Find the right artist in seconds.",
  },
  featureContactTitle: { id: "Hubungi Langsung", en: "Direct Contact" },
  featureContactDesc: {
    id: "Setiap profil dilengkapi kontak WhatsApp PIC untuk memudahkan komunikasi dan pemesanan langsung.",
    en: "Every profile includes a WhatsApp PIC contact for easy communication and direct booking.",
  },

  // ── Sanggar Catalog ──
  sanggarBackBtn: { id: "Kembali", en: "Back" },
  sanggarPageTitle: { id: "Koleksi Sanggar Tari", en: "Dance Studio Collection" },
  sanggarRegistered: { id: "SANGGAR TERDAFTAR", en: "REGISTERED STUDIOS" },
  sanggarCatalogFallback: { id: "KATALOG SANGGAR TARI TRADISIONAL JAKARTA", en: "JAKARTA TRADITIONAL DANCE STUDIO CATALOG" },
  sanggarSearchTitle: { id: "Pencarian", en: "Search" },
  sanggarSearchPlaceholder: { id: "Cari nama sanggar...", en: "Search studio name..." },
  sanggarFilterGrade: { id: "Filter Grade", en: "Filter by Grade" },
  sanggarGradeAll: { id: "SEMUA GRADE", en: "ALL GRADES" },
  sanggarEmptyTitle: { id: "Belum Ada Data", en: "No Data Yet" },
  sanggarEmptyFilter: { id: "Tidak ditemukan sanggar yang sesuai dengan filter Anda.", en: "No studios found matching your filters." },
  sanggarEmptyDefault: { id: "Data sanggar tari belum tersedia saat ini.", en: "Dance studio data is not available at this time." },
  sanggarResetFilter: { id: "RESET FILTER", en: "RESET FILTERS" },

  // ── Pemusik Catalog ──
  pemusikBackBtn: { id: "Kembali", en: "Back" },
  pemusikPageTitle: { id: "Koleksi Seniman Musik", en: "Music Artists Collection" },
  pemusikRegistered: { id: "SENIMAN MUSIK TERDAFTAR", en: "REGISTERED MUSIC ARTISTS" },
  pemusikCatalogFallback: { id: "KATALOG SENIMAN MUSIK TRADISIONAL JAKARTA", en: "JAKARTA TRADITIONAL MUSIC ARTIST CATALOG" },
  pemusikSearchTitle: { id: "Pencarian", en: "Search" },
  pemusikSearchPlaceholder: { id: "Cari nama, genre, instrumen...", en: "Search name, genre, instrument..." },
  pemusikFilterJenis: { id: "Filter Jenis", en: "Filter by Type" },
  pemusikJenisAll: { id: "SEMUA JENIS", en: "ALL TYPES" },
  pemusikEmptyTitle: { id: "Belum Ada Data", en: "No Data Yet" },
  pemusikEmptyFilter: { id: "Tidak ditemukan seniman musik yang sesuai dengan filter Anda.", en: "No music artists found matching your filters." },
  pemusikEmptyDefault: { id: "Data seniman musik belum tersedia saat ini.", en: "Music artist data is not available at this time." },
  pemusikResetFilter: { id: "RESET FILTER", en: "RESET FILTERS" },

  // ── Footer ──
  footerDescription: {
    id: "Platform katalog digital pelaku seni dan budaya tradisional Jakarta. Memudahkan pencarian seniman, sanggar tari, dan seniman musik berkualitas.",
    en: "Digital catalog platform for Jakarta's traditional arts and cultural practitioners. Makes it easy to find high-quality artists, dance studios, and music artists.",
  },
  footerCatalog: { id: "Katalog", en: "Catalog" },
  footerInfo: { id: "Informasi", en: "Information" },
  footerAbout: { id: "Tentang Kami", en: "About Us" },
  footerPrivacy: { id: "Kebijakan Privasi", en: "Privacy Policy" },
  footerTerms: { id: "Syarat & Ketentuan", en: "Terms & Conditions" },
  footerContact: { id: "Kontak", en: "Contact" },
  footerCopyright: { id: "Hak Cipta Dilindungi.", en: "All Rights Reserved." },
  footerBuiltWith: {
    id: "Dibangun dengan dedikasi untuk pelestarian seni dan budaya tradisional DKI Jakarta.",
    en: "Built with dedication to the preservation of DKI Jakarta's traditional arts and culture.",
  },

  // ── Admin Dashboard ──
  adminSidebarDashboard: { id: "Dasbor", en: "Dashboard" },
  adminSidebarSanggar: { id: "Data Sanggar", en: "Dance Studio Data" },
  adminSidebarMusik: { id: "Data Seniman Musik", en: "Music Artist Data" },
  adminSidebarSettings: { id: "Pengaturan", en: "Settings" },
  adminSidebarWeb: { id: "Lihat Website", en: "View Website" },
  adminSidebarLogout: { id: "Keluar", en: "Sign Out" },
  adminTitleOverview: { id: "Dashboard Overview", en: "Dashboard Overview" },
  adminDescOverview: {
    id: "Ringkasan statistik dan aktivitas terbaru Katalog Seni DKI Jakarta.",
    en: "Summary of statistics and recent activities in the Jakarta Art Catalog."
  },
  adminStatTotalSanggar: { id: "Total Sanggar", en: "Total Dance Studios" },
  adminStatTotalMusik: { id: "Total Seniman Musik", en: "Total Music Artists" },
  adminStatPending: { id: "Menunggu Verifikasi", en: "Pending Verification" },
  adminStatVerified: { id: "Terverifikasi", en: "Verified" },
  adminChartTitle: { id: "Statistik Pendaftaran (2026)", en: "Registration Statistics (2026)" },
  adminDataSanggarTitle: { id: "Data Sanggar Tari", en: "Dance Studio Data" },
  adminDataSanggarDesc: { id: "Kelola data sanggar tari tradisional di DKI Jakarta.", en: "Manage traditional dance studio data in Jakarta." },
  adminBtnAddData: { id: "Tambah Data", en: "Add Data" },
  adminSearchSanggar: { id: "Cari sanggar...", en: "Search studio..." },
  colName: { id: "NAMA SANGGAR", en: "STUDIO NAME" },
  colCategory: { id: "KATEGORI/GRADE", en: "CATEGORY/GRADE" },
  colDanceType: { id: "JENIS TARIAN", en: "DANCE TYPE" },
  colStatus: { id: "STATUS", en: "STATUS" },
  colAction: { id: "AKSI", en: "ACTION" },
  statusActive: { id: "Aktif", en: "Active" },
  adminRecentActivityTitle: { id: "Aktivitas Terbaru", en: "Recent Activity" },
  colEntityName: { id: "NAMA ENTITAS", en: "ENTITY NAME" },
  colType: { id: "TIPE", en: "TYPE" },
  colActivity: { id: "AKTIVITAS", en: "ACTIVITY" },
  colTime: { id: "WAKTU", en: "TIME" },
  newRegistration: { id: "Pendaftaran Baru", en: "New Registration" },
  adminDataMusikTitle: { id: "Data Seniman Musik", en: "Music Artist Data" },
  adminDataMusikDesc: { id: "Kelola data seniman dan pemusik tradisional di DKI Jakarta.", en: "Manage traditional music artist data in Jakarta." },
  adminSearchMusik: { id: "Cari seniman...", en: "Search artist..." },
  colArtistName: { id: "NAMA SENIMAN", en: "ARTIST NAME" },
  colCategoryMusik: { id: "KATEGORI", en: "CATEGORY" },
  colGenreInstrument: { id: "GENRE & INSTRUMEN", en: "GENRE & INSTRUMENT" },
  adminSettingsTitle: { id: "Pengaturan Akun", en: "Account Settings" },
  adminSettingsDesc: { id: "Kelola profil dan keamanan akun administrator Anda.", en: "Manage your administrator account profile and security." },
  adminProfileTitle: { id: "Profil Administrator", en: "Administrator Profile" },
  adminProfileDesc: { id: "Informasi dasar akun Anda.", en: "Basic information of your account." },
  adminEmailLabel: { id: "Alamat Email", en: "Email Address" },
  adminEmailNote: { id: "Email ini digunakan untuk login dan tidak dapat diubah.", en: "This email is used for login and cannot be changed." },
  adminPassTitle: { id: "Ganti Password", en: "Change Password" },
  adminPassDesc: { id: "Pastikan akun Anda menggunakan password yang kuat.", en: "Ensure your account uses a strong password." },
  adminPassNew: { id: "Password Baru", en: "New Password" },
  adminPassConfirm: { id: "Konfirmasi Password Baru", en: "Confirm New Password" },
  adminBtnSavePass: { id: "Simpan Password", en: "Save Password" },

  // ── Admin Edit Sanggar ──
  adminBackToSanggar: { id: "Kembali ke Data Sanggar", en: "Back to Dance Studio Data" },
  adminEditSanggarTitle: { id: "Edit Data Sanggar", en: "Edit Dance Studio Data" },
  adminEditSanggarDesc: { id: "Ubah informasi sanggar dan simpan perubahan.", en: "Edit studio information and save changes." },
  adminBasicInfo: { id: "Informasi Dasar", en: "Basic Information" },
  adminAddressContact: { id: "Alamat & Kontak", en: "Address & Contact" },
  adminSanggarName: { id: "Nama Sanggar", en: "Studio Name" },
  adminSanggarCategory: { id: "Kategori / Grade", en: "Category / Grade" },
  adminSanggarTagline: { id: "Tagline Sanggar", en: "Studio Tagline" },
  adminSanggarDesc: { id: "Deskripsi Sanggar", en: "Studio Description" },
  adminSanggarAddress: { id: "Alamat Sanggar (Sekretariat)", en: "Studio Address (Secretariat)" },
  adminSanggarPracticeAddress: { id: "Alamat Tempat Latihan", en: "Practice Location Address" },
  adminBtnCancel: { id: "Batal", en: "Cancel" },
  adminBtnSaveChanges: { id: "Simpan Perubahan", en: "Save Changes" },
  adminLeader: { id: "Ketua Sanggar", en: "Studio Leader" },
  adminPICName: { id: "Nama PIC / Kontak", en: "PIC Name / Contact" },
  adminPICPhone: { id: "Nomor WhatsApp PIC", en: "PIC WhatsApp Number" },
  adminServicesSection: { id: "Layanan & Prestasi", en: "Services & Achievements" },
  adminStudioServices: { id: "Layanan Sanggar", en: "Studio Services" },
  adminAchievements: { id: "Prestasi / Penghargaan", en: "Achievements / Awards" },
  adminMediaSection: { id: "Media & Galeri", en: "Media & Gallery" },
  adminBtnAddPhoto: { id: "Tambah Foto", en: "Add Photo" },
  adminBtnUpload: { id: "Unggah", en: "Upload" },

  // ── Dynamic Fields & Image Upload ──
  adminFeaturedDance: { id: "Tari Unggulan", en: "Featured Dances" },
  adminBtnAddDance: { id: "Tambah Tari", en: "Add Dance" },
  adminDanceName: { id: "NAMA TARI", en: "DANCE NAME" },
  adminDanceDesc: { id: "DESKRIPSI TARI", en: "DANCE DESCRIPTION" },
  adminFeaturedWork: { id: "Karya Unggulan", en: "Featured Works" },
  adminBtnAddWork: { id: "Tambah Karya", en: "Add Work" },
  adminWorkName: { id: "NAMA KARYA", en: "WORK NAME" },
  adminWorkDesc: { id: "DESKRIPSI KARYA", en: "WORK DESCRIPTION" },
  adminPhotoLeader: { id: "Foto Ketua Sanggar", en: "Studio Leader Photo" },
  adminPhotoArtist: { id: "Foto Seniman", en: "Artist Photo" },
  adminClickToUpload: { id: "Klik untuk memilih gambar", en: "Click to select image" },
  adminUploadSupport: { id: "Mendukung JPG, PNG, WebP (Max 5MB)", en: "Supports JPG, PNG, WebP (Max 5MB)" },
  adminLogoIdentity: { id: "Logo & Identitas Utama", en: "Logo & Main Identity" },
  adminStudioLogo: { id: "Logo Sanggar", en: "Studio Logo" },
  adminArtistLogo: { id: "Logo Seniman", en: "Artist Logo" },
  adminThumbnailSection: { id: "Gambar Thumbnail Katalog (3:4)", en: "Catalog Thumbnail Image (3:4)" },
  adminDancerCard: { id: "Foto Card Penari", en: "Dancer Card Photo" },
  adminGallerySection: { id: "Galeri & Penampilan", en: "Gallery & Performances" },
  adminGroupPhoto: { id: "Foto Grup Tari", en: "Dance Group Photo" },
  adminFeaturedPhoto: { id: "Foto Tari Unggulan", en: "Featured Dance Photo" },
  adminMusicCard: { id: "Foto Card Seniman", en: "Artist Card Photo" },
  adminMusicGroupPhoto: { id: "Foto Grup/Panggung", en: "Group/Stage Photo" },

  // Pemusik Specifics
  adminBackToMusic: { id: "Kembali ke Data Pemusik", en: "Back to Music Artist Data" },
  adminEditMusicTitle: { id: "Edit Data Pemusik", en: "Edit Music Artist Data" },
  adminEditMusicDesc: { id: "Ubah informasi seniman atau pemusik tradisional.", en: "Edit traditional music artist information." },
  adminArtistName: { id: "Nama Seniman / Grup", en: "Artist / Group Name" },
  adminArtistCategory: { id: "Kategori / Jenis", en: "Category / Type" },
  adminMusicGenre: { id: "Genre Musik", en: "Music Genre" },
  adminMusicInstrument: { id: "Instrumen / Spesialisasi", en: "Instrument / Specialization" },
  adminArtistDesc: { id: "Deskripsi Seniman", en: "Artist Description" },
  adminArtistAddress: { id: "Alamat Basecamp / Sekretariat", en: "Basecamp / Secretariat Address" },
  adminMusicServices: { id: "Layanan Penampilan", en: "Performance Services" },

  // Dashboard Specifics
  dashboardDance: { id: "Sanggar", en: "Dance Studio" },
  dashboardMusic: { id: "Seniman Musik", en: "Music Artist" },
  dashboardActNew: { id: "Pendaftaran Baru", en: "New Registration" },
  dashboardStatusActive: { id: "Aktif", en: "Active" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("id");

  const t = useCallback(
    (key: string): string => {
      return translations[key]?.[language] ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
