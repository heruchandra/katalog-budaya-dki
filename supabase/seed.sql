-- Katalog Seni DKI Jakarta: Seed Data for Supabase
-- Contains initial/seed data for Seniman Musik (Sumitra Adi Kusuma, etc.)

-- Sumitra Adi Kusuma (id = 1)
update public.pemusiks
set
  layanan_items = jsonb_build_array(
    'Edukasi pengenalan musik tradisional Betawi',
    'Pengembangan dan pelestarian musik Betawi melalui kegiatan kreatif dan pertunjukan'
  ),
  youtube_url = 'https://www.youtube.com/results?search_query=Orkes+Gambang+Kromong+Suara+Lama'
where id = 1 or nama_seniman ilike '%Sumitra Adi Kusuma%';

