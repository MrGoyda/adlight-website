"use client";

import React, { useState } from "react";
import { Clock, Send, Trash2, Pencil, Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { crmDict } from "@/dictionaries/crm";
import { triggerHaptic } from "@/lib/haptics";

interface LeadActivityItem {
  id: string;
  createdAt: string;
  text: string;
  author: string | null;
  type: string;
}

interface LeadTimelineProps {
  activities: LeadActivityItem[];
  newNoteText: string;
  onNoteChange: (text: string) => void;
  onAddNote: (e: React.FormEvent) => void;
  onUpdateNote: (activityId: string, text: string) => Promise<boolean>;
  onDeleteNote: (id: string) => void;
  isAddingNote: boolean;
}

export default function LeadTimeline({
  activities,
  newNoteText,
  onNoteChange,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  isAddingNote,
}: LeadTimelineProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const startEditing = (act: LeadActivityItem) => {
    triggerHaptic("light");
    setEditingId(act.id);
    setEditText(act.text);
  };

  const cancelEditing = () => {
    triggerHaptic("light");
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (activityId: string) => {
    if (!editText.trim()) return;
    setIsUpdating(true);
    const ok = await onUpdateNote(activityId, editText.trim());
    if (ok) {
      setEditingId(null);
      setEditText("");
    }
    setIsUpdating(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          {crmDict.leadDetail.timelineTitle}
        </h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {crmDict.leadDetail.timelineSubtitle}
        </p>
      </div>

      {/* Форма добавления заметки */}
      <form onSubmit={onAddNote} className="space-y-3">
        <textarea
          rows={3}
          required
          value={newNoteText}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder={crmDict.leadDetail.timelinePlaceholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 font-medium focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/10 leading-relaxed"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isAddingNote}
            variant="solid"
            size="sm"
            leftIcon={<Send className="w-3.5 h-3.5" />}
            className="text-xs font-black py-2.5 px-5"
          >
            {isAddingNote ? crmDict.leadDetail.addingHistory : crmDict.leadDetail.addHistoryBtn}
          </Button>
        </div>
      </form>

      {/* Список таймлайна */}
      <div className="space-y-4 pt-2">
        {activities.length === 0 ? (
          <div className="p-8 text-center border border-slate-100 rounded-2xl text-slate-400 text-xs italic">
            {crmDict.leadDetail.noHistory}
          </div>
        ) : (
          activities.map((act) => {
            const isEditingThis = editingId === act.id;

            return (
              <div key={act.id} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-100 mt-1" />
                  <div className="w-[2px] bg-slate-100 flex-1 my-1" />
                </div>

                <div className="flex-1 bg-slate-50/60 border border-slate-200/70 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                      {act.author || "Менеджер"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(act.createdAt).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {!isEditingThis && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => startEditing(act)}
                            className="p-1 text-slate-400 hover:text-orange-600 transition cursor-pointer"
                            title={crmDict.leadDetail.editNoteTitle}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteNote(act.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title={crmDict.leadDetail.deleteNoteTitle}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditingThis ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-white border border-orange-300 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 leading-relaxed"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={cancelEditing}
                          disabled={isUpdating}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3 text-slate-400" />
                          {crmDict.leadDetail.cancelEditBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(act.id)}
                          disabled={isUpdating}
                          className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          <Check className="w-3 h-3" />
                          {isUpdating ? "..." : crmDict.leadDetail.saveNoteBtn}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                      {act.text}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
