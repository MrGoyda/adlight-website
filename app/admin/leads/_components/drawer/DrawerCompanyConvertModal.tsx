"use client";

import React, { useState } from "react";
import { Briefcase, Building, FolderKanban, ArrowRight, X, User } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { Lead, Company } from "../../_types/leadTypes";
import { LeadFullDetails } from "../../_types/leadDetailTypes";
import BottomSheet from "@/components/ui/BottomSheet";

interface DrawerCompanyConvertModalProps {
  isOpen?: boolean;
  activeLead: Lead | LeadFullDetails;
  companies?: Company[];
  onClose: () => void;
  onConvert: (data: {
    companyName: string;
    binIin: string;
    contactPosition: string;
    projectTitle: string;
  }) => Promise<void>;
}

export default function DrawerCompanyConvertModal({
  isOpen = true,
  activeLead,
  companies = [],
  onClose,
  onConvert,
}: DrawerCompanyConvertModalProps) {
  const [companyName, setCompanyName] = useState(
    (activeLead as any).client?.name || activeLead.name || ""
  );
  const [binIin, setBinIin] = useState("");
  const [position, setPosition] = useState("Руководитель / Заказчик");
  const [projectTitle, setProjectTitle] = useState(
    `Проект: ${activeLead.name}`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !projectTitle.trim()) return;

    setIsSubmitting(true);
    triggerHaptic("success");
    await onConvert({
      companyName,
      binIin,
      contactPosition: position,
      projectTitle,
    });
    setIsSubmitting(false);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      maxHeight="max-h-[90dvh]"
      className="bg-white"
    >
      <div className="flex flex-col h-full w-full max-w-full overflow-hidden overflow-x-hidden">
        {/* Шапка шторки */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center shadow-2xs shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate">
                Квалификация в Проект
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Создание Компании и B2B Проекта из сделки
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer active:scale-90 shrink-0"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain touch-pan-y"
        >
          {/* Название компании */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              Название компании / Заказчик *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="ТОО Название или ИП..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition shadow-2xs"
            />
          </div>

          {/* БИН / ИИН и Должность */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                БИН / ИИН (12 цифр)
              </label>
              <input
                type="text"
                value={binIin}
                onChange={(e) => setBinIin(e.target.value)}
                placeholder="12 цифр..."
                maxLength={12}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition shadow-2xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Должность контакта
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Директор..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition shadow-2xs"
              />
            </div>
          </div>

          {/* Название нового Проекта */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              Название нового B2B Проекта *
            </label>
            <input
              type="text"
              required
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Вывеска для филиала..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition shadow-2xs"
            />
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl transition shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? "Конвертация..." : "Создать B2B проект"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
}
