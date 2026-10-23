"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowUp, CheckCircle2, ExternalLink, Info, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { findMusikMaster, rowOfMaster } from "@/data/musikData";
import { supabase } from "@/lib/supabase";
import { JAKARTA_WILAYAH } from "@/lib/wilayah";
import { isVideoFile, youTubeId } from "@/lib/video";
import { useLanguage } from "@/context/LanguageContext";
import ImageField from "@/components/admin/ImageField";
import VideoField from "@/components/admin/VideoField";
import { FieldLabel, GalleryEditor, SectionNotice, inputClass, secondaryButtonClass } from "@/components/admin/FormParts";
import ExperienceList from "@/components/ExperienceList";
import { pengalamanLine } from "@/lib/pemusikData";
import {
  EMPTY_PEMUSIK_FORM,
  emptyPrestasi,
  KATEGORI_MUSIK_OPTIONS,
  PEMUSIK_MIGRATION_COLUMNS,
  PEMUSIK_MIGRATION_FILE,
  PEMUSIK_TABLE,
  PemusikFormValues,
  PemusikRow,
  buildPemusikPayload,
  fillFromMaster,
  getPemusikColumns,
  isValidWaNumber,
  masterToForm,
  pemusikRowToForm,
  savePemusik,
  typedWaDigits,
} from "@/lib/pemusikAdmin";

type TabKey = "utama" | "kontak" | "media" | "layanan" | "pengalaman";

/** Which tab each validated field lives on, so a failed save opens the right tab */
type FieldErrors = Partial<Record<"nama" | "kategori" | "whatsapp" | "anggota" | "video", true>>;

export default function PemusikForm({ id }: { id?: string }) {
  const isEdit = Boolean(id);
  // a slug id ("betawi-section") is a built-in profile that has no database row yet
  const isBuiltIn = isEdit && !/^\d+$/.test(id!);
  const router = useRouter();
  const { language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);

  const [values, setValues] = useState<PemusikFormValues>(EMPTY_PEMUSIK_FORM);
  const [columns, setColumns] = useState<Set<string> | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("utama");
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  /** Fields filled in from the master data because the database row has them empty */
  const [prefilled, setPrefilled] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [cols, rowResult] = await Promise.all([
        getPemusikColumns(),
        isEdit && !isBuiltIn ? supabase.from(PEMUSIK_TABLE).select("*").eq("id", id).single() : Promise.resolve(null),
      ]);
      if (cancelled) return;
      setColumns(cols);
      if (isBuiltIn) {
        // A built-in profile (src/data/musikData.ts) with no row yet: start from its data; saving inserts it as a new
        // row, which then stands for it everywhere. Already saved once? Edit that row instead.
        const master = findMusikMaster(id!);
        const { data: rows } = await supabase.from(PEMUSIK_TABLE).select("id, nama_seniman");
        if (cancelled) return;
        const saved = master && rows ? rowOfMaster(rows as Pick<PemusikRow, "id" | "nama_seniman">[], master.id) : undefined;
        if (saved) {
          router.replace(`/admin/pemusik/edit/${saved.id}`);
          return;
        }
        if (!master) setError(language === "en" ? "Could not load this music artist." : "Gagal memuat data seniman musik.");
        else setValues(fillFromMaster(EMPTY_PEMUSIK_FORM, masterToForm(master)).values);
      } else if (rowResult) {
        if (rowResult.error || !rowResult.data) {
          setError(language === "en" ? "Could not load this music artist." : "Gagal memuat data seniman musik.");
        } else {
          const fromRow = pemusikRowToForm(rowResult.data as PemusikRow);
          // A row with master data (src/data/musikData.ts): the public page shows the master values where the row is
          // empty, so the form starts from the same values (saving moves them into the database)
          const master = findMusikMaster(String(id));
          if (master) {
            const merged = fillFromMaster(fromRow, masterToForm(master));
            setValues(merged.values);
            setPrefilled(merged.filled);
          } else {
            setValues(fromRow);
          }
        }
      }
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const set = <K extends keyof PemusikFormValues>(key: K, value: PemusikFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  /** True when the database has no column for this field yet (migration not applied) */
  const isMissing = (column: string) => columns !== null && !columns.has(column);
  const missingColumns = Object.keys(PEMUSIK_MIGRATION_COLUMNS).filter(isMissing);
  const migrationTag = (column: string) => (isMissing(column) ? tr("Perlu migrasi DB", "Needs DB migration") : undefined);
  const sectionNotice = (column: string) =>
    isMissing(column)
      ? tr(
          `Bagian ini belum bisa disimpan: kolom "${column}" belum ada di database. Jalankan berkas ${PEMUSIK_MIGRATION_FILE} di Supabase SQL Editor.`,
          `This section cannot be saved yet: the "${column}" column does not exist in the database. Run ${PEMUSIK_MIGRATION_FILE} in the Supabase SQL Editor.`
        )
      : undefined;

  // labels follow the category (a new, still empty form reads as a community)
  const isKomunitas = values.kategori !== "Pemusik";
  // the number the WhatsApp button would use; anything typed that isn't a valid number blocks the save
  const waNumber = typedWaDigits(values);
  const waInvalid = waNumber !== "" && !isValidWaNumber(waNumber);
  // a pasted link that is neither YouTube nor a video file blocks the save
  const videoInvalid = !!values.video_url.trim() && !youTubeId(values.video_url) && !isVideoFile(values.video_url);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "utama", label: tr("Informasi Utama", "Main Info") },
    { key: "kontak", label: tr("Kontak & Sosial Media", "Contact & Social") },
    { key: "media", label: tr("Media & Galeri", "Media & Gallery") },
    { key: "layanan", label: tr("Layanan & Karya", "Services & Works") },
    { key: "pengalaman", label: tr("Pengalaman Berkesenian", "Artistic Experience") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const anggota = values.jumlah_anggota.trim();
    const next: FieldErrors = {
      ...(!values.nama_seniman.trim() && { nama: true }),
      ...(!values.kategori && { kategori: true }),
      ...(anggota && !/^\d+$/.test(anggota) && { anggota: true }),
      ...(waInvalid && { whatsapp: true }),
      ...(videoInvalid && { video: true }),
    };
    setErrors(next);
    if (next.nama || next.kategori || next.anggota) return setActiveTab("utama");
    if (next.whatsapp) return setActiveTab("kontak");
    if (next.video) return setActiveTab("media");

    setIsSaving(true);
    try {
      const payload = await buildPemusikPayload(values);
      // a built-in profile is inserted as a new row; any other edit updates its row
      const result = await savePemusik(isEdit && !isBuiltIn ? id! : null, payload, columns);
      const skipped = result.skipped.length > 0 ? `&skipped=${encodeURIComponent(result.skipped.join(","))}` : "";
      router.push(`/admin/pemusik?success=1${skipped}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : tr("Gagal menyimpan data seniman musik.", "Failed to save the music artist."));
      setIsSaving(false);
    }
  };

  const errorClass = (bad?: boolean) => (bad ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "");
  const errorText = (text: string) => <span className="mt-1 block text-xs text-red-600">{text}</span>;
  const hint = (text: string) => <span className="mt-1 block text-xs text-zinc-500">{text}</span>;

  /** Move item i of a list up (-1) or down (+1) */
  const move = <T,>(list: T[], i: number, delta: -1 | 1): T[] => {
    const j = i + delta;
    if (j < 0 || j >= list.length) return list;
    const copy = [...list];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  };
  const rowButton = "flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-zinc-400 transition-colors disabled:opacity-30";

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin" aria-label={tr("Memuat", "Loading")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8 pb-28">
      <Link href="/admin/pemusik" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-orange-600 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        {tr("Kembali ke Data Seniman Musik", "Back to Music Artist Data")}
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {isEdit ? tr("Edit Seniman Musik", "Edit Music Artist") : tr("Tambah Seniman Musik", "Add Music Artist")}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {tr("Perubahan langsung tampil di situs publik setelah disimpan.", "Changes appear on the public site as soon as you save.")}
          </p>
        </div>
        {isEdit && (
          <a href={`/pemusik/${id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-orange-600 transition-colors">
            <ExternalLink className="h-4 w-4" />
            {tr("Lihat halaman publik", "View public page")}
          </a>
        )}
      </div>

      {missingColumns.length > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">{tr("Beberapa kolom belum tersedia di database", "Some fields are not in the database yet")}</p>
            <p className="mt-1 text-amber-800">
              {tr("Bidang berikut dinonaktifkan sampai migrasi dijalankan: ", "These fields are disabled until the migration is run: ")}
              <strong>{missingColumns.map((c) => PEMUSIK_MIGRATION_COLUMNS[c]).join(", ")}</strong>.{" "}
              {tr("Berkas: ", "File: ")}
              <code className="rounded-sm bg-amber-100 px-1 py-0.5 text-xs">{PEMUSIK_MIGRATION_FILE}</code>
            </p>
          </div>
        </div>
      )}

      {isBuiltIn && !error && (
        <div className="mb-5 flex items-start gap-3 rounded-sm border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            {tr(
              `Profil bawaan dari src/data/musikData.ts yang belum ada di database. Tekan Simpan untuk menyimpannya sebagai data baru di database; setelah itu profil ini tampil dan diedit dari data tersebut. Biarkan namanya tetap “${values.nama_seniman}” agar profil bawaannya tidak tampil ganda.`,
              `Built-in profile from src/data/musikData.ts that isn't in the database yet. Press Save to store it as a new database entry; from then on that entry is shown and edited. Keep the name “${values.nama_seniman}” so the built-in profile isn't listed twice.`
            )}
          </p>
        </div>
      )}

      {prefilled.length > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-sm border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            {tr(
              `${prefilled.length} isian diambil dari data bawaan (src/data/musikData.ts) karena masih kosong di database, sama seperti yang tampil di situs publik. Tekan Simpan untuk menyimpannya ke database.`,
              `${prefilled.length} fields come from the built-in data (src/data/musikData.ts) because they are empty in the database, as shown on the public site. Press Save to store them in the database.`
            )}
          </p>
        </div>
      )}

      {error && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="relative overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-xs">
        <div aria-hidden="true" className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#F7941E] via-[#E01A67] to-[#2B3990]" />

        {/* Tabs */}
        <div role="tablist" aria-label={tr("Bagian formulir", "Form sections")} className="flex overflow-x-auto border-b border-zinc-200 pt-1">
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative shrink-0 px-4 sm:px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors outline-none ${
                activeTab === tab.key ? "text-orange-600" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <span className="mr-1.5 tabular-nums text-zinc-400">{i + 1}.</span>
              {tab.label}
              {activeTab === tab.key && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-orange-600" />}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-7">
          {/* ===== Tab 1: Informasi Utama ===== */}
          {activeTab === "utama" && (
            <div role="tabpanel" className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="md:col-span-2">
                <FieldLabel required>{tr("Nama Seniman / Komunitas Musik", "Artist / Music Community Name")}</FieldLabel>
                <input
                  type="text"
                  value={values.nama_seniman}
                  onChange={(e) => { set("nama_seniman", e.target.value); setErrors((p) => ({ ...p, nama: undefined })); }}
                  aria-invalid={!!errors.nama}
                  className={`${inputClass} ${errorClass(errors.nama)}`}
                  placeholder={tr("Contoh: Komunitas Betawi Section", "e.g. Komunitas Betawi Section")}
                />
                {errors.nama && errorText(tr("Nama wajib diisi.", "Name is required."))}
              </label>

              <label>
                <FieldLabel required>{tr("Kategori Musik", "Music Category")}</FieldLabel>
                <select
                  value={values.kategori}
                  onChange={(e) => { set("kategori", e.target.value); setErrors((p) => ({ ...p, kategori: undefined })); }}
                  aria-invalid={!!errors.kategori}
                  className={`${inputClass} ${errorClass(errors.kategori)}`}
                >
                  <option value="" disabled hidden>{tr("Pilih kategori", "Choose a category")}</option>
                  {KATEGORI_MUSIK_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                {errors.kategori
                  ? errorText(tr("Pilih kategori musik.", "Choose a music category."))
                  : hint(tr("Komunitas Musik: komunitas, grup, orkes, atau sanggar musik. Pemusik: musisi individu.", "Komunitas Musik: a community, group, ensemble or music studio. Pemusik: a solo musician."))}
              </label>

              <label>
                <FieldLabel tag={migrationTag("nama_panggung")}>{isKomunitas ? tr("Nama Grup / Orkes", "Group / Ensemble Name") : tr("Nama Panggung", "Stage Name")}</FieldLabel>
                <input type="text" value={values.nama_panggung} onChange={(e) => set("nama_panggung", e.target.value)} disabled={isMissing("nama_panggung")} className={inputClass} placeholder={isKomunitas ? tr("Contoh: Orkes Gambang Kromong Suara Lama", "e.g. Orkes Gambang Kromong Suara Lama") : ""} />
              </label>

              <label>
                <FieldLabel tag={migrationTag("wilayah")}>{tr("Wilayah (Kota Administrasi)", "Region (Administrative City)")}</FieldLabel>
                <select value={values.wilayah} onChange={(e) => set("wilayah", e.target.value)} disabled={isMissing("wilayah")} className={inputClass}>
                  <option value="">{tr("Pilih wilayah", "Choose a region")}</option>
                  {JAKARTA_WILAYAH.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </label>

              <label>
                <FieldLabel tag={migrationTag("status")}>Status</FieldLabel>
                <select value={values.status} onChange={(e) => set("status", e.target.value as PemusikFormValues["status"])} disabled={isMissing("status")} className={inputClass}>
                  <option value="terverifikasi">{tr("Terverifikasi (tampil di publik)", "Verified (shown publicly)")}</option>
                  <option value="draft">{tr("Draft (disembunyikan dari publik)", "Draft (hidden from the public)")}</option>
                </select>
              </label>


              <label>
                <FieldLabel tag={migrationTag("tahun_berdiri")}>{isKomunitas ? tr("Tahun Berdiri", "Year Founded") : tr("Aktif Sejak", "Active Since")}</FieldLabel>
                <input type="text" inputMode="numeric" value={values.tahun_berdiri} onChange={(e) => set("tahun_berdiri", e.target.value)} disabled={isMissing("tahun_berdiri")} className={inputClass} placeholder="2015" />
              </label>

              <label>
                <FieldLabel tag={migrationTag("jumlah_anggota")}>{tr("Jumlah Anggota", "Number of Members")}</FieldLabel>
                <input
                  type="text"
                  inputMode="numeric"
                  value={values.jumlah_anggota}
                  onChange={(e) => { set("jumlah_anggota", e.target.value); setErrors((p) => ({ ...p, anggota: undefined })); }}
                  disabled={isMissing("jumlah_anggota")}
                  aria-invalid={!!errors.anggota}
                  className={`${inputClass} ${errorClass(errors.anggota)}`}
                  placeholder="150"
                />
                {errors.anggota && errorText(tr("Isi dengan angka saja.", "Numbers only."))}
              </label>

              <label>
                <FieldLabel tag={migrationTag("ketua")}>{isKomunitas ? tr("Nama Ketua", "Leader") : tr("Nama Lengkap / Pimpinan", "Full Name / Leader")}</FieldLabel>
                <input type="text" value={values.ketua} onChange={(e) => set("ketua", e.target.value)} disabled={isMissing("ketua")} className={inputClass} />
              </label>

              <label>
                <FieldLabel tag={migrationTag("nama_pic")}>{tr("Nama PIC", "Contact Person (PIC)")}</FieldLabel>
                <input type="text" value={values.nama_pic} onChange={(e) => set("nama_pic", e.target.value)} disabled={isMissing("nama_pic")} className={inputClass} />
                {hint(tr("Kosongkan bila sama dengan ketua.", "Leave empty when it's the leader."))}
              </label>

              <label className="md:col-span-2">
                <FieldLabel tag={migrationTag("jenis_musik")}>{tr("Jenis Musik", "Music Types")}</FieldLabel>
                <input type="text" value={values.jenis_musik} onChange={(e) => set("jenis_musik", e.target.value)} disabled={isMissing("jenis_musik")} className={inputClass} placeholder={tr("Pisahkan dengan koma: Gambang Kromong, Tanjidor", "Comma-separated: Gambang Kromong, Tanjidor")} />
              </label>

              <label>
                <FieldLabel>Genre</FieldLabel>
                <input type="text" value={values.genre_musik} onChange={(e) => set("genre_musik", e.target.value)} className={inputClass} placeholder={tr("Pisahkan dengan koma", "Comma-separated")} />
              </label>

              <label>
                <FieldLabel>{isKomunitas ? tr("Instrumen yang Dimainkan", "Instruments Played") : tr("Alat Musik yang Dikuasai", "Instruments Mastered")}</FieldLabel>
                <input type="text" value={values.instrumen} onChange={(e) => set("instrumen", e.target.value)} className={inputClass} placeholder={tr("Pisahkan dengan koma: Gambang, Kromong, Tehyan", "Comma-separated: Gambang, Kromong, Tehyan")} />
              </label>

              <label className="md:col-span-2">
                <FieldLabel>{tr("Deskripsi Profil", "Profile Description")}</FieldLabel>
                <textarea rows={6} value={values.deskripsi} onChange={(e) => set("deskripsi", e.target.value)} className={inputClass} />
                {hint(tr("Pisahkan paragraf dengan satu baris kosong.", "Separate paragraphs with a blank line."))}
              </label>
            </div>
          )}

          {/* ===== Tab 2: Kontak & Sosial Media ===== */}
          {activeTab === "kontak" && (
            <div role="tabpanel" className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label>
                <FieldLabel tag={migrationTag("kontak")}>{tr("Nomor Kontak (ditampilkan)", "Contact Numbers (shown)")}</FieldLabel>
                <input type="text" inputMode="tel" value={values.kontak} onChange={(e) => set("kontak", e.target.value)} disabled={isMissing("kontak")} className={inputClass} placeholder="081384071949 / 085939836744" />
                {hint(tr("Boleh lebih dari satu, pisahkan dengan “/”.", "More than one is fine, separated by “/”."))}
              </label>

              <label>
                <FieldLabel tag={migrationTag("whatsapp")}>{tr("Nomor WhatsApp Aktif", "Active WhatsApp Number")}</FieldLabel>
                <input
                  type="text"
                  inputMode="tel"
                  value={values.whatsapp}
                  onChange={(e) => { set("whatsapp", e.target.value); setErrors((p) => ({ ...p, whatsapp: undefined })); }}
                  disabled={isMissing("whatsapp")}
                  aria-invalid={!!errors.whatsapp}
                  className={`${inputClass} ${errorClass(errors.whatsapp || waInvalid)}`}
                  placeholder="085939836744"
                />
                {hint(tr("Kosongkan bila sama dengan nomor kontak pertama.", "Leave empty when it's the first contact number."))}
              </label>

              {/* What the public WhatsApp button will open, after the number is normalised to 62… */}
              <div className="md:col-span-2">
                {waNumber ? (
                  <div className={`flex items-start gap-2.5 rounded-sm border p-3 text-xs ${waInvalid ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
                    {waInvalid ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
                    <p>
                      {waInvalid
                        ? tr(`Nomor WhatsApp tidak valid (${waNumber}). Gunakan format 08… atau +62…`, `Invalid WhatsApp number (${waNumber}). Use 08… or +62…`)
                        : <>
                            {tr("Tombol WhatsApp akan membuka ", "The WhatsApp button will open ")}
                            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="font-bold underline">wa.me/{waNumber}</a>
                            {!values.whatsapp.trim() && tr(" (dari nomor kontak pertama).", " (from the first contact number).")}
                          </>}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">{tr("Belum ada nomor: tombol WhatsApp tidak ditampilkan di situs publik.", "No number yet: the public site shows no WhatsApp button.")}</p>
                )}
              </div>

              <label>
                <FieldLabel tag={migrationTag("email")}>Email</FieldLabel>
                <input type="email" value={values.email} onChange={(e) => set("email", e.target.value)} disabled={isMissing("email")} className={inputClass} placeholder="nama@email.com" />
              </label>
              <label>
                <FieldLabel tag={migrationTag("instagram")}>Instagram</FieldLabel>
                <input type="text" value={values.instagram} onChange={(e) => set("instagram", e.target.value)} disabled={isMissing("instagram")} className={inputClass} placeholder={tr("@akun atau link", "@handle or link")} />
              </label>
              <label>
                <FieldLabel tag={migrationTag("youtube_url")}>YouTube</FieldLabel>
                <input type="text" value={values.youtube_url} onChange={(e) => set("youtube_url", e.target.value)} disabled={isMissing("youtube_url")} className={inputClass} placeholder={tr("@kanal, nama kanal, atau link", "@channel, channel name or link")} />
              </label>
              <label>
                <FieldLabel tag={migrationTag("tiktok")}>TikTok</FieldLabel>
                <input type="text" value={values.tiktok} onChange={(e) => set("tiktok", e.target.value)} disabled={isMissing("tiktok")} className={inputClass} placeholder={tr("@akun atau link", "@handle or link")} />
              </label>
              <label>
                <FieldLabel tag={migrationTag("facebook")}>Facebook</FieldLabel>
                <input type="text" value={values.facebook} onChange={(e) => set("facebook", e.target.value)} disabled={isMissing("facebook")} className={inputClass} placeholder={tr("Nama halaman atau link", "Page name or link")} />
              </label>
              <label className="md:col-span-2">
                <FieldLabel tag={migrationTag("alamat")}>{tr("Alamat Lengkap", "Full Address")}</FieldLabel>
                <textarea rows={2} value={values.alamat} onChange={(e) => set("alamat", e.target.value)} disabled={isMissing("alamat")} className={inputClass} />
                {hint(tr("Dipakai untuk peta lokasi di halaman detail.", "Used for the location map on the detail page."))}
              </label>
            </div>
          )}

          {/* ===== Tab 3: Media & Galeri ===== */}
          {activeTab === "media" && (
            <div role="tabpanel" className="space-y-10">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <ImageField
                    label={tr("Logo / Foto Profil", "Logo / Profile Photo")}
                    hint={tr("Tampil bulat di header detail (1:1).", "Shown round in the detail header (1:1).")}
                    value={values.logo}
                    aspect={1}
                    previewClass="aspect-square"
                    onChange={(v) => set("logo", v)}
                  />
                  <div className="mt-2"><SectionNotice text={sectionNotice("logo_url")} /></div>
                </div>
                <div>
                  <ImageField
                    label={tr("Foto Cover Card", "Card Cover Photo")}
                    hint={tr("Poster kartu di halaman katalog (3:4).", "Card poster on the catalog page (3:4).")}
                    value={values.foto_card}
                    aspect={3 / 4}
                    lockAspect
                    previewClass="aspect-[3/4]"
                    onChange={(v) => set("foto_card", v)}
                  />
                  <div className="mt-2"><SectionNotice text={sectionNotice("foto_card_url")} /></div>
                </div>
                <div className="sm:col-span-2">
                  <VideoField
                    value={{ url: values.video_url, file: values.video_file }}
                    onChange={(v) => {
                      setValues((prev) => ({ ...prev, video_url: v.url, video_file: v.file }));
                      setErrors((p) => ({ ...p, video: undefined }));
                    }}
                    isEn={language === "en"}
                    disabled={isMissing("video_url")}
                    tag={migrationTag("video_url")}
                    notice={sectionNotice("video_url") && <div className="mb-2"><SectionNotice text={sectionNotice("video_url")} /></div>}
                    invalid={!!errors.video}
                  />
                  {!values.video_url.trim() && !values.video_file && hint(tr("Kosong: halaman detail menampilkan “Video penampilan belum tersedia”.", "Empty: the detail page shows “performance video not available yet”."))}
                </div>
              </div>

              <GalleryEditor
                title={tr("Galeri Foto", "Photo Gallery")}
                items={values.galeri}
                onChange={(galeri) => set("galeri", galeri)}
                disabled={isMissing("galeri")}
                notice={sectionNotice("galeri")}
              />
            </div>
          )}

          {/* ===== Tab 4: Layanan & Karya ===== */}
          {activeTab === "layanan" && (
            <div role="tabpanel" className="space-y-10">
              {/* Layanan */}
              <section>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">{tr("Layanan", "Services")}</h2>
                    <p className="text-xs text-zinc-500">{tr("Satu layanan per baris. Lebih dari 5 bisa digulir di halaman detail.", "One service per row. More than 5 scroll on the detail page.")}</p>
                  </div>
                  <button type="button" disabled={isMissing("layanan_items")} onClick={() => set("layanan", [...values.layanan, ""])} className={secondaryButtonClass}>
                    <Plus className="h-4 w-4" /> {tr("Tambah Layanan", "Add Service")}
                  </button>
                </div>
                <div className="mt-3"><SectionNotice text={sectionNotice("layanan_items")} /></div>
                <div className="mt-3 space-y-2.5">
                  {values.layanan.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => set("layanan", values.layanan.map((l, j) => (j === i ? e.target.value : l)))}
                        placeholder={tr("Contoh: Pertunjukan musik tradisional untuk acara formal", "e.g. Traditional music for formal events")}
                        aria-label={tr(`Layanan ${i + 1}`, `Service ${i + 1}`)}
                        className={inputClass}
                      />
                      <button type="button" onClick={() => set("layanan", values.layanan.filter((_, j) => j !== i))} className={`${rowButton} hover:bg-red-50 hover:text-red-600`} aria-label={tr(`Hapus layanan ${i + 1}`, `Remove service ${i + 1}`)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Karya Unggulan */}
              <section>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">{tr("Karya Unggulan", "Featured Works")}</h2>
                    <p className="text-xs text-zinc-500">{tr("Lagu, album, atau pertunjukan andalan. Link dokumentasi opsional.", "Signature songs, albums or performances. Documentation link optional.")}</p>
                  </div>
                  <button type="button" disabled={isMissing("karya_items")} onClick={() => set("karya", [...values.karya, { judul: "", deskripsi: "", tahun: "", link: "" }])} className={secondaryButtonClass}>
                    <Plus className="h-4 w-4" /> {tr("Tambah Karya", "Add Work")}
                  </button>
                </div>
                <div className="mt-3"><SectionNotice text={sectionNotice("karya_items")} /></div>
                <div className="mt-3 space-y-4">
                  {values.karya.map((item, i) => {
                    const update = (patch: Partial<typeof item>) => set("karya", values.karya.map((k, j) => (j === i ? { ...k, ...patch } : k)));
                    return (
                      <div key={i} className="grid grid-cols-1 gap-3 rounded-sm border border-zinc-200 bg-zinc-50/60 p-4 sm:grid-cols-[1fr_120px]">
                        <label>
                          <FieldLabel>{tr("Judul karya", "Title")}</FieldLabel>
                          <input type="text" value={item.judul} onChange={(e) => update({ judul: e.target.value })} className={inputClass} />
                        </label>
                        <label>
                          <FieldLabel>{tr("Tahun", "Year")}</FieldLabel>
                          <input type="text" inputMode="numeric" value={item.tahun} onChange={(e) => update({ tahun: e.target.value })} className={inputClass} />
                        </label>
                        <label className="sm:col-span-2">
                          <FieldLabel>{tr("Link dokumentasi", "Documentation link")}</FieldLabel>
                          <input type="url" value={item.link} onChange={(e) => update({ link: e.target.value })} className={inputClass} placeholder="https://…" />
                        </label>
                        <label className="sm:col-span-2">
                          <FieldLabel>{tr("Deskripsi", "Description")}</FieldLabel>
                          <textarea rows={2} value={item.deskripsi} onChange={(e) => update({ deskripsi: e.target.value })} className={inputClass} />
                        </label>
                        <div className="sm:col-span-2 flex justify-end">
                          <button type="button" onClick={() => set("karya", values.karya.filter((_, j) => j !== i))} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800">
                            <Trash2 className="h-3.5 w-3.5" /> {tr("Hapus karya", "Remove work")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Prestasi */}
              <section>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">{tr("Prestasi & Penghargaan", "Achievements & Awards")}</h2>
                    <p className="text-xs text-zinc-500">{tr("Tahun tampil sebagai badge di kartu prestasi.", "The year shows as a badge on the award card.")}</p>
                  </div>
                  {/* new achievements go on top, right under this button */}
                  <button type="button" disabled={isMissing("prestasi_items")} onClick={() => set("prestasi", [emptyPrestasi(), ...values.prestasi])} className={secondaryButtonClass}>
                    <Plus className="h-4 w-4" /> {tr("Tambah Prestasi", "Add Achievement")}
                  </button>
                </div>
                <div className="mt-3"><SectionNotice text={sectionNotice("prestasi_items")} /></div>
                <div className="mt-3 space-y-2.5">
                  {values.prestasi.map((item, i) => {
                    const update = (patch: Partial<typeof item>) => set("prestasi", values.prestasi.map((p, j) => (j === i ? { ...p, ...patch } : p)));
                    return (
                      <div key={item.uid} className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_1fr_100px_auto]">
                        <input type="text" value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder={tr("Nama prestasi", "Achievement")} aria-label={tr("Nama prestasi", "Achievement")} className={inputClass} />
                        <input type="text" value={item.organizer} onChange={(e) => update({ organizer: e.target.value })} placeholder={tr("Penyelenggara", "Organizer")} aria-label={tr("Penyelenggara", "Organizer")} className={inputClass} />
                        <input type="text" inputMode="numeric" value={item.year} onChange={(e) => update({ year: e.target.value })} placeholder={tr("Tahun", "Year")} aria-label={tr("Tahun", "Year")} className={inputClass} />
                        <button type="button" onClick={() => set("prestasi", values.prestasi.filter((_, j) => j !== i))} className={`${rowButton} hover:bg-red-50 hover:text-red-600`} aria-label={tr("Hapus prestasi", "Remove achievement")}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* ===== Tab 5: Pengalaman Berkesenian ===== */}
          {activeTab === "pengalaman" && (
            <div role="tabpanel" className="space-y-6">
              <section>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">{tr("Pengalaman Berkesenian", "Artistic Experience")}</h2>
                    <p className="text-xs text-zinc-500">{tr("Kegiatan dan tahunnya. Tahun tampil sebagai badge di timeline.", "Event and year. The year shows as a badge on the timeline.")}</p>
                  </div>
                  <button type="button" onClick={() => set("pengalaman", [...values.pengalaman, { kegiatan: "", tahun: "" }])} className={secondaryButtonClass}>
                    <Plus className="h-4 w-4" /> {tr("Tambah Pengalaman", "Add Experience")}
                  </button>
                </div>
                {isMissing("pengalaman_items") && (
                  <div className="mt-3">
                    <SectionNotice
                      text={tr(
                        `Sebelum migrasi, daftar ini disimpan sebagai teks (satu baris per kegiatan) di kolom lama "pengalaman".`,
                        `Until the migration is run, this list is saved as text (one line per item) in the legacy "pengalaman" column.`
                      )}
                    />
                  </div>
                )}
                <div className="mt-3 space-y-2.5">
                  {values.pengalaman.map((item, i) => {
                    const update = (patch: Partial<typeof item>) => set("pengalaman", values.pengalaman.map((p, j) => (j === i ? { ...p, ...patch } : p)));
                    return (
                      <div key={i} className="flex flex-col gap-2 sm:flex-row">
                        <input type="text" value={item.kegiatan} onChange={(e) => update({ kegiatan: e.target.value })} placeholder={tr("Contoh: Pagelaran kesenian Betawi di Setu Babakan", "e.g. Betawi arts showcase at Setu Babakan")} aria-label={tr(`Kegiatan ${i + 1}`, `Event ${i + 1}`)} className={inputClass} />
                        <div className="flex gap-1">
                          <input type="text" inputMode="numeric" value={item.tahun} onChange={(e) => update({ tahun: e.target.value })} placeholder={tr("Tahun", "Year")} aria-label={tr(`Tahun kegiatan ${i + 1}`, `Year of event ${i + 1}`)} className={`${inputClass} sm:w-28`} />
                          <button type="button" disabled={i === 0} onClick={() => set("pengalaman", move(values.pengalaman, i, -1))} className={`${rowButton} hover:bg-zinc-100 hover:text-zinc-700`} aria-label={tr("Naikkan", "Move up")}>
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button type="button" disabled={i === values.pengalaman.length - 1} onClick={() => set("pengalaman", move(values.pengalaman, i, 1))} className={`${rowButton} hover:bg-zinc-100 hover:text-zinc-700`} aria-label={tr("Turunkan", "Move down")}>
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => set("pengalaman", values.pengalaman.filter((_, j) => j !== i))} className={`${rowButton} hover:bg-red-50 hover:text-red-600`} aria-label={tr("Hapus pengalaman", "Remove experience")}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Live preview with the public timeline component */}
              {values.pengalaman.some((p) => p.kegiatan.trim()) && (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">{tr("Pratinjau di halaman detail", "Preview on the detail page")}</h3>
                  <ExperienceList items={values.pengalaman.filter((p) => p.kegiatan.trim()).map(pengalamanLine)} isEn={language === "en"} />
                </section>
              )}
            </div>
          )}
        </div>

        {/* Sticky action bar */}
        <div className="sticky bottom-0 flex flex-col-reverse gap-2.5 border-t border-zinc-200 bg-white/95 px-5 py-3.5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs text-zinc-500">
            {tr("Gambar & video baru diunggah saat Anda menekan Simpan.", "New images & videos are uploaded when you press Save.")}
          </p>
          <div className="flex gap-2.5">
            <Link href="/admin/pemusik" className="flex-1 sm:flex-none rounded-sm border border-zinc-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
              {tr("Batal", "Cancel")}
            </Link>
            <button type="submit" disabled={isSaving} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-sm bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-600/20 hover:bg-brand-deep transition-all disabled:opacity-70">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? tr("Menyimpan…", "Saving…") : tr("Simpan", "Save")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
