"use client";

import React, { useEffect } from "react";
import { 
  X, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  FileCheck, 
  Calculator, 
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw
} from "lucide-react";
import { FileCategory } from "@prisma/client";
import { createPortal } from "react-dom";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { triggerHaptic } from "@/lib/haptics";

export interface MediaFileItem {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  category: FileCategory;
  createdAt: string;
}

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: MediaFileItem[];
  initialFileId: string;
}

export default function MediaViewerModal({
  isOpen,
  onClose,
  files,
  initialFileId,
}: MediaViewerModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);
  const [rotation, setRotation] = React.useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      lockScroll("mediaViewer");
    } else {
      unlockScroll("mediaViewer");
    }
    return () => unlockScroll("mediaViewer");
  }, [isOpen]);

  useEffect(() => {
    if (initialFileId && files.length > 0) {
      const idx = files.findIndex((f) => f.id === initialFileId);
      setCurrentIndex(idx !== -1 ? idx : 0);
    }
  }, [initialFileId, files]);

  useEffect(() => {
    setZoomLevel(1);
    setRotation(0);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, files]);

  if (!isOpen || files.length === 0 || typeof window === "undefined") return null;

  const currentFile = files[currentIndex] || files[0];
  const isImage = currentFile.mimeType.startsWith("image/");
  const isVideo = currentFile.mimeType.startsWith("video/");
  const isPdf = currentFile.mimeType === "application/pdf" || currentFile.name.toLowerCase().endsWith(".pdf");
  
  const ext = currentFile.name.split(".").pop()?.toLowerCase() || "";
  const isWord = ["doc", "docx", "docm", "rtf", "txt"].includes(ext);
  const isExcel = ["xls", "xlsx", "xlsm", "xlsb", "csv"].includes(ext);
  const isOfficeDoc = isWord || isExcel;

  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(currentFile.url)}`;

  const handlePrev = () => {
    triggerHaptic("light");
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
  };

  const handleNext = () => {
    triggerHaptic("light");
    setCurrentIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async () => {
    triggerHaptic("success");
    try {
      const response = await fetch(currentFile.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = currentFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(currentFile.url, "_blank");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex flex-col bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-200 overflow-hidden">
      {/* ── ШАПКА ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-white/10 text-white shrink-0 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h4 className="font-black text-sm text-white truncate max-w-md">{currentFile.name}</h4>
            <p className="text-[10px] text-slate-400 font-semibold">
              {(currentFile.size / 1024 / 1024).toFixed(2)} МБ • {currentIndex + 1} из {files.length}
            </p>
          </div>
        </div>

        {/* Элементы управления шапки */}
        <div className="flex items-center gap-2">
          {isImage && (
            <div className="hidden sm:flex items-center gap-1 mr-4 bg-white/10 rounded-xl p-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Уменьшить"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono font-bold px-2 text-slate-300">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Увеличить"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer ml-1"
                title="Повернуть"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Скачать</span>
          </button>

          <a
            href={currentFile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
            title="Открыть напрямую"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition cursor-pointer ml-2"
            title="Закрыть (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── ОСНОВНОЙ КОНТЕНТ ── */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
        {/* Кнопка «Назад» */}
        {files.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-6 z-20 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg border border-white/10 shadow-2xl transition cursor-pointer active:scale-90"
            title="Предыдущий файл (←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Область отображения медиафайла */}
        <div className="w-full h-full flex items-center justify-center">
          {isImage && (
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              <img
                src={currentFile.url}
                alt={currentFile.name}
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s ease-out",
                }}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
            </div>
          )}

          {isVideo && (
            <video
              src={currentFile.url}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
            />
          )}

          {isPdf && (
            <iframe
              src={`${currentFile.url}#toolbar=1&navpanes=0`}
              className="w-full h-full rounded-2xl border border-white/10 bg-white shadow-2xl"
              title={currentFile.name}
            />
          )}

          {isOfficeDoc && (
            <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <iframe
                src={officeViewerUrl}
                className="w-full h-full border-none"
                title={currentFile.name}
              />
            </div>
          )}

          {!isImage && !isVideo && !isPdf && !isOfficeDoc && (
            <div className="p-12 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/10 text-center space-y-4 max-w-sm">
              <FileText className="w-16 h-16 text-orange-400 mx-auto" />
              <div>
                <h4 className="text-base font-extrabold text-white">{currentFile.name}</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Предпросмотр недоступен для данного типа файла. Вы можете скачать его напрямую.
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-lg transition cursor-pointer"
              >
                Скачать файл
              </button>
            </div>
          )}
        </div>

        {/* Кнопка «Вперед» */}
        {files.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-6 z-20 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg border border-white/10 shadow-2xl transition cursor-pointer active:scale-90"
            title="Следующий файл (→)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
