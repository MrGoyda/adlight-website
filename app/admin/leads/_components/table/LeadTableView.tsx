"use client";

import React from "react";
import { 
  CheckSquare, 
  Square, 
  RotateCcw, 
  Calculator, 
  Copy, 
  Phone, 
  Trash2 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { Lead } from "../../_types/leadTypes";
import { STATUS_MAP, LEADS_DICTIONARY } from "../../_data/leadsDictionary";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/phoneUtils";

interface LeadTableViewProps {
  leads: Lead[];
  selectedLeadIds: Set<string>;
  detailLeadId?: string;
  phoneOccurrences?: Record<string, number>;
  onSelectLead: (lead: Lead) => void;
  onToggleBatchSelect: (leadId: string, e?: React.MouseEvent) => void;
  onToggleSelectAll: () => void;
  onFilterDuplicatePhone: (phone: string) => void;
  onCopyPhone: (e: React.MouseEvent, phone: string) => void;
  onDeleteClick?: (leadId: string, e: React.MouseEvent, isPermanent?: boolean) => void;
  onRestoreFromTrash?: (leadId: string, e: React.MouseEvent) => void;
}

function LeadTableView({
  leads,
  selectedLeadIds,
  detailLeadId,
  phoneOccurrences,
  onSelectLead,
  onToggleBatchSelect,
  onToggleSelectAll,
  onFilterDuplicatePhone,
  onCopyPhone,
  onDeleteClick,
  onRestoreFromTrash,
}: LeadTableViewProps) {
  const tableDict = LEADS_DICTIONARY.table;
  const t = LEADS_DICTIONARY.toolbar;
  const isAllSelected = leads.length > 0 && selectedLeadIds.size === leads.length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
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
              <th className="py-3 px-4">{tableDict.colNote}</th>
              <th className="py-3 px-4">{tableDict.colStage}</th>
              <th className="py-3 px-4">{tableDict.colManager}</th>
              <th className="py-3 px-4">{tableDict.colAmount}</th>
              <th className="py-3 px-4 text-right">{tableDict.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => {
              const status = STATUS_MAP[lead.status] || { label: lead.status, color: "text-slate-600", bg: "bg-slate-100" };
              const amount = lead.offeredPrice || lead.revenue || 0;
              const cleanPhone = (lead.phone || "").replace(/[^0-9+]/g, "");
              const cleanDigits = (lead.phone || "").replace(/\D/g, "").slice(-10);
              const dupCount = cleanDigits && phoneOccurrences ? (phoneOccurrences[cleanDigits] || 0) : 0;
              const isRowSelected = selectedLeadIds.has(lead.id);

              return (
                <tr
                  key={lead.id}
                  onClick={() => {
                    triggerHaptic("light");
                    onSelectLead(lead);
                  }}
                  className={`hover:bg-slate-50/80 cursor-pointer transition ${
                    isRowSelected ? "bg-orange-50/60" : detailLeadId === lead.id ? "bg-orange-50/40" : ""
                  }`}
                >
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
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-slate-900 block truncate max-w-xs">{lead.name || tableDict.noName}</span>
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
                    <span className="text-[10px] text-slate-400 font-medium">{lead.phone || "—"}</span>
                    {lead.rejectionReason && (
                      <span className="text-[10px] text-rose-600 font-bold block truncate max-w-xs mt-0.5">
                        🏷️ {lead.rejectionReason}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 max-w-[200px] truncate text-slate-500 font-medium">
                    {lead.comment || "—"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${status.color} ${status.bg}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-bold">
                    {lead.manager === "ELISEY" ? t.managerElisey : lead.manager === "DANIIL" ? t.managerDaniil : "—"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-black text-slate-900">
                    {amount > 0 ? `${amount.toLocaleString("ru")} ₸` : "—"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {lead.deletedAt ? (
                        <>
                          {onRestoreFromTrash && (
                            <button
                              type="button"
                              onClick={(e) => onRestoreFromTrash(lead.id, e)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] border border-emerald-200 transition"
                              title={LEADS_DICTIONARY.trash.restoreBtn}
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{LEADS_DICTIONARY.trash.restoreBtn}</span>
                            </button>
                          )}
                          {onDeleteClick && (
                            <button
                              type="button"
                              onClick={(e) => onDeleteClick(lead.id, e, true)}
                              className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition"
                              title={LEADS_DICTIONARY.trash.permanentDeleteBtn}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Смета калькулятор */}
                          <a
                            href={`/admin/calculator?leadId=${lead.id}`}
                            className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 flex items-center justify-center transition touch-manipulation"
                            title={tableDict.calcTooltip}
                          >
                            <Calculator className="w-3.5 h-3.5" />
                          </a>

                          {/* Копировать телефон */}
                          {cleanPhone && (
                            <button
                              type="button"
                              onClick={(e) => onCopyPhone(e, lead.phone || "")}
                              className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer touch-manipulation"
                              title={tableDict.copyPhoneTooltip}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Позвонить */}
                          {cleanPhone && (
                            <a
                              href={`tel:${cleanPhone}`}
                              className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition touch-manipulation"
                              title={tableDict.callTooltip}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* WhatsApp */}
                          <a
                            href={getWhatsAppUrl(lead.phone || "", `Здравствуйте, ${lead.name || tableDict.whatsAppGreeting}!`)}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition touch-manipulation"
                            title={tableDict.whatsAppTooltip}
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                          </a>

                          {/* В корзину */}
                          {onDeleteClick && (
                            <button
                              type="button"
                              onClick={(e) => onDeleteClick(lead.id, e, false)}
                              className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer touch-manipulation"
                              title="В корзину"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(LeadTableView);
