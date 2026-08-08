"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Landmark, LogIn } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/sanggar", label: "Sanggar Tari" },
  { href: "/pemusik", label: "Pemusik" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-primary-900/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-primary-500/40">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-surface-900">
              Katalog Seni
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-600">
              DKI Jakarta
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-4 py-2 text-sm font-medium text-surface-600 transition-all duration-200 hover:bg-primary-50 hover:text-primary-700"
            >
              {link.label}
            </Link>
          ))}
          <div className="mx-3 h-6 w-px bg-surface-200" />
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/40"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-xl p-2.5 text-surface-600 transition-colors hover:bg-surface-100 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-surface-100 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-surface-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-surface-100 pt-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 text-sm font-semibold text-white shadow-md"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
