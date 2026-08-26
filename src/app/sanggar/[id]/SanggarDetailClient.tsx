"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, CheckCircle, Clock, Users, Building, User } from "lucide-react";
import { Dancing_Script, Poppins } from 'next/font/google';
import { useLanguage } from "@/context/LanguageContext";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

const getWaLink = (phone: string) => {
  if (!phone) return '#';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return `https://wa.me/62${cleaned.substring(1)}`;
  }
  return `https://wa.me/${cleaned}`;
};

interface SanggarDetailData {
  id: string;
  name: string;
  taglineSanggar: string;
  grade: string;
  ketuaSanggar: string;
  namaPicKontak: string;
  nomorPicKontak: string;
  email: string;
  alamatSanggar: string;
  alamatTempatLatihan: string;
  description: string;
  layananSanggar: string;
  prestasiPenghargaan: string;
  established: string;
  members: string;
  tariUnggulan: any[];
  imageUrl: string;
  logoUrl: string | null;
  fotoKetuaUrl: string | null;
  gallery: { type: string; url: string }[];
}

export default function SanggarDetailClient({ sanggar }: { sanggar: SanggarDetailData }) {
  const { t } = useLanguage();

  return (
    <div className={`min-h-screen bg-white pt-24 pb-24 ${poppins.className}`}>
      
      {/* Back Navigation - Premium Editorial Style */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-8">
        <Link className="group inline-flex items-center gap-4 text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-500 hover:text-orange-600 transition-colors duration-300 uppercase" href="/sanggar">
          <svg 
            className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform duration-300 ease-in-out" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{t('backToCatalog')}</span>
        </Link>
      </div>
      
      {/* Cinematic Hero Image */}
      <div className="w-full relative h-[50vh] md:h-[70vh] mb-12">
        <img 
          src={sanggar.imageUrl} 
          alt={sanggar.name} 
          className="w-full h-full object-cover rounded-none"
        />
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[90vw] px-4 sm:px-6 lg:px-8">
        
        {/* Title & Meta cleanly below image */}
        <div className="mb-16 max-w-4xl">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-xs uppercase tracking-widest text-slate-500 font-medium">
            <span>{sanggar.grade}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5" /> {t('verified')}
            </span>
          </div>
          <div className="flex items-center gap-6 mb-4">
            {sanggar.logoUrl && (
              <img 
                src={sanggar.logoUrl} 
                alt="Logo Sanggar" 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-slate-200 shadow-sm"
              />
            )}
            <h1 className={`text-5xl md:text-6xl font-light text-slate-900 ${dancingScript.className}`}>
              {sanggar.name}
            </h1>
          </div>
          {sanggar.taglineSanggar && (
            <p className="text-lg md:text-xl text-slate-500 font-light italic mt-4">
              &quot;{sanggar.taglineSanggar}&quot;
            </p>
          )}
        </div>

        {/* 3-Column Grid Layout for Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-slate-200 pt-16">
          
          {/* Main Info Column (Span 2) */}
          <div className="md:col-span-2 space-y-16">
            
            {/* Deskripsi */}
            <section>
              <h2 className="text-sm uppercase tracking-widest text-slate-900 font-medium mb-6">{t('descSanggar')}</h2>
              <p className="text-slate-600 font-light leading-loose">
                {sanggar.description}
              </p>
              
              <div className="mt-8 flex flex-wrap gap-12">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-widest">{t('est')}</span>
                  </div>
                  <p className="text-lg text-slate-900">{sanggar.established}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-widest">{t('members')}</span>
                  </div>
                  <p className="text-lg text-slate-900">{sanggar.members}</p>
                </div>
              </div>
            </section>

            {/* Tari Unggulan */}
            {sanggar.tariUnggulan && sanggar.tariUnggulan.length > 0 && (
              <section>
                <h2 className="text-sm uppercase tracking-widest text-slate-900 font-medium mb-6">{t('featuredDances')}</h2>
                <div className="space-y-8">
                  {sanggar.tariUnggulan.map((tari: any, index: number) => (
                    <div key={index} className="group">
                      <h4 className="font-medium text-slate-900 text-base mb-2 group-hover:text-slate-500 transition-colors">{tari.namaTari || tari.nama}</h4>
                      <p className="text-sm font-light text-slate-500 leading-relaxed max-w-2xl">{tari.deskripsiTari || tari.deskripsi}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Layanan & Prestasi */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-slate-900 font-medium mb-4">{t('services')}</h3>
                <p className="text-slate-600 text-sm font-light leading-loose">
                  {sanggar.layananSanggar}
                </p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest text-slate-900 font-medium mb-4">{t('achievements')}</h3>
                <p className="text-slate-600 text-sm font-light leading-loose">
                  {sanggar.prestasiPenghargaan}
                </p>
              </div>
            </section>

          </div>

          {/* Sidebar / Kontak Column (Span 1) */}
          <aside className="space-y-12">
            
            <section>
              <h3 className="text-sm uppercase tracking-widest text-slate-900 font-medium mb-6">{t('profileContact')}</h3>
              
              <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-lg w-fit border border-slate-100">
                {sanggar.fotoKetuaUrl ? (
                  <img src={sanggar.fotoKetuaUrl} alt="Foto Ketua" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xl">
                    {sanggar.ketuaSanggar && sanggar.ketuaSanggar !== "-" ? sanggar.ketuaSanggar.charAt(0).toUpperCase() : "K"}
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">{t('studioHead')}</p>
                  <p className="font-semibold text-slate-900 text-lg">{sanggar.ketuaSanggar || t('studioHead')}</p>
                </div>
              </div>

              <div className="space-y-8 font-light text-sm text-slate-600">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" /> {t('secretariat')}
                  </p>
                  <p className="leading-relaxed">{sanggar.alamatSanggar}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {t('trainingVenue')}
                  </p>
                  <p className="leading-relaxed">{sanggar.alamatTempatLatihan}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" /> {t('picName')}
                  </p>
                  <p className="text-slate-900 font-medium">{sanggar.namaPicKontak}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {t('phone')}
                  </p>
                  <p className="text-slate-900">{sanggar.nomorPicKontak}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </p>
                  <p className="text-slate-900">{sanggar.email}</p>
                </div>
              </div>

              <div className="mt-10">
                <a 
                  href={getWaLink(sanggar.nomorPicKontak)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center w-full bg-slate-900 text-white hover:bg-slate-700 px-8 py-4 uppercase tracking-widest text-xs transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  {t('contactBtn')}
                </a>
              </div>
            </section>

          </aside>
        </div>

        {/* Galeri - Edge to Edge Grid */}
        <section className="mt-24 border-t border-slate-200 pt-16">
          <h2 className="text-sm uppercase tracking-widest text-slate-900 font-medium mb-8">{t('gallery')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sanggar.gallery.map((img, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden bg-slate-100">
                <img 
                  src={img.url} 
                  alt={img.type} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-4">
                  <span className="text-white text-xs uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    {img.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
