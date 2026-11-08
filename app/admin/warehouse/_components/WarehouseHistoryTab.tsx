"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import { 
  History, 
  Search, 
  X, 
  ArrowDownLeft, 
  ArrowUpRight 
} from "lucide-react";
import { WarehouseTransactionData } from "../_types/warehouseTypes";
import { UNIT_LABELS } from "../constants";
import { triggerHaptic } from "@/lib/haptics";

interface WarehouseHistoryTabProps {
  transactions: WarehouseTransactionData[];
}

export default function WarehouseHistoryTab({
  transactions,
}: WarehouseHistoryTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [directionFilter, setDirectionFilter] = useState<"all" | "in" | "out">("all");

  const filteredTransactions = useMemo(() => {
    let list = transactions;

    if (directionFilter === "in") {
      list = list.filter((t) => t.quantityChanged > 0);
    } else if (directionFilter === "out") {
      list = list.filter((t) => t.quantityChanged < 0);
    }

    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.item.name.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return list;
  }, [transactions, directionFilter, deferredSearch]);

  const formatDate = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Панель фильтров истории */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Поиск по названию или описанию */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию материала или примечанию..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                setSearchQuery("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Переключатель направления */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setDirectionFilter("all");
            }}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
              directionFilter === "all"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Все операции ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setDirectionFilter("in");
            }}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
              directionFilter === "in"
                ? "bg-white text-emerald-700 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
            <span>Приход</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setDirectionFilter("out");
            }}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
              directionFilter === "out"
                ? "bg-white text-rose-700 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ArrowUpRight className="w-3 h-3 text-rose-600" />
            <span>Списание</span>
          </button>
        </div>
      </div>

      {/* Таблица истории */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-3 px-4 w-36">Дата и время</th>
              <th className="py-3 px-4">Материал</th>
              <th className="py-3 px-3 w-32 text-right">Изменение</th>
              <th className="py-3 px-4">Основание / Причина</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <History className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Записей не найдено</p>
                    <p className="text-xs text-slate-400">
                      История движений материалов появится после первых операций оприходования или списания
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const isIntake = tx.quantityChanged > 0;
                const unitLabel = UNIT_LABELS[tx.item.unit] || tx.item.unit;

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                    {/* 1. Дата */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {formatDate(tx.createdAt)}
                    </td>

                    {/* 2. Наименование */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-xs text-slate-900">
                        {tx.item.name}
                      </div>
                      {tx.item.category && (
                        <div className="text-[10px] text-slate-400">
                          {tx.item.category}
                        </div>
                      )}
                    </td>

                    {/* 3. Количество */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-lg ${
                          isIntake
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-rose-50 text-rose-700 border border-rose-200/60"
                        }`}
                      >
                        {isIntake ? (
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-rose-600" />
                        )}
                        <span>
                          {isIntake ? `+${tx.quantityChanged}` : `${tx.quantityChanged}`} {unitLabel}
                        </span>
                      </span>
                    </td>

                    {/* 4. Описание */}
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {tx.description || "Без комментария"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
