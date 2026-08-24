"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { CRM_EVENTS, dispatchCrmEvent } from "@/lib/crmEvents";
import BottomSheet from "@/components/ui/BottomSheet";
import { CRM_NAV_ITEMS, CRM_QUICK_ACTIONS } from "@/app/admin/_data/crmNavigationDictionary";

export default function CrmBottomBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const handleAction = (actionId: "lead" | "estimate" | "client") => {
    triggerHaptic("light");
    setIsActionSheetOpen(false);

    if (actionId === "lead") {
      if (pathname === "/admin/leads") {
        dispatchCrmEvent(CRM_EVENTS.OPEN_CREATE_LEAD);
      } else {
        router.push("/admin/leads?action=create-lead");
      }
    } else if (actionId === "estimate") {
      if (pathname === "/admin/leads") {
        dispatchCrmEvent(CRM_EVENTS.OPEN_ESTIMATE);
      } else {
        router.push("/admin/leads?action=estimate");
      }
    } else if (actionId === "client") {
      if (pathname === "/admin/leads" || pathname === "/admin/clients") {
        dispatchCrmEvent(CRM_EVENTS.OPEN_CREATE_CLIENT);
      } else {
        router.push("/admin/clients?action=create-client");
      }
    }
  };

  return (
    <>
      {/* ── Нижний фиксированный нативный таббар в светлой теме ── */}
      <div className="fixed bottom-0 left-0 right-0 z-[80] lg:hidden bg-white/95 border-t border-slate-200/80 backdrop-blur-md px-2 py-1.5 pb-safe select-none shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around relative max-w-md mx-auto">
          {CRM_NAV_ITEMS.map((item) => {
            if (item.isAction) {
              return (
                <div key="action-plus" className="relative -top-4 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setIsActionSheetOpen(!isActionSheetOpen);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-300 active:scale-90 border-2 border-white cursor-pointer ${
                      isActionSheetOpen 
                        ? "bg-slate-800 rotate-45" 
                        : "bg-gradient-to-tr from-orange-500 to-amber-500 shadow-orange-500/30"
                    }`}
                    aria-label="Быстрое действие"
                  >
                    <Plus className="w-6 h-6 stroke-[3]" />
                  </button>
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => {
                  triggerHaptic("light");
                  setIsActionSheetOpen(false);
                }}
                className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition duration-150 relative ${
                  isActive ? "text-orange-600" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={`text-[10px] mt-1 tracking-tight ${isActive ? "font-black" : "font-semibold"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Плавная мобильная шторка (iOS Bottom Sheet) на чистом CSS ── */}
      <BottomSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        maxWidth="max-w-md"
        maxHeight="max-h-[80dvh]"
        className="bg-white p-4 pb-safe space-y-3"
      >
        <div className="flex items-center justify-between px-2 pb-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Быстрые действия
          </span>
          <button 
            type="button"
            onClick={() => setIsActionSheetOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            title="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-2">
          {CRM_QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            const isLead = action.id === "lead";
            const isEstimate = action.id === "estimate";
            const isClient = action.id === "client";

            const bgClass = isLead 
              ? "bg-orange-50 border-orange-200/80 text-orange-600 hover:bg-orange-100/60" 
              : isEstimate 
              ? "bg-amber-50/70 border-amber-200/80 text-amber-900 hover:bg-amber-100/60" 
              : "bg-blue-50/70 border-blue-200/80 text-blue-900 hover:bg-blue-100/60";

            const iconBg = isLead ? "bg-orange-500" : isEstimate ? "bg-amber-500" : "bg-blue-500";

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => handleAction(action.id)}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl border font-extrabold text-xs transition text-left cursor-pointer active:scale-[0.98] ${bgClass}`}
              >
                <div className={`w-10 h-10 rounded-xl ${iconBg} text-white flex items-center justify-center shrink-0 shadow-md ${action.shadow}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-extrabold text-slate-900">{action.title}</span>
                  <span className="text-[11px] text-slate-500 font-medium block">{action.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
}
