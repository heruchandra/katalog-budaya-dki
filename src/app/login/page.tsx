"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { authCallbackUrl, homeFor, isEmailNotConfirmed } from "@/lib/auth";

// The query string, read without useSearchParams (this page is static): "" while prerendering and hydrating
const noSubscribe = () => () => {};
const useSearch = () => useSyncExternalStore(noSubscribe, () => window.location.search, () => "");

export default function LoginPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);
  // Messages from /auth/callback: ?verified=1 (address verified) or ?auth_error=expired|invalid (bad link)
  const params = new URLSearchParams(useSearch());
  const justVerified = params.get("verified") === "1";
  const linkError = params.get("auth_error");
  const [unverified, setUnverified] = useState(false);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = ['/bg/bg-login-1.webp', '/bg/bg-login-2.webp', '/bg/bg-login-3.webp', '/bg/bg-login-4.webp'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 3000); // Changes image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setUnverified(false);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (isEmailNotConfirmed(authError)) {
          setUnverified(true);
          setError(tr(
            "Email Anda belum diverifikasi. Silakan cek inbox/spam email Anda untuk melakukan verifikasi.",
            "Your email hasn't been verified yet. Please check your inbox/spam to verify it."
          ));
        } else {
          setError(tr("Email atau password tidak valid.", "Invalid email or password."));
        }
      } else {
        router.push(homeFor(data.user?.email));
        router.refresh();
      }
    } catch {
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
            className={`absolute inset-0 w-full h-screen object-cover transition-opacity duration-1000 ease-in-out ${
              currentBg === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Optional elegant welcome text to fill the space temporarily */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <h2 className="text-white text-4xl font-light tracking-[0.2em] uppercase">{t('loginWelcomeTitle')}</h2>
          <p className="text-sm md:text-base font-light text-white/90 mt-3 text-center tracking-wide max-w-lg leading-relaxed drop-shadow-md">{t('authWelcomeDescription')}</p>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="relative w-full lg:w-[30%] flex flex-col items-center justify-center px-8 lg:px-8 xl:px-12 bg-white h-screen overflow-hidden">
        <Link href="/" className="absolute top-8 left-8 p-2 text-gray-400 hover:text-gray-900 transition-colors duration-300">
          <ArrowLeft strokeWidth={1.5} className="w-6 h-6" />
        </Link>
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="text-center mb-5">
            <div className="flex justify-center mb-3">
              <Image 
                src="/logos/logo-disbud.webp"
                alt="Dinas Kebudayaan DKI Jakarta"
                width={73}
                height={48}
                className="h-12 w-[73px] object-contain"
                preload
              />
            </div>
            <h1 className="mt-2 text-lg font-bold text-surface-900">
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
                  className="w-full rounded-none border border-zinc-200 bg-surface-50/50 py-2.5 pl-10 pr-4 text-[13px] text-surface-800 placeholder:text-surface-400 transition-all duration-200 focus:border-orange-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-600 outline-none"
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
                  className="w-full rounded-none border border-zinc-200 bg-surface-50/50 py-2.5 pl-10 pr-12 text-[13px] text-surface-800 placeholder:text-surface-400 transition-all duration-200 focus:border-orange-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-600 outline-none"
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
            {justVerified && !error && (
              <p role="status" className="mb-3 flex items-start gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left text-xs font-medium text-emerald-800">
                <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {tr("Email Anda berhasil diverifikasi. Silakan masuk dengan email dan password Anda.", "Your email has been verified. Please sign in with your email and password.")}
              </p>
            )}
            {linkError && !error && (
              <p role="alert" className="mb-3 flex items-start gap-1.5 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {linkError === "expired"
                  ? tr("Tautan verifikasi sudah kedaluwarsa. Isi email Anda lalu kirim ulang tautan verifikasi.", "The verification link has expired. Enter your email and resend the verification link.")
                  : tr("Tautan verifikasi tidak valid atau sudah dipakai. Coba masuk, atau kirim ulang tautan verifikasi.", "The verification link is invalid or was already used. Try signing in, or resend the verification link.")}
              </p>
            )}
            {error && <p className="text-red-500 text-xs mb-3 ml-1 text-left flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {error}</p>}
            {/* Resend the verification email (unverified account, or an expired / invalid link) */}
            {(unverified || linkError) && (
              <div className="mb-3 ml-1 text-left text-xs">
                <button
                  type="button"
                  disabled={!email || resendState === "sending" || resendState === "sent"}
                  onClick={async () => {
                    setResendState("sending");
                    const { error: resendError } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: authCallbackUrl() } });
                    setResendState(resendError ? "error" : "sent");
                  }}
                  className="font-semibold text-orange-700 underline underline-offset-2 disabled:no-underline disabled:opacity-60"
                >
                  {resendState === "sent"
                    ? tr(`Email verifikasi dikirim ulang ke ${email}`, `Verification email sent again to ${email}`)
                    : resendState === "sending"
                      ? tr("Mengirim…", "Sending…")
                      : tr("Kirim ulang email verifikasi", "Resend the verification email")}
                </button>
                {!email && <span className="ml-1 text-zinc-500">{tr("(isi email terlebih dahulu)", "(enter your email first)")}</span>}
                {resendState === "error" && <p className="mt-1 text-red-600">{tr("Gagal mengirim ulang. Coba lagi beberapa saat lagi.", "Could not resend. Please try again in a moment.")}</p>}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-none bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-60"
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
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: authCallbackUrl() } })}
              className="flex w-full items-center justify-center gap-2 rounded-none border border-surface-200 bg-white px-6 py-2.5 text-[13px] font-semibold text-surface-700 shadow-sm transition-all duration-200 hover:bg-surface-50 hover:text-surface-900"
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
