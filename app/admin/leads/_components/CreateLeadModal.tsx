"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { UserPlus, X, Calendar, Clock, MapPin, User, Phone, FileText, ArrowRight } from "lucide-react";
import { PartnerName } from "@prisma/client";
import { triggerHaptic } from "@/lib/haptics";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newLeadName: string;
  setNewLeadName: (val: string) => void;
  newLeadPhone: string;
  setNewLeadPhone: (val: string) => void;
  newLeadManager: string;
  setNewLeadManager: (val: any) => void;
  newLeadAppDate: string;
  setNewLeadAppDate: (val: string) => void;
  newLeadDeadline: string;
  setNewLeadDeadline: (val: string) => void;
  newLeadAddress: string;
  setNewLeadAddress: (val: string) => void;
  newLeadComment: string;
  setNewLeadComment: (val: string) => void;
  isCreatingLead: boolean;
}

export default function CreateLeadModal({
  isOpen,
  onClose,
  onSubmit,
  newLeadName,
  setNewLeadName,
  newLeadPhone,
  setNewLeadPhone,
  newLeadManager,
  setNewLeadManager,
  newLeadAppDate,
  setNewLeadAppDate,
  newLeadDeadline,
  setNewLeadDeadline,
  newLeadAddress,
  setNewLeadAddress,
  newLeadComment,
  setNewLeadComment,
  isCreatingLead,
}: CreateLeadModalProps) {
  const dragControls = useDragControls();

  useEffect(() => {
    if (isOpen) {
      lockScroll("create-lead-modal");
      return () => unlockScroll("create-lead-modal");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Оверлей затемнения с блюром */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            triggerHaptic("light");
            onClose();
          }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
        />

        {/* ── Нативная мобильная шторка (Bottom Sheet) / Десктопная модалка ── */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 350 }}
          drag="y"
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.3 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 90 || info.velocity.y > 400) {
              triggerHaptic("light");
              onClose();
            }
          }}
          className="relative w-full max-w-xl bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 flex flex-col h-[90dvh] max-h-[90dvh] sm:h-auto sm:max-h-[85vh] text-slate-900"
        >
          {/* Верхняя панель со свайпом (Зона Drag) */}
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className="pt-3 px-5 sm:px-6 pb-3 border-b border-slate-100 bg-slate-50/80 shrink-0 select-none cursor-grab active:cursor-grabbing touch-none"
          >
            {/* Язычок свайпа для мобилок */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-2 sm:hidden shrink-0" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center shadow-2xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                    Новая заявка / Сделка
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Регистрация входящего лида и назначение замера
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onClose();
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Форма скроллируемая внутри шторки */}
          <form
            onSubmit={onSubmit}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Имя и Телефон */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  ФИО / Имя заказчика *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Азамат Жумабеков"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-base sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 transition text-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Номер телефона (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+7 (701) 000-00-00"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-base sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 transition text-slate-900 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Адрес объекта */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                Адрес замера / Фасада
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ТРЦ Ардагер / пр. Абылай Хана 45..."
                  value={newLeadAddress}
                  onChange={(e) => setNewLeadAddress(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-base sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 transition text-slate-900 shadow-2xs"
                />
              </div>
            </div>

            {/* Сроки и Замер */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Дата и время замера
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="datetime-local"
                    value={newLeadAppDate}
                    onChange={(e) => setNewLeadAppDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-base sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 transition text-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Срок сдачи (Дедлайн)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={newLeadDeadline}
                    onChange={(e) => setNewLeadDeadline(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-base sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 transition text-slate-900 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Ответственный партнер */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                Ответственный
              </label>
              <select
                value={newLeadManager}
                onChange={(e) => setNewLeadManager(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 transition text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="">Не назначен</option>
                <option value={PartnerName.DANIIL}>Даниил</option>
                <option value={PartnerName.ELISEY}>Елисей</option>
              </select>
            </div>

            {/* Заметки / Техзадание */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                Описание задачи / Комментарий
              </label>
              <textarea
                rows={3}
                placeholder="Световые объемные буквы 40см, акрил день-ночь, блок питания 200W..."
                value={newLeadComment}
                onChange={(e) => setNewLeadComment(e.target.value)}
                className="w-full p-3 text-base sm:text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 transition text-slate-900 shadow-2xs resize-none"
              />
            </div>

            {/* Кнопки */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onClose();
                }}
                disabled={isCreatingLead}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Отмена
              </button>

              <button
                type="submit"
                disabled={isCreatingLead}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-md shadow-orange-500/20 transition active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isCreatingLead ? (
                  "Создание..."
                ) : (
                  <>
                    <span>Создать сделку</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
