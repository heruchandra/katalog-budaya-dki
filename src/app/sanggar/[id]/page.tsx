import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DANCE_WORKS_TITLE, danceWorksSummary, isClearedKaryaTari, isDraft, parseGallery, parseLayanan, parsePrestasi } from "@/lib/sanggarData";
import SanggarDetailClient, { SanggarDetailData, TariItem } from "./SanggarDetailClient";
import { SPECIFIC_PROFILES, curatedPhoneOf, findCuratedProfile, generateFallbackSanggar } from "@/data/sanggarProfiles";
import { resolveWilayah } from "@/lib/wilayah";

export const dynamic = "force-dynamic";

export default async function SanggarDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sanggars")
    .select("*")
    .eq("id", id)
    .single();

  if (error && !SPECIFIC_PROFILES[id]) {
    console.error("Supabase fetch sanggar error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <p className="text-xl text-slate-500">Sanggar tidak ditemukan.</p>
      </div>
    );
  }

  // Drafts are hidden from the public site
  if (data && isDraft(data)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <p className="text-xl text-slate-500">Sanggar tidak ditemukan.</p>
      </div>
    );
  }

  // the curated profile (src/data/sanggarProfiles.ts), when the sanggar has one
  const specific = findCuratedProfile(id, data?.nama_sanggar);
  const fallback = generateFallbackSanggar(data, id);

  // ---- Data saved through the admin panel ----
  // Anything the admin has filled in wins over the curated demo profile and the generated fallback.
  // (Name stays curated-first: several database names differ from the curated display names.)
  const dbGallery = data ? parseGallery(data) : [];
  const dbLayananAll = data ? parseLayanan(data) : [];
  // An emptied Karya Tari Unggulan entry: the admin removed every work, so no works card (curated ones included)
  const worksCleared = dbLayananAll.some(isClearedKaryaTari);
  const dbLayanan = dbLayananAll.filter((l) => !isClearedKaryaTari(l));
  const dbPrestasi = data ? parsePrestasi(data) : [];
  const dbDescription: string[] | null = data?.deskripsi
    ? String(data.deskripsi).split(/\r?\n\s*\r?\n|\r?\n/).map((p: string) => p.trim()).filter(Boolean)
    : null;
  const dbInstagramUrl = data?.instagram
    ? (data.instagram.startsWith("http") ? data.instagram : `https://instagram.com/${data.instagram.replace("@", "")}`)
    : null;
  const dbGrade = data?.grade ? (data.grade.toLowerCase().includes('grade') ? data.grade : `Grade ${data.grade}`) : null;
  const curatedPhone = curatedPhoneOf(specific);

  const finalSanggar: SanggarDetailData = {
    id: data?.id || id,
    name: specific?.name || data?.nama_sanggar || data?.nama || fallback?.name || '',
    leader: data?.ketua_sanggar || specific?.leader || data?.nama_pimpinan || data?.ketua || fallback?.kontak?.ketua || '',
    tagline: data?.tagline || specific?.tagline || fallback.tagline,
    grade: dbGrade || specific?.grade || fallback.grade,
    // the catalog card's rule: database value, curated city, kecamatan or address; else the province
    wilayah: resolveWilayah({ ...(data ?? {}), id: data?.id ?? id }) || specific?.wilayah || fallback.wilayah,
    description: dbDescription || specific?.description || fallback.description,
    descriptionEn: dbDescription ? undefined : specific?.descriptionEn,
    alamatSanggar: data?.alamat || specific?.alamatSanggar || fallback.alamatSanggar,
    alamatLatihan: data?.alamat_tempat_latihan || specific?.alamatLatihan || fallback.alamatLatihan,
    address: data?.alamat || specific?.address || specific?.alamatSanggar || fallback?.address || fallback?.alamatSanggar || '',
    logo: data?.logo_url || specific?.logo,
    services: dbLayanan.length > 0 ? undefined : specific?.services,
    // A service with sub-works (sub_karya) is a works card: it opens its works, like "Karya Tari Unggulan Sanggar"
    layanan: dbLayanan.length > 0
      ? dbLayanan.map((l) => {
          const works: TariItem[] = (l.sub_karya ?? []).map((s) => ({
            name: s.judul,
            synopsis: s.sinopsis,
            choreographer: s.penata_tari,
            composer: s.penata_musik,
            image: s.gambar_url,
          }));
          if (works.length === 0) return { title: l.title, description: l.description, image: l.image || undefined };
          const summary = danceWorksSummary(works.map((w) => w.name));
          return {
            title: l.title,
            titleEn: l.title === DANCE_WORKS_TITLE.id ? DANCE_WORKS_TITLE.en : undefined,
            description: l.description || summary.id,
            descriptionEn: l.description ? undefined : summary.en,
            image: l.image || works.find((w) => w.image)?.image,
            featuresDanceWorks: true,
            works,
          };
        })
      : specific?.layanan || specific?.services || (data?.layanan && Array.isArray(data.layanan) ? data.layanan : fallback.layanan),
    danceSpecialties: worksCleared ? [] : specific?.danceSpecialties || specific?.tariUnggulan || fallback.tariUnggulan,
    tariUnggulan: worksCleared ? [] : specific?.tariUnggulan || specific?.danceSpecialties || (data?.tari_unggulan && Array.isArray(data.tari_unggulan) && data.tari_unggulan.length > 0
      ? data.tari_unggulan
      : fallback.tariUnggulan),
    prestasi: dbPrestasi.length > 0
      ? dbPrestasi.map((p) => ({ title: p.title, organizer: p.organizer || undefined, year: p.year || undefined }))
      : specific?.prestasi || (data?.prestasi && Array.isArray(data.prestasi) && data.prestasi.length > 0
        ? data.prestasi
        : fallback.prestasi),
    achievements: dbPrestasi.length > 0 ? undefined : specific?.achievements || specific?.prestasi,
    // The curated contact block (phone list, WhatsApp link) is dropped once the admin saves a WhatsApp number
    contacts: data?.kontak_pic ? undefined : specific?.contacts,
    kontak: {
      ketua: data?.ketua_sanggar || specific?.kontak?.ketua || specific?.leader || data?.nama_pimpinan || fallback.kontak.ketua,
      pic: data?.nama_pic || specific?.kontak?.pic || fallback.kontak.pic,
      phone: data?.kontak_pic || curatedPhone || fallback.kontak.phone,
      email: data?.email || specific?.kontak?.email || fallback.kontak.email,
      instagram: dbInstagramUrl || specific?.contacts?.instagram || specific?.kontak?.instagram,
    },
    whatsappNumber: data?.kontak_pic || curatedPhone || data?.no_hp,
    whatsappUrl: data?.kontak_pic
      ? null
      : specific?.whatsappUrl || specific?.contacts?.whatsapp || (specific?.whatsappNumber ? `https://wa.me/${specific.whatsappNumber}` : null),
    instagram: dbInstagramUrl || specific?.contacts?.instagram || specific?.kontak?.instagram,
    instagramUrl: dbInstagramUrl || specific?.instagramUrl || specific?.contacts?.instagram || (specific?.instagram ? (specific.instagram.startsWith("http") ? specific.instagram : `https://instagram.com/${specific.instagram.replace("@", "")}`) : null),
    imageUrl: data?.foto_grup_url || data?.thumbnail_url || specific?.imageUrl || fallback.imageUrl,
    logoUrl: data?.logo_url || specific?.logo || null,
    fotoKetuaUrl: data?.foto_ketua_url || specific?.logo || specific?.fotoKetuaUrl || fallback.fotoKetuaUrl,
    youtubeUrl: data?.youtube_url || specific?.youtubeUrl || specific?.contacts?.youtube || null,
    mapsUrl: data?.maps_url || null,
    videoUrl: data?.video_url || null,
    gallery: dbGallery.length > 0
      ? dbGallery.map((g, i) => ({ type: g.caption || `Foto ${i + 1}`, url: g.url }))
      : specific?.gallery || fallback.gallery,
    galleryIsUploaded: dbGallery.length > 0,
  };

  return <SanggarDetailClient sanggar={finalSanggar} />;
}

