"use client";

import React, { useState } from "react";
import { FileCategory } from "@prisma/client";
import { 
  Upload, 
  Trash2, 
  Download, 
  Eye, 
  Image as ImageIcon, 
  FileText, 
  CheckSquare, 
  Folder 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { LeadFileItem } from "../../../_types/leadDetailTypes";

interface LeadMediaFilesTabProps {
  files: LeadFileItem[];
  onUploadFiles: (e: React.ChangeEvent<HTMLInputElement>, category: FileCategory) => void;
  onDeleteFile: (fileId: string) => void;
  onOpenFile: (file: LeadFileItem) => void;
  isUploading: boolean;
}

const FILE_CATEGORIES: { id: FileCategory; label: string; icon: any }[] = [
  { id: "MEASUREMENT", label: "Замеры и Объект", icon: ImageIcon },
  { id: "SKETCH", label: "Дизайн и Макеты", icon: CheckSquare },
  { id: "CONTRACT", label: "Договоры", icon: FileText },
  { id: "INVOICE", label: "Счета и Акты", icon: FileText },
  { id: "OTHER", label: "Прочее", icon: Folder },
];

export default function LeadMediaFilesTab({
  files,
  onUploadFiles,
  onDeleteFile,
  onOpenFile,
  isUploading,
}: LeadMediaFilesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>("MEASUREMENT");

  const currentFiles = files.filter((f) => f.category === selectedCategory);

  const handleDownload = async (file: LeadFileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("success");
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(file.url, "_blank");
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Панель загрузки и табов */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Хранилище файлов объекта
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Фото замеров, эскизы, привязки и документация
            </p>
          </div>

          <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/20 cursor-pointer active:scale-95 transition">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? "Загрузка в R2..." : "+ Загрузить файлы"}</span>
            <input
              type="file"
              multiple
              disabled={isUploading}
              onChange={(e) => onUploadFiles(e, selectedCategory)}
              className="hidden"
            />
          </label>
        </div>

        {/* Категории файлов */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-200/60">
          {FILE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            const count = files.filter((f) => f.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-slate-200/60 border border-slate-200/80"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Сетка файлов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentFiles.length === 0 ? (
          <div className="sm:col-span-2 p-8 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold">
            В категории «{FILE_CATEGORIES.find((c) => c.id === selectedCategory)?.label}» файлов пока нет.
          </div>
        ) : (
          currentFiles.map((file) => {
            const isImage = file.mimeType.startsWith("image/");
            const isPdf = file.mimeType === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

            return (
              <div
                key={file.id}
                onClick={() => {
                  triggerHaptic("light");
                  onOpenFile(file);
                }}
                className="bg-white p-3 rounded-2xl border border-slate-200/80 hover:border-orange-300 shadow-2xs hover:shadow-sm transition cursor-pointer flex items-center gap-3 group"
              >
                {/* Превью / Иконка */}
                <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="w-6 h-6 text-slate-400 mx-auto" />
                      <span className="text-[9px] font-black text-slate-500 uppercase block">
                        {isPdf ? "PDF" : "DOC"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Инфо о файле */}
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-slate-900 text-xs truncate group-hover:text-orange-600 transition">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {(file.size / 1024).toFixed(0)} KB • {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Действия */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleDownload(file, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    title="Скачать"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic("medium");
                      onDeleteFile(file.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
