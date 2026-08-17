/**
 * Утилиты для расчета умных дедлайнов, таймлайна замеров и контроля остывания лидов.
 */

export interface LeadTimingInfo {
  // Замер / Встреча
  isAppointmentToday: boolean;
  isAppointmentTomorrow: boolean;
  isAppointmentPast: boolean;
  appointmentTimeStr: string | null;
  appointmentDateStr: string | null;
  appointmentBadge: {
    text: string;
    variant: "today" | "tomorrow" | "past" | "upcoming";
  } | null;

  // Остывание новых заявок (>2 часов без движения)
  isLeadColdWarning: boolean;
  isFreshLead: boolean;
  timeSinceCreationStr: string;

  // Дедлайн сдачи проекта
  deadlineBadge: {
    text: string;
    variant: "urgent" | "today" | "upcoming" | "overdue";
  } | null;
}

export function getLeadTimingInfo(
  createdAt: string,
  status: string,
  appointmentDate?: string | null,
  deadline?: string | null
): LeadTimingInfo {
  const now = new Date();
  
  // ── 1. Расчет времени с момента создания (Остывание лида) ──
  const createdDate = new Date(createdAt);
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let timeSinceCreationStr = "";
  if (diffMinutes < 60) {
    timeSinceCreationStr = `${Math.max(1, diffMinutes)} мин назад`;
  } else if (diffHours < 24) {
    timeSinceCreationStr = `${diffHours} ч назад`;
  } else {
    timeSinceCreationStr = `${diffDays} дн назад`;
  }

  // Лид считается "остывающим", если он в статусе NEW и создан более 2 часов назад
  const isLeadColdWarning = status === "NEW" && diffHours >= 2;
  const isFreshLead = status === "NEW" && diffHours < 2;

  // ── 2. Расчет даты замера / встречи ──
  let isAppointmentToday = false;
  let isAppointmentTomorrow = false;
  let isAppointmentPast = false;
  let appointmentTimeStr: string | null = null;
  let appointmentDateStr: string | null = null;
  let appointmentBadge: LeadTimingInfo["appointmentBadge"] = null;

  if (appointmentDate) {
    const appDate = new Date(appointmentDate);
    if (!isNaN(appDate.getTime())) {
      appointmentTimeStr = appDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
      appointmentDateStr = appDate.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const startOfDayAfterTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
      const startOfAppDate = new Date(appDate.getFullYear(), appDate.getMonth(), appDate.getDate());

      if (startOfAppDate.getTime() === startOfToday.getTime()) {
        isAppointmentToday = true;
        const isTimePassed = appDate.getTime() < now.getTime();
        appointmentBadge = {
          text: `Замер сегодня в ${appointmentTimeStr}${isTimePassed ? " (прошел)" : ""}`,
          variant: "today",
        };
      } else if (startOfAppDate.getTime() === startOfTomorrow.getTime()) {
        isAppointmentTomorrow = true;
        appointmentBadge = {
          text: `Замер завтра в ${appointmentTimeStr}`,
          variant: "tomorrow",
        };
      } else if (appDate.getTime() < startOfToday.getTime() && status !== "COMPLETED" && status !== "CANCELLED") {
        isAppointmentPast = true;
        appointmentBadge = {
          text: `Замер был ${appointmentDateStr}`,
          variant: "past",
        };
      } else if (appDate.getTime() >= startOfDayAfterTomorrow.getTime()) {
        appointmentBadge = {
          text: `Замер: ${appointmentDateStr} (${appointmentTimeStr})`,
          variant: "upcoming",
        };
      }
    }
  }

  // ── 3. Расчет дедлайна сдачи проекта ──
  let deadlineBadge: LeadTimingInfo["deadlineBadge"] = null;

  if (deadline && status !== "COMPLETED" && status !== "CANCELLED") {
    const deadDate = new Date(deadline);
    if (!isNaN(deadDate.getTime())) {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const startOfDeadDate = new Date(deadDate.getFullYear(), deadDate.getMonth(), deadDate.getDate());
      const daysUntilDeadline = Math.round((startOfDeadDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));

      const formattedDeadline = deadDate.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

      if (daysUntilDeadline < 0) {
        deadlineBadge = {
          text: `Просрочен на ${Math.abs(daysUntilDeadline)} дн. (срок: ${formattedDeadline})`,
          variant: "overdue",
        };
      } else if (daysUntilDeadline === 0) {
        deadlineBadge = {
          text: `Срок сдачи СЕГОДНЯ`,
          variant: "today",
        };
      } else if (daysUntilDeadline <= 2) {
        deadlineBadge = {
          text: `Срок сдачи: ${daysUntilDeadline === 1 ? "завтра" : "через 2 дня"} (${formattedDeadline})`,
          variant: "urgent",
        };
      } else {
        deadlineBadge = {
          text: `Срок: ${formattedDeadline}`,
          variant: "upcoming",
        };
      }
    }
  }

  return {
    isAppointmentToday,
    isAppointmentTomorrow,
    isAppointmentPast,
    appointmentTimeStr,
    appointmentDateStr,
    appointmentBadge,
    isLeadColdWarning,
    isFreshLead,
    timeSinceCreationStr,
    deadlineBadge,
  };
}
