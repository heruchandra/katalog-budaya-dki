import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import SanggarCatalog from "./SanggarCatalog";

export const metadata: Metadata = {
  title: "Sanggar Tari — Katalog Seni DKI Jakarta",
  description:
    "Temukan sanggar tari tradisional bersertifikat Grade A dan Grade B di Jakarta. Profil lengkap dengan galeri foto dan kontak langsung.",
};

export const dynamic = "force-dynamic";

export interface Sanggar {
  id: string;
  nama_sanggar: string;
  nama_pimpinan?: string;
  grade?: string;
  alamat?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota_kab?: string;
  no_hp?: string;
  kontak_pic?: string;
  whatsapp?: string;
  whatsappNumber?: string;
  whatsappUrl?: string;
  instagram?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  youtube?: string;
  jenis_tarian?: string;
  thumbnail_url: string | null;
}

export default async function SanggarPage() {
  let sanggars: Sanggar[] = [];
  let fetchError: string | null = null;

  try {
    // Validate environment variables before attempting connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase env vars missing:", {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "SET" : "MISSING",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? "SET"
          : "MISSING",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
          ? "SET"
          : "MISSING",
      });
      fetchError =
        "Konfigurasi database belum lengkap. Hubungi administrator.";
    } else {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("sanggars")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase Query Error Details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        fetchError = error.message || "Gagal mengambil data sanggar.";
      } else {
        sanggars = (data as Sanggar[]) ?? [];

        const cardImages = [
          "/card-1.webp",
          "/card-2.webp",
          "/card-3.webp",
          "/card-4.webp",
          "/card-5.webp",
          "/card-6.webp",
        ];

        sanggars.forEach((s, idx) => {
          s.thumbnail_url = cardImages[idx % cardImages.length];
        });

        const ae = sanggars.find(s => s.nama_sanggar.includes("AE Production") || s.nama_sanggar.includes("Art Enthusiast"));
        if (ae) {
          ae.nama_sanggar = "Art Enthusiast Production";
          ae.thumbnail_url = "/card-1.webp";
          ae.whatsapp = "6281318702623";
          ae.youtubeUrl = "https://www.youtube.com/@ae.production_";
        }

        // Sinar Norray (Replaces Sandyakala Art Performance if present)
        const norray = sanggars.find(s => 
          s.nama_sanggar?.toLowerCase().includes("sinar norray") || 
          s.nama_sanggar?.toLowerCase().includes("sandyakala") ||
          s.id === "sinar-norray"
        );
        if (norray) {
          norray.nama_sanggar = "Sinar Norray";
          norray.nama_pimpinan = "Engkar Karmilasari (Engkar Nori)";
          norray.grade = "B";
          norray.alamat = "Jl. Daman 1 No.39 RT.008/002 Bambu Apus Cipayung Jakarta Timur";
          norray.thumbnail_url = "/card-7.webp";
          norray.whatsapp = "6281310998647";
          norray.whatsappUrl = "https://wa.me/6281310998647";
          norray.instagramUrl = "https://instagram.com/sinar_norray";
          norray.youtubeUrl = "https://youtube.com/@sinarnorray6913?si=oV-MbzLOy6alf8JJ";
        } else {
          sanggars.push({
            id: "sinar-norray",
            nama_sanggar: "Sinar Norray",
            nama_pimpinan: "Engkar Karmilasari (Engkar Nori)",
            grade: "B",
            alamat: "Jl. Daman 1 No.39 RT.008/002 Bambu Apus Cipayung Jakarta Timur",
            thumbnail_url: "/card-7.webp",
            whatsapp: "6281310998647",
            whatsappUrl: "https://wa.me/6281310998647",
            instagramUrl: "https://instagram.com/sinar_norray",
            youtubeUrl: "https://youtube.com/@sinarnorray6913?si=oV-MbzLOy6alf8JJ"
          });
        }

        // Assign images to specific Sanggar cards
        const am = sanggars.find(s => s.nama_sanggar === "AM Dance Studio");
        if (am) {
          am.thumbnail_url = "/card-2.webp";
          am.whatsapp = "6281289214320";
          am.youtubeUrl = "https://www.youtube.com";
        }

        const arunika = sanggars.find(s => s.nama_sanggar === "Arunika Art Production");
        if (arunika) {
          arunika.thumbnail_url = "/card-3.webp";
          arunika.whatsapp = "6281289214320";
          arunika.youtubeUrl = "https://www.youtube.com";
        }

        const ayodya = sanggars.find(s => s.nama_sanggar === "Ayodya Pala");
        if (ayodya) {
          ayodya.thumbnail_url = "/card-4.webp";
          ayodya.whatsapp = "6281399160062";
          ayodya.youtubeUrl = "https://www.youtube.com";
        }

        const citra = sanggars.find(s => s.nama_sanggar === "Citra Art Studio");
        if (citra) {
          citra.thumbnail_url = "/card-5.webp";
          citra.whatsapp = "6281289214320";
          citra.youtubeUrl = "https://www.youtube.com";
        }

        const daya = sanggars.find(s => s.nama_sanggar === "Daya Presta");
        if (daya) {
          daya.thumbnail_url = "/card-6.webp";
          daya.whatsapp = "6281289214320";
          daya.youtubeUrl = "https://www.youtube.com";
        }
      }
    }
  } catch (err: unknown) {
    const errMsg =
      err instanceof Error ? err.message : String(err);
    console.error("Unexpected fetch exception:", errMsg, err);
    fetchError = errMsg || "Terjadi kesalahan koneksi ke server database.";
  }

  return <SanggarCatalog sanggars={sanggars} fetchError={fetchError} />;
}