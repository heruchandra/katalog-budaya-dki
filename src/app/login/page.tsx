"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Eye, EyeOff, Landmark, ArrowLeft, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Email atau password tidak valid.");
      } else {
        router.push("/admin");
        router.refresh();
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
        {/* Optional elegant welcome text to fill the space temporarily */}
        <h2 className="relative z-10 text-white text-4xl font-light tracking-[0.2em] uppercase">Welcome</h2>
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
              {t('loginWelcomeTitle')}
            </h1>
            <p className="mt-1 text-[13px] text-gray-500">
              {t('loginWelcomeSubtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full">

            {/* Email Field */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-surface-700"
              >
                {t('loginEmailLabel')}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('loginEmailPlaceholder')}
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
                {t('loginPasswordLabel')}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('loginPasswordPlaceholder')}
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
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  {t('loginButton')}
                </>
              )}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-[11px]">{t('loginOr')}</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-surface-200 bg-white px-6 py-2.5 text-[13px] font-semibold text-surface-700 shadow-sm transition-all duration-200 hover:bg-surface-50 hover:text-surface-900"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t('loginGoogleButton')}
            </button>

            <p className="mt-5 text-center text-[13px] text-gray-600">
              {t('loginNoAccount')}{' '}
              <Link href="/register" className="text-orange-600 font-medium hover:underline">
                {t('loginRegisterHere')}
              </Link>
            </p>

            {/* Help text */}
            <p className="mt-4 text-center text-[11px] leading-relaxed text-surface-400">
              {t('loginDisclaimer')}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
