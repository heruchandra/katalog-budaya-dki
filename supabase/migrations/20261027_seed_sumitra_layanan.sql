-- Katalog Seni DKI Jakarta: Seed Layanan (Services) for Sumitra Adi Kusuma (id = 1) (Phase 858)
-- Services:
-- 1. Edukasi pengenalan musik tradisional Betawi
-- 2. Pengembangan dan pelestarian musik Betawi melalui kegiatan kreatif dan pertunjukan
-- Run once in Supabase Dashboard > SQL Editor. Safe to re-run: idempotent update.

update public.pemusiks
set layanan_items = jsonb_build_array(
  'Edukasi pengenalan musik tradisional Betawi',
  'Pengembangan dan pelestarian musik Betawi melalui kegiatan kreatif dan pertunjukan'
)
where id = 1 or nama_seniman ilike '%Sumitra Adi Kusuma%';

