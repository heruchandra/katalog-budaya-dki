"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ChevronDown, ExternalLink, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { JAKARTA_WILAYAH } from "@/lib/wilayah";
import { useLanguage } from "@/context/LanguageContext";
import ImageField from "@/components/admin/ImageField";
import { FieldLabel, GalleryEditor, SectionNotice, inputClass } from "@/components/admin/FormParts";
import {
  EMPTY_FORM,
  GRADE_OPTIONS,
  KATEGORI_OPTIONS,
  MIGRATION_COLUMNS,
  SANGGAR_TABLE,
  SanggarFormValues,
  SanggarRow,
  SubKaryaFormItem,
  buildPayload,
  emptySubKarya,
  getSanggarColumns,
  rowToForm,
  saveSanggar,
} from "@/lib/sanggarAdmin";

type TabKey = "umum" | "kontak" | "media" | "galeri";

export default function SanggarForm({ id }: { id?: string }) {
  const isEdit = Boolean(id);
  const router = useRouter();
  const { language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);

  const [values, setValues] = useState<SanggarFormValues>(EMPTY_FORM);
  const [columns, setColumns] = useState<Set<string> | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("umum");
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [gradeError, setGradeError] = useState(false);
  // Services whose sub-work list is folded away (by index; cleared when a service is removed)
  const [foldedSubs, setFoldedSubs] = useState<Set<number>>(() => new Set());
  const setSubsFolded = (i: number, folded: boolean) =>
    setFoldedSubs((prev) => {
      const next = new Set(prev);
      if (folded) next.add(i);
      else next.delete(i);
      return next;
    });
  const hasValidGrade = (GRADE_OPTIONS as readonly string[]).includes(values.grade);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [cols, rowResult] = await Promise.all([
        getSanggarColumns(),
        isEdit ? supabase.from(SANGGAR_TABLE).select("*").eq("id", id).single() : Promise.resolve(null),
      ]);
      if (cancelled) return;
      setColumns(cols);
      if (rowResult) {
        if (rowResult.error || !rowResult.data) {
          setError(language === "en" ? "Could not load this sanggar." : "Gagal memuat data sanggar.");
        } else {
          setValues(rowToForm(rowResult.data as SanggarRow));
        }
      }
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const set = <K extends keyof SanggarFormValues>(key: K, value: SanggarFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  /** True when the database has no column for this field yet (migration not applied). */
  const isMissing = (column: string) => columns !== null && !columns.has(column);
  const missingColumns = Object.keys(MIGRATION_COLUMNS).filter(isMissing);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "umum", label: tr("Informasi Umum", "General Info") },
    { key: "kontak", label: tr("PIC & Kontak / Medsos", "PIC & Contact / Social") },
    { key: "media", label: tr("Media & Foto Profil", "Media & Profile Photos") },
    { key: "galeri", label: tr("Galeri & Layanan", "Gallery & Services") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const missingName = !values.nama_sanggar.trim();
    if (missingName || !hasValidGrade) {
      setNameError(missingName);
      setGradeError(!hasValidGrade);
      setActiveTab("umum");
      return;
    }
    setIsSaving(true);
    try {
      const payload = await buildPayload(values);
      const result = await saveSanggar(isEdit ? id! : null, payload, columns);
      const skipped = result.skipped.length > 0 ? `&skipped=${encodeURIComponent(result.skipped.join(","))}` : "";
      router.push(`/admin/sanggar?success=1${skipped}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : tr("Gagal menyimpan data sanggar.", "Failed to save the sanggar."));
      setIsSaving(false);
    }
  };

  /** Amber tag text for a field whose column is missing, otherwise undefined */
  const migrationTag = (column: string) => (isMissing(column) ? tr("Perlu migrasi DB", "Needs DB migration") : undefined);

  /** Notice text for a whole section whose column is missing, otherwise undefined */
  const sectionNotice = (column: string) =>
    isMissing(column)
      ? tr(
          `Bagian ini belum bisa disimpan: kolom "${column}" belum ada di database. Jalankan berkas supabase/migrations/20260930_admin_sanggar_fields.sql di Supabase SQL Editor.`,
          `This section cannot be saved yet: the "${column}" column does not exist in the database. Run supabase/migrations/20260930_admin_sanggar_fields.sql in the Supabase SQL Editor.`
        )
      : undefined;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin" aria-label={tr("Memuat", "Loading")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8 pb-28">
      <Link href="/admin/sanggar" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-orange-600 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        {tr("Kembali ke Data Sanggar", "Back to Sanggar Data")}
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {isEdit ? tr("Edit Sanggar", "Edit Sanggar") : tr("Tambah Sanggar", "Add Sanggar")}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {tr("Perubahan langsung tampil di situs publik setelah disimpan.", "Changes appear on the public site as soon as you save.")}
          </p>
        </div>
        {isEdit && (
          <a href={`/sanggar/${id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-orange-600 transition-colors">
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
              <strong>{missingColumns.map((c) => MIGRATION_COLUMNS[c]).join(", ")}</strong>.{" "}
              {tr("Berkas: ", "File: ")}
              <code className="rounded-sm bg-amber-100 px-1 py-0.5 text-xs">supabase/migrations/20260930_admin_sanggar_fields.sql</code>
            </p>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-xs">
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
          {/* ===== Tab 1: Informasi Umum ===== */}
          {activeTab === "umum" && (
            <div role="tabpanel" className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="md:col-span-2">
                <FieldLabel required>{tr("Nama Sanggar", "Sanggar Name")}</FieldLabel>
                <input
                  type="text"
                  value={values.nama_sanggar}
                  onChange={(e) => { set("nama_sanggar", e.target.value); setNameError(false); }}
                  aria-invalid={nameError}
                  className={`${inputClass} ${nameError ? "border-red-400 focus:border-red-500 focus:ring-red-500" : ""}`}
                  placeholder={tr("Contoh: Sanggar Seni Sinar Norray", "e.g. Sanggar Seni Sinar Norray")}
                />
                {nameError && <span className="mt-1 block text-xs text-red-600">{tr("Nama sanggar wajib diisi.", "Sanggar name is required.")}</span>}
              </label>

              <label>
                <FieldLabel tag={migrationTag("kategori")}>{tr("Kategori Seni", "Art Category")}</FieldLabel>
                <select value={values.kategori} onChange={(e) => set("kategori", e.target.value)} disabled={isMissing("kategori")} className={inputClass}>
                  {KATEGORI_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </label>

              <label>
                <FieldLabel required>Grade</FieldLabel>
                {/* Only Grade A / B can be chosen. The placeholder is not selectable: it just shows that nothing
                    valid is set yet (new sanggar, or an old record holding another value). */}
                <select
                  value={hasValidGrade ? values.grade : ""}
                  onChange={(e) => { set("grade", e.target.value); setGradeError(false); }}
                  aria-invalid={gradeError}
                  className={`${inputClass} ${gradeError ? "border-red-400 focus:border-red-500 focus:ring-red-500" : ""}`}
                >
                  <option value="" disabled hidden>{tr("Pilih grade", "Choose a grade")}</option>
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
                {gradeError && <span className="mt-1 block text-xs text-red-600">{tr("Pilih Grade A atau Grade B.", "Choose Grade A or Grade B.")}</span>}
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
                <select value={values.status} onChange={(e) => set("status", e.target.value as SanggarFormValues["status"])} disabled={isMissing("status")} className={inputClass}>
                  <option value="terverifikasi">{tr("Terverifikasi (tampil di publik)", "Verified (shown publicly)")}</option>
                  <option value="draft">{tr("Draft (disembunyikan dari publik)", "Draft (hidden from the public)")}</option>
                </select>
              </label>

              <label className="md:col-span-2">
                <FieldLabel>Tagline</FieldLabel>
                <input type="text" value={values.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} />
              </label>

              <label className="md:col-span-2">
                <FieldLabel>{tr("Alamat Lengkap", "Full Address")}</FieldLabel>
                <textarea rows={2} value={values.alamat} onChange={(e) => set("alamat", e.target.value)} className={inputClass} />
              </label>

              <label className="md:col-span-2">
                <FieldLabel>{tr("Tempat & Jadwal Latihan", "Practice Venue & Schedule")}</FieldLabel>
                <textarea rows={2} value={values.alamat_tempat_latihan} onChange={(e) => set("alamat_tempat_latihan", e.target.value)} className={inputClass} />
              </label>

              <label className="md:col-span-2">
                <FieldLabel>{tr("Deskripsi Profil / Sejarah", "Profile Description / History")}</FieldLabel>
                <textarea rows={6} value={values.deskripsi} onChange={(e) => set("deskripsi", e.target.value)} className={inputClass} />
              </label>
            </div>
          )}

          {/* ===== Tab 2: PIC & Kontak ===== */}
          {activeTab === "kontak" && (
            <div role="tabpanel" className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label>
                <FieldLabel>{tr("Ketua Sanggar", "Sanggar Leader")}</FieldLabel>
                <input type="text" value={values.ketua_sanggar} onChange={(e) => set("ketua_sanggar", e.target.value)} className={inputClass} />
              </label>
              <label>
                <FieldLabel>{tr("Nama PIC Kontak", "Contact Person (PIC)")}</FieldLabel>
                <input type="text" value={values.nama_pic} onChange={(e) => set("nama_pic", e.target.value)} className={inputClass} />
              </label>
              <label>
                <FieldLabel>{tr("No. WhatsApp", "WhatsApp Number")}</FieldLabel>
                <input type="tel" inputMode="tel" value={values.kontak_pic} onChange={(e) => set("kontak_pic", e.target.value)} className={inputClass} placeholder="081234567890" />
                <span className="mt-1 block text-xs text-zinc-500">{tr("Dipakai untuk tombol WhatsApp di situs publik.", "Used for the WhatsApp button on the public site.")}</span>
              </label>
              <label>
                <FieldLabel>Email</FieldLabel>
                <input type="email" value={values.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="nama@email.com" />
              </label>
              <label>
                <FieldLabel>{tr("Link Instagram", "Instagram Link")}</FieldLabel>
                <input type="text" value={values.instagram} onChange={(e) => set("instagram", e.target.value)} className={inputClass} placeholder="https://instagram.com/…" />
              </label>
              <label>
                <FieldLabel tag={migrationTag("youtube_url")}>{tr("Link YouTube", "YouTube Link")}</FieldLabel>
                <input type="url" value={values.youtube_url} onChange={(e) => set("youtube_url", e.target.value)} disabled={isMissing("youtube_url")} className={inputClass} placeholder="https://youtube.com/@…" />
              </label>
              <label className="md:col-span-2">
                <FieldLabel tag={migrationTag("maps_url")}>{tr("Link Google Maps", "Google Maps Link")}</FieldLabel>
                <input type="url" value={values.maps_url} onChange={(e) => set("maps_url", e.target.value)} disabled={isMissing("maps_url")} className={inputClass} placeholder="https://maps.app.goo.gl/…" />
                <span className="mt-1 block text-xs text-zinc-500">{tr("Jika kosong, tombol Maps memakai pencarian dari alamat.", "If empty, the Maps button searches for the address.")}</span>
              </label>
            </div>
          )}

          {/* ===== Tab 3: Media ===== */}
          {activeTab === "media" && (
            <div role="tabpanel" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ImageField
                label={tr("Thumbnail Katalog", "Catalog Thumbnail")}
                hint={tr("Poster kartu di halaman katalog (3:4).", "Card poster on the catalog page (3:4).")}
                value={values.thumbnail}
                aspect={3 / 4}
                lockAspect
                previewClass="aspect-[3/4]"
                onChange={(v) => set("thumbnail", v)}
              />
              <ImageField
                label={tr("Logo / Foto Profil", "Logo / Profile Photo")}
                hint={tr("Tampil bulat di halaman detail (1:1).", "Shown round on the detail page (1:1).")}
                value={values.logo}
                aspect={1}
                previewClass="aspect-square"
                onChange={(v) => set("logo", v)}
              />
              <ImageField
                label={tr("Foto Ketua Sanggar", "Leader Photo")}
                hint={tr("Dipakai bila logo kosong (1:1).", "Used when there is no logo (1:1).")}
                value={values.foto_ketua}
                aspect={1}
                previewClass="aspect-square"
                onChange={(v) => set("foto_ketua", v)}
              />
              <ImageField
                label={tr("Foto Grup / Sampul", "Group / Cover Photo")}
                hint={tr("Foto utama sanggar (16:9).", "Main sanggar photo (16:9).")}
                value={values.foto_grup}
                aspect={16 / 9}
                previewClass="aspect-video"
                onChange={(v) => set("foto_grup", v)}
              />
            </div>
          )}

          {/* ===== Tab 4: Galeri & Layanan ===== */}
          {activeTab === "galeri" && (
            <div role="tabpanel" className="space-y-10">
              <GalleryEditor
                title={tr("Galeri Foto & Aktivitas", "Photo Gallery & Activities")}
                items={values.galeri}
                onChange={(galeri) => set("galeri", galeri)}
                disabled={isMissing("galeri")}
                notice={sectionNotice("galeri")}
              />

              {/* Layanan / Karya */}
              <section>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">{tr("Layanan / Karya", "Services / Works")}</h2>
                    <p className="text-xs text-zinc-500">{tr("Tampil sebagai kartu layanan di halaman detail.", "Shown as service cards on the detail page.")}</p>
                  </div>
                  <button
                    type="button"
                    disabled={isMissing("layanan_items")}
                    onClick={() => set("layanan", [...values.layanan, { title: "", description: "", image: { url: null }, sub_karya: [] }])}
                    className="inline-flex items-center gap-2 rounded-sm border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 hover:border-orange-400 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" /> {tr("Tambah Layanan", "Add Service")}
                  </button>
                </div>

                <div className="mt-3"><SectionNotice text={sectionNotice("layanan_items")} /></div>

                <div className="mt-3 space-y-4">
                  {values.layanan.map((item, i) => {
                    const update = (patch: Partial<typeof item>) => set("layanan", values.layanan.map((l, j) => (j === i ? { ...l, ...patch } : l)));
                    const subs = item.sub_karya;
                    const setSubs = (next: SubKaryaFormItem[]) => update({ sub_karya: next });
                    const updateSub = (id: string, patch: Partial<SubKaryaFormItem>) =>
                      setSubs(subs.map((s) => (s.id === id ? { ...s, ...patch } : s)));
                    const subsOpen = !foldedSubs.has(i);
                    return (
                      <div key={i} className="grid grid-cols-1 gap-4 rounded-sm border border-zinc-200 bg-zinc-50/60 p-4 md:grid-cols-[200px_1fr]">
                        <ImageField
                          label={tr("Gambar layanan", "Service image")}
                          value={item.image}
                          aspect={16 / 9}
                          previewClass="aspect-video"
                          onChange={(v) => update({ image: v })}
                        />
                        <div className="grid grid-cols-1 gap-3">
                          <label>
                            <FieldLabel>{tr("Nama layanan / karya", "Service / work name")}</FieldLabel>
                            <input type="text" value={item.title} onChange={(e) => update({ title: e.target.value })} className={inputClass} />
                          </label>
                          <label>
                            <FieldLabel>{tr("Deskripsi", "Description")}</FieldLabel>
                            <textarea rows={3} value={item.description} onChange={(e) => update({ description: e.target.value })} className={inputClass} />
                          </label>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                set("layanan", values.layanan.filter((_, j) => j !== i));
                                setFoldedSubs(new Set());
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> {tr("Hapus layanan", "Remove service")}
                            </button>
                          </div>
                        </div>

                        {/* Sub-karya: the works (dances) grouped under this service, e.g. "Karya Tari Unggulan Sanggar" */}
                        <div className="md:col-span-2 border-t border-zinc-200 pt-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-zinc-900">
                                {tr("Sub-Karya / Tarian", "Sub-works / Dances")}
                                {subs.length > 0 && <span className="ml-1.5 font-normal text-zinc-400">({subs.length})</span>}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {tr(
                                  "Opsional, mis. tarian di dalam “Karya Tari Unggulan Sanggar”. Di halaman detail, layanan ini membuka kartu karya-karyanya; bila deskripsinya kosong, ringkasannya disusun dari judul tarian.",
                                  "Optional, e.g. the dances of “Karya Tari Unggulan Sanggar”. On the detail page this service opens its works; without a description, its summary lists the dance titles."
                                )}
                              </p>
                            </div>
                            {subs.length > 0 && (
                              <button
                                type="button"
                                aria-expanded={subsOpen}
                                onClick={() => setSubsFolded(i, subsOpen)}
                                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-orange-600 transition-colors"
                              >
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${subsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                                {subsOpen ? tr("Sembunyikan", "Hide") : tr("Tampilkan", "Show")}
                              </button>
                            )}
                          </div>

                          {subsOpen && subs.length > 0 && (
                            <ol className="mt-3 space-y-3">
                              {subs.map((sub, k) => (
                                <li key={sub.id} className="rounded-sm border border-zinc-200 bg-white p-3">
                                  <div className="mb-3 flex items-center justify-between gap-2">
                                    <span className="inline-flex min-w-0 items-center gap-2 text-xs font-semibold text-zinc-500">
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-brand text-[10px] font-bold text-white">
                                        {String(k + 1).padStart(2, "0")}
                                      </span>
                                      <span className="truncate">{sub.judul.trim() || tr("Tarian baru", "New dance")}</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setSubs(subs.filter((s) => s.id !== sub.id))}
                                      aria-label={`${tr("Hapus Tarian", "Remove Dance")} ${k + 1}`}
                                      className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" /> {tr("Hapus Tarian", "Remove Dance")}
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr]">
                                    <ImageField
                                      label={tr("Foto karya", "Work photo")}
                                      hint={tr("Opsional (16:9).", "Optional (16:9).")}
                                      value={sub.image}
                                      aspect={16 / 9}
                                      previewClass="aspect-video"
                                      onChange={(v) => updateSub(sub.id, { image: v })}
                                    />
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                      <label className="sm:col-span-2">
                                        <FieldLabel>{tr("Judul Tarian / Karya", "Dance / Work Title")}</FieldLabel>
                                        <input type="text" value={sub.judul} onChange={(e) => updateSub(sub.id, { judul: e.target.value })} className={inputClass} placeholder={tr("Mis. Tari Mpok Cantik", "e.g. Tari Mpok Cantik")} />
                                      </label>
                                      <label className="sm:col-span-2">
                                        <FieldLabel>{tr("Sinopsis Karya", "Work Synopsis")}</FieldLabel>
                                        <textarea rows={4} value={sub.sinopsis} onChange={(e) => updateSub(sub.id, { sinopsis: e.target.value })} className={inputClass} />
                                      </label>
                                      <label>
                                        <FieldLabel>{tr("Penata Tari", "Choreographer")}</FieldLabel>
                                        <input type="text" value={sub.penata_tari} onChange={(e) => updateSub(sub.id, { penata_tari: e.target.value })} className={inputClass} placeholder={tr("Mis. Wahyu Kardinata Suroso, S.Pd", "e.g. Wahyu Kardinata Suroso, S.Pd")} />
                                      </label>
                                      <label>
                                        <FieldLabel>{tr("Penata Musik", "Music Arranger")}</FieldLabel>
                                        <input type="text" value={sub.penata_musik} onChange={(e) => updateSub(sub.id, { penata_musik: e.target.value })} className={inputClass} placeholder={tr("Mis. Rizki Aidul Akbar, S.Sn", "e.g. Rizki Aidul Akbar, S.Sn")} />
                                      </label>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ol>
                          )}

                          <button
                            type="button"
                            disabled={isMissing("layanan_items")}
                            onClick={() => {
                              setSubs([...subs, emptySubKarya()]);
                              setSubsFolded(i, false);
                            }}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-dashed border-orange-300 bg-orange-50/60 px-3 py-2 text-xs font-semibold text-orange-700 hover:border-orange-400 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3.5 w-3.5" /> {tr("Tambah Sub-Karya / Tarian", "Add Sub-work / Dance")}
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
                    <p className="text-xs text-zinc-500">{tr("Opsional. Tampil di halaman detail.", "Optional. Shown on the detail page.")}</p>
                  </div>
                  <button
                    type="button"
                    disabled={isMissing("prestasi_items")}
                    onClick={() => set("prestasi", [...values.prestasi, { title: "", organizer: "", year: "" }])}
                    className="inline-flex items-center gap-2 rounded-sm border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 hover:border-orange-400 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" /> {tr("Tambah Prestasi", "Add Achievement")}
                  </button>
                </div>

                <div className="mt-3"><SectionNotice text={sectionNotice("prestasi_items")} /></div>

                <div className="mt-3 space-y-2.5">
                  {values.prestasi.map((item, i) => {
                    const update = (patch: Partial<typeof item>) => set("prestasi", values.prestasi.map((p, j) => (j === i ? { ...p, ...patch } : p)));
                    return (
                      <div key={i} className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_1fr_100px_auto]">
                        <input type="text" value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder={tr("Nama prestasi", "Achievement")} aria-label={tr("Nama prestasi", "Achievement")} className={inputClass} />
                        <input type="text" value={item.organizer} onChange={(e) => update({ organizer: e.target.value })} placeholder={tr("Penyelenggara", "Organizer")} aria-label={tr("Penyelenggara", "Organizer")} className={inputClass} />
                        <input type="text" inputMode="numeric" value={item.year} onChange={(e) => update({ year: e.target.value })} placeholder={tr("Tahun", "Year")} aria-label={tr("Tahun", "Year")} className={inputClass} />
                        <button type="button" onClick={() => set("prestasi", values.prestasi.filter((_, j) => j !== i))} className="flex h-10 w-10 items-center justify-center rounded-sm text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors" aria-label={tr("Hapus prestasi", "Remove achievement")}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Sticky action bar */}
        <div className="sticky bottom-0 flex flex-col-reverse gap-2.5 border-t border-zinc-200 bg-white/95 px-5 py-3.5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs text-zinc-500">
            {tr("Gambar baru diunggah saat Anda menekan Simpan.", "New images are uploaded when you press Save.")}
          </p>
          <div className="flex gap-2.5">
            <Link href="/admin/sanggar" className="flex-1 sm:flex-none rounded-sm border border-zinc-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
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
