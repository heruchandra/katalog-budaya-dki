"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, Mail, Lock, Eye, EyeOff, Landmark, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth logic will be implemented in a later phase
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="batik-pattern absolute inset-0 opacity-40" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent-200/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>

        {/* Login Card */}
        <div className="overflow-hidden rounded-2xl border border-surface-200/60 bg-white/80 shadow-xl shadow-surface-900/5 backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-b from-orange-50/90 to-amber-50/40 border-b border-surface-100 px-8 py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 border border-primary-200/60 shadow-sm">
              <Landmark className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-xl font-extrabold text-surface-900">
              Selamat Datang
            </h1>
            <p className="mt-1 text-sm text-surface-600">
              Masuk ke Katalog Seni DKI Jakarta
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Email Field */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-surface-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full rounded-xl border border-surface-200 bg-surface-50/50 py-3 pl-10 pr-4 text-sm text-surface-800 placeholder:text-surface-400 transition-all duration-200 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-surface-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full rounded-xl border border-surface-200 bg-surface-50/50 py-3 pl-10 pr-12 text-sm text-surface-800 placeholder:text-surface-400 transition-all duration-200 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 transition-colors hover:text-surface-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Masuk
                </>
              )}
            </button>

            {/* Help text */}
            <p className="mt-5 text-center text-xs text-surface-400">
              Hanya untuk staf Dinas Kebudayaan DKI Jakarta yang terdaftar.
              <br />
              Hubungi administrator jika Anda memerlukan akses.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
