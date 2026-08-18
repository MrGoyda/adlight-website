"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Clock, MessageSquare, Send, Trash2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";
import { DEFAULT_CHECKLIST_ITEMS } from "../../../_data/leadDetailDictionary";
import { LeadActivityItem, LeadChecklistState } from "../../../_types/leadDetailTypes";

interface LeadTimelineTabProps {
  checklist: LeadChecklistState;
  onToggleChecklistItem: (itemId: string) => void;
  activities: LeadActivityItem[];
  onAddNote: (text: string) => Promise<void>;
  onDeleteActivity: (activityId: string) => void;
  isAddingNote: boolean;
}

export default function LeadTimelineTab({
  checklist,
  onToggleChecklistItem,
  activities,
  onAddNote,
  onDeleteActivity,
  isAddingNote,
}: LeadTimelineTabProps) {
  const [noteText, setNoteText] = useState("");

  const completedCount = DEFAULT_CHECKLIST_ITEMS.filter((item) => checklist[item.id]).length;
  const progressPercent = Math.round((completedCount / DEFAULT_CHECKLIST_ITEMS.length) * 100);

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    triggerHaptic("medium");
    await onAddNote(noteText.trim());
    setNoteText("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 1. Интерактивный Чек-лист готовности заказа */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Чек-лист готовности сделки ({completedCount} из {DEFAULT_CHECKLIST_ITEMS.length})
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Ключевые вехи выполнения заказа
            </p>
          </div>
          <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-200/80">
            {progressPercent}%
          </span>
        </div>

        {/* Прогресс-бар */}
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Список шагов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {DEFAULT_CHECKLIST_ITEMS.map((item) => {
            const isDone = Boolean(checklist[item.id]);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  triggerHaptic(isDone ? "light" : "success");
                  onToggleChecklistItem(item.id);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs font-extrabold transition cursor-pointer flex items-center gap-2.5 active:scale-98 select-none ${
                  isDone
                    ? "bg-emerald-50 text-emerald-950 border-emerald-200/90 shadow-2xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span className={isDone ? "line-through opacity-80" : ""}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Добавление новой заметки в таймлайн */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
          Новая запись в историю сделки
        </label>
        <form onSubmit={handleSubmitNote} className="space-y-2">
          <AutoResizeTextarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Результат звонка, договоренность по встрече, замечания по макету..."
            minHeight={64}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAddingNote || !noteText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs transition cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAddingNote ? "Добавление..." : "Добавить заметку"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Список активностей / Таймлайн */}
      <div className="space-y-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-1">
          История событий ({activities.length})
        </span>

        {activities.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold">
            В истории пока нет записей. Добавьте первую заметку выше.
          </div>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5 relative group"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-black text-slate-800">
                  <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                  <span>{act.author || "Менеджер"}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(act.createdAt).toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("medium");
                      onDeleteActivity(act.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                    title="Удалить запись"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                {act.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
