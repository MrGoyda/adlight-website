"use client";

import React, { useState } from "react";
import { Briefcase, Building, FolderKanban, ArrowRight } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { Lead, Company } from "../../_types/leadTypes";

interface DrawerCompanyConvertModalProps {
  activeLead: Lead;
  companies: Company[];
  onClose: () => void;
  onConvert: (data: {
    companyName: string;
    binIin: string;
    contactPosition: string;
    projectTitle: string;
  }) => Promise<void>;
}

export default function DrawerCompanyConvertModal({
  activeLead,
  companies,
  onClose,
  onConvert,
}: DrawerCompanyConvertModalProps) {
  const [companyName, setCompanyName] = useState(
    activeLead.client?.name || activeLead.name || ""
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-none">
                Квалификация в Проект
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Создание Компании и Проекта
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building className="w-3 h-3 text-orange-500" />
              Название компании / Заказчик *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="ТОО Название или ИП..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                БИН / ИИН
              </label>
              <input
                type="text"
                value={binIin}
                onChange={(e) => setBinIin(e.target.value)}
                placeholder="12 цифр..."
                maxLength={12}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Должность контакта
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Директор..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <FolderKanban className="w-3 h-3 text-indigo-500" />
              Название нового Проекта *
            </label>
            <input
              type="text"
              required
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Вывеска для филиала..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold rounded-xl transition shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Конвертация..." : "Создать проект"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
