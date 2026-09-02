"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, Landmark, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = ['/batik-1.webp', '/batik-2.webp', '/batik-3.webp'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Changes image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (authError) {
        setError(authError.message || "Gagal mendaftar. Silakan coba lagi.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError("Terjadi kesalahan pada sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* Left Side - Animated Background */}
      <div className="hidden lg:flex lg:w-[70%] bg-slate-900 relative items-center justify-center overflow-hidden">
        {backgrounds.map((bg, index) => (
          <img
            key={bg}
            src={bg}
            alt="Batik Background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              currentBg === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Optional elegant text */}
        <h2 className="relative z-10 text-white text-4xl font-light tracking-[0.2em] uppercase">Join Us</h2>
      </div>

      {/* Right Side - Form Container */}
      <div className="w-full lg:w-[30%] flex flex-col items-center justify-center px-8 lg:px-8 xl:px-12 bg-white h-screen overflow-hidden">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 border border-primary-200/60 shadow-sm">
              <Landmark className="h-5 w-5" />
            </div>
            <h1 className="mt-4 text-lg font-bold text-surface-900">
              Daftar Akun Baru
            </h1>
            <p className="mt-1 text-[13px] text-gray-500">
              Buat akun untuk Katalog Seni DKI Jakarta
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full">

            {/* Name Field */}
            <div className="mb-3">
              <label
                htmlFor="name"
                className="mb-1.5 block text-[13px] font-medium text-surface-700"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="w-full rounded-xl border border-surface-200 bg-surface-50/50 py-2.5 pl-10 pr-4 text-[13px] text-surface-800 placeholder:text-surface-400 transition-all duration-200 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-surface-700"
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
                  className="w-full rounded-xl border border-surface-200 bg-surface-50/50 py-2.5 pl-10 pr-4 text-[13px] text-surface-800 placeholder:text-surface-400 transition-all duration-200 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium text-surface-700"
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
                  className="w-full rounded-xl border border-surface-200 bg-surface-50/50 py-2.5 pl-10 pr-12 text-[13px] text-surface-800 placeholder:text-surface-400 transition-all duration-200 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 outline-none"
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
            {error && <p className="text-red-500 text-xs mb-3 ml-1 text-left flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {error}</p>}
            {success && <p className="text-green-600 text-xs mb-3 ml-1 text-left flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Registrasi berhasil! Mengalihkan ke halaman login...</p>}
            <button
              type="submit"
              disabled={isLoading || success}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Daftar"
              )}
            </button>

            <p className="text-center text-[13px] text-gray-600 mt-5">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-orange-600 font-medium hover:underline">
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
