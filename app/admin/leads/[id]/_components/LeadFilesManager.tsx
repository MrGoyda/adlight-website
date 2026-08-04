"use client";

import React from "react";
import { FileCategory } from "@prisma/client";
import { Upload, ExternalLink, Trash2, Download, Eye, Play } from "lucide-react";
import { CATEGORY_LABELS } from "./config";
import { crmDict } from "@/dictionaries/crm";
import { triggerHaptic } from "@/lib/haptics";

interface LeadFileItem {
  id: string;
  name: string;
  url: string;
  fileKey: string;
  size: number;
  mimeType: string;
  category: FileCategory;
  createdAt: string;
}

interface LeadFilesManagerProps {
  files: LeadFileItem[];
  selectedCategory: FileCategory;
  onSelectCategory: (cat: FileCategory) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteFile: (fileId: string) => void;
  onOpenFile: (fileId: string) => void;
  isUploading: boolean;
}

export default function LeadFilesManager({
  files,
  selectedCategory,
  onSelectCategory,
  onFileUpload,
  onDeleteFile,
  onOpenFile,
  isUploading,
}: LeadFilesManagerProps) {
  const currentCategoryFiles = files.filter((f) => f.category === selectedCategory);

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
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-orange-500" />
            {crmDict.leadDetail.storageTitle}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {crmDict.leadDetail.storageSubtitle}
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-sm cursor-pointer active:scale-95 transition">
          <Upload className="w-4 h-4" />
          {isUploading ? crmDict.leadDetail.uploading : crmDict.leadDetail.uploadBtn}
          <input
            type="file"
            multiple
            disabled={isUploading}
            onChange={onFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Табы категорий */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_LABELS) as FileCategory[]).map((cat) => {
          const labelObj = CATEGORY_LABELS[cat];
          const Icon = labelObj.icon;
          const isActive = selectedCategory === cat;
          const count = files.filter((f) => f.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => {
                triggerHaptic("light");
                onSelectCategory(cat);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-650"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {labelObj.label}
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Список файлов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {currentCategoryFiles.length === 0 ? (
          <div className="sm:col-span-2 p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-semibold">
            {crmDict.leadDetail.noFilesCategory} «{CATEGORY_LABELS[selectedCategory].label}».
          </div>
        ) : (
          currentCategoryFiles.map((file) => {
            const isImage = file.mimeType.startsWith("image/");
            const isVideo = file.mimeType.startsWith("video/");
            const isPdf = file.mimeType === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
            const ext = file.name.split(".").pop()?.toUpperCase() || "DOC";

            return (
              <div
                key={file.id}
                onClick={() => {
                  triggerHaptic("light");
                  onOpenFile(file.id);
                }}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isImage ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                  ) : isVideo ? (
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <Play className="w-4 h-4 fill-purple-600" />
                    </div>
                  ) : (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[11px] shrink-0 ${
                      isPdf ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {ext}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h5 className="text-xs font-extrabold text-slate-800 truncate group-hover:text-orange-600 transition">
                      {file.name}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      {(file.size / 1024 / 1024).toFixed(2)} МБ •{" "}
                      {new Date(file.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFile(file.id);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                    title={crmDict.leadDetail.openFile}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleDownload(file, e)}
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                    title={crmDict.leadDetail.downloadFile}
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title={crmDict.leadDetail.deleteR2}
                  >
                    <Trash2 className="w-4 h-4" />
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
