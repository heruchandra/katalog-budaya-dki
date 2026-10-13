-- Katalog Seni DKI Jakarta: only two Seniman Musik categories, 'Komunitas Musik' and 'Pemusik' (Phase 782 / 784)
-- Run in Supabase Dashboard > SQL Editor (after 20261013_admin_pemusik_fields.sql, or on its own).
-- Safe to re-run, also when an earlier version of this file (with 'Pemusik Perorangan') was already run.
-- The site already reads older values the same way (see normalizeKategori in src/lib/pemusikData.ts),
-- so this only makes the stored data match what is shown.

-- An earlier version allowed 'Pemusik Perorangan': drop that rule before converting the data
alter table public.pemusiks drop constraint if exists pemusiks_jenis_seniman_check;

-- Groups of any kind become 'Komunitas Musik'; everything else (incl. 'Solo', 'Perorangan', 'Pemusik Perorangan',
-- empty) 'Pemusik'
update public.pemusiks
set jenis_seniman = case
  when jenis_seniman ~* '(komunitas|kelompok|sanggar|grup|group|orkes|band|ensemble)' then 'Komunitas Musik'
  else 'Pemusik'
end
where jenis_seniman is null
   or jenis_seniman not in ('Komunitas Musik', 'Pemusik');

-- From now on only the two categories can be stored
alter table public.pemusiks
  add constraint pemusiks_jenis_seniman_check check (jenis_seniman in ('Komunitas Musik', 'Pemusik'));
