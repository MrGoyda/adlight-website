"use client";

import React, { useMemo } from "react";
import { 
  Archive, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Phone, 
  Trash2, 
  CheckSquare, 
  Square,
  DollarSign,
  Filter
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { Lead } from "../../_types/leadTypes";
import { STATUS_MAP, LEADS_DICTIONARY } from "../../_data/leadsDictionary";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/phoneUtils";

interface LeadArchiveViewProps {
  leads: Lead[];
  allArchiveLeads: Lead[];
  selectedLeadIds: Set<string>;
  onToggleBatchSelect: (leadId: string, e?: React.MouseEvent) => void;
  onToggleSelectAll: () => void;
  onSelectLead: (lead: Lead) => void;
  onReactivateLead: (leadId: string, e: React.MouseEvent) => void;
  onDeleteClick: (leadId: string, e: React.MouseEvent, isPermanent?: boolean) => void;
  onCopyPhone: (e: React.MouseEvent, phone: string) => void;
  onFilterDuplicatePhone: (phone: string) => void;
  phoneOccurrences?: Record<string, number>;
  archiveSubTab: "ALL" | "COMPLETED" | "UNSUCCESSFUL";
  onSelectSubTab: (tab: "ALL" | "COMPLETED" | "UNSUCCESSFUL") => void;
  archiveReasonFilter: string;
  onSelectReasonFilter: (reason: string) => void;
  archiveStats: {
    totalCount: number;
    completedCount: number;
    completedRevenue: number;
    unsuccessfulCount: number;
    conversion: number;
    reasonsCount: Record<string, number>;
  };
}

export default function LeadArchiveView({
  leads,
  selectedLeadIds,
  onToggleBatchSelect,
  onToggleSelectAll,
  onSelectLead,
  onReactivateLead,
  onDeleteClick,
  onFilterDuplicatePhone,
  phoneOccurrences,
  archiveSubTab,
  onSelectSubTab,
  archiveReasonFilter,
  onSelectReasonFilter,
  archiveStats,
}: LeadArchiveViewProps) {
  const dict = LEADS_DICTIONARY.archive;
  const tableDict = LEADS_DICTIONARY.table;

  const isAllSelected = leads.length > 0 && selectedLeadIds.size === leads.length;

  // Список доступных причин отказа для фильтра
  const availableReasons = useMemo(() => {
    return Object.entries(archiveStats.reasonsCount)
      .sort((a, b) => b[1] - a[1]);
  }, [archiveStats.reasonsCount]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* ── BENTO-КАРТОЧКА АРХИВА: СТАТИСТИКА + СЕГМЕНТНЫЕ ПОДВКЛАДКИ ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        
        {/* Верхняя строка: Заголовок архива + 4 Bento-метрики */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
              <Archive className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {dict.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {dict.subtitle}
              </p>
            </div>
          </div>

          {/* Метрики архива (Bento stats) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
            {/* Всего в архиве */}
            <div className="bg-slate-50 rounded-2xl p-2.5 sm:p-3 border border-slate-200/80">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                {dict.statTotal}
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                {archiveStats.totalCount}
              </span>
            </div>

            {/* Выручка выполненных */}
            <div className="bg-emerald-50/60 rounded-2xl p-2.5 sm:p-3 border border-emerald-200/80">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {dict.statCompletedRevenue}
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-800 block mt-0.5 truncate">
                {archiveStats.completedRevenue > 0
                  ? `${archiveStats.completedRevenue.toLocaleString("ru-RU")} ₸`
                  : "0 ₸"}
              </span>
            </div>

            {/* Успешные проекты */}
            <div className="bg-emerald-50/40 rounded-2xl p-2.5 sm:p-3 border border-emerald-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {dict.statCompleted}
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-700 block mt-0.5">
                {archiveStats.completedCount}
              </span>
            </div>

            {/* Отказы / Не состоялись */}
            <div className="bg-rose-50/60 rounded-2xl p-2.5 sm:p-3 border border-rose-200/80">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 block flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {dict.statUnsuccessful}
              </span>
              <span className="text-sm sm:text-base font-black text-rose-700 block mt-0.5">
                {archiveStats.unsuccessfulCount}
                <span className="text-[10px] text-slate-400 font-bold ml-1.5">
                  ({archiveStats.conversion}% конв.)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Нижняя строка: Сегментированный переключатель (Все / Выполненные / Не выполненные) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl select-none self-start">
            {/* Все */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                onSelectSubTab("ALL");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                archiveSubTab === "ALL"
                  ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>{dict.tabAll}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {archiveStats.totalCount}
              </span>
            </button>

            {/* Выполненные */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                onSelectSubTab("COMPLETED");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                archiveSubTab === "COMPLETED"
                  ? "bg-white text-emerald-800 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-emerald-700"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dict.tabCompleted}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                {archiveStats.completedCount}
              </span>
            </button>

            {/* Не выполненные */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                onSelectSubTab("UNSUCCESSFUL");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                archiveSubTab === "UNSUCCESSFUL"
                  ? "bg-white text-rose-800 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-rose-700"
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>{dict.tabUnsuccessful}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800">
                {archiveStats.unsuccessfulCount}
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-semibold self-center sm:self-auto">
            Отображается: <span className="text-slate-900 font-black">{leads.length}</span> сделок
          </div>
        </div>

        {/* Чипсы причин отказа (когда выбраны «Не выполненные» или «Все» и есть отказы) */}
        {archiveSubTab !== "COMPLETED" && availableReasons.length > 0 && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 flex-wrap">
            <span className="text-[11px] font-extrabold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Причины:
            </span>

            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                onSelectReasonFilter("ALL");
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition cursor-pointer ${
                archiveReasonFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {dict.reasonsFilterAll}
            </button>

            {availableReasons.map(([reason, count]) => {
              const isActive = archiveReasonFilter === reason;
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    onSelectReasonFilter(isActive ? "ALL" : reason);
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black transition cursor-pointer ${
                    isActive
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/70"
                  }`}
                >
                  <span>{reason}</span>
                  <span className={`text-[9px] font-extrabold px-1 rounded-full ${
                    isActive ? "bg-rose-700 text-white" : "bg-rose-200/70 text-rose-800"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* ── ТАБЛИЦА / РЕЕСТР АРХИВНЫХ СДЕЛОК ── */}
      {leads.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 font-medium shadow-xs">
          {archiveSubTab === "COMPLETED"
            ? dict.emptyCompleted
            : archiveSubTab === "UNSUCCESSFUL"
            ? dict.emptyUnsuccessful
            : dict.emptyAll}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  {/* Чекбокс выбора */}
                  <th className="w-10 py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={onToggleSelectAll}
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                      title={isAllSelected ? LEADS_DICTIONARY.bulkActions.deselectAll : LEADS_DICTIONARY.bulkActions.selectAll}
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-orange-600" />
                      ) : selectedLeadIds.size > 0 ? (
                        <div className="w-4 h-4 rounded border-2 border-orange-600 bg-orange-50 flex items-center justify-center">
                          <div className="w-2 h-0.5 bg-orange-600" />
                        </div>
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">{tableDict.colClient}</th>
                  <th className="py-3 px-4">Результат / Причина</th>
                  <th className="py-3 px-4">{tableDict.colManager}</th>
                  <th className="py-3 px-4">{tableDict.colAmount}</th>
                  <th className="py-3 px-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => {
                  const isCompleted = lead.status === "COMPLETED";
                  const isRowSelected = selectedLeadIds.has(lead.id);
                  const amount = lead.revenue || lead.offeredPrice || 0;
                  const cleanPhone = (lead.phone || "").replace(/[^0-9+]/g, "");
                  const cleanDigits = (lead.phone || "").replace(/\D/g, "").slice(-10);
                  const dupCount = cleanDigits && phoneOccurrences ? (phoneOccurrences[cleanDigits] || 0) : 0;
                  const status = STATUS_MAP[lead.status] || { label: lead.status, color: "text-slate-600", bg: "bg-slate-100" };

                  return (
                    <tr
                      key={lead.id}
                      style={{ contentVisibility: "auto", containIntrinsicSize: "50px" }}
                      onClick={() => {
                        triggerHaptic("light");
                        onSelectLead(lead);
                      }}
                      className={`hover:bg-slate-50/80 cursor-pointer transition ${
                        isRowSelected
                          ? "bg-orange-50/60"
                          : isCompleted
                          ? "hover:bg-emerald-50/20"
                          : ""
                      }`}
                    >
                      {/* Чекбокс */}
                      <td className="w-10 py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => onToggleBatchSelect(lead.id, e)}
                          className="p-1 rounded hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                        >
                          {isRowSelected ? (
                            <CheckSquare className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                          )}
                        </button>
                      </td>

                      {/* Клиент */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-slate-900 block truncate max-w-xs">
                            {lead.name || tableDict.noName}
                          </span>
                          {dupCount > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onFilterDuplicatePhone(cleanDigits);
                              }}
                              className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 text-[9px] font-black border border-purple-200 hover:bg-purple-100 transition"
                              title={`${LEADS_DICTIONARY.duplicates.filterTitle} ${dupCount}`}
                            >
                              🔁 {dupCount}
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {lead.phone || "—"}
                        </span>
                        {lead.address && (
                          <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                            📍 {lead.address}
                          </span>
                        )}
                      </td>

                      {/* Результат / Причина */}
                      <td className="py-3 px-4 max-w-[240px]">
                        {isCompleted ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border text-emerald-700 border-emerald-200 bg-emerald-50">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {dict.completedStatus}
                            </span>
                            {lead.comment && (
                              <p className="text-[10px] text-slate-500 truncate font-medium">
                                {lead.comment}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${status.color} ${status.bg}`}>
                              <XCircle className="w-3 h-3 text-rose-500" />
                              {status.label}
                            </span>
                            {lead.rejectionReason && (
                              <span className="text-[10px] text-rose-700 font-bold block truncate">
                                🏷️ {lead.rejectionReason}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Ответственный менеджер */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-bold">
                        {lead.manager === "ELISEY"
                          ? LEADS_DICTIONARY.toolbar.managerElisey
                          : lead.manager === "DANIIL"
                          ? LEADS_DICTIONARY.toolbar.managerDaniil
                          : "—"}
                      </td>

                      {/* Сумма / Выручка */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isCompleted ? (
                          <div>
                            <span className="font-black text-emerald-700 block">
                              +{amount.toLocaleString("ru-RU")} ₸
                            </span>
                            {lead.expenses > 0 && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                Себест: {lead.expenses.toLocaleString("ru-RU")} ₸
                              </span>
                            )}
                          </div>
                        ) : amount > 0 ? (
                          <span className="font-bold text-slate-400 line-through">
                            {amount.toLocaleString("ru-RU")} ₸
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">—</span>
                        )}
                      </td>

                      {/* Быстрые действия */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          
                          {/* Кнопка "В работу" (Реактивация) */}
                          <button
                            type="button"
                            onClick={(e) => onReactivateLead(lead.id, e)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-black text-[11px] border border-orange-200 transition cursor-pointer active:scale-95 shadow-2xs"
                            title={dict.reactivateTooltip}
                          >
                            <RotateCcw className="w-3 h-3 text-orange-600" />
                            <span>{dict.reactivateBtn}</span>
                          </button>

                          {/* Позвонить */}
                          {cleanPhone && (
                            <a
                              href={`tel:${cleanPhone}`}
                              className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition border border-blue-200/50"
                              title={tableDict.callTooltip}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* WhatsApp */}
                          {cleanPhone && (
                            <a
                              href={getWhatsAppUrl(cleanPhone, `Здравствуйте, ${lead.name || tableDict.whatsAppGreeting}!`)}
                              target="_blank"
                              rel="noreferrer"
                              className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition border border-emerald-200/50"
                              title={tableDict.whatsAppTooltip}
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* В корзину */}
                          <button
                            type="button"
                            onClick={(e) => onDeleteClick(lead.id, e, false)}
                            className="w-7 h-7 rounded-xl bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
                            title="В корзину"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
