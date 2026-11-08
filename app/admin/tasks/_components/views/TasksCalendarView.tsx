"use client";

import React, { useState, useMemo } from "react";
import { 
  Calendar as CalendarIcon,
  MapPin, 
  Phone, 
  ExternalLink, 
  Clock, 
  User, 
  Compass,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { CrmTaskItem } from "../../_types/taskTypes";
import { TASKS_DICTIONARY } from "../../_data/tasksDictionary";

interface TasksCalendarViewProps {
  tasks: CrmTaskItem[];
  onOpenExpenseModal: (task: CrmTaskItem) => void;
  onOpenDetailModal?: (task: CrmTaskItem) => void;
  onRefresh: () => void;
}

export default function TasksCalendarView({
  tasks,
  onOpenExpenseModal,
}: TasksCalendarViewProps) {
  const dict = TASKS_DICTIONARY;

  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );

  // Оптимизация O(N): Единый проход для выборки задач на выбранный день и счетчиков
  const { currentDayTasks, measurementsCount, installsCount } = useMemo(() => {
    const list: CrmTaskItem[] = [];
    let measurements = 0;
    let installs = 0;

    for (const t of tasks) {
      if (!t.dueDate) continue;
      const taskDate = new Date(t.dueDate).toISOString().split("T")[0];
      if (taskDate === selectedDate) {
        list.push(t);
        if (t.stage === "MEASUREMENT") measurements++;
        else if (t.stage === "INSTALLATION") installs++;
      }
    }

    return {
      currentDayTasks: list,
      measurementsCount: measurements,
      installsCount: installs,
    };
  }, [tasks, selectedDate]);

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
            aria-label="Предыдущий день"
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
            aria-label="Следующий день"
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

                      {t.dueDate && (
                        <span className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(t.dueDate).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>

                    {/* Название и описание */}
                    <h4 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                      {t.title}
                    </h4>

                    {t.lead && (
                      <div className="text-xs font-bold text-slate-600">
                        Клиент: <span className="text-slate-900">{t.lead.name}</span>
                      </div>
                    )}

                    {/* Адрес с переходом в 2ГИС */}
                    {address && (
                      <div className="flex items-start gap-1.5 p-2 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span className="font-semibold text-slate-700 flex-1 leading-snug">
                          {address}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Кнопки выезда: Звонок клиенту + 2ГИС навигация */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 flex-wrap">
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs transition cursor-pointer active:scale-95 touch-manipulation"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Позвонить</span>
                      </a>
                    )}

                    {hasAddress && t.lead?.address && (
                      <a
                        href={`https://2gis.kz/search/${encodeURIComponent(t.lead.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold text-xs transition cursor-pointer active:scale-95 touch-manipulation"
                      >
                        <Compass className="w-3.5 h-3.5 text-blue-600" />
                        <span>2ГИС Маршрут</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    )}

                    {t.assignee && (
                      <span className="ml-auto text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {dict.assignees[t.assignee] || t.assignee}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 font-medium text-xs space-y-2">
          <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
          <p>{dict.calendar.noEventsDay}</p>
        </div>
      )}
    </div>
  );
}
