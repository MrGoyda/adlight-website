"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Target, FileSpreadsheet, Check, Sparkles, Filter } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { getAudienceExportData } from "../actions";

interface ExportAudienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportAudienceModal: React.FC<ExportAudienceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [filter, setFilter] = useState<"ALL" | "PAID_DEALS" | "COMPANIES">("ALL");
  const [isPending, setIsPending] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async (targetType: "META" | "YANDEX" | "FULL_CSV") => {
    setIsPending(true);
    triggerHaptic("medium");

    const res = await getAudienceExportData(filter);
    setIsPending(false);

    if (res.error || !res.data) {
      toast.error(res.error || "Не удалось получить данные для экспорта");
      return;
    }

    const rows = res.data;
    if (rows.length === 0) {
      toast.warning("В выбранном сегменте нет клиентов для выгрузки");
      return;
    }

    toast.success(`Экспорт сформирован (${rows.length} контактов)`);

    let csvContent = "";
    let filename = `adlight_audience_${filter.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (targetType === "META") {
      // Facebook / Instagram Ads Custom Audiences: Заголовок "phone" и список номеров
      csvContent = "phone\n" + rows.map((r) => r.phoneMeta).filter(Boolean).join("\n");
      filename = `meta_lookalike_audience_${filter.toLowerCase()}.csv`;
    } else if (targetType === "YANDEX") {
      // Яндекс Аудитории: phone,email
      csvContent = "phone,email\n" + rows.map((r) => `${r.phoneE164},${r.email}`).join("\n");
      filename = `yandex_audience_${filter.toLowerCase()}.csv`;
    } else {
      // Полный экспорт в Excel/CSV со всеми атрибутами
      csvContent = "Имя,Телефон,Организация,Email,Кол-во сделок,Выручка (LTV),Дата добавления\n" +
        rows.map((r) => `"${r.name}","${r.phoneRaw}","${r.companyName}","${r.email}",${r.dealsCount},${r.totalRevenue},"${r.createdAt}"`).join("\n");
      filename = `adlight_clients_database_${filter.toLowerCase()}.csv`;
    }

    // Скачивание файла с поддержкой UTF-8 BOM для корректного отображения в русском Excel
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerHaptic("success");
    setDownloadSuccess(`Файл ${filename} (${rows.length} контактов) успешно скачан!`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 flex flex-col max-h-[90dvh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-2xs">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                  Экспорт аудиторий для рекламы
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Выгрузка базы для Lookalike в Meta Ads и ретаргетинга
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
            {downloadSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{downloadSuccess}</span>
              </div>
            )}

            {/* Выбор сегмента */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                1. Выберите сегмент клиентов:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { key: "ALL", label: "Все контакты", desc: "Вся база" },
                  { key: "PAID_DEALS", label: "С покупками", desc: "LTV > 0 (Реальные)" },
                  { key: "COMPANIES", label: "Организации", desc: "B2B компании" },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setFilter(s.key as any);
                    }}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer active:scale-95 ${
                      filter === s.key
                        ? "border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-2xs"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="font-extrabold text-xs block">{s.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Выбор формата экспорта */}
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                2. Выгрузить для рекламного кабинета:
              </label>

              {/* Meta Lookalike */}
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDownload("META")}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 bg-white text-left transition flex items-center justify-between shadow-2xs group cursor-pointer active:scale-98"
              >
                <div>
                  <span className="font-black text-xs text-slate-900 group-hover:text-blue-700 block">
                    📱 Facebook & Instagram Ads (Lookalike)
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Формат E.164 (7701XXXXXXX) для создания похожих аудиторий
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Download className="w-4 h-4" />
                </div>
              </button>

              {/* Yandex Audiences */}
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDownload("YANDEX")}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 bg-white text-left transition flex items-center justify-between shadow-2xs group cursor-pointer active:scale-98"
              >
                <div>
                  <span className="font-black text-xs text-slate-900 group-hover:text-amber-700 block">
                    🎯 Яндекс Аудитории & Google Customer Match
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Формат с кодом страны (+7701XXXXXXX) и email
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                  <Download className="w-4 h-4" />
                </div>
              </button>

              {/* Excel Full CSV */}
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDownload("FULL_CSV")}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 bg-white text-left transition flex items-center justify-between shadow-2xs group cursor-pointer active:scale-98"
              >
                <div>
                  <span className="font-black text-xs text-slate-900 group-hover:text-emerald-700 block">
                    📊 Полная база клиентов в Excel (CSV)
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Имена, Телефоны, Компании, Количество сделок и общая сумма (LTV)
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Download className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
