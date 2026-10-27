-- Katalog Seni DKI Jakarta: populate YouTube URL for Sumitra Adi Kusuma in public.pemusiks (Phase 857)
-- Matches channel search URL used by Komunitas Betawi Section ("Orkes Gambang Kromong Suara Lama")
-- Run once in Supabase Dashboard > SQL Editor. Safe to re-run: idempotent update.

update public.pemusiks
set youtube_url = 'https://www.youtube.com/results?search_query=Orkes+Gambang+Kromong+Suara+Lama'
where (id = 1 or nama_seniman ilike '%Sumitra Adi Kusuma%')
  and (youtube_url is null or youtube_url = '');

