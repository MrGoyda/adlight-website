"use client";

import React, { useState, useCallback } from "react";
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

  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleOpenCreateForStage = useCallback((stage: TaskStage) => {
    setCreateDefaultStage(stage);
    setIsCreateOpen(true);
  }, []);

  const handleOpenExpenseModal = useCallback((task: CrmTaskItem) => {
    setExpenseTask(task);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateOpen(false);
  }, []);

  const handleCloseExpenseModal = useCallback(() => {
    setExpenseTask(null);
  }, []);

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
          onOpenExpenseModal={handleOpenExpenseModal}
          onRefresh={handleRefresh}
        />
      )}

      {/* ── РЕЖИМ 2: КАНБАН ЦЕХА (LINEAR STYLE) ── */}
      {viewMode === "KANBAN" && (
        <TasksKanbanView
          tasks={tasks}
          onOpenExpenseModal={handleOpenExpenseModal}
          onOpenQuickCreate={handleOpenCreateForStage}
          onRefresh={handleRefresh}
        />
      )}

      {/* ── РЕЖИМ 3: КАЛЕНДАРЬ ВЫЕЗДОВ (TIMELINE) ── */}
      {viewMode === "CALENDAR" && (
        <TasksCalendarView
          tasks={tasks}
          onOpenExpenseModal={handleOpenExpenseModal}
          onRefresh={handleRefresh}
        />
      )}

      {/* ── ЛЕНИВАЯ МОДАЛКА СОЗДАНИЯ ── */}
      {isCreateOpen && (
        <TaskQuickCreateModal
          isOpen={isCreateOpen}
          onClose={handleCloseCreateModal}
          leads={leads}
          defaultStage={createDefaultStage}
          onSuccess={handleRefresh}
        />
      )}

      {/* ── ЛЕНИВАЯ МОДАЛКА СПИСАНИЯ РАСХОДА ── */}
      {expenseTask && (
        <TaskExpenseModal
          isOpen={Boolean(expenseTask)}
          onClose={handleCloseExpenseModal}
          task={expenseTask}
          accounts={accounts}
          categories={categories}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
