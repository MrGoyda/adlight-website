"use client";

import React, { useState, useMemo } from "react";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Clock, 
  User, 
  CheckCircle2, 
  Compass,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { CrmTaskItem } from "../../_types/taskTypes";
import { TASKS_DICTIONARY } from "../../_data/tasksDictionary";
import TaskCard from "../TaskCard";

interface TasksCalendarViewProps {
  tasks: CrmTaskItem[];
  onOpenExpenseModal: (task: CrmTaskItem) => void;
  onOpenDetailModal?: (task: CrmTaskItem) => void;
  onRefresh: () => void;
}

export default function TasksCalendarView({
  tasks,
  onOpenExpenseModal,
  onOpenDetailModal,
  onRefresh,
}: TasksCalendarViewProps) {
  const dict = TASKS_DICTIONARY;

  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );

  // Фильтруем задачи, у которых есть дата выполнения
  const datedTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate !== null);
  }, [tasks]);

  // Задачи на выбранный день
  const currentDayTasks = useMemo(() => {
    return datedTasks.filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate).toISOString().split("T")[0];
      return taskDate === selectedDate;
    });
  }, [datedTasks, selectedDate]);

  // Замеры и Монтажи
  const measurementsCount = currentDayTasks.filter((t) => t.stage === "MEASUREMENT").length;
  const installsCount = currentDayTasks.filter((t) => t.stage === "INSTALLATION").length;

  const handlePrevDay = () => {
    triggerHaptic("light");
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    triggerHaptic("light");
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    triggerHaptic("light");
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const formattedDateTitle = new Date(selectedDate).toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* ── ТУЛБАР ВЫБОРА ДАТЫ И МЕТРИКИ ВЫЕЗДОВ ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Навигация по датам */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevDay}
            className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer touch-manipulation"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-3 text-center min-w-[200px]">
            <h3 className="font-black text-sm sm:text-base text-slate-900 capitalize">
              {formattedDateTitle}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold block">
              {currentDayTasks.length} запланировано
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextDay}
            className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer touch-manipulation"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleToday}
            className="ml-2 px-3 py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-extrabold text-xs transition cursor-pointer touch-manipulation"
          >
            {dict.calendar.todayBtn}
          </button>
        </div>

        {/* Метрики выездов на день */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black flex items-center gap-1.5">
            <span>📐</span>
            <span>{measurementsCount} {dict.calendar.measurementsCount}</span>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-black flex items-center gap-1.5">
            <span>🏗️</span>
            <span>{installsCount} {dict.calendar.installsCount}</span>
          </div>
        </div>
      </div>

      {/* ── ЛОГИСТИЧЕСКИЕ ВЫЕЗДЫ НА ОБЪЕКТЫ (МАРШРУТЫ, АДРЕСА, ТЕЛЕФОНЫ) ── */}
      {currentDayTasks.length > 0 ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {currentDayTasks.map((t) => {
              const address = t.lead?.address || t.description;
              const hasAddress = Boolean(t.lead?.address);
              const phone = t.lead?.phone;

              return (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3 relative flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Бейджи этапа и времени */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        t.stage === "MEASUREMENT"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : t.stage === "INSTALLATION"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : "bg-slate-100 text-slate-700"
                      }`}>
                        {dict.kanbanStages[t.stage] || t.stage}
                      </span>

                      {t.assignee && (
                        <span className="text-[10px] font-extrabold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                          👤 {dict.assignees[t.assignee]}
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {t.title}
                    </h4>

                    {/* Адрес объекта */}
                    {address && (
                      <div className="p-2.5 bg-slate-50 rounded-2xl flex items-start gap-2 text-xs text-slate-700">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span className="font-semibold line-clamp-2">{address}</span>
                      </div>
                    )}
                  </div>

                  {/* Быстрые действия: 2GIS / Звонок / Смета */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                    {hasAddress && (
                      <a
                        href={`https://2gis.kz/search/${encodeURIComponent(t.lead!.address!)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black transition cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-emerald-600" />
                        <span>2GIS Карты</span>
                      </a>
                    )}

                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-black transition cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>Позвонить</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenExpenseModal(t)}
                      className="ml-auto text-xs font-black text-rose-600 hover:text-rose-800 transition cursor-pointer"
                    >
                      {dict.actions.recordExpense}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 font-medium text-xs space-y-1">
          <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p>{dict.calendar.noEventsDay}</p>
        </div>
      )}
    </div>
  );
}
