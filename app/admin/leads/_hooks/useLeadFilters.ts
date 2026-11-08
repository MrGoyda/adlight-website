"use client";

import { useState, useMemo, useDeferredValue } from "react";
import { Lead } from "../_types/leadTypes";
import { getLeadTimingInfo } from "../_utils/leadTimelineUtils";

export function useLeadFilters(leads: Lead[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [workView, setWorkView] = useState<"ACTIVE" | "ON_HOLD" | "ARCHIVE" | "TRASH">("ACTIVE");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [timingFilter, setTimingFilter] = useState<"ALL" | "APPOINTMENTS_TODAY" | "COLD_WARNING" | "URGENT_DEADLINES" | "STALE_14D">("ALL");
  const [isGlobalExpanded, setIsGlobalExpanded] = useState(false);

  // Подфильтры в архиве: Все / Выполненные / Не выполненные
  const [archiveSubTab, setArchiveSubTab] = useState<"ALL" | "COMPLETED" | "UNSUCCESSFUL">("ALL");
  const [archiveReasonFilter, setArchiveReasonFilter] = useState<string>("ALL");

  // Плавный deferred-поиск без фризов при вводе текста
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // Подсчёт дубликатов по номеру телефона (последние 10 цифр)
  const phoneOccurrences = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const digits = (l.phone || "").replace(/\D/g, "");
      if (digits.length >= 10) {
        const key = digits.slice(-10);
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [leads]);

  // 1. Корзина (удаленные мягко)
  const trashLeads = useMemo(() => {
    return leads.filter((l) => Boolean(l.deletedAt));
  }, [leads]);

  // 2. Активные (В фокусе, не в корзине, не в отказе)
  const activeLeads = useMemo(() => {
    return leads.filter((l) => !l.deletedAt && l.status !== "CANCELLED" && l.status !== "UNPROCESSED");
  }, [leads]);

  // 3. На паузе (Отложенные, без срочных действий на сегодня)
  const onHoldLeads = useMemo(() => {
    return leads.filter((l) => {
      if (l.deletedAt || l.status === "CANCELLED" || l.status === "UNPROCESSED") return false;
      const t = getLeadTimingInfo(l.createdAt, l.status, l.appointmentDate, l.deadline);
      return !t.isAppointmentToday && !t.isLeadColdWarning && t.deadlineBadge?.variant !== "overdue";
    });
  }, [leads]);

  // 4. Архив (Выполненные проекты, отказы и не отработанные, не в корзине)
  const archiveLeads = useMemo(() => {
    return leads.filter(
      (l) => !l.deletedAt && (l.status === "COMPLETED" || l.status === "CANCELLED" || l.status === "UNPROCESSED")
    );
  }, [leads]);

  // Статистика архива
  const archiveStats = useMemo(() => {
    const completed = archiveLeads.filter((l) => l.status === "COMPLETED");
    const unsuccessful = archiveLeads.filter((l) => l.status === "CANCELLED" || l.status === "UNPROCESSED");
    const completedRevenue = completed.reduce((sum, l) => sum + (l.revenue || l.offeredPrice || 0), 0);
    const totalCount = archiveLeads.length;
    const conversion = totalCount > 0 ? Math.round((completed.length / totalCount) * 100) : 0;

    const reasonsCount: Record<string, number> = {};
    unsuccessful.forEach((l) => {
      const r = l.rejectionReason || "Не указана";
      reasonsCount[r] = (reasonsCount[r] || 0) + 1;
    });

    return {
      totalCount,
      completedCount: completed.length,
      completedRevenue,
      unsuccessfulCount: unsuccessful.length,
      conversion,
      reasonsCount,
    };
  }, [archiveLeads]);

  const currentWorkspaceLeads = useMemo(() => {
    if (workView === "TRASH") return trashLeads;
    if (workView === "ARCHIVE") return archiveLeads;
    if (workView === "ON_HOLD") return onHoldLeads;
    return activeLeads;
  }, [workView, activeLeads, onHoldLeads, archiveLeads, trashLeads]);

  // Статистика
  const totalRevenue = useMemo(() => {
    return leads
      .filter((l) => !l.deletedAt)
      .reduce((sum, l) => sum + (l.revenue || 0), 0);
  }, [leads]);

  const conversionRate = useMemo(() => {
    const validLeads = leads.filter((l) => !l.deletedAt);
    if (validLeads.length === 0) return 0;
    const completed = validLeads.filter((l) => l.status === "COMPLETED").length;
    return Math.round((completed / validLeads.length) * 100);
  }, [leads]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      if (!l.deletedAt) {
        counts[l.status] = (counts[l.status] || 0) + 1;
      }
    });
    return counts;
  }, [leads]);

  const timingStats = useMemo(() => {
    let appointmentsToday = 0;
    let coldWarnings = 0;
    let urgentDeadlines = 0;
    let stale14d = 0;
    const now = Date.now();
    const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

    activeLeads.forEach((l) => {
      const t = getLeadTimingInfo(l.createdAt, l.status, l.appointmentDate, l.deadline);
      if (t.isAppointmentToday) appointmentsToday++;
      if (t.isLeadColdWarning) coldWarnings++;
      if (t.deadlineBadge?.variant === "overdue" || t.deadlineBadge?.variant === "today" || t.deadlineBadge?.variant === "urgent") {
        urgentDeadlines++;
      }
      if (l.status === "NEW" && (now - new Date(l.createdAt).getTime()) > FOURTEEN_DAYS_MS) {
        stale14d++;
      }
    });

    return { 
      appointmentsToday, 
      coldWarnings, 
      urgentDeadlines, 
      stale14d,
      trashCount: trashLeads.length 
    };
  }, [activeLeads, trashLeads.length]);

  // Фильтрованный список текущего пространства с concurrent-поиском
  const filteredLeads = useMemo(() => {
    const cleanSearch = deferredSearchTerm.toLowerCase().trim();
    const now = Date.now();
    const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

    return currentWorkspaceLeads.filter((lead) => {
      if (cleanSearch) {
        const matchesSearch =
          (lead.name && lead.name.toLowerCase().includes(cleanSearch)) ||
          (lead.phone && lead.phone.includes(cleanSearch)) ||
          (lead.address && lead.address.toLowerCase().includes(cleanSearch)) ||
          (lead.rejectionReason && lead.rejectionReason.toLowerCase().includes(cleanSearch));
        if (!matchesSearch) return false;
      }

      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
      if (!matchesStatus) return false;

      if (timingFilter === "APPOINTMENTS_TODAY") {
        const t = getLeadTimingInfo(lead.createdAt, lead.status, lead.appointmentDate, lead.deadline);
        return t.isAppointmentToday;
      }
      if (timingFilter === "COLD_WARNING") {
        const t = getLeadTimingInfo(lead.createdAt, lead.status, lead.appointmentDate, lead.deadline);
        return t.isLeadColdWarning;
      }
      if (timingFilter === "URGENT_DEADLINES") {
        const t = getLeadTimingInfo(lead.createdAt, lead.status, lead.appointmentDate, lead.deadline);
        return t.deadlineBadge?.variant === "overdue" || t.deadlineBadge?.variant === "today" || t.deadlineBadge?.variant === "urgent";
      }
      if (timingFilter === "STALE_14D") {
        return lead.status === "NEW" && (now - new Date(lead.createdAt).getTime()) > FOURTEEN_DAYS_MS;
      }

      if (workView === "ARCHIVE") {
        if (archiveSubTab === "COMPLETED" && lead.status !== "COMPLETED") return false;
        if (archiveSubTab === "UNSUCCESSFUL" && lead.status !== "CANCELLED" && lead.status !== "UNPROCESSED") return false;
        if (archiveReasonFilter !== "ALL") {
          const r = lead.rejectionReason || "Не указана";
          if (r !== archiveReasonFilter) return false;
        }
      }

      return true;
    });
  }, [currentWorkspaceLeads, deferredSearchTerm, statusFilter, timingFilter, workView, archiveSubTab, archiveReasonFilter]);

  return {
    searchTerm,
    setSearchTerm,
    workView,
    setWorkView,
    statusFilter,
    setStatusFilter,
    timingFilter,
    setTimingFilter,
    isGlobalExpanded,
    setIsGlobalExpanded,
    archiveSubTab,
    setArchiveSubTab,
    archiveReasonFilter,
    setArchiveReasonFilter,
    archiveStats,
    activeLeads,
    onHoldLeads,
    archiveLeads,
    trashLeads,
    phoneOccurrences,
    filteredLeads,
    totalRevenue,
    conversionRate,
    statusCounts,
    timingStats,
  };
}
