-- Katalog Seni DKI Jakarta: the built-in Seniman Musik profiles of src/data/musikData.ts into the database (Phase 852)
-- Generated from that file with the admin form's own code (masterToForm → buildPemusikPayload), so each row is what
-- saving the profile in the admin panel would store.
-- Run once in Supabase Dashboard > SQL Editor (the editor shows the result of the last statement). Safe to re-run:
--   * Komunitas Betawi Section is inserted only when no row has that name. The new row stands for the built-in
--     profile (matched by name): the admin list, the dashboard, the catalog and /pemusik/betawi-section use it from
--     then on. Keep its name, or the built-in profile shows again next to it.
--   * Sumitra Adi Kusuma (row 1) only gets its empty columns filled; anything already saved there stays.

-- Komunitas Betawi Section (built-in id "betawi-section"): a new row, unless one with this name exists already
insert into public.pemusiks (nama_seniman, jenis_seniman, genre_musik, instrumen, deskripsi, pengalaman, nama_panggung, wilayah, status, tahun_berdiri, jumlah_anggota, ketua, nama_pic, jenis_musik, kontak, whatsapp, email, instagram, youtube_url, tiktok, facebook, alamat, logo_url, foto_card_url, galeri, video_url, layanan_items, karya_items, prestasi_items, pengalaman_items)
select
  'Komunitas Betawi Section',
  'Komunitas Musik',
  null,
  'Gambang, Kromong, Kongahyan, Tehyan, Jihyan, Sukong, Samhyan, Ciotaw, Gendang, Kecrek, Gambang Besi, Gong Enam, Selukat, Kemor, Perkusi, Drum, Brass Section, Suling',
  'Komunitas Betawi Section merupakan perkumpulan musisi Betawi yang mengulas kembali lagu-lagu Dalem yang hampir punah. Anggota yang tergabung di komunitas ini adalah anak-anak dari berbagai grup Gambang Kromong yang ada di Jakarta dan sekitarnya.',
  'Pagelaran kesenian budaya tradisional Betawi di Setu Babakan 2025
Pagelaran kesenian budaya tradisional Betawi di Setu Babakan 2026
Abang None Kepulauan Seribu 2026
Perayaan Shejit Y.M Kongco Cheng Goan Cheng Kun dan Y.M Kongco Thian Kauw Ciong Kun di Vihara Dharma Jaya Toasebio 2026
Pengiring musik Belajar Bersama Maestro Jaja Mihardja 2026',
  'Orkes Gambang Kromong Suara Lama',
  'Jakarta Timur',
  'terverifikasi',
  '2015',
  150,
  'Sumitra Adi Kusuma',
  null,
  'Gambang Kromong Classic, Gambang Kromong Modern, Tanjidor, Nusantara',
  '081384071949 / 085939836744',
  '6285939836744',
  'sumitraadikusuma12@gmail.com',
  'https://www.instagram.com/kombes.gksl',
  'Orkes Gambang Kromong Suara Lama',
  'https://www.tiktok.com/@kombes.gksl',
  'Kombes gksl',
  'Jl. Raya Hankam TMII RT.01 RW.02, Kelurahan Ceger, Kecamatan Cipayung, Jakarta Timur',
  '/images/musik/komunitas-betawi-section/profile/profile-komunitas-betawi-section.webp',
  '/images/musik/komunitas-betawi-section/card/card.webp',
  '[{"url":"/images/musik/komunitas-betawi-section/galeri/galeri-1.webp","caption":"Dokumentasi Komunitas Betawi Section"},{"url":"/images/musik/komunitas-betawi-section/galeri/galeri-2.webp","caption":"Dokumentasi Komunitas Betawi Section"},{"url":"/images/musik/komunitas-betawi-section/galeri/galeri-3.webp","caption":"Dokumentasi Komunitas Betawi Section"},{"url":"/images/musik/komunitas-betawi-section/galeri/galeri-4.webp","caption":"Dokumentasi Komunitas Betawi Section"},{"url":"/images/musik/komunitas-betawi-section/galeri/galeri-5.webp","caption":"Dokumentasi Komunitas Betawi Section"}]'::jsonb,
  '/images/musik/komunitas-betawi-section/video/video.mp4',
  '["Pertunjukan musik tradisional untuk acara formal maupun nonformal","Pengisi acara pada kegiatan budaya, festival, seminar, dan kegiatan masyarakat","Workshop dan pelatihan musik tradisional bagi pelajar, mahasiswa, maupun masyarakat umum","Edukasi dan pengenalan musik tradisional Betawi","Kolaborasi musik dengan komunitas seni, musisi, sekolah, perguruan tinggi, dan lembaga kebudayaan","Dokumentasi dan pertunjukan karya musik tradisional","Pengembangan serta pelestarian seni dan musik tradisional melalui kegiatan kreatif dan pertunjukan"]'::jsonb,
  '[{"judul":"Jakarta Dulu","deskripsi":"Sebuah karya musik yang mengangkat tentang wajah Jakarta pada masa lampau ketika kehidupan kota terasa lebih sederhana. Melalui perpaduan nuansa musik Betawi, karya ini menggambarkan suasana di kampung pada jaman dahulu sebelum era pembangunan.","tahun":"","link":""}]'::jsonb,
  '[{"title":"Juara Pertama Lomba Aransemen Lagu Gambang Kromong Tingkat Nasional","organizer":"","year":""}]'::jsonb,
  '[{"kegiatan":"Pagelaran kesenian budaya tradisional Betawi di Setu Babakan","tahun":"2025"},{"kegiatan":"Pagelaran kesenian budaya tradisional Betawi di Setu Babakan","tahun":"2026"},{"kegiatan":"Abang None Kepulauan Seribu","tahun":"2026"},{"kegiatan":"Perayaan Shejit Y.M Kongco Cheng Goan Cheng Kun dan Y.M Kongco Thian Kauw Ciong Kun di Vihara Dharma Jaya Toasebio","tahun":"2026"},{"kegiatan":"Pengiring musik Belajar Bersama Maestro Jaja Mihardja","tahun":"2026"}]'::jsonb
where not exists (select 1 from public.pemusiks where lower(btrim(nama_seniman)) = lower('Komunitas Betawi Section'))
returning id, nama_seniman, status;

-- Sumitra Adi Kusuma (row 1): fill only the columns still empty in the database
update public.pemusiks set
  jenis_seniman = coalesce(nullif(btrim(jenis_seniman), ''), 'Pemusik'),
  genre_musik = coalesce(nullif(btrim(genre_musik), ''), 'All Genre'),
  instrumen = coalesce(nullif(btrim(instrumen), ''), 'Gambang Kromong, Samhyan, Kongahyan, Tehyan, Jihyan, Sukong, Trombone, Conga & Bongo, Vokal Tradisi Betawi'),
  deskripsi = coalesce(nullif(btrim(deskripsi), ''), 'Sumitra Adi Kusuma, yang dikenal dengan nama panggung Mitra, merupakan seniman musik yang memiliki kepedulian kuat terhadap pelestarian musik tradisi Betawi.'),
  nama_panggung = coalesce(nullif(btrim(nama_panggung), ''), 'Mitra'),
  wilayah = coalesce(nullif(btrim(wilayah), ''), 'Jakarta Timur'),
  kontak = coalesce(nullif(btrim(kontak), ''), '081384071940 / 085939836744'),
  whatsapp = coalesce(nullif(btrim(whatsapp), ''), '6281384071940'),
  email = coalesce(nullif(btrim(email), ''), 'sumitraadikusuma12@gmail.com'),
  instagram = coalesce(nullif(btrim(instagram), ''), 'https://www.instagram.com/sumitraadi'),
  tiktok = coalesce(nullif(btrim(tiktok), ''), 'https://www.tiktok.com/@sumitraadikusuma'),
  facebook = coalesce(nullif(btrim(facebook), ''), 'Sumitra Adi Kusuma Tohir'),
  alamat = coalesce(nullif(btrim(alamat), ''), 'Jl. Buni Gg. Mangga RT.02 RW.04, Kelurahan Munjul, Kecamatan Cipayung, Jakarta Timur'),
  karya_items = case when karya_items is null or karya_items = '[]'::jsonb then '[{"judul":"Jawara Ngotek","deskripsi":"Gambang Kromong kekinian","tahun":"2019","link":"https://drive.google.com/drive/folders/1CN6v_RaBA4NSifQMRmjhRoqYhkdlzt00?usp=sharing"}]'::jsonb else karya_items end,
  prestasi_items = case when prestasi_items is null or prestasi_items = '[]'::jsonb then '[{"title":"Pemain Tehyan Terbaik 2019","organizer":"","year":""},{"title":"Penata Musik Terbaik 2019","organizer":"","year":""},{"title":"Penata Musik Terbaik Parade Musik TMII 2022","organizer":"","year":""}]'::jsonb else prestasi_items end
where id = 1 and lower(btrim(nama_seniman)) = lower('Sumitra Adi Kusuma')
returning id, nama_seniman;
