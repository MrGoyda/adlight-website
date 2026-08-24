"use client";

import React, { useState } from "react";
import { User, Building2, FileText, MapPin, X, ArrowRight } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { createClient } from "../actions";
import PhoneInput from "@/components/ui/PhoneInput";
import BottomSheet from "@/components/ui/BottomSheet";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newClient: any) => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [binIin, setBinIin] = useState("");
  const [legalAddress, setLegalAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Пожалуйста, заполните имя и телефон клиента");
      return;
    }

    setIsPending(true);
    setError(null);
    triggerHaptic("medium");

    const res = await createClient({
      name: name.trim(),
      phone: phone.trim(),
      companyName: companyName.trim() || undefined,
      binIin: binIin.trim() || undefined,
      legalAddress: legalAddress.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setIsPending(false);

    if (res.error) {
      setError(res.error);
      triggerHaptic("error");
    } else {
      triggerHaptic("success");
      if (onSuccess) onSuccess(res.client);
      setName("");
      setPhone("");
      setCompanyName("");
      setBinIin("");
      setLegalAddress("");
      setNotes("");
      onClose();
    }
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
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate">
                Новый клиент
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Занесение контакта в постоянную базу клиентов
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

        {/* Содержимое формы */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 overscroll-contain touch-pan-y"
        >
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Имя */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              ФИО / Имя контакта *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Например: Азамат Жумабеков"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-base sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-slate-900 shadow-2xs"
              />
            </div>
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              Номер телефона (WhatsApp) *
            </label>
            <PhoneInput
              required
              placeholder="+7 (701) 000-00-00"
              value={phone}
              onChange={(val) => setPhone(val)}
              className="bg-slate-50 focus:bg-white focus:border-blue-500"
            />
          </div>

          {/* Компания и БИН */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                Организация / Компания
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ТОО / ИП / Бренд"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-base sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-slate-900 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                БИН / ИИН (для счетов)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="12 цифр"
                  value={binIin}
                  onChange={(e) => setBinIin(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-base sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-slate-900 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Адрес */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              Адрес объекта / Юридический адрес
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Город, улица, номер здания"
                value={legalAddress}
                onChange={(e) => setLegalAddress(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-base sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-slate-900 shadow-2xs"
              />
            </div>
          </div>

          {/* Заметки */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              Заметки / Сфера деятельности
            </label>
            <textarea
              rows={2}
              placeholder="Сфера: Ресторан / Стоматология / Сеть магазинов..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-base sm:text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-slate-900 shadow-2xs resize-none"
            />
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                "Сохранение..."
              ) : (
                <>
                  <span>Добавить в базу</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
};
