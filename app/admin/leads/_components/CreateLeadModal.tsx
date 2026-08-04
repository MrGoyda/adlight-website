"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, Calendar, Clock } from "lucide-react";
import { LeadStatus, PartnerName } from "@prisma/client";
import Button from "@/components/ui/Button";
import { triggerHaptic } from "@/lib/haptics";
import { crmDict } from "@/dictionaries/crm";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newLeadName: string;
  setNewLeadName: (val: string) => void;
  newLeadPhone: string;
  setNewLeadPhone: (val: string) => void;
  newLeadManager: PartnerName | "";
  setNewLeadManager: (val: PartnerName | "") => void;
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

import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

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
  React.useEffect(() => {
    if (isOpen) {
      lockScroll("create-lead-modal");
      return () => unlockScroll("create-lead-modal");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Overlay с анимацией и блюром */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={() => { triggerHaptic("light"); onClose(); }}
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-8 shadow-apple-modal relative z-10 my-auto max-h-[90dvh] overflow-y-auto scrollbar-hide"
      >
        <button
          type="button"
          onClick={() => { triggerHaptic("light"); onClose(); }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-full transition cursor-pointer active:scale-95 z-50"
        >
          <XCircle className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight">{crmDict.createLeadModal.title}</h3>
        <p className="text-slate-500 text-xs mb-6 font-semibold">
          {crmDict.createLeadModal.subtitle}
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {crmDict.createLeadModal.fioLabel}
              </label>
              <input
                type="text"
                required
                value={newLeadName}
                onChange={(e) => setNewLeadName(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
                placeholder="Алексей Иванов"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {crmDict.createLeadModal.phoneLabel}
              </label>
              <input
                type="text"
                required
                value={newLeadPhone}
                onChange={(e) => setNewLeadPhone(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
                placeholder="+77071112233"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {crmDict.createLeadModal.managerLabel}
            </label>
            <div className="relative">
              <select
                value={newLeadManager}
                onChange={(e) => setNewLeadManager(e.target.value as PartnerName | "")}
                className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-700 font-bold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10 appearance-none cursor-pointer"
              >
                <option value="">{crmDict.createLeadModal.notAssigned}</option>
                <option value="DANIIL">Даниил</option>
                <option value="ELISEY">Елисей</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-400 font-bold">▼</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" /> {crmDict.createLeadModal.appointmentLabel}
              </label>
              <input
                type="datetime-local"
                value={newLeadAppDate}
                onChange={(e) => setNewLeadAppDate(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2 px-3 text-slate-700 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-500" /> {crmDict.createLeadModal.deadlineLabel}
              </label>
              <input
                type="date"
                value={newLeadDeadline}
                onChange={(e) => setNewLeadDeadline(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2 px-3 text-slate-700 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {crmDict.createLeadModal.addressLabel}
            </label>
            <input
              type="text"
              value={newLeadAddress}
              onChange={(e) => setNewLeadAddress(e.target.value)}
              className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
              placeholder="г. Астана, ул. Сарыарка, 12..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {crmDict.createLeadModal.notesLabel}
            </label>
            <textarea
              rows={2}
              value={newLeadComment}
              onChange={(e) => setNewLeadComment(e.target.value)}
              className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl p-3 text-slate-900 font-medium focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10 leading-relaxed"
              placeholder="Дополнительные заметки..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => { triggerHaptic("light"); onClose(); }}
              variant="lightOutline"
              className="flex-1 py-3 text-xs font-bold text-slate-650"
            >
              {crmDict.createLeadModal.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isCreatingLead}
              variant="solid"
              className="flex-1 py-3 text-xs font-extrabold bg-gradient-to-r from-orange-600 to-red-600 shadow-md"
            >
              {isCreatingLead ? crmDict.createLeadModal.creating : crmDict.createLeadModal.createBtn}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
