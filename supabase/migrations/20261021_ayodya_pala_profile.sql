-- Katalog Seni DKI Jakarta: complete profile of Ayodya Pala Indonesia Art Center (sanggars.id = 17) (Phase 836, 839, 850)
-- Source: the sanggar's own form "INFORMASI SANGGAR AYODYA PALA" (texts as written, spelling tidied only). The same
-- texts are the curated fallback in src/data/sanggarProfiles.ts.
-- Run once in Supabase Dashboard > SQL Editor. Safe to re-run: it writes the same values again, but note that it
-- REPLACES the Layanan / Karya and Prestasi lists (images added to those items afterwards would be cleared).
-- It only touches the row with id 17 whose name starts with "Ayodya Pala", so another sanggar is never overwritten
-- if the ids differ. Photos (logo, thumbnail, galeri, foto_*), status, email and links are left as they are.

update public.sanggars
set
  nama_sanggar          = 'Ayodya Pala Indonesia Art Center',
  tagline               = 'Membangun Bangsa Melalui Seni Budaya',
  kategori              = 'Seni Tari',
  grade                 = 'A',
  wilayah               = 'Jakarta Selatan',
  alamat                = 'Jalan Raya Lenteng Agung No. 1 Kel. Lenteng Agung, Kec. Jagakarsa, Jakarta Selatan 12610',
  alamat_tempat_latihan = 'Jalan Raya Lenteng Agung No. 1 Kel. Lenteng Agung, Kec. Jagakarsa, Jakarta Selatan 12610',
  ketua_sanggar         = 'Dra. Budi Agustinah',
  nama_pic              = 'Dra. Budi Agustinah',
  kontak_pic            = '081399160062',
  -- searched by the public catalog (not shown on the card)
  jenis_tarian          = 'Tari Mpok Cantik, Tari Kembang Merona, Tari Godeg Ayu, Tari Jari Manis, Tari Goyang Ngamprok',
  deskripsi             = 'Yayasan Ayodya Pala dirintis mulai tahun 1978 dan dibentuk menjadi yayasan pada tanggal 24 April 1980, memiliki kurang lebih 2.400 siswa aktif dan mempunyai Motto “Membangun Bangsa Melalui Seni dan Budaya”. Ayodya Pala berasal dari kata AYODYA yang diambil dari Epos Ramayana yaitu suatu negara / kerajaan tempat Rama dilahirkan. Kerajaan tersebut makmur, aman, tentram, dan masyarakatnya berbudaya. Sedangkan kata PALA berasal dari sumpah palapa yang dikumandangkan oleh Maha Patih Gajah Mada yang berasal dari Kerajaan Majapahit yang intinya mempersatukan wilayah Nusantara.',
  -- "Layanan Sanggar" (3), then the Karya Tari Unggulan entry (kind karya_tari_unggulan, the admin form's own section)
  -- holding the five Tari Unggulan as its sub_karya
  layanan_items = jsonb_build_array(
    jsonb_build_object('title', 'Tari Daerah Nusantara', 'description', '', 'image', null),
    jsonb_build_object('title', 'Modelling Anak', 'description', '', 'image', null),
    jsonb_build_object('title', 'Vokal dan Musik', 'description', '', 'image', null),
    jsonb_build_object('title', 'Karya Tari Unggulan Sanggar', 'kind', 'karya_tari_unggulan', 'description', 'Karya tari unggulan Ayodya Pala Indonesia Art Center. Kostum: Rumah Kostum Ayodya Pala.', 'image', null, 'sub_karya', jsonb_build_array(
      jsonb_build_object('id', 'tari-mpok-cantik', 'judul', 'Tari Mpok Cantik', 'sinopsis', 'Tari Mpok Cantik ini berpijak pada Tari Betawi Tradisi yang dikembangkan kembali menjadi gerak kreasi Betawi, yang menceritakan tentang sekumpulan mpok-mpok remaja cantik yang berkumpul dan bersenda gurau bersama. Cerita ini diambil dari kehidupan sehari-hari layaknya remaja. “Pisang kapok mau dipetik / Pohon nangke jangan ditebang / Mpok mpok yang paling cantik / Boleh tau sape namanye.”', 'penata_tari', 'Wahyu Kardinata Suroso, S.Pd', 'penata_musik', 'Rizki Aidul Akbar, S.Sn', 'gambar_url', '/images/sanggar/ayodya-pala/card/card-4.webp'),
      jsonb_build_object('id', 'tari-kembang-merona', 'judul', 'Tari Kembang Merona', 'sinopsis', 'Merupakan Tari Kreasi Baru yang berpijak dari kesenian Cokek Betawi. Menggambarkan gadis-gadis yang sedang kasmaran adalah fase di mana bunga berada dalam kondisi terbaiknya—mekar sempurna, wangi, dan menawan. Ini melambangkan manusia yang telah mencapai potensi maksimal atau kedewasaan diri yang utuh. Divisualisasikan dalam bentuk gerak-gerak tari Betawi yang dikembangkan dengan unsur-unsur keindahan, keberanian, dan semangat hidup. Dengan kostum dominan merah serta menggunakan saputangan merah, sebagai simbol wanita yang mandiri, kecantikan yang mempesona, kekuatan diri, dan kebahagiaan yang terpancar.', 'penata_tari', 'Yulli Fajar & Ratna Kurniasih', 'penata_musik', 'Ricky'),
      jsonb_build_object('id', 'tari-godeg-ayu', 'judul', 'Tari Godeg Ayu', 'sinopsis', 'Merupakan Tari Kreasi Depok. Menggambarkan perjalanan kehidupan seorang gadis yang menginjak dewasa, disempurnakan oleh berbagai sifatnya yang khas, semuanya terpadu dalam pribadi yang penuh dengan harapan, cita-cita dan cinta. Tak lepas pula dari kodratnya sebagai manusia, konflik, dilema dan tantangan kadang kala hadir menyelimuti kehidupannya.', 'penata_tari', 'Wulandari, S.Sn', 'penata_musik', 'Mang Ujang & Imam Firmansyah, S.Sn'),
      jsonb_build_object('id', 'tari-jari-manis', 'judul', 'Tari Jari Manis', 'sinopsis', 'Tari Jari Manis (Jangan Iri Mpok Manis). “Seperti halnya cinta, sahabat akan muncul dari pihak yang tak terduga. Ketika kebencian meliputi, dialah musuhmu. Ketika cinta bernaung, mereka menjadi sahabatmu. Tetapi, ketika musuhmu adalah rasa iri dan keegoisan hati, di situlah persahabatan diuji.” Sebuah karya yang berpijak pada tari cokek yang menceritakan tentang konflik persahabatan gadis Jakarta yang diwarnai oleh rasa kecemburuan terhadap sahabatnya sendiri.', 'penata_tari', 'Myta Rahmawati, S.Pd', 'penata_musik', 'Septian Ray Sukirman'),
      jsonb_build_object('id', 'tari-goyang-ngamprok', 'judul', 'Tari Goyang Ngamprok', 'sinopsis', 'Tari ini menceritakan tentang persahabatan yang runtuh karena perbedaan. Perbedaan bukan berarti tidak dapat disatukan, tetapi perbedaan itu membuat kita semakin lebih dewasa dan juga semakin kuat dalam membina persahabatan.', 'penata_tari', 'Wahyu Kardinata Suroso, S.Pd', 'penata_musik', 'Firman, S.Pd & Imam Firmansyah, S.Sn')
    ))
  ),
  prestasi_items = jsonb_build_array(
    jsonb_build_object('title', 'Pemegang Rekor MURI – 1.117 Penari dari Satu Sanggar', 'organizer', 'Ayodya Pala berhasil meraih Rekor Museum Rekor-Dunia Indonesia (MURI) untuk kategori Pagelaran Penari Terbanyak dari Satu Sanggar, dengan 1.117 penari yang tampil serempak membawakan Tari Bhinneka pada Depok Culture Festival, 25 Oktober 2025 di Depok Open Space, Balai Kota Depok.', 'year', '2025'),
    jsonb_build_object('title', 'Dipercaya tampil dalam berbagai acara nasional, pemerintahan, korporasi, dan internasional', 'organizer', 'Penari Ayodya Pala telah terlibat dalam berbagai event seperti Jakarnaval 2026, program TRANS7, kegiatan United Nations Development Programme (UNDP), Warta Kota Awards, kegiatan DPRD Jawa Barat, serta berbagai event perusahaan dan institusi.', 'year', ''),
    jsonb_build_object('title', 'Lebih dari 3.000 anggota/siswa Ayodya Pala & 45 tahun berkarya', 'organizer', 'Pada pemberitaan pemecahan Rekor MURI 2025, Ayodya Pala disebut telah memiliki lebih dari 3.000 anggota dan telah berkarya selama sekitar 45 tahun dalam pengembangan seni tari Nusantara.', 'year', '')
  )
where id = 17
  and nama_sanggar ilike 'ayodya pala%'
returning id, nama_sanggar, jsonb_array_length(layanan_items) as layanan,
  jsonb_array_length(layanan_items -> -1 -> 'sub_karya') as tari_unggulan, jsonb_array_length(prestasi_items) as prestasi;
