"use client";

import React, { useState } from "react";
import { Plus, X, Calendar, User, Layers, CheckSquare, Trash2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { createTask } from "../actions";
import { 
  TaskStage, 
  TaskPriority, 
  PartnerName 
} from "../_types/taskTypes";
import { TASKS_DICTIONARY } from "../_data/tasksDictionary";
import BottomSheet from "@/components/ui/BottomSheet";

interface TaskQuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: { id: string; name: string; phone: string; address?: string | null }[];
  defaultStage?: TaskStage;
  defaultLeadId?: string | null;
  onSuccess?: () => void;
}

export default function TaskQuickCreateModal({
  isOpen,
  onClose,
  leads = [],
  defaultStage = "GENERAL",
  defaultLeadId = null,
  onSuccess,
}: TaskQuickCreateModalProps) {
  const dict = TASKS_DICTIONARY.modals;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<TaskStage>(defaultStage);
  const [priority, setPriority] = useState<TaskPriority>("NORMAL");
  const [assignee, setAssignee] = useState<PartnerName | "">("");
  const [leadId, setLeadId] = useState<string>(defaultLeadId || "");
  const [dueDate, setDueDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  
  // Чек-лист подпунктов
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [...prev, newSubtask.trim()]);
    setNewSubtask("");
  };

  const handleRemoveSubtask = (idx: number) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Укажите название задачи");
      return;
    }

    setIsSubmitting(true);
    triggerHaptic("medium");

    try {
      const res = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        stage,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        assignee: assignee ? (assignee as PartnerName) : null,
        leadId: leadId || null,
        subtaskTitles: subtasks,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(TASKS_DICTIONARY.toasts.created);
        setTitle("");
        setDescription("");
        setSubtasks([]);
        onClose();
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      desktopVariant="modal"
      desktopWidth="sm:w-[500px]"
    >
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Заголовок */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/80">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {dict.createTitle}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {dict.createSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Название */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.titleLabel}
          </label>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={dict.titlePlaceholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-base sm:text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition"
          />
        </div>

        {/* Этап и Приоритет */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              {dict.stageLabel}
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as TaskStage)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-orange-500 transition"
            >
              {Object.entries(TASKS_DICTIONARY.kanbanStages).map(([st, name]) => (
                <option key={st} value={st}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              {dict.priorityLabel}
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-orange-500 transition"
            >
              {Object.entries(TASKS_DICTIONARY.priorities).map(([pr, name]) => (
                <option key={pr} value={pr}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ответственный и Срок */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              {dict.assigneeLabel}
            </label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-orange-500 transition"
            >
              <option value="">Не назначен (Общая)</option>
              <option value="DANIIL">Даниил</option>
              <option value="ELISEY">Елисей</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              {dict.dueDateLabel}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Привязка к заказу */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.leadLabel}
          </label>
          <select
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-orange-500 transition"
          >
            <option value="">{dict.leadPlaceholder}</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                Заказ: {l.name} {l.address ? `• 📍 ${l.address}` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Описание / Заметки */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.descLabel}
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={dict.descPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-base sm:text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition resize-none"
          />
        </div>

        {/* Чек-лист подпунктов */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.subtasksLabel}
          </label>
          
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder={dict.subtaskPlaceholder}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-base sm:text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-orange-500"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Добавить
            </button>
          </div>

          {subtasks.length > 0 && (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pl-1">
              {subtasks.map((st, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 px-2.5 bg-slate-50 rounded-xl">
                  <span className="font-semibold text-slate-700 truncate">{st}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(i)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Кнопка сохранения */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-md shadow-orange-600/25 active:scale-98 transition cursor-pointer disabled:opacity-50 touch-manipulation"
          >
            {isSubmitting ? "Создание..." : dict.saveBtn}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
