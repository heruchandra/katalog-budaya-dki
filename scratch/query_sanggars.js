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

async function getRows() {
  const { data, error } = await supabase.from('sanggars').select('*');
  if (error) console.error(error);
  else {
    data.forEach(s => {
      console.log('ID:', s.id, '| Nama:', s.nama_sanggar, '| Tagline:', s.tagline);
      console.log('Keys with values:', Object.entries(s).filter(([k, v]) => v !== null && v !== '').map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : (String(v).slice(0, 50))}`));
      console.log('-----------------------------------------');
    });
  }
}

getRows();
