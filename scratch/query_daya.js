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
  const { data, error } = await supabase.from('sanggars').select('*').ilike('nama_sanggar', '%Daya Presta%');
  if (error) console.error(error);
  else {
    console.log(JSON.stringify(data, null, 2));
  }
}

getRows();
