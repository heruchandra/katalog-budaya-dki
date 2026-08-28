"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { UploadCloud, X, Check, Crop } from "lucide-react";
import getCroppedImg from "@/lib/cropImage";
import { useLanguage } from "@/context/LanguageContext";

export interface ImageUploadWithCropProps {
  label: string;
  aspectRatio: number;
  onUpload: (file: Blob | null, previewUrl: string | null) => void;
  defaultPreview?: string | null;
}

export default function ImageUploadWithCrop({
  label,
  aspectRatio,
  onUpload,
  defaultPreview,
}: ImageUploadWithCropProps) {
  const { t } = useLanguage();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
    // reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      if (croppedImageBlob) {
        const previewUrl = URL.createObjectURL(croppedImageBlob);
        setPreview(previewUrl);
        onUpload(croppedImageBlob, previewUrl);
        setIsCropping(false);
      }
    } catch (e) {
      console.error(e);
      alert("Gagal memotong gambar.");
    }
  }, [imageSrc, croppedAreaPixels, onUpload]);

  const cancelCrop = () => {
    setIsCropping(false);
    setImageSrc(null);
  };

  const handleRemove = () => {
    setPreview(null);
    setImageSrc(null);
    onUpload(null, null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>

      {/* Upload Zone or Preview */}
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-primary-50 hover:border-primary-400 transition-colors group"
        >
          <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-primary-500 mb-2 transition-colors" />
          <span className="text-sm font-medium text-gray-600 group-hover:text-primary-600">
            {t('adminClickToUpload')}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {t('adminUploadSupport')}
          </span>
        </div>
      ) : (
        <div className="relative w-full h-40 border border-gray-200 rounded-xl overflow-hidden bg-gray-100 group">
          <img 
            src={preview} 
            alt={`Preview ${label}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Crop className="w-4 h-4" /> Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <X className="w-4 h-4" /> Hapus
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Cropper Modal */}
      {isCropping && imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Sesuaikan Gambar ({label})</h3>
              <button 
                type="button"
                onClick={cancelCrop}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative w-full h-[50vh] sm:h-[60vh] bg-gray-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-600 w-12">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => {
                    setZoom(Number(e.target.value))
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelCrop}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={showCroppedImage}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-sm transition-all"
                >
                  <Check className="w-4 h-4" />
                  {t('adminBtnUpload')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
