# Dokumen Kebutuhan Produk (PRD): Katalog Digital Pelaku Seni Budaya (Dinas Kebudayaan DKI Jakarta)

---

## 1. Ringkasan & Tujuan Dokumen

### 1.1 Ringkasan

**Katalog Digital Pelaku Seni Budaya** adalah sistem direktori berbasis web yang dibangun untuk Dinas Kebudayaan Provinsi DKI Jakarta. Sistem ini berfungsi sebagai platform terpusat bagi publik, Event Organizer (EO), pihak swasta, hingga instansi kedutaan untuk mencari, melihat profil, dan menghubungi langsung seniman serta kelompok seni tradisional secara mandiri. Platform ini akan mendigitalkan dan menggantikan proses pendataan yang sebelumnya menggunakan *spreadsheet* atau dokumen teks manual.

### 1.2 Tujuan Bisnis & Dampak

* **Pemberdayaan Ekonomi:** Memfasilitasi pemesanan komersial secara langsung agar pelaku seni tradisional bisa mendapatkan eksposur dan pendapatan mandiri di luar acara yang difasilitasi atau didanai pemerintah.


* **Transformasi & Standardisasi Digital:** Menstandardisasi kategorisasi seniman menjadi klasifikasi yang terstruktur (Grade A/B untuk Sanggar Tari; Solo/Komunitas untuk Pemusik) dalam satu ekosistem *database* terpadu.


* **Aksesibilitas Publik:** Menyediakan platform web yang estetik, responsif (*mobile-friendly*), dan teroptimasi SEO agar mudah ditemukan di mesin pencari.

---

## 2. Persona Pengguna & Target Audiens

| Peran Pengguna | Deskripsi | Kebutuhan Utama |
| --- | --- | --- |
| **Klien / Publik (EO, Swasta, Kedutaan)** | Pengguna eksternal yang sedang mencari referensi atau ingin menyewa jasa penari tradisional dan pemusik.

 | Pencarian cepat, visualisasi *grade*/kategori yang jelas, portofolio karya, dan tombol untuk langsung menghubungi PIC via WhatsApp.

 |
| **Admin Dinas** | Staf pengelola di internal Dinas Kebudayaan DKI Jakarta.

 | Panel kendali (CMS) sederhana untuk menambah (*input*), mengedit, atau memperbarui informasi seniman tanpa perlu keahlian *coding*. |

---

## 3. Arsitektur Sistem & *Tech Stack*

Pembangunan sistem akan menggunakan standar teknologi web modern yang memiliki performa tinggi, gratis untuk skala awal, dan mudah dikelola pemeliharaannya (*maintenance*).

* **Frontend Framework:** **Next.js (React)** — Mendukung *Server-Side Rendering* (SSR) untuk memastikan setiap halaman profil seniman terindeks dengan baik oleh Google (SEO).
* **UI / Styling:** **Tailwind CSS** — Digunakan untuk menyusun antarmuka visual (seperti *Card* profil, tombol filter, galeri) yang responsif dan modern.
* **Backend & Database:** **Supabase (PostgreSQL)** — Berfungsi sebagai *Database-as-a-Service* (BaaS) relasional untuk menyimpan seluruh data formulir pendataan.


* **Storage (Penyimpanan Media):** **Supabase Storage** — Tempat penyimpanan aman untuk seluruh aset visual, termasuk foto grup, foto panggung, dan logo.


* **Deployment:** **Vercel** — Platform *hosting* publik.

---

## 4. Rincian Kebutuhan Fitur

### 4.1 Direktori Publik (*Frontend / User Facing*)

* **Fitur 1: Hero Section & Kolom Pencarian Global**
* Pengguna dapat langsung mengetikkan nama seniman, genre, instrumen, atau jenis tarian di halaman utama.




* **Fitur 2: Sistem Filter & Klasifikasi**
* **Filter Tari:** Navigasi untuk menampilkan hanya sanggar **Grade A** atau **Grade B**.


* **Filter Musik:** Navigasi untuk menampilkan hanya pemusik **Solo** atau **Komunitas**.




* **Fitur 3: Grid Kartu Profil (*Listing*)**
* Tampilan daftar seniman dalam bentuk *Card* yang memuat foto utama, nama, *grade*/kategori, dan lokasi.




* **Fitur 4: Halaman Detail Profil (`/katalog/[id]`)**
* Menampilkan data komprehensif: Biografi/Deskripsi, sejarah pendirian, daftar layanan, alamat latihan/pusat, daftar karya unggulan lengkap (dengan durasi & instrumen), serta deretan prestasi.


* Menampilkan galeri foto dinamis dan terkurasi (Foto Tampil, Foto Latihan, Logo, dll).


* **Tombol *Call-to-Action*:** Tombol "Hubungi via WhatsApp" yang langsung mengarah ke nomor PIC seniman.





### 4.2 CMS Administratif (*Backend Management*)

* **Fitur 1: Autentikasi Admin**
* Halaman *login* aman khusus staf dinas.


* **Fitur 2: Form Input Data (CRUD)**
* Formulir digital internal untuk menambah data baru atau mengedit data lama, di mana struktur *field input*-nya 100% mereplikasi form pendataan luring.




* **Fitur 3: Manajer Aset Media**
* Sistem unggah berkas (*drag-and-drop*) untuk meng-*upload* *List Foto* langsung ke *server storage*.





---

## 5. Skema Database Final (Supabase / PostgreSQL)

Skema tabel dirancang secara spesifik mengikuti parameter *field* pada formulir *Informasi Sanggar*, *Informasi Komunitas Pemusik*, dan *Informasi Pemusik*.

### 5.1 Tabel: `sanggars`

| Nama Kolom | Tipe Data | Deskripsi Berdasarkan Formulir |
| --- | --- | --- |
| `id` | `uuid` | *Primary Key* otomatis. |
| `nama_sanggar` | `text` | Nama sanggar tari.

 |
| `tagline` | `text` | *Tagline* sanggar.

 |
| `grade` | `text` | Klasifikasi: `'Grade A'` atau `'Grade B'`.

 |
| `deskripsi` | `text` | Deskripsi umum sanggar.

 |
| `alamat_pusat` | `text` | Alamat sanggar (pusat).

 |
| `alamat_latihan` | `text` | Alamat tempat latihan rutin.

 |
| `layanan` | `text` | Layanan sanggar yang disediakan.

 |
| `tari_unggulan` | `jsonb` | *Array* *object* berisi `judul_tari` dan `ringkasan`.

 |
| `prestasi` | `text` | Daftar prestasi atau penghargaan.

 |
| `pic_nama` | `text` | Nama narahubung (PIC) utama.

 |
| `pic_phone` | `text` | Nomor Kontak/WhatsApp PIC.

 |
| `ketua_sanggar` | `text` | Nama Ketua Sanggar.

 |
| `list_foto` | `jsonb` | *Array URL* gambar: Foto Grup Tari, Foto Tari Unggulan, Foto Ketua Sanggar, Logo Sanggar.

 |
| `created_at` | `timestamptz` | Stempel waktu pembuatan rekaman data. |

### 5.2 Tabel: `pemusiks`

*(Menggabungkan data **Pemusik Solo** dan **Komunitas Pemusik**. Kolom yang tidak relevan untuk salah satu kategori bersifat Nullable).*

| Nama Kolom | Tipe Data | Deskripsi Berdasarkan Formulir |
| --- | --- | --- |
| `id` | `uuid` | *Primary Key* otomatis. |
| `kategori` | `text` | Format penampil: `'Solo'` atau `'Komunitas'`.

 |
| `nama_pemusik` | `text` | Nama Lengkap (Solo) atau Nama Komunitas Pemusik (Komunitas).

 |
| `nama_panggung` | `text` | Nama Panggung (*Nullable*, khusus Solo).

 |
| `tahun_berdiri` | `integer` | Tahun Berdiri (*Nullable*, khusus Komunitas).

 |
| `deskripsi` | `text` | Deskripsi/Biografi Seniman atau Komunitas.

 |
| `alamat` | `text` | Alamat Lengkap atau Alamat Komunitas.

 |
| `ketua_komunitas` | `text` | Nama Ketua Komunitas (*Nullable*, khusus Komunitas).

 |
| `pic_nama` | `text` | Nama (PIC) atau Kontak Utama.

 |
| `pic_phone` | `text` | Nomor HP/WhatsApp (PIC).

 |
| `email` | `text` | Alamat Email resmi.

 |
| `media_sosial` | `text` | Tautan akun Media Sosial (IG, YouTube, dll).

 |
| `jumlah_anggota` | `integer` | Jumlah Anggota (*Nullable*, khusus Komunitas).

 |
| `genre_musik` | `text` | Genre Musik atau Jenis Musik yang Dibawakan.

 |
| `instrumen` | `text` | Alat musik yang dikuasai / Instrumen yang dimainkan.

 |
| `pengalaman` | `text` | Rekam jejak Pengalaman Berkesenian.

 |
| `layanan` | `text` | Layanan yang Ditawarkan atau Layanan Komunitas.

 |
| `prestasi` | `text` | Daftar Prestasi/Penghargaan.

 |
| `keanggotaan_org` | `text` | Keanggotaan Komunitas/Organisasi (*Nullable*, khusus Solo).

 |
| `karya_unggulan` | `jsonb` | *Array* *object* berisi: `judul`, `tahun`, `jenis_karya`, `durasi`, `instrumen`, `ringkasan`, `link_dokumentasi`.

 |
| `list_foto` | `jsonb` | *Array URL* gambar: Foto Tampil, Latihan, Alat Musik, Bersama Penonton, Studio, dll.

 |
| `created_at` | `timestamptz` | Stempel waktu pembuatan rekaman data. |

---

## 6. Kebutuhan Non-Fungsional

* **Search Engine Optimization (SEO):** Implementasi tag meta dinamis pada detail seniman untuk mendongkrak visibilitas di Google.
* **Performa:** Optimasi gambar otomatis dengan format WebP melalui komponen bawaan Next.js untuk menjaga waktu muat halaman di bawah 2 detik.
* **Responsivitas Perangkat:** Antarmuka harus beradaptasi secara sempurna untuk dibuka di perangkat *mobile* (meningkatkan kenyamanan EO atau publik yang mengakses *link* via WhatsApp).

---

## 7. Lini Masa Eksekusi & Target (Siklus Magang 4 Bulan, 2026)

| Rencana Kerja (*Timeline*) | Fokus Pengerjaan | Target Luaran (*Output*) |
| --- | --- | --- |
| **Bulan 1** | *Requirements Gathering* & *Design* | Penyelesaian skema *database* di Supabase, perancangan UI/UX di Figma.

 |
| **Bulan 2** | *Core Development* | Implementasi *coding* menggunakan Next.js & Tailwind CSS, pembuatan sistem filter & pencarian.

 |
| **Bulan 3** | *Data Ingestion* & CMS | Pembangunan halaman Admin, serta penginputan (*seeding*) data terkurasi awal dari sanggar dan pemusik.

 |
| **Bulan 4** | UAT, *Testing*, & *Deploymecnt* | Uji coba fitur secara penuh (*User Acceptance Testing*), integrasi dengan sistem dinas (opsional), dan perilisan sistem (*live*).

 |

