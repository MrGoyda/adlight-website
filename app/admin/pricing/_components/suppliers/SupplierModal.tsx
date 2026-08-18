"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Building2, Phone, MapPin, MessageCircle } from "lucide-react";
import { SupplierData } from "../../_types/pricingTypes";
import { triggerHaptic } from "@/lib/haptics";
import BottomSheet from "@/components/ui/BottomSheet";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    name: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    notes?: string;
  }) => Promise<void>;
  editingSupplier?: SupplierData | null;
}

export default function SupplierModal({
  isOpen,
  onClose,
  onSave,
  editingSupplier,
}: SupplierModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSupplier) {
      setName(editingSupplier.name || "");
      setPhone(editingSupplier.phone || "");
      setWhatsapp(editingSupplier.whatsapp || "");
      setAddress(editingSupplier.address || "");
      setNotes(editingSupplier.notes || "");
    } else {
      setName("");
      setPhone("");
      setWhatsapp("");
      setAddress("");
      setNotes("");
    }
  }, [editingSupplier, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    triggerHaptic("medium");

    try {
      await onSave({
        id: editingSupplier?.id,
        name: name.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        address: address.trim(),
        notes: notes.trim(),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      maxHeight="max-h-[92dvh]"
      className="bg-white"
    >
      <div className="flex flex-col h-full w-full max-w-full overflow-hidden overflow-x-hidden">
        {/* Шапка */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20 shrink-0 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                {editingSupplier ? "Редактировать поставщика" : "Новый поставщик"}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold truncate">Контакты и склады поставщика</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-3.5 overflow-y-auto overflow-x-hidden w-full max-w-full touch-pan-y [touch-action:pan-y] overscroll-contain flex-1"
        >
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Название компании / поставщика *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Напр. ТОО Демер / Signtech"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition box-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Телефон
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (700) 000-00-00"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
                />
              </div>
            </div>

            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                WhatsApp
              </label>
              <div className="relative">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+77000000000"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Адрес офиса / склада
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="г. Алматы, ул. Рыскулова 103"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Заметки / Контакты менеджеров
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Менеджер Аскар, скидка 10% от прайса, доставка в течение дня"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-orange-500 outline-none resize-none box-border shadow-2xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs transition cursor-pointer active:scale-95"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Сохранение..." : editingSupplier ? "Обновить" : "Сохранить"}</span>
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
}
