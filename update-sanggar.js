const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read .env.local
const envPath = path.resolve(__dirname, '.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error("Could not read .env.local file. Error:", e.message);
  process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']; 

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const dataToUpdate = {
    tagline: "Kemampuan bertindak untuk mencapai dan mencetak prestasi seni sejak 1985.",
    email: "dayapresta14@gmail.com",
    instagram: "dayapresta_id"
  };

  console.log("Attempting to update Daya Presta record...");
  const { data, error } = await supabase
    .from('sanggars')
    .update(dataToUpdate)
    .eq('nama_sanggar', 'Sanggar Tari Daya Presta')
    .select();
  
  if (error) {
    console.error("Error updating data:", error);
  } else {
    console.log("Update successful! Updated records:", data);
  }
}

run();
