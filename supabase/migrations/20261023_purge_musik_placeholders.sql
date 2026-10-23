-- Katalog Seni DKI Jakarta: remove the placeholder Seniman Musik rows (Phase 853)
-- Rows 2–5 (Decong, Ega, Sevtian Wijaya, Dimas Lambara) came in with the first bulk import (2026-08-31) and hold only a
-- name, "Solo" and the status: no description, contact, media, works or history. On the public catalog they show as
-- empty cards. This DELETES them for good (Supabase keeps no undo; restore only from a backup).
--
-- Run in Supabase Dashboard > SQL Editor, together with 20261023_seed_musik_master.sql (order doesn't matter).
-- Safe to re-run. A row is deleted only when its id AND name match AND every profile column is still empty, so a row
-- that got real data in the meantime is kept. The result lists the rows that were deleted.
--
-- To check first, run only this:
--   select id, nama_seniman, jenis_seniman, status from public.pemusiks where id in (2, 3, 4, 5) order by id;

delete from public.pemusiks
where (id, lower(btrim(nama_seniman))) in ((2, 'decong'), (3, 'ega'), (4, 'sevtian wijaya'), (5, 'dimas lambara'))
  and coalesce(btrim(deskripsi), '') = ''
  and coalesce(btrim(nama_panggung), '') = ''
  and coalesce(btrim(genre_musik), '') = ''
  and coalesce(btrim(instrumen), '') = ''
  and coalesce(btrim(jenis_musik), '') = ''
  and coalesce(btrim(pengalaman), '') = ''
  and coalesce(btrim(wilayah), '') = ''
  and coalesce(btrim(kontak), '') = ''
  and coalesce(btrim(whatsapp), '') = ''
  and coalesce(btrim(email), '') = ''
  and coalesce(btrim(instagram), '') = ''
  and coalesce(btrim(youtube_url), '') = ''
  and coalesce(btrim(tiktok), '') = ''
  and coalesce(btrim(facebook), '') = ''
  and coalesce(btrim(alamat), '') = ''
  and coalesce(btrim(logo_url), '') = ''
  and coalesce(btrim(foto_card_url), '') = ''
  and coalesce(btrim(video_url), '') = ''
  and coalesce(galeri, '[]'::jsonb) = '[]'::jsonb
  and coalesce(layanan_items, '[]'::jsonb) = '[]'::jsonb
  and coalesce(karya_items, '[]'::jsonb) = '[]'::jsonb
  and coalesce(prestasi_items, '[]'::jsonb) = '[]'::jsonb
  and coalesce(pengalaman_items, '[]'::jsonb) = '[]'::jsonb
returning id, nama_seniman;
