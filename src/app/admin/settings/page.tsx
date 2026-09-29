"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }
    };
    fetchUser();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ text: "Password minimal 6 karakter.", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Konfirmasi password tidak cocok.", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      setMessage({ text: "Password berhasil diperbarui.", type: "success" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      setMessage({ text: err.message || "Gagal memperbarui password.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('adminSettingsTitle')}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t('adminSettingsDesc')}
        </p>
      </div>

      {message && (
        <div className={`mb-6 flex items-center gap-3 rounded-none px-4 py-3 text-sm font-medium ${
          message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Profile Card */}
        <div className="rounded-none border border-gray-100 bg-white shadow-sm overflow-hidden h-fit">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
            <h3 className="text-base font-semibold leading-6 text-gray-900">{t('adminProfileTitle')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('adminProfileDesc')}</p>
          </div>
          <div className="px-6 py-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('adminEmailLabel')}
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  disabled
                  value={email}
                  className="block w-full rounded-none border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 bg-gray-50 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:opacity-75"
                  placeholder="Memuat email..."
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">{t('adminEmailNote')}</p>
            </div>
          </div>
        </div>

        {/* Password Card */}
        <div className="rounded-none border border-gray-100 bg-white shadow-sm overflow-hidden h-fit">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
            <h3 className="text-base font-semibold leading-6 text-gray-900">{t('adminPassTitle')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('adminPassDesc')}</p>
          </div>
          <form onSubmit={handleUpdatePassword} className="px-6 py-6 space-y-6">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                {t('adminPassNew')}
              </label>
              <div className="relative mt-2 border border-zinc-200 rounded-none focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full py-2.5 pl-10 text-gray-900 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm sm:leading-6"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                {t('adminPassConfirm')}
              </label>
              <div className="relative mt-2 border border-zinc-200 rounded-none focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirm-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full py-2.5 pl-10 text-gray-900 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm sm:leading-6"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center gap-2 rounded-none bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Menyimpan..." : t('adminBtnSavePass')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
