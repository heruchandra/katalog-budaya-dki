"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Music, 
  Settings, 
  LogOut, 
  Menu,
  X,
  UserCircle,
  Globe
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { t, language, setLanguage } = useLanguage();
  const navigation = [
    { name: t('adminSidebarDashboard'), href: "/admin", icon: LayoutDashboard },
    { name: t('adminSidebarSanggar'), href: "/admin/sanggar", icon: Users },
    { name: t('adminSidebarMusik'), href: "/admin/pemusik", icon: Music },
    { name: t('adminSidebarSettings'), href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-surface-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 bg-surface-950 border-b border-surface-800">
          <span className="text-lg font-bold text-white tracking-tight">Katalog Seni Admin</span>
          <button 
            className="lg:hidden text-surface-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 gap-3 ${
                    active 
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                      : "text-surface-300 hover:bg-surface-800/50 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      active ? "text-white" : "text-surface-400 group-hover:text-white"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-surface-800 space-y-1">
          <Link
            href="/"
            className="group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-surface-300 hover:bg-surface-800 hover:text-white transition-colors"
          >
            <Globe className="mr-3 h-5 w-5 text-surface-400 group-hover:text-white" />
            {t('adminSidebarWeb')}
          </Link>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-surface-300 hover:bg-surface-800 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-surface-400 group-hover:text-white" />
            {t('adminSidebarLogout')}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-sm">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-end items-center">
            <div className="flex items-center gap-2 bg-slate-50/80 px-2 py-1 rounded-full border border-orange-300 shadow-sm mr-4">
              <button 
                onClick={() => setLanguage('id')}
                className={`w-6 h-6 rounded-full overflow-hidden transition-all duration-300 ${language === 'id' ? 'ring-2 ring-white scale-110 shadow-sm' : 'grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
                title="Bahasa Indonesia"
              >
                <img src="https://flagcdn.com/id.svg" alt="ID" className="w-full h-full object-cover" />
              </button>
              <div className="w-px h-4 bg-orange-200"></div>
              <button 
                onClick={() => setLanguage('en')}
                className={`w-6 h-6 rounded-full overflow-hidden transition-all duration-300 ${language === 'en' ? 'ring-2 ring-white scale-110 shadow-sm' : 'grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
                title="English"
              >
                <img src="https://flagcdn.com/gb.svg" alt="EN" className="w-full h-full object-cover" />
              </button>
            </div>
            <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
              <UserCircle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
