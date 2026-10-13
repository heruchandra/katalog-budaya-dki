-- Katalog Seni DKI Jakarta: full Seniman Musik profile fields for the admin panel (Phase 781)
-- Run once in Supabase Dashboard > SQL Editor. Safe to re-run: every statement is idempotent.
-- Until this is run, the admin form still saves the existing fields (nama_seniman, jenis_seniman, genre_musik,
-- instrumen, pengalaman, deskripsi) and simply skips these.

alter table public.pemusiks
  -- Informasi utama
  add column if not exists nama_panggung    text,                                -- stage / ensemble name
  add column if not exists wilayah          text,
  add column if not exists status           text not null default 'terverifikasi',
  add column if not exists grade            text,
  add column if not exists tahun_berdiri    text,                                -- founded (komunitas) / active since (pemusik)
  add column if not exists jumlah_anggota   integer,
  add column if not exists ketua            text,
  add column if not exists nama_pic         text,
  add column if not exists jenis_musik      text,                                -- comma list, e.g. "Gambang Kromong, Tanjidor"
  -- Kontak & sosial media
  add column if not exists kontak           text,                                -- numbers as displayed, e.g. "0813… / 0859…"
  add column if not exists whatsapp         text,                                -- the active WhatsApp line, stored as 62…
  add column if not exists email            text,
  add column if not exists instagram        text,
  add column if not exists youtube_url      text,
  add column if not exists tiktok           text,
  add column if not exists facebook         text,
  add column if not exists alamat           text,
  -- Media
  add column if not exists logo_url         text,
  add column if not exists foto_card_url    text,
  add column if not exists galeri           jsonb not null default '[]'::jsonb,  -- [{ "url", "caption" }]
  add column if not exists video_url        text,                                -- YouTube link or .mp4 / .webm file
  -- Layanan, karya, prestasi, pengalaman
  add column if not exists layanan_items    jsonb not null default '[]'::jsonb,  -- ["Pertunjukan musik …", …]
  add column if not exists karya_items      jsonb not null default '[]'::jsonb,  -- [{ "judul", "deskripsi", "tahun", "link" }]
  add column if not exists prestasi_items   jsonb not null default '[]'::jsonb,  -- [{ "title", "organizer", "year" }]
  add column if not exists pengalaman_items jsonb not null default '[]'::jsonb;  -- [{ "kegiatan", "tahun" }]

-- Same statuses as the sanggars table: 'terverifikasi' (shown publicly) and 'draft' (hidden from the public site)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'pemusiks_status_check') then
    alter table public.pemusiks
      add constraint pemusiks_status_check check (status in ('terverifikasi', 'draft'));
  end if;
end $$;

-- Optional grade, as for sanggars
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'pemusiks_grade_check') then
    alter table public.pemusiks
      add constraint pemusiks_grade_check check (grade is null or grade in ('A', 'B'));
  end if;
end $$;

-- Only the six administrative areas of DKI Jakarta (or empty)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'pemusiks_wilayah_check') then
    alter table public.pemusiks
      add constraint pemusiks_wilayah_check check (
        wilayah is null or wilayah in (
          'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Kepulauan Seribu'
        )
      );
  end if;
end $$;

create index if not exists pemusiks_status_idx on public.pemusiks (status);
create index if not exists pemusiks_wilayah_idx on public.pemusiks (wilayah);

-- ---------------------------------------------------------------------------------------------
-- RECOMMENDED: the admin pages are only guarded in the browser. Make sure Row Level Security on
-- public.pemusiks allows INSERT / UPDATE / DELETE only for the admin account, e.g.:
-- ---------------------------------------------------------------------------------------------
-- alter table public.pemusiks enable row level security;
-- create policy "pemusiks public read"  on public.pemusiks for select using (true);
-- create policy "pemusiks admin write"  on public.pemusiks for all to authenticated
--   using (auth.jwt() ->> 'email' = 'admindisbud@gmail.com')
--   with check (auth.jwt() ->> 'email' = 'admindisbud@gmail.com');
