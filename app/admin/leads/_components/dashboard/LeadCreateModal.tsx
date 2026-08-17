"use client";

import React, { useState } from "react";
import { UserPlus, UserCheck, ChevronDown, Calendar, CalendarCheck } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import Button from "@/components/ui/Button";
import { LeadStatus, PartnerName } from "@prisma/client";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {dict.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {dict.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {dict.nameLabel} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dict.namePlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {dict.phoneLabel} *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={dict.phonePlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-orange-500" /> {dict.appointmentLabel}
              </label>
              <input
                type="datetime-local"
                value={appDate}
                onChange={(e) => setAppDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <CalendarCheck className="w-3 h-3 text-emerald-600" /> {dict.deadlineLabel}
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {dict.managerLabel}
            </label>
            <div className="relative">
              <select
                value={manager}
                onChange={(e) => setManager(e.target.value as PartnerName)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500 appearance-none cursor-pointer"
              >
                <option value="">Не назначен</option>
                <option value={PartnerName.DANIIL}>Даниил</option>
                <option value={PartnerName.ELISEY}>Елисей</option>
              </select>
              <UserCheck className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {dict.addressLabel}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="г. Астана, ул. Сыганак..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {dict.commentLabel}
            </label>
            <AutoResizeTextarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Первичные пожелания клиента..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-orange-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs font-bold py-2"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="solid"
              disabled={isCreating}
              className="text-xs font-black py-2 px-5"
            >
              {isCreating ? "Создание..." : dict.submitBtn}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
