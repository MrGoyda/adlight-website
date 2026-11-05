"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Building2,
  MapPin,
  MessageCircle,
  Globe,
  Instagram,
  Plus,
  Trash2,
} from "lucide-react";
import { SupplierData } from "../../_types/pricingTypes";
import { triggerHaptic } from "@/lib/haptics";
import BottomSheet from "@/components/ui/BottomSheet";
import PhoneInput from "@/components/ui/PhoneInput";
import { pricingDict } from "@/dictionaries/pricing";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    phones?: string[];
    whatsapp?: string | null;
    website?: string | null;
    instagram?: string | null;
    notes?: string | null;
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
  const [phones, setPhones] = useState<string[]>([""]);
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = pricingDict.modals.supplier;

  useEffect(() => {
    if (editingSupplier) {
      setName(editingSupplier.name || "");
      // Инициализируем массив телефонов (из phones или phone)
      const existingPhones =
        editingSupplier.phones && editingSupplier.phones.length > 0
          ? editingSupplier.phones
          : editingSupplier.phone
          ? [editingSupplier.phone]
          : [""];
      setPhones(existingPhones);
      setWhatsapp(editingSupplier.whatsapp || "");
      setWebsite(editingSupplier.website || "");
      setInstagram(editingSupplier.instagram || "");
      setAddress(editingSupplier.address || "");
      setNotes(editingSupplier.notes || "");
    } else {
      setName("");
      setPhones([""]);
      setWhatsapp("");
      setWebsite("");
      setInstagram("");
      setAddress("");
      setNotes("");
    }
  }, [editingSupplier, isOpen]);

  const handlePhoneChange = (index: number, val: string) => {
    setPhones((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleAddPhone = () => {
    triggerHaptic("light");
    setPhones((prev) => [...prev, ""]);
  };

  const handleRemovePhone = (index: number) => {
    triggerHaptic("light");
    setPhones((prev) => {
      if (prev.length <= 1) return [""];
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    triggerHaptic("medium");

    const cleanPhones = phones.map((p) => p.trim()).filter(Boolean);

    try {
      await onSave({
        id: editingSupplier?.id,
        name: name.trim(),
        phones: cleanPhones,
        phone: cleanPhones[0] || null,
        whatsapp: whatsapp.trim() || null,
        website: website.trim() || null,
        instagram: instagram.trim() || null,
        address: address.trim() || null,
        notes: notes.trim() || null,
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
      desktopVariant="modal"
      desktopWidth="sm:max-w-xl"
      maxHeight="max-h-[92dvh] sm:max-h-[88vh]"
      className="bg-white"
    >
      <div className="flex flex-col h-full w-full max-w-full overflow-hidden overflow-x-hidden">
        {/* Шапка */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20 shrink-0 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                {editingSupplier ? t.editTitle : t.createTitle}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold truncate">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 rounded border border-slate-200">
              Esc
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
              title={t.closeTooltip}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Форма */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto overflow-x-hidden w-full max-w-full touch-pan-y [touch-action:pan-y] overscroll-contain flex-1"
        >
          {/* Название компании */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              {t.nameLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition box-border"
            />
          </div>

          {/* Телефоны (динамический список) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">
                {t.phonesLabel}
              </label>
              <button
                type="button"
                onClick={handleAddPhone}
                className="text-[11px] font-extrabold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{t.addPhoneButton}</span>
              </button>
            </div>

            <div className="space-y-2">
              {phones.map((phoneVal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <PhoneInput
                      value={phoneVal}
                      onChange={(val) => handlePhoneChange(index, val)}
                      placeholder={t.phonePlaceholder}
                      className="bg-slate-50 focus:bg-white"
                    />
                  </div>
                  {phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(index)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                      title="Удалить номер"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              {t.whatsappLabel}
            </label>
            <PhoneInput
              value={whatsapp}
              onChange={(val) => setWhatsapp(val)}
              placeholder={t.phonePlaceholder}
              showIcon={false}
              className="bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Сайт и Инстаграм (в 2 колонки на sm) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                {t.websiteLabel}
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder={t.websitePlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
              />
            </div>

            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                {t.instagramLabel}
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder={t.instagramPlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
              />
            </div>
          </div>

          {/* Адрес офиса / склада */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              {t.addressLabel}
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.addressPlaceholder}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
              />
            </div>
          </div>

          {/* Заметки */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              {t.notesLabel}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-orange-500 outline-none resize-none box-border shadow-2xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs transition cursor-pointer active:scale-95"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting ? t.saving : editingSupplier ? t.update : t.save}
              </span>
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
}
