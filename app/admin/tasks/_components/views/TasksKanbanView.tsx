"use client";

import React, { useState, useMemo, useCallback } from "react";
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { updateTaskStage } from "../../actions";
import { 
  CrmTaskItem, 
  TaskStage, 
  TaskFilterAssignee 
} from "../../_types/taskTypes";
import { TASKS_DICTIONARY } from "../../_data/tasksDictionary";
import TaskCard from "../TaskCard";

interface TasksKanbanViewProps {
  tasks: CrmTaskItem[];
  onOpenExpenseModal: (task: CrmTaskItem) => void;
  onOpenQuickCreate: (stage: TaskStage) => void;
  onOpenDetailModal?: (task: CrmTaskItem) => void;
  onRefresh: () => void;
}

const KANBAN_STAGES: readonly TaskStage[] = [
  "MEASUREMENT",
  "SUPPLY",
  "PRODUCTION",
  "ASSEMBLY",
  "INSTALLATION",
  "HANDOVER",
] as const;

const STAGE_HEADERS: Record<TaskStage, { icon: string; color: string }> = {
  MEASUREMENT: { icon: "📐", color: "border-blue-300 bg-blue-50 text-blue-900" },
  SUPPLY: { icon: "🛒", color: "border-amber-300 bg-amber-50 text-amber-900" },
  PRODUCTION: { icon: "⚙️", color: "border-purple-300 bg-purple-50 text-purple-900" },
  ASSEMBLY: { icon: "🔨", color: "border-indigo-300 bg-indigo-50 text-indigo-900" },
  INSTALLATION: { icon: "🏗️", color: "border-orange-300 bg-orange-50 text-orange-900" },
  HANDOVER: { icon: "🤝", color: "border-emerald-300 bg-emerald-50 text-emerald-900" },
  GENERAL: { icon: "📌", color: "border-slate-300 bg-slate-50 text-slate-900" },
};

export default function TasksKanbanView({
  tasks,
  onOpenExpenseModal,
  onOpenQuickCreate,
  onOpenDetailModal,
  onRefresh,
}: TasksKanbanViewProps) {
  const dict = TASKS_DICTIONARY;
  const [assigneeFilter, setAssigneeFilter] = useState<TaskFilterAssignee>("ALL");

  // 1. Фильтрация по исполнителю
  const filteredTasks = useMemo(() => {
    if (assigneeFilter === "ALL") return tasks;
    return tasks.filter((t) => {
      if (assigneeFilter === "DANIIL") return t.assignee === "DANIIL";
      if (assigneeFilter === "ELISEY") return t.assignee === "ELISEY";
      if (assigneeFilter === "UNASSIGNED") return t.assignee === null;
      return true;
    });
  }, [tasks, assigneeFilter]);

  // 2. Оптимизация O(N): Единая группировка активных задач по колонкам
  const tasksByStage = useMemo(() => {
    const map: Record<TaskStage, CrmTaskItem[]> = {
      MEASUREMENT: [],
      SUPPLY: [],
      PRODUCTION: [],
      ASSEMBLY: [],
      INSTALLATION: [],
      HANDOVER: [],
      GENERAL: [],
    };

    for (const t of filteredTasks) {
      if (t.status !== "DONE" && map[t.stage]) {
        map[t.stage].push(t);
      }
    }

    return map;
  }, [filteredTasks]);

  const handleMoveStage = useCallback(async (taskId: string, nextStage: TaskStage) => {
    triggerHaptic("medium");
    const res = await updateTaskStage(taskId, nextStage);
    if (!res.success && "error" in res) {
      toast.error(res.error);
    } else {
      toast.success(dict.toasts.stageUpdated);
      onRefresh();
    }
  }, [dict.toasts.stageUpdated, onRefresh]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* ── ТУЛБАР ФИЛЬТРА ПО ИСПОЛНИТЕЛЮ ── */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="inline-flex bg-slate-100 p-1 rounded-2xl select-none max-w-full overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => { triggerHaptic("light"); setAssigneeFilter("ALL"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              assigneeFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {dict.assignees.ALL}
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic("light"); setAssigneeFilter("DANIIL"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              assigneeFilter === "DANIIL" ? "bg-white text-blue-700 shadow-2xs font-extrabold" : "text-slate-500 hover:text-blue-700"
            }`}
          >
            {dict.assignees.DANIIL}
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic("light"); setAssigneeFilter("ELISEY"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              assigneeFilter === "ELISEY" ? "bg-white text-orange-700 shadow-2xs font-extrabold" : "text-slate-500 hover:text-orange-700"
            }`}
          >
            {dict.assignees.ELISEY}
          </button>
        </div>

        <span className="text-xs font-bold text-slate-400 hidden sm:inline">
          Пайплайн наружной рекламы
        </span>
      </div>

      {/* ── ГОРИЗОНТАЛЬНАЯ КАНБАН-ДОСКА (6 КОЛОНОК) ── */}
      <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-6 pt-1 items-start snap-x snap-mandatory">
        {KANBAN_STAGES.map((stageKey, colIdx) => {
          const stageTasks = tasksByStage[stageKey] || [];
          const header = STAGE_HEADERS[stageKey];
          const prevStage = colIdx > 0 ? KANBAN_STAGES[colIdx - 1] : null;
          const nextStage = colIdx < KANBAN_STAGES.length - 1 ? KANBAN_STAGES[colIdx + 1] : null;

          return (
            <div
              key={stageKey}
              className="w-72 sm:w-80 shrink-0 bg-slate-50/80 rounded-3xl p-3 border border-slate-200/80 space-y-3 snap-start flex flex-col max-h-[75vh]"
            >
              {/* Шапка колонки */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="text-base">{header.icon}</span>
                  <div>
                    <h4 className="font-black text-xs text-slate-900 leading-tight">
                      {dict.kanbanStages[stageKey]}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold block">
                      {dict.stageDescriptions[stageKey]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200/90 text-slate-700 font-extrabold text-[10px] flex items-center justify-center font-mono">
                    {stageTasks.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      onOpenQuickCreate(stageKey);
                    }}
                    aria-label={`Добавить задачу в этап ${dict.kanbanStages[stageKey]}`}
                    className="w-6 h-6 rounded-lg bg-white hover:bg-orange-50 text-slate-400 hover:text-orange-600 flex items-center justify-center shadow-2xs border border-slate-200 transition cursor-pointer"
                    title="+ Добавить в этот этап"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Карточки колонки скроллируемые */}
              <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1 pr-1">
                {stageTasks.map((t) => (
                  <div key={t.id} className="relative group">
                    <TaskCard
                      task={t}
                      onOpenExpenseModal={onOpenExpenseModal}
                      onOpenDetailModal={onOpenDetailModal}
                      onRefresh={onRefresh}
                    />

                    {/* Быстрые стрелочки перемещения этапа */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-xs border border-slate-200 z-10">
                      {prevStage && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStage(t.id, prevStage);
                          }}
                          aria-label={`Вернуть на «${dict.kanbanStages[prevStage]}»`}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 cursor-pointer"
                          title={`Вернуть на «${dict.kanbanStages[prevStage]}»`}
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      )}
                      {nextStage && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStage(t.id, nextStage);
                          }}
                          aria-label={`Перевести на «${dict.kanbanStages[nextStage]}»`}
                          className="p-1 hover:bg-orange-50 rounded text-slate-500 hover:text-orange-600 cursor-pointer"
                          title={`Перевести на «${dict.kanbanStages[nextStage]}»`}
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageTasks.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200/80 rounded-2xl text-[11px] text-slate-400 font-semibold">
                    Нет активных задач
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
