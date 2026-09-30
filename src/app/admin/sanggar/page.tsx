"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Eye, ImageOff, Info, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { JAKARTA_WILAYAH, resolveWilayah } from "@/lib/wilayah";
import { GRADE_OPTIONS, MIGRATION_COLUMNS, SANGGAR_TABLE, SanggarRow, deleteSanggar, isDraft } from "@/lib/sanggarAdmin";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const selectClass =
  "rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition-colors focus:border-orange-600 focus:ring-1 focus:ring-orange-600";

const gradeOf = (row: SanggarRow) => (row.grade || "").replace(/grade/i, "").trim().toUpperCase();

function AdminSanggarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);

  const [rows, setRows] = useState<SanggarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const [wilayah, setWilayah] = useState("all");
  const [status, setStatus] = useState(searchParams.get("status") === "draft" ? "draft" : "all");
  const [pendingDelete, setPendingDelete] = useState<SanggarRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Success / skipped-columns message when arriving back from the form (?success=1&skipped=a,b)
  const [toast, setToast] = useState<{ kind: "success" | "info" | "error"; text: string } | null>(() => {
    if (!searchParams.get("success")) return null;
    const skippedLabels = (searchParams.get("skipped") || "").split(",").filter(Boolean).map((c) => MIGRATION_COLUMNS[c] || c);
    return skippedLabels.length > 0
      ? {
          kind: "info",
          text: tr(
            `Data tersimpan, kecuali: ${skippedLabels.join(", ")} (kolom belum ada di database, jalankan migrasi).`,
            `Saved, except: ${skippedLabels.join(", ")} (columns missing in the database, run the migration).`
          ),
        }
      : { kind: "success", text: tr("Data sanggar berhasil disimpan.", "Sanggar saved.") };
  });

  // Clean the one-time query params out of the URL
  useEffect(() => {
    if (searchParams.get("success")) router.replace("/admin/sanggar", { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.kind === "success" ? 3500 : 9000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: fetchError } = await supabase.from(SANGGAR_TABLE).select("*").order("nama_sanggar", { ascending: true });
      if (cancelled) return;
      if (fetchError) setError(fetchError.message);
      else setRows((data as SanggarRow[]) || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasStatusColumn = rows.length > 0 && "status" in rows[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const g = gradeOf(row);
      const matchQuery = !q || row.nama_sanggar?.toLowerCase().includes(q) || (row.nama_pic || "").toLowerCase().includes(q);
      const matchGrade = grade === "all" || (grade === "none" ? !g : g === grade);
      const matchWilayah = wilayah === "all" || resolveWilayah(row) === wilayah;
      const matchStatus = status === "all" || (status === "draft" ? isDraft(row) : !isDraft(row));
      return matchQuery && matchGrade && matchWilayah && matchStatus;
    });
  }, [rows, query, grade, wilayah, status]);

  const hasFilter = Boolean(query) || grade !== "all" || wilayah !== "all" || status !== "all";

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteSanggar(pendingDelete.id);
      setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id));
      setToast({ kind: "success", text: tr(`"${pendingDelete.nama_sanggar}" dihapus.`, `"${pendingDelete.nama_sanggar}" deleted.`) });
      router.refresh();
    } catch (err) {
      setToast({ kind: "error", text: tr("Gagal menghapus: ", "Delete failed: ") + (err instanceof Error ? err.message : "") });
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  const th = "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-500";

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{tr("Data Sanggar", "Sanggar Data")}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {tr("Kelola profil, kontak, media, dan galeri setiap sanggar.", "Manage each sanggar's profile, contacts, media and gallery.")}
          </p>
        </div>
        <Link href="/admin/sanggar/tambah" className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-600/20 hover:bg-brand-deep transition-all">
          <Plus className="h-4 w-4" />
          {tr("Tambah Sanggar", "Add Sanggar")}
        </Link>
      </div>

      <div className="overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-xs">
        {/* Filter & search bar */}
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1 rounded-sm border border-zinc-200 bg-zinc-50 focus-within:border-orange-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-600">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr("Cari nama sanggar atau PIC…", "Search sanggar name or PIC…")}
              aria-label={tr("Cari sanggar", "Search sanggar")}
              className="w-full bg-transparent py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={grade} onChange={(e) => setGrade(e.target.value)} aria-label="Filter grade" className={selectClass}>
              <option value="all">{tr("Semua Grade", "All Grades")}</option>
              {GRADE_OPTIONS.map((g) => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
              <option value="none">{tr("Belum Tergrade", "Ungraded")}</option>
            </select>
            <select value={wilayah} onChange={(e) => setWilayah(e.target.value)} aria-label={tr("Filter wilayah", "Filter region")} className={selectClass}>
              <option value="all">{tr("Semua Wilayah", "All Regions")}</option>
              {JAKARTA_WILAYAH.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter status" className={selectClass} disabled={!hasStatusColumn} title={hasStatusColumn ? undefined : tr("Perlu migrasi database", "Needs the database migration")}>
              <option value="all">{tr("Semua Status", "All Statuses")}</option>
              <option value="terverifikasi">{tr("Terverifikasi", "Verified")}</option>
              <option value="draft">Draft</option>
            </select>
            {hasFilter && (
              <button type="button" onClick={() => { setQuery(""); setGrade("all"); setWilayah("all"); setStatus("all"); }} className="inline-flex items-center gap-1 px-2 py-2 text-xs font-semibold text-zinc-500 hover:text-orange-600">
                <X className="h-3.5 w-3.5" /> {tr("Reset", "Reset")}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th scope="col" className={th}>{tr("Sanggar", "Sanggar")}</th>
                <th scope="col" className={th}>{tr("Kategori", "Category")}</th>
                <th scope="col" className={th}>Grade</th>
                <th scope="col" className={th}>{tr("Wilayah", "Region")}</th>
                <th scope="col" className={th}>{tr("Kontak PIC", "PIC Contact")}</th>
                <th scope="col" className={th}>Status</th>
                <th scope="col" className={`${th} text-right`}>{tr("Aksi", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">{tr("Memuat data…", "Loading…")}</td></tr>
              )}
              {!loading && error && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-red-600">{tr("Gagal memuat data: ", "Failed to load: ")}{error}</td></tr>
              )}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">
                  {hasFilter ? tr("Tidak ada sanggar yang cocok dengan filter.", "No sanggar match these filters.") : tr("Belum ada data sanggar.", "No sanggar yet.")}
                </td></tr>
              )}
              {!loading && !error && filtered.map((row) => {
                const g = gradeOf(row);
                const region = resolveWilayah(row);
                const draft = isDraft(row);
                return (
                  <tr key={row.id} className="hover:bg-zinc-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-zinc-200 bg-zinc-100 text-zinc-300">
                          {row.thumbnail_url || row.logo_url ? (
                            <img src={(row.thumbnail_url || row.logo_url) as string} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageOff className="h-4 w-4" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-900">{row.nama_sanggar}</p>
                          <p className="text-xs text-zinc-400">ID {row.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">{row.kategori || <span className="text-zinc-300">—</span>}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {g ? (
                        <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-bold ${
                          g === "A" ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                            : g === "B" ? "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20"
                            : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                        }`}>Grade {g}</span>
                      ) : (
                        <span className="text-xs text-zinc-400">{tr("Belum tergrade", "Ungraded")}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">{region || <span className="text-zinc-300">—</span>}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600">
                      {row.nama_pic || row.kontak_pic ? (
                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-800">{row.nama_pic || "—"}</p>
                          {row.kontak_pic && <p className="text-xs text-zinc-500">{row.kontak_pic}</p>}
                        </div>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold ${
                        draft ? "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-300" : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                      }`}>
                        {draft ? "Draft" : tr("Terverifikasi", "Verified")}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <a href={`/sanggar/${row.id}`} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900" title={tr("Lihat halaman publik", "View public page")} aria-label={tr(`Lihat ${row.nama_sanggar}`, `View ${row.nama_sanggar}`)}>
                          <Eye className="h-4 w-4" />
                        </a>
                        <Link href={`/admin/sanggar/edit/${row.id}`} className="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 hover:bg-orange-50 hover:text-orange-600" title="Edit" aria-label={`Edit ${row.nama_sanggar}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button type="button" onClick={() => setPendingDelete(row)} className="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 hover:bg-red-50 hover:text-red-600" title={tr("Hapus", "Delete")} aria-label={tr(`Hapus ${row.nama_sanggar}`, `Delete ${row.nama_sanggar}`)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && !error && (
          <div className="border-t border-zinc-200 px-4 py-3 text-xs text-zinc-500">
            {tr(`Menampilkan ${filtered.length} dari ${rows.length} sanggar`, `Showing ${filtered.length} of ${rows.length} sanggar`)}
          </div>
        )}
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title={tr("Hapus sanggar ini?", "Delete this sanggar?")}
          message={tr(
            `"${pendingDelete.nama_sanggar}" akan dihapus permanen dari katalog dan situs publik. Tindakan ini tidak dapat dibatalkan.`,
            `"${pendingDelete.nama_sanggar}" will be permanently removed from the catalog and the public site. This cannot be undone.`
          )}
          confirmLabel={isDeleting ? tr("Menghapus…", "Deleting…") : tr("Ya, hapus", "Yes, delete")}
          cancelLabel={tr("Batal", "Cancel")}
          isBusy={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {toast && (
        <div role="status" className={`fixed bottom-6 right-6 z-[120] flex max-w-md items-start gap-3 rounded-sm px-4 py-3 text-sm font-medium text-white shadow-2xl ${
          toast.kind === "success" ? "bg-emerald-600" : toast.kind === "info" ? "bg-amber-600" : "bg-red-600"
        }`}>
          {toast.kind === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <Info className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{toast.text}</span>
          <button type="button" onClick={() => setToast(null)} className="ml-1 shrink-0 opacity-80 hover:opacity-100" aria-label={tr("Tutup", "Close")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminSanggarList() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Memuat data…</div>}>
      <AdminSanggarContent />
    </Suspense>
  );
}
