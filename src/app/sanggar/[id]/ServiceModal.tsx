"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { SanggarDetailData, ServiceItem, TariItem } from "./SanggarDetailClient";
import { ownDanceImage, ownServiceImage } from "@/lib/sanggarImages";
import { isDanceClassService, splitPracticeInfo } from "@/lib/sanggarData";
import { WHATSAPP_CTA } from "@/components/SocialPills";
import PracticeInfo from "./PracticeInfo";

interface ServiceModalProps {
  service: ServiceItem;
  sanggar: SanggarDetailData;
  isEn: boolean;
  waNumber: string;
  studioName: string;
  onClose: () => void;
}

// The sanggar's own photos only; null when it has none (the image is then left out / a placeholder is shown)
const getServiceImage = (service: ServiceItem, sanggar: SanggarDetailData) =>
  service.image || ownServiceImage(sanggar, service.title, service.titleEn) || sanggar.image || sanggar.coverImage || null;

const getDanceImage = (dance: TariItem, sanggar: SanggarDetailData) =>
  dance.image || ownDanceImage(sanggar, dance.name || dance.title) || null;

/**
 * Service detail modal ("Lihat Detail" on a Layanan Sanggar card). Loaded with next/dynamic only when a
 * service is opened, so it isn't part of the detail page's initial JavaScript.
 */
export default function ServiceModal({ service, sanggar, isEn, waNumber, studioName, onClose }: ServiceModalProps) {
  const modalTitle = isEn ? (service.titleEn || service.title) : service.title;
  const serviceImage = getServiceImage(service, sanggar);

  const modalDesc = (isEn && service.descriptionEn)
    ? service.descriptionEn
    : (service.description || (isEn
        ? "In-depth studio training, performance programs, and cultural consultation guided by experienced mentors."
        : "Program pelatihan terarah, pementasan kesenian, dan konsultasi budaya yang dibimbing langsung oleh instruktur berpengalaman."));

  const danceHighlights = isEn
    ? ((sanggar.danceSpecialties && sanggar.danceSpecialties.length > 0) ? sanggar.danceSpecialties : (sanggar.tariUnggulan || []))
    : ((sanggar.tariUnggulan && sanggar.tariUnggulan.length > 0) ? sanggar.tariUnggulan : (sanggar.danceSpecialties || []));

  // Karya Tari Unggulan hanya tampil penuh di layanan yang ditandai featuresDanceWorks.
  // Sanggar tanpa layanan bertanda tetap memakai chip "Pementasan Terkait" (perilaku lama).
  const showDanceWorks = !!service.featuresDanceWorks && danceHighlights.length > 0;
  const hasDanceWorksService = [...(sanggar.layanan || []), ...(sanggar.services || [])]
    .some((s) => typeof s === "object" && s !== null && s.featuresDanceWorks);
  const showDanceChips = !hasDanceWorksService && danceHighlights.length > 0;

  // The dance class carries the studio's practice schedule + venue; this modal is the only place they appear
  const practiceInfo = isDanceClassService(service.title, service.titleEn)
    ? splitPracticeInfo(sanggar.alamatLatihan || sanggar.address || sanggar.alamatSanggar)
    : null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${showDanceWorks ? "max-w-2xl" : "max-w-lg"} bg-white rounded-none p-6 sm:p-8 shadow-2xl border border-zinc-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={modalTitle}
      >
        {/* Header Title & Close Button */}
        <div className="flex items-start justify-between gap-4 pb-2">
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-tight">{modalTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-none text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            aria-label={isEn ? "Close modal" : "Tutup modal"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Featured Service Image Banner: not shown for the Karya Tari service, whose dance-work cards below
            already carry the photos */}
        {!showDanceWorks && serviceImage && (
          <div className="relative w-full aspect-video rounded-none overflow-hidden my-4 border border-zinc-200/80 shadow-sm bg-zinc-100">
            <Image src={serviceImage} alt={modalTitle} fill sizes="(min-width: 640px) 448px, 90vw" className="object-cover" />
          </div>
        )}

        {/* Service Summary */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 my-4">
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-1.5">
            {isEn ? "Service Summary" : "Ringkasan Layanan"}
          </p>
          <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">{modalDesc}</p>
        </div>

        {practiceInfo && (
          <div className="bg-orange-50/60 p-4 rounded-xl border border-orange-100 my-4">
            <p className="text-xs font-semibold tracking-wider text-orange-700 uppercase mb-3">
              {isEn ? "Practice Venue & Schedule" : "Tempat & Jadwal Latihan"}
            </p>
            <PracticeInfo info={practiceInfo} isEn={isEn} />
          </div>
        )}

        {/* Karya Tari Unggulan cards (the modal title already reads "Karya Tari Unggulan Sanggar") */}
        {showDanceWorks && (
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {danceHighlights.map((dance, idx) => {
                const danceName = dance.name || dance.title || "";
                const danceImage = getDanceImage(dance, sanggar);
                return (
                  <div key={idx} className="rounded-none border border-zinc-200/80 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="relative w-full aspect-video bg-zinc-100 overflow-hidden flex items-center justify-center">
                      {danceImage ? (
                        <Image src={danceImage} alt={danceName} fill sizes="(min-width: 640px) 300px, 90vw" className="object-cover" />
                      ) : (
                        <ImageOff className="w-7 h-7 text-zinc-300" aria-hidden="true" />
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-none bg-brand text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h5 className="text-base font-bold text-zinc-900 leading-snug">{danceName}</h5>
                      </div>
                      <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">{isEn ? "Work Synopsis:" : "Sinopsis Karya:"}</p>
                      <p className="text-zinc-600 text-sm leading-relaxed text-justify">{dance.synopsis || dance.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Specialties (sanggar tanpa layanan Karya Tari) */}
        {showDanceChips && (
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-wider text-orange-600 uppercase mb-2.5 flex items-center gap-1.5">
              <span>♫</span> {isEn ? "Related Performances" : "Cakupan Materi & Pementasan Terkait"}
            </p>
            <div className="flex flex-wrap gap-2">
              {danceHighlights.map((item, idx) => (
                <span key={idx} className="inline-flex items-center rounded-none bg-orange-50 text-orange-700 text-xs font-medium px-3.5 py-1.5 border border-orange-200/60">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp CTA (only when the sanggar has a number on record) */}
        {waNumber && (
        <a
          href={`https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(
            isEn
              ? `Hello, I saw the profile of ${studioName} on DKI Jakarta Art Catalog and would like to inquire about the service: "${modalTitle}".`
              : `Halo, saya melihat profil ${studioName} di Katalog Seni DKI Jakarta dan ingin berkonsultasi mengenai layanan: "${modalTitle}".`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm ${WHATSAPP_CTA}`}
        >
          <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span>{isEn ? "Consult via WhatsApp" : "Konsultasi via WhatsApp"}</span>
        </a>
        )}
      </div>
    </div>
  );
}
