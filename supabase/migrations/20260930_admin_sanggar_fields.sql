-- Katalog Seni DKI Jakarta: extra sanggar fields used by the admin panel (Phase 706)
-- Run once in Supabase Dashboard > SQL Editor. Safe to re-run: every statement is idempotent.
-- Until this is run, the admin form still saves all existing fields and simply skips these.

alter table public.sanggars
  add column if not exists kategori       text,
  add column if not exists wilayah        text,
  add column if not exists status         text not null default 'terverifikasi',
  add column if not exists youtube_url    text,
  add column if not exists maps_url       text,
  add column if not exists galeri         jsonb not null default '[]'::jsonb,  -- [{ "url": "...", "caption": "..." }]
  add column if not exists layanan_items  jsonb not null default '[]'::jsonb,  -- [{ "title", "description", "price", "image" }]
  add column if not exists prestasi_items jsonb not null default '[]'::jsonb;  -- [{ "title", "organizer", "year" }]

-- Only these two statuses are used: 'terverifikasi' (shown publicly) and 'draft' (hidden from the public site)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'sanggars_status_check') then
    alter table public.sanggars
      add constraint sanggars_status_check check (status in ('terverifikasi', 'draft'));
  end if;
end $$;

-- Only the six administrative areas of DKI Jakarta (or empty)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'sanggars_wilayah_check') then
    alter table public.sanggars
      add constraint sanggars_wilayah_check check (
        wilayah is null or wilayah in (
          'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Kepulauan Seribu'
        )
      );
  end if;
end $$;

create index if not exists sanggars_status_idx on public.sanggars (status);
create index if not exists sanggars_wilayah_idx on public.sanggars (wilayah);

-- ---------------------------------------------------------------------------------------------
-- OPTIONAL: storage bucket for uploaded images. The admin uploads to the public bucket
-- "katalog-media". Uncomment if the bucket does not exist yet (Storage > Buckets shows it).
-- ---------------------------------------------------------------------------------------------
-- insert into storage.buckets (id, name, public)
-- values ('katalog-media', 'katalog-media', true)
-- on conflict (id) do nothing;
--
-- create policy "katalog-media public read"
--   on storage.objects for select
--   using (bucket_id = 'katalog-media');
--
-- create policy "katalog-media admin upload"
--   on storage.objects for insert to authenticated
--   with check (bucket_id = 'katalog-media' and auth.jwt() ->> 'email' = 'admindisbud@gmail.com');

-- ---------------------------------------------------------------------------------------------
-- RECOMMENDED: the admin pages are only guarded in the browser. Make sure Row Level Security on
-- public.sanggars allows INSERT / UPDATE / DELETE only for the admin account, e.g.:
-- ---------------------------------------------------------------------------------------------
-- alter table public.sanggars enable row level security;
-- create policy "sanggars public read"  on public.sanggars for select using (true);
-- create policy "sanggars admin write"  on public.sanggars for all to authenticated
--   using (auth.jwt() ->> 'email' = 'admindisbud@gmail.com')
--   with check (auth.jwt() ->> 'email' = 'admindisbud@gmail.com');
