-- Katalog Seni DKI Jakarta: only two Seniman Musik categories (Phase 782)
-- Run once in Supabase Dashboard > SQL Editor (after 20261013_admin_pemusik_fields.sql, or on its own).
-- Safe to re-run. The site already reads older values the same way (see normalizeKategori in src/lib/pemusikData.ts),
-- so this only makes the stored data match what is shown.

-- Groups of any kind become 'Komunitas Musik'; everything else (incl. 'Solo', 'Perorangan', empty) 'Pemusik Perorangan'
update public.pemusiks
set jenis_seniman = case
  when jenis_seniman ~* '(komunitas|kelompok|sanggar|grup|group|orkes|band|ensemble)' then 'Komunitas Musik'
  else 'Pemusik Perorangan'
end
where jenis_seniman is null
   or jenis_seniman not in ('Komunitas Musik', 'Pemusik Perorangan');

-- From now on only the two categories can be stored
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'pemusiks_jenis_seniman_check') then
    alter table public.pemusiks
      add constraint pemusiks_jenis_seniman_check check (jenis_seniman in ('Komunitas Musik', 'Pemusik Perorangan'));
  end if;
end $$;
