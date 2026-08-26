const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

async function run() {
  const url = `${env['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/pemusik?limit=1`;
  const headers = {
    'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    'Authorization': `Bearer ${env['NEXT_PUBLIC_SUPABASE_ANON_KEY']}`
  };

  try {
    console.log("🚨 TEST DEBUG: Woy, kode gw berhasil jalan masuk sini! 🚨");
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.log("Error status:", res.statusText);
      return;
    }
    const data = await res.json();
    console.log("Data length:", data.length);
    if (data.length === 0) {
      // Let's try to do an OPTIONS request or something to get the schema?
      // Actually, we can fetch from information_schema via RPC if possible, but we don't have RPC.
      // Let's insert a dummy row and rollback? No, anon key.
      console.log("Table is empty.");
    } else {
      console.log("Keys:", Object.keys(data[0]));
    }
  } catch (e) {
    console.error(e);
  }
}
run();
