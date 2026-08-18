"use client";

import React, { useState } from "react";
import { UserPlus, UserCheck, ChevronDown, Calendar, CalendarCheck, X, MapPin, MessageSquare, Phone, User } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { LeadStatus, PartnerName } from "@prisma/client";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";
import BottomSheet from "@/components/ui/BottomSheet";

interface LeadCreateModalProps {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    message: string;
    status: LeadStatus;
    comment: string;
    source: string;
    address: string;
    appointmentDate?: string;
    deadline?: string;
    manager: PartnerName | null;
  }) => Promise<void>;
  isCreating: boolean;
}

export default function LeadCreateModal({
  onClose,
  onSubmit,
  isCreating,
}: LeadCreateModalProps) {
  const dict = LEADS_DICTIONARY.createModal;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState("Вручную");
  const [comment, setComment] = useState("");
  const [address, setAddress] = useState("");
  const [appDate, setAppDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [manager, setManager] = useState<PartnerName | "">("");
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.NEW);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    triggerHaptic("success");
    await onSubmit({
      name,
      phone,
      message,
      status,
      comment,
      source,
      address,
      appointmentDate: appDate || undefined,
      deadline: deadline || undefined,
      manager: (manager as PartnerName) || null,
    });
  };

  return (
    <BottomSheet
      isOpen={true}
      onClose={onClose}
      maxWidth="max-w-xl"
      maxHeight="max-h-[92dvh]"
      className="bg-white"
    >
      <div className="flex flex-col h-full w-full max-w-full overflow-hidden overflow-x-hidden">
        {/* Шапка шторки */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20 shrink-0 w-full max-w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900 leading-tight truncate">
                {dict.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5 truncate">
                {dict.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма создания лида внутри скроллящегося контейнера */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto overflow-x-hidden w-full max-w-full touch-pan-y [touch-action:pan-y] overscroll-contain flex-1"
        >
          {/* Имя и Телефон */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-full">
            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                {dict.nameLabel} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dict.namePlaceholder}
                className="w-full min-w-0 max-w-full box-border bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition"
              />
            </div>

            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {dict.phoneLabel} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={dict.phonePlaceholder}
                className="w-full min-w-0 max-w-full box-border bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition"
              />
            </div>
          </div>

          {/* Дата замера и Дедлайн сдачи */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-full">
            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" /> {dict.appointmentLabel}
              </label>
              <input
                type="datetime-local"
                value={appDate}
                onChange={(e) => setAppDate(e.target.value)}
                className="w-full min-w-0 max-w-full box-border bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition"
              />
            </div>

            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {dict.deadlineLabel}
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full min-w-0 max-w-full box-border bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition"
              />
            </div>
          </div>

          {/* Ответственный менеджер */}
          <div className="w-full max-w-full">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              {dict.managerLabel}
            </label>
            <div className="relative w-full max-w-full">
              <select
                value={manager}
                onChange={(e) => setManager(e.target.value as PartnerName)}
                className="w-full min-w-0 max-w-full box-border bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 appearance-none cursor-pointer"
              >
                <option value="">Не назначен</option>
                <option value={PartnerName.DANIIL}>Даниил</option>
                <option value={PartnerName.ELISEY}>Елисей</option>
              </select>
              <UserCheck className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Адрес объекта */}
          <div className="w-full max-w-full">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              {dict.addressLabel}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="г. Астана, ул. Сыганак..."
              className="w-full min-w-0 max-w-full box-border bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition"
            />
          </div>

          {/* Заметка к заявке */}
          <div className="w-full max-w-full">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {dict.commentLabel}
            </label>
            <AutoResizeTextarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Первичные пожелания клиента, детали вывески..."
              className="w-full min-w-0 max-w-full box-border bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition shadow-2xs"
            />
          </div>

          {/* Нижний футер с кнопками */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 shrink-0 w-full max-w-full">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs transition cursor-pointer active:scale-95"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isCreating ? "Создание..." : dict.submitBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
}
