"use client";

import React, { useState, useMemo } from "react";
import { 
  Flame, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Search, 
  X
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { 
  CrmTaskItem, 
  TaskFilterAssignee
} from "../../_types/taskTypes";
import { TASKS_DICTIONARY } from "../../_data/tasksDictionary";
import TaskCard from "../TaskCard";

interface TasksAgendaViewProps {
  tasks: CrmTaskItem[];
  onOpenExpenseModal: (task: CrmTaskItem) => void;
  onOpenDetailModal?: (task: CrmTaskItem) => void;
  onRefresh: () => void;
}

export default function TasksAgendaView({
  tasks,
  onOpenExpenseModal,
  onOpenDetailModal,
  onRefresh,
}: TasksAgendaViewProps) {
  const dict = TASKS_DICTIONARY;

  const [assigneeFilter, setAssigneeFilter] = useState<TaskFilterAssignee>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  // Фильтрация
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // 1. Фильтр исполнителя
      if (assigneeFilter === "DANIIL" && t.assignee !== "DANIIL") return false;
      if (assigneeFilter === "ELISEY" && t.assignee !== "ELISEY") return false;
      if (assigneeFilter === "UNASSIGNED" && t.assignee !== null) return false;

      // 2. Поиск
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchLead = (t.lead?.name || "").toLowerCase().includes(q);
        const matchAddress = (t.lead?.address || "").toLowerCase().includes(q);
        if (!matchTitle && !matchLead && !matchAddress) return false;
      }

      return true;
    });
  }, [tasks, assigneeFilter, searchQuery]);

  // Разделение по секциям за 1 проход O(N)
  const { urgentTasks, upcomingTasks, noDateTasks, completedTasks } = useMemo(() => {
    const urgent: CrmTaskItem[] = [];
    const upcoming: CrmTaskItem[] = [];
    const noDate: CrmTaskItem[] = [];
    const done: CrmTaskItem[] = [];

    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

    for (const t of filteredTasks) {
      if (t.status === "DONE") {
        done.push(t);
        continue;
      }

      if (!t.dueDate) {
        noDate.push(t);
        continue;
      }

      const dueTime = new Date(t.dueDate).getTime();
      if (dueTime <= todayEnd || t.priority === "URGENT") {
        urgent.push(t);
      } else {
        upcoming.push(t);
      }
    }

    return {
      urgentTasks: urgent,
      upcomingTasks: upcoming,
      noDateTasks: noDate,
      completedTasks: done,
    };
  }, [filteredTasks]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* ── ТУЛБАР: ФИЛЬТР ИСПОЛНИТЕЛЯ И ПОИСК ── */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Исполнители */}
        <div className="inline-flex bg-slate-100 p-1 rounded-2xl select-none max-w-full overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => { triggerHaptic("light"); setAssigneeFilter("ALL"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              assigneeFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {dict.assignees.ALL} ({tasks.length})
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
          <button
            type="button"
            onClick={() => { triggerHaptic("light"); setAssigneeFilter("UNASSIGNED"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              assigneeFilter === "UNASSIGNED" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {dict.assignees.UNASSIGNED}
          </button>
        </div>

        {/* Поиск */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={dict.header.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-9 pr-8 py-2 text-base sm:text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Очистить поиск"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── 1. СЕКЦИЯ: ГОРИТ СЕГОДНЯ И ПРОСРОЧЕНО ── */}
      {urgentTasks.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 px-1">
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <h3 className="text-xs sm:text-sm font-black text-rose-950 uppercase tracking-wider">
              {dict.agendaSections.urgentToday} ({urgentTasks.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {urgentTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onOpenExpenseModal={onOpenExpenseModal}
                onOpenDetailModal={onOpenDetailModal}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── 2. СЕКЦИЯ: ПРЕДСТОЯЩИЕ НА ЭТОЙ НЕДЕЛЕ ── */}
      {upcomingTasks.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center gap-2 px-1">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
              {dict.agendaSections.upcoming} ({upcomingTasks.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcomingTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onOpenExpenseModal={onOpenExpenseModal}
                onOpenDetailModal={onOpenDetailModal}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── 3. СЕКЦИЯ: БЕЗ ТОЧНОЙ ДАТЫ / ХОЗЯЙСТВЕННЫЕ ── */}
      {noDateTasks.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center gap-2 px-1">
            <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
              {dict.agendaSections.noDate} ({noDateTasks.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {noDateTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onOpenExpenseModal={onOpenExpenseModal}
                onOpenDetailModal={onOpenDetailModal}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── 4. СЕКЦИЯ: ЗАВЕРШЕННЫЕ ── */}
      {completedTasks.length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setShowCompleted((p) => !p);
            }}
            className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {dict.agendaSections.completed} ({completedTasks.length})
            </span>
            <span className="text-[10px] text-slate-400">
              {showCompleted ? "• Скрыть" : "• Показать"}
            </span>
          </button>

          {showCompleted && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 animate-in fade-in duration-100">
              {completedTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onOpenExpenseModal={onOpenExpenseModal}
                  onOpenDetailModal={onOpenDetailModal}
                  onRefresh={onRefresh}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Пустое состояние */}
      {filteredTasks.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 font-medium text-xs">
          {dict.agendaSections.emptyAgenda}
        </div>
      )}
    </div>
  );
}
