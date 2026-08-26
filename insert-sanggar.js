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
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']; // Or service role key if needed

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const dataToInsert = {
    nama_sanggar: "Sanggar Tari Daya Presta",
    grade: "Grade A",
    jenis_tarian: "Tari Tradisional, Tari Kreasi Betawi, Drama Musikal",
    tagline: "Kemampuan bertindak untuk mencapai dan mencetak prestasi seni sejak 1985.",
    deskripsi: "Sanggar Tari Daya Presta sudah berdiri, berkarya, dan menjadi salah satu wadah pengembangan tari sejak tahun 1985. Nama 'Daya Presta' diambil dari kata 'Daya' (kemampuan bertindak) dan 'Presta' (prestasi). Daya Presta tidak hanya aktif berkembang di Jakarta, tetapi juga merambah ke Bandung dan Jogja.",
    alamat: "Jl. Cikini Raya No.73, Menteng, Kota Jakarta Pusat, DKI Jakarta 10330",
    kontak_pic: "081297249285",
    email: "dayapresta14@gmail.com",
    instagram: "dayapresta_id",
    list_foto: [
      "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
      "https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=800&q=80"
    ]
  };

  console.log("Attempting to insert Daya Presta record...");
  const { data, error } = await supabase.from('sanggars').insert(dataToInsert).select();
  
  if (error) {
    console.error("Error inserting data with all columns:");
    console.error(error);
    
    // If the error is about missing columns, retry without the newly added columns.
    console.log("\nRetrying insertion without potentially missing columns (email, instagram, tagline, list_foto)...");
    
    delete dataToInsert.email;
    delete dataToInsert.instagram;
    delete dataToInsert.tagline;
    delete dataToInsert.list_foto;
    
    const { data: fallbackData, error: fallbackError } = await supabase.from('sanggars').insert(dataToInsert).select();
    if (fallbackError) {
      console.error("Fallback insertion failed:", fallbackError);
    } else {
      console.log("Fallback insertion successful! ID:", fallbackData[0]?.id);
    }
  } else {
    console.log("Insertion successful! ID:", data[0]?.id);
  }
}

run();
