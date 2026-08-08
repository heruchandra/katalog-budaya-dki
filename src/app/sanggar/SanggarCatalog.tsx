"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  Phone,
  Filter,
  Search,
  Users,
  Award,
  ArrowLeft,
  Inbox,
  AlertTriangle,
} from "lucide-react";

interface Sanggar {
  id: string;
  nama_sanggar: string;
  nama_pimpinan: string;
  grade: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota_kab: string;
  no_hp: string;
  jenis_tarian: string;
  foto_url: string | null;
}

interface SanggarCatalogProps {
  sanggars: Sanggar[];
  fetchError: string | null;
}

const gradeFilters = [
  { value: "all", label: "Semua Grade" },
  { value: "A", label: "Grade A" },
  { value: "B", label: "Grade B" },
];

export default function SanggarCatalog({
  sanggars,
  fetchError,
}: SanggarCatalogProps) {
  const [activeGrade, setActiveGrade] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = sanggars.filter((s) => {
    const matchGrade =
      activeGrade === "all" ||
      s.grade?.toUpperCase() === activeGrade.toUpperCase();
    const matchSearch =
      searchQuery === "" ||
      s.nama_sanggar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.jenis_tarian?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kecamatan?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchSearch;
  });

  return (
    <div className="min-h-screen pb-16 pt-24">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-amber-50/30 to-surface-50 border-b border-surface-200/60 py-12 sm:py-16">
        <div className="batik-pattern pointer-events-none absolute inset-0 opacity-15" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-surface-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 border border-primary-200/60 shadow-sm">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-surface-900 sm:text-3xl lg:text-4xl">
                Sanggar Tari
              </h1>
              <p className="mt-0.5 text-sm text-surface-600">
                {sanggars.length > 0
                  ? `${sanggars.length} sanggar terdaftar`
                  : "Katalog sanggar tari tradisional Jakarta"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="bg-slate-50/80 pt-2 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="mt-6 mb-8 flex flex-col gap-4 rounded-2xl border border-surface-200/60 bg-white p-4 shadow-lg shadow-surface-900/5 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Cari nama sanggar atau jenis tarian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-surface-50/50 py-2.5 pl-10 pr-4 text-sm text-surface-800 placeholder:text-surface-400 transition-all focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Grade Toggle */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-surface-400" />
            {gradeFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveGrade(filter.value)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                  activeGrade === filter.value
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/25"
                    : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error State / Empty State */}
        {(fetchError || filtered.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-100">
              {fetchError ? (
                <AlertTriangle className="h-10 w-10 text-surface-400" />
              ) : (
                <Inbox className="h-10 w-10 text-surface-300" />
              )}
            </div>
            <h2 className="mt-6 text-xl font-bold text-surface-800">
              {fetchError ? "Koneksi Database Belum Diatur" : "Belum Ada Data Sanggar"}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-surface-500">
              {fetchError
                ? "Pastikan Anda telah mengisi kredensial di file .env.local dan tabel 'sanggars' sudah tersedia di Supabase."
                : searchQuery || activeGrade !== "all"
                ? "Tidak ditemukan sanggar yang sesuai dengan filter Anda. Coba ubah kriteria pencarian."
                : "Data sanggar tari belum tersedia saat ini. Silakan kunjungi kembali nanti atau hubungi administrator."}
            </p>
            {!fetchError && (searchQuery || activeGrade !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveGrade("all");
                }}
                className="mt-5 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-700"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sanggar) => (
              <div
                key={sanggar.id}
                className="group relative overflow-hidden rounded-2xl border border-surface-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10"
              >
                {/* Image Area */}
                <div className="relative h-44 bg-gradient-to-br from-primary-100 to-primary-200">
                  {sanggar.foto_url ? (
                    <img
                      src={sanggar.foto_url}
                      alt={sanggar.nama_sanggar}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Users className="h-12 w-12 text-primary-300" />
                    </div>
                  )}
                  {/* Grade Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm ${
                        sanggar.grade?.toUpperCase() === "A"
                          ? "bg-primary-600 text-white"
                          : "bg-white text-primary-700"
                      }`}
                    >
                      <Award className="h-3 w-3" />
                      Grade {sanggar.grade}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-surface-900 line-clamp-1">
                    {sanggar.nama_sanggar}
                  </h3>
                  <p className="mt-0.5 text-xs text-surface-500">
                    Pimpinan: {sanggar.nama_pimpinan}
                  </p>

                  {sanggar.jenis_tarian && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {sanggar.jenis_tarian
                        .split(",")
                        .slice(0, 3)
                        .map((tarian) => (
                          <span
                            key={tarian.trim()}
                            className="rounded-md bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700"
                          >
                            {tarian.trim()}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="mt-4 space-y-1.5">
                    {sanggar.kecamatan && (
                      <p className="flex items-center gap-2 text-xs text-surface-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-surface-400" />
                        {sanggar.kecamatan}
                        {sanggar.kota_kab ? `, ${sanggar.kota_kab}` : ""}
                      </p>
                    )}
                    {sanggar.no_hp && (
                      <a
                        href={`https://wa.me/${sanggar.no_hp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-primary-600 transition-colors hover:text-primary-700"
                      >
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        Hubungi via WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        {filtered.length > 0 && (
          <p className="mt-8 text-center text-xs text-surface-400">
            Menampilkan {filtered.length} dari {sanggars.length} sanggar
          </p>
        )}
      </div>
      </div>
    </div>
  );
}
