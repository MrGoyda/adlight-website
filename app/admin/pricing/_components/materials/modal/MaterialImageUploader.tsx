"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { pricingDict } from "@/dictionaries/pricing";

interface MaterialImageUploaderProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

export default function MaterialImageUploader({
  imageUrl,
  onImageUrlChange,
}: MaterialImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const f = pricingDict.modals.material.fields;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(pricingDict.toasts.photoInvalidFormat);
      return;
    }

    setIsUploading(true);
    triggerHaptic("light");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "materials");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.publicUrl) {
        onImageUrlChange(data.publicUrl);
        toast.success(pricingDict.toasts.photoSaved);
        triggerHaptic("medium");
      } else {
        throw new Error(data.error || "Не удалось получить URL");
      }
    } catch (err: unknown) {
      console.error("Ошибка загрузки фото:", err);
      const errMsg = err instanceof Error ? err.message : "Не удалось загрузить фото";
      toast.error(pricingDict.toasts.photoUploadError(errMsg));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
          <span>{f.photo}</span>
        </label>
        {imageUrl && (
          <button
            type="button"
            onClick={() => onImageUrlChange("")}
            className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
          >
            {f.photoDelete}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-1 text-orange-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[9px] font-bold">{f.photoUploading}</span>
            </div>
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt="Предпросмотр"
              width={64}
              height={64}
              unoptimized
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-300" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Скрытый input для выбора файла */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer active:scale-98 disabled:opacity-50 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? f.photoUploading : f.photoUploadButton}</span>
            </button>
            <span className="text-[10px] text-slate-400">{f.photoOrUrl}</span>
          </div>

          <input
            type="url"
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            placeholder={f.photoUrlPlaceholder}
            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:border-orange-500 outline-none transition box-border"
          />
        </div>
      </div>
    </div>
  );
}
