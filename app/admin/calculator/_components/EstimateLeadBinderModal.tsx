"use client";

import React, { useState } from "react";
import { X, Link2, UserPlus } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { SpreadsheetItem } from "../_types/calculatorTypes";
import { saveEstimateToLead, createLeadFromEstimate } from "../calculatorActions";
import { toast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/haptics";
import { useRouter } from "next/navigation";

interface EstimateLeadBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SpreadsheetItem[];
  leads: Array<{ id: string; name: string; phone: string; status: string }>;
  currentLeadId?: string | null;
  onSavedSuccess?: () => void;
}

export default function EstimateLeadBinderModal({
  isOpen,
  onClose,
  items,
  leads,
  currentLeadId,
  onSavedSuccess,
}: EstimateLeadBinderModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"existing" | "new">(currentLeadId ? "existing" : "existing");
  const [selectedLeadId, setSelectedLeadId] = useState<string>(currentLeadId || leads[0]?.id || "");
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadAddress, setNewLeadAddress] = useState("");
  const [newLeadComment, setNewLeadComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Смета пуста, нечего привязывать");
      return;
    }

    setIsSubmitting(true);
    triggerHaptic("medium");

    const estimateItemsPayload = items.map((i) => ({
      type: i.type,
      name: i.name,
      quantity: Number(i.quantity) || 1,
      unit: i.unit,
      costPrice: Number(i.costPrice) || 0,
      sellPrice: Number(i.sellPrice) || 0,
      warehouseItemId: i.warehouseItemId,
    }));

    if (mode === "existing") {
      if (!selectedLeadId) {
        toast.error("Выберите сделку из списка");
        setIsSubmitting(false);
        return;
      }
      const res = await saveEstimateToLead(selectedLeadId, estimateItemsPayload);
      setIsSubmitting(false);
      if (res.success) {
        toast.success("Смета успешно привязана к сделке!");
        onSavedSuccess?.();
        onClose();
        router.refresh();
      } else {
        toast.error(res.error || "Не удалось привязать смету");
      }
    } else {
      if (!newLeadName.trim() || !newLeadPhone.trim()) {
        toast.error("Заполните имя и номер телефона клиента");
        setIsSubmitting(false);
        return;
      }
      const res = await createLeadFromEstimate(
        {
          name: newLeadName,
          phone: newLeadPhone,
          address: newLeadAddress,
          comment: newLeadComment,
        },
        estimateItemsPayload
      );
      setIsSubmitting(false);
      if (res.success) {
        toast.success(`Создана новая сделка: ${newLeadName}`);
        onSavedSuccess?.();
        onClose();
        router.refresh();
      } else {
        toast.error(res.error || "Не удалось создать сделку");
      }
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      desktopVariant="modal"
      desktopWidth="w-[480px]"
    >
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Привязка сметы к CRM</h3>
            <p className="text-[11px] text-slate-500">
              Сохраните расчет ({items.length} поз.) в сделку
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Переключатель режимов */}
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === "existing"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>В текущую сделку</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === "new"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Создать новый лид</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {mode === "existing" ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Выберите активную сделку из CRM *
              </label>
              {leads.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Нет активных сделок в статусе Новая / В работе</p>
              ) : (
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-white"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.phone})
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Имя клиента / Компания *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Например: Кафе Арабика / Айдар"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Телефон клиента *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="+7 (707) 000-00-00"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Адрес объекта (опционально)
                </label>
                <input
                  type="text"
                  value={newLeadAddress}
                  onChange={(e) => setNewLeadAddress(e.target.value)}
                  placeholder="г. Актау, 14 мкр, дом 5"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Примечание / Комментарий (опционально)
                </label>
                <textarea
                  value={newLeadComment}
                  onChange={(e) => setNewLeadComment(e.target.value)}
                  placeholder="Детали заказа..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition resize-none"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Сохранение..." : mode === "existing" ? "Привязать к сделке" : "Создать сделку и сохранить"}
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
}
