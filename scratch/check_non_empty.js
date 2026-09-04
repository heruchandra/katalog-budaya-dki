const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

async function checkNonEmpty() {
  const { data, error } = await supabase.from('sanggars').select('*');
  if (error) {
    console.error(error);
    return;
  }
  const filledRows = data.filter(row => {
    return Object.entries(row).some(([k, v]) => !['id', 'created_at', 'nama_sanggar', 'grade'].includes(k) && v !== null && v !== '');
  });
  console.log(`Found ${filledRows.length} filled rows out of ${data.length}`);
  filledRows.forEach(r => console.log(r.id, r.nama_sanggar, Object.entries(r).filter(([k, v]) => v !== null && v !== '')));
}

checkNonEmpty();
