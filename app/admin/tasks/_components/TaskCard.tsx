"use client";

import React, { useState, useEffect, useTransition } from "react";
import { 
  Check, 
  Clock, 
  DollarSign, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  ExternalLink,
  Layers,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { 
  updateTaskStatus, 
  toggleSubtask, 
  deleteTask 
} from "../actions";
import { 
  CrmTaskItem, 
  TaskStatus, 
  TaskStage, 
  TaskPriority 
} from "../_types/taskTypes";
import { TASKS_DICTIONARY } from "../_data/tasksDictionary";

interface TaskCardProps {
  task: CrmTaskItem;
  onOpenExpenseModal: (task: CrmTaskItem) => void;
  onOpenDetailModal?: (task: CrmTaskItem) => void;
  onRefresh: () => void;
}

const STAGE_COLORS: Record<TaskStage, { bg: string; text: string; border: string }> = {
  MEASUREMENT: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  SUPPLY: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  PRODUCTION: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  ASSEMBLY: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  INSTALLATION: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  HANDOVER: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  GENERAL: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
};

const PRIORITY_BADGES: Record<TaskPriority, { text: string; dot: string }> = {
  URGENT: { text: "text-rose-700 bg-rose-50 border-rose-200", dot: "bg-rose-500" },
  HIGH: { text: "text-orange-700 bg-orange-50 border-orange-200", dot: "bg-orange-500" },
  NORMAL: { text: "text-slate-700 bg-slate-50 border-slate-200", dot: "bg-slate-400" },
  LOW: { text: "text-slate-500 bg-slate-50 border-slate-200", dot: "bg-slate-300" },
};

function TaskCardComponent({
  task,
  onOpenExpenseModal,
  onOpenDetailModal,
  onRefresh,
}: TaskCardProps) {
  const dict = TASKS_DICTIONARY;
  const [, startTransition] = useTransition();

  // Оптимистичный локальный статус и подзадачи
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(task.status);
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Синхронизация при обновлении родительских данных
  useEffect(() => {
    setCurrentStatus(task.status);
  }, [task.status]);

  useEffect(() => {
    setSubtasks(task.subtasks);
  }, [task.subtasks]);

  const isDone = currentStatus === "DONE";
  const stageStyle = STAGE_COLORS[task.stage] || STAGE_COLORS.GENERAL;
  const priorityStyle = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.NORMAL;

  // Проверка просроченности
  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj ? (!isDone && dueDateObj.getTime() < Date.now()) : false;
  const isToday = dueDateObj ? new Date().toDateString() === dueDateObj.toDateString() : false;

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("medium");
    const nextStatus = isDone ? "TODO" : "DONE";
    setCurrentStatus(nextStatus);

    startTransition(async () => {
      const res = await updateTaskStatus(task.id, nextStatus);
      if (!res.success && "error" in res) {
        toast.error(res.error);
        setCurrentStatus(task.status);
      } else {
        onRefresh();
      }
    });
  };

  const handleToggleSubtask = async (subtaskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    const target = subtasks.find((s) => s.id === subtaskId);
    if (!target) return;

    const nextCompleted = !target.isCompleted;
    setSubtasks((prev) =>
      prev.map((s) => (s.id === subtaskId ? { ...s, isCompleted: nextCompleted } : s))
    );

    const res = await toggleSubtask(subtaskId, nextCompleted);
    if (!res.success && "error" in res) {
      toast.error(res.error);
      setSubtasks(task.subtasks);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("warning");
    if (!window.confirm("Удалить эту задачу?")) return;

    setIsDeleting(true);
    const res = await deleteTask(task.id);
    if (!res.success && "error" in res) {
      toast.error(res.error);
      setIsDeleting(false);
    } else {
      toast.success(dict.toasts.deleted);
      onRefresh();
    }
  };

  const completedSubtasksCount = subtasks.filter((s) => s.isCompleted).length;

  return (
    <div
      onClick={() => onOpenDetailModal?.(task)}
      className={`p-4 rounded-3xl border transition-all duration-150 select-none bg-white relative group space-y-3 cursor-pointer ${
        isDone 
          ? "border-slate-200/70 bg-slate-50/50 opacity-75" 
          : isOverdue 
            ? "border-rose-300 ring-2 ring-rose-500/10 shadow-xs hover:border-rose-400" 
            : "border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs"
      }`}
    >
      {/* ── ВЕРХНЯЯ СТРОКА: ЧЕКБОКС + ЗАГОЛОВОК + ДЕЙСТВИЯ ── */}
      <div className="flex items-start gap-3">
        {/* Микро-чекбокс с тактильным кругом */}
        <button
          type="button"
          onClick={handleToggleComplete}
          aria-label={isDone ? "Вернуть в работу" : "Отметить выполненной"}
          className={`w-6 h-6 rounded-xl flex items-center justify-center border transition-all shrink-0 mt-0.5 cursor-pointer touch-manipulation active:scale-90 ${
            isDone
              ? "bg-emerald-600 border-emerald-600 text-white shadow-xs shadow-emerald-600/30"
              : "border-slate-300 hover:border-orange-500 bg-white"
          }`}
          title={isDone ? "Вернуть в работу" : "Отметить выполненной"}
        >
          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Заголовок и привязка к сделке */}
        <div className="min-w-0 flex-1">
          <h4
            className={`font-black text-xs sm:text-sm leading-snug transition ${
              isDone ? "line-through text-slate-400" : "text-slate-900"
            }`}
          >
            {task.title}
          </h4>

          {/* Связанный заказ */}
          {task.lead && (
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <a
                href={`/admin/leads?search=${encodeURIComponent(task.lead.name)}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline max-w-[200px] truncate"
              >
                <span>📦 {task.lead.name}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>

              {task.lead.address && (
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">
                  • 📍 {task.lead.address}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Удаление */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={dict.actions.delete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
          title={dict.actions.delete}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── ТЕГИ И БЕЙДЖИ (ЭТАП, ДЕДЛАЙН, ИСПОЛНИТЕЛЬ, БЮДЖЕТ) ── */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-extrabold pt-1">
        {/* Этап производства */}
        <span
          className={`px-2 py-0.5 rounded-full border ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}
        >
          {dict.kanbanStages[task.stage] || task.stage}
        </span>

        {/* Приоритет */}
        {task.priority !== "NORMAL" && (
          <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${priorityStyle.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
            {dict.priorities[task.priority]}
          </span>
        )}

        {/* Ответственный */}
        {task.assignee ? (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
            <User className="w-2.5 h-2.5 text-slate-400" />
            {dict.assignees[task.assignee] || task.assignee}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 font-medium">
            Общая
          </span>
        )}

        {/* Срок выполнения / Дедлайн */}
        {dueDateObj && (
          <span
            className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isOverdue
                ? "bg-rose-50 text-rose-700 border border-rose-200 font-black"
                : isToday
                  ? "bg-amber-50 text-amber-700 border border-amber-200 font-black"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            <Clock className="w-2.5 h-2.5" />
            {isOverdue ? "Просрочено: " : isToday ? "Сегодня, " : ""}
            {dueDateObj.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
          </span>
        )}

        {/* Автоматически сгенерировано */}
        {task.isAutoGenerated && (
          <span className="px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200/80 text-[9px]">
            ⚡ Авто
          </span>
        )}
      </div>

      {/* ── КНОПКИ ДЕЙСТВИЙ (ФИНАНСЫ & ЧЕК-ЛИСТ) ── */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Кнопка списания расхода */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic("medium");
            onOpenExpenseModal(task);
          }}
          aria-label={dict.actions.recordExpense}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-extrabold text-[11px] transition cursor-pointer active:scale-95 touch-manipulation"
        >
          <DollarSign className="w-3.5 h-3.5 text-rose-500" />
          <span>{dict.actions.recordExpense}</span>
          {task.actualCost && task.actualCost > 0 ? (
            <span className="font-mono text-rose-600 ml-1">
              ({task.actualCost.toLocaleString("ru-RU")}&nbsp;₸)
            </span>
          ) : null}
        </button>

        {/* Аккордеон подпунктов */}
        {subtasks.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic("light");
              setShowSubtasks((prev) => !prev);
            }}
            aria-label="Показать чек-лист подзадач"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer py-1"
          >
            <Layers className="w-3 h-3 text-slate-400" />
            <span>
              {completedSubtasksCount}/{subtasks.length}
            </span>
            {showSubtasks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* ── ВЫПАДАЮЩИЙ ЧЕК-ЛИСТ ПОДПУНКТОВ ── */}
      {showSubtasks && subtasks.length > 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="space-y-1.5 pt-2 pl-2 border-l-2 border-slate-200 animate-in fade-in duration-100"
        >
          {subtasks.map((s) => (
            <div
              key={s.id}
              onClick={(e) => handleToggleSubtask(s.id, e)}
              className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-slate-50 cursor-pointer select-none transition text-xs"
            >
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition shrink-0 ${
                  s.isCompleted
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {s.isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span
                className={`font-semibold transition ${
                  s.isCompleted ? "line-through text-slate-400" : "text-slate-800"
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(TaskCardComponent);
