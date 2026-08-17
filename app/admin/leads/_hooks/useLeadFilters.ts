"use client";

import { useState, useMemo } from "react";
import { LeadStatus } from "@prisma/client";
import { Lead } from "../_types/leadTypes";
import { getLeadTimingInfo } from "../_utils/leadTimelineUtils";

export function useLeadFilters(leads: Lead[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [workView, setWorkView] = useState<"ACTIVE" | "ON_HOLD" | "ARCHIVE">("ACTIVE");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [timingFilter, setTimingFilter] = useState<"ALL" | "APPOINTMENTS_TODAY" | "COLD_WARNING" | "URGENT_DEADLINES">("ALL");
  const [isGlobalExpanded, setIsGlobalExpanded] = useState(false);

  // Разделение на 3 пространства: Активные (В фокусе), На паузе (Отложенные), Архив/Отказы
  const activeLeads = useMemo(() => {
    return leads.filter((l) => l.status !== "CANCELLED" && l.status !== "UNPROCESSED");
  }, [leads]);

  const onHoldLeads = useMemo(() => {
    return leads.filter((l) => {
      if (l.status === "CANCELLED" || l.status === "UNPROCESSED") return false;
      const t = getLeadTimingInfo(l.createdAt, l.status, l.appointmentDate, l.deadline);
      return !t.isAppointmentToday && !t.isLeadColdWarning && t.deadlineBadge?.variant !== "overdue";
    });
  }, [leads]);

  const archiveLeads = useMemo(() => {
    return leads.filter((l) => l.status === "CANCELLED" || l.status === "UNPROCESSED");
  }, [leads]);

  const currentWorkspaceLeads = useMemo(() => {
    if (workView === "ARCHIVE") return archiveLeads;
    if (workView === "ON_HOLD") return onHoldLeads;
    return activeLeads;
  }, [workView, activeLeads, onHoldLeads, archiveLeads]);

  // Статистика
  const totalRevenue = useMemo(() => {
    return leads.reduce((sum, l) => sum + (l.revenue || 0), 0);
  }, [leads]);

  const conversionRate = useMemo(() => {
    if (leads.length === 0) return 0;
    const completed = leads.filter((l) => l.status === "COMPLETED").length;
    return Math.round((completed / leads.length) * 100);
  }, [leads]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return counts;
  }, [leads]);

  const timingStats = useMemo(() => {
    let appointmentsToday = 0;
    let coldWarnings = 0;
    let urgentDeadlines = 0;

    activeLeads.forEach((l) => {
      const t = getLeadTimingInfo(l.createdAt, l.status, l.appointmentDate, l.deadline);
      if (t.isAppointmentToday) appointmentsToday++;
      if (t.isLeadColdWarning) coldWarnings++;
      if (t.deadlineBadge?.variant === "overdue" || t.deadlineBadge?.variant === "today" || t.deadlineBadge?.variant === "urgent") {
        urgentDeadlines++;
      }
    });

    return { appointmentsToday, coldWarnings, urgentDeadlines };
  }, [activeLeads]);

  // Фильтрованный список текущего пространства
  const filteredLeads = useMemo(() => {
    return currentWorkspaceLeads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        (lead.address && lead.address.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
      if (!matchesSearch || !matchesStatus) return false;

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

      return true;
    });
  }, [currentWorkspaceLeads, searchTerm, statusFilter, timingFilter]);

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
    activeLeads,
    onHoldLeads,
    archiveLeads,
    currentWorkspaceLeads,
    filteredLeads,
    totalRevenue,
    conversionRate,
    statusCounts,
    timingStats,
  };
}
