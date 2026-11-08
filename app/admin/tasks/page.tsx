import React from "react";
import { getTasksInitialData } from "./actions";
import TasksDashboard from "./_components/TasksDashboard";

export const metadata = {
  title: "Центр задач и планирования | ADLight CRM",
  description: "Производственный цикл наружной рекламы, замеры, цех и финансы",
};

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const res = await getTasksInitialData();

  if (!res.success || !res.data) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-rose-200 text-rose-600 font-bold text-sm">
        {res.error || "Не удалось загрузить задачи"}
      </div>
    );
  }

  return (
    <TasksDashboard
      tasks={res.data.tasks}
      leads={res.data.leads}
      accounts={res.data.accounts}
      categories={res.data.categories}
    />
  );
}
