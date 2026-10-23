-- Katalog Seni DKI Jakarta: a performance video for each sanggar (Phase 856)
-- Run once in Supabase Dashboard > SQL Editor. Safe to re-run.
-- Holds a YouTube link, a link to a video file, or the URL of a video uploaded from the admin form to the
-- "katalog-media" bucket (sanggar/video-…). Until this is run, the form shows the field as needing this migration.

alter table public.sanggars
  add column if not exists video_url text;
