"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { 
  CrmTaskItem, 
  TasksViewMode, 
  TaskStage 
} from "../_types/taskTypes";
import TasksTabBar from "./TasksTabBar";
import TasksAgendaView from "./views/TasksAgendaView";
import TasksKanbanView from "./views/TasksKanbanView";
import TasksCalendarView from "./views/TasksCalendarView";

// Ленивые модальные окна
const TaskQuickCreateModal = dynamic(() => import("./TaskQuickCreateModal"), { ssr: false });
const TaskExpenseModal = dynamic(() => import("./TaskExpenseModal"), { ssr: false });

interface TasksDashboardProps {
  tasks: CrmTaskItem[];
  leads: { id: string; name: string; phone: string; address?: string | null }[];
  accounts: { id: string; name: string; balance: number }[];
  categories: { id: string; name: string }[];
}

export default function TasksDashboard({
  tasks = [],
  leads = [],
  accounts = [],
  categories = [],
}: TasksDashboardProps) {
  const router = useRouter();

  const [viewMode, setViewMode] = useState<TasksViewMode>("AGENDA");

  // Модальные окна
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDefaultStage, setCreateDefaultStage] = useState<TaskStage>("GENERAL");
  const [expenseTask, setExpenseTask] = useState<CrmTaskItem | null>(null);

  const handleRefresh = () => {
    router.refresh();
  };

  const handleOpenCreateForStage = (stage: TaskStage) => {
    setCreateDefaultStage(stage);
    setIsCreateOpen(true);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16">
      {/* ── ТАБ-БАР РЕЖИМОВ ПЛАНИРОВАНИЯ ── */}
      <TasksTabBar
        currentTab={viewMode}
        onChangeTab={setViewMode}
        onOpenCreate={() => {
          setCreateDefaultStage("GENERAL");
          setIsCreateOpen(true);
        }}
      />

      {/* ── РЕЖИМ 1: ФОКУС ДНЯ (THINGS 3 STYLE) ── */}
      {viewMode === "AGENDA" && (
        <TasksAgendaView
          tasks={tasks}
          onOpenExpenseModal={(t) => setExpenseTask(t)}
          onRefresh={handleRefresh}
        />
      )}

      {/* ── РЕЖИМ 2: КАНБАН ЦЕХА (LINEAR STYLE) ── */}
      {viewMode === "KANBAN" && (
        <TasksKanbanView
          tasks={tasks}
          onOpenExpenseModal={(t) => setExpenseTask(t)}
          onOpenQuickCreate={handleOpenCreateForStage}
          onRefresh={handleRefresh}
        />
      )}

      {/* ── РЕЖИМ 3: КАЛЕНДАРЬ ВЫЕЗДОВ (TIMELINE) ── */}
      {viewMode === "CALENDAR" && (
        <TasksCalendarView
          tasks={tasks}
          onOpenExpenseModal={(t) => setExpenseTask(t)}
          onRefresh={handleRefresh}
        />
      )}

      {/* ── ЛЕНИВАЯ МОДАЛКА СОЗДАНИЯ ── */}
      {isCreateOpen && (
        <TaskQuickCreateModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          leads={leads}
          defaultStage={createDefaultStage}
          onSuccess={handleRefresh}
        />
      )}

      {/* ── ЛЕНИВАЯ МОДАЛКА СПИСАНИЯ РАСХОДА ── */}
      {expenseTask && (
        <TaskExpenseModal
          isOpen={Boolean(expenseTask)}
          onClose={() => setExpenseTask(null)}
          task={expenseTask}
          accounts={accounts}
          categories={categories}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
