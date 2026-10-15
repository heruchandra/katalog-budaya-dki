"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { authCallbackUrl, fetchProfileRole, homeForRole } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
    setSuccess(false);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          // the verification link comes back to this same host (localhost, LAN IP, preview or production)
          emailRedirectTo: authCallbackUrl(),
        }
      });

      if (authError) {
        setError(authError.message || "Gagal mendaftar. Silakan coba lagi.");
      } else if (data.user && data.user.identities?.length === 0) {
        // Supabase answers a sign-up for an address that is already registered with an empty identity list
        setError(tr(
          "Email ini sudah terdaftar. Silakan masuk, atau cek inbox/spam bila belum memverifikasinya.",
          "This email is already registered. Please sign in, or check your inbox/spam if you haven't verified it yet."
        ));
      } else if (data.session) {
        // email confirmation is turned off in Supabase: the account is signed in right away
        router.push(homeForRole(data.user ? await fetchProfileRole(supabase, data.user.id) : null));
        router.refresh();
      } else {
        // stays on this page: the visitor has to act on the email now
        setSuccess(true);
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
        {/* Optional elegant text */}
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
              {t('registerTitle')}
            </h1>
            <p className="mt-1 text-[13px] text-gray-500">
              {t('registerSubtitle')}
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
                {t('registerFullNameLabel')}
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('registerFullNamePlaceholder')}
                  required
                  className="w-full rounded-none border border-zinc-200 bg-surface-50/50 py-2.5 pl-10 pr-4 text-[13px] text-surface-800 placeholder:text-surface-400 transition-all duration-200 focus:border-orange-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-600 outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-surface-700"
              >
                {t('registerEmailLabel')}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('registerEmailPlaceholder')}
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
                {t('registerPasswordLabel')}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('registerPasswordPlaceholder')}
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
            {error && <p className="text-red-500 text-xs mb-3 ml-1 text-left flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {error}</p>}
            {success && (
              <div role="status" className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left text-xs text-emerald-800">
                <p className="flex items-start gap-1.5 font-semibold">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {tr(
                    "Pendaftaran berhasil! Silakan periksa email Anda untuk mengonfirmasi pendaftaran.",
                    "Registration successful! Please check your email to confirm your registration."
                  )}
                </p>
                <p className="mt-1.5 pl-5 text-emerald-700">
                  {tr(`Tautan verifikasi dikirim ke ${email}. Tidak ada di inbox? Cek folder spam.`, `A verification link was sent to ${email}. Not in your inbox? Check the spam folder.`)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 pl-5">
                  <button
                    type="button"
                    disabled={resendState === "sending" || resendState === "sent"}
                    onClick={async () => {
                      setResendState("sending");
                      const { error: resendError } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: authCallbackUrl() } });
                      setResendState(resendError ? "error" : "sent");
                    }}
                    className="font-semibold text-emerald-800 underline underline-offset-2 disabled:no-underline disabled:opacity-70"
                  >
                    {resendState === "sent" ? tr("Email terkirim ulang", "Email sent again") : resendState === "sending" ? tr("Mengirim…", "Sending…") : tr("Kirim ulang email", "Resend email")}
                  </button>
                  <Link href="/login" className="font-semibold text-emerald-800 underline underline-offset-2">{tr("Ke halaman Masuk", "Go to Sign In")}</Link>
                </div>
                {resendState === "error" && <p className="mt-1.5 pl-5 text-red-600">{tr("Gagal mengirim ulang. Coba lagi beberapa saat lagi.", "Could not resend. Please try again in a moment.")}</p>}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading || success}
              className="flex w-full items-center justify-center gap-2 rounded-none bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                t('registerButton')
              )}
            </button>

            <p className="text-center text-[13px] text-gray-600 mt-5">
              {t('registerAlreadyHaveAccount')}{' '}
              <Link href="/login" className="text-orange-600 font-medium hover:underline">
                {t('registerLoginHere')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
