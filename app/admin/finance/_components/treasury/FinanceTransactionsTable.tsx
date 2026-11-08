"use client";

import React, { useState, useMemo, useCallback } from "react";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowRightLeft, 
  UserCheck, 
  Search, 
  Trash2, 
  Calendar,
  X,
  CreditCard,
  Building,
  Coins,
  Layers,
  Zap,
  Tag
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { deleteTransaction } from "../../actions";
import { FinanceTransactionItem, FinanceCategoryItem } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";

interface FinanceTransactionsTableProps {
  transactions: FinanceTransactionItem[];
  categories: FinanceCategoryItem[];
  selectedAccountId?: string | null;
  onRefresh: () => void;
}

type TypeFilter = "ALL" | "INCOME" | "EXPENSE_COMPANY" | "TRANSFER_BETWEEN_ACCOUNTS" | "WITHDRAWAL_PARTNER";

export default function FinanceTransactionsTable({
  transactions,
  categories,
  selectedAccountId,
  onRefresh,
}: FinanceTransactionsTableProps) {
  const dict = FINANCE_DICTIONARY.transactions;

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(30);

  // Сброс пагинации при смене фильтров
  const handleTypeChange = (newType: TypeFilter) => {
    triggerHaptic("light");
    setTypeFilter(newType);
    setVisibleCount(30);
  };

  const handleCategoryChange = (newCat: string) => {
    setSelectedCategoryId(newCat);
    setVisibleCount(30);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setVisibleCount(30);
  };

  // Фильтрация транзакций
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // 1. Фильтр по счету
      if (selectedAccountId) {
        if (t.accountId !== selectedAccountId && t.targetAccountId !== selectedAccountId) {
          return false;
        }
      }

      // 2. Фильтр по типу
      if (typeFilter !== "ALL" && t.type !== typeFilter) {
        return false;
      }

      // 3. Фильтр по категории
      if (selectedCategoryId !== "ALL" && t.categoryId !== selectedCategoryId) {
        return false;
      }

      // 4. Поиск
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = (t.description || "").toLowerCase().includes(query);
        const matchesLead = (t.lead?.name || "").toLowerCase().includes(query);
        const matchesAmount = String(t.amount).includes(query);
        if (!matchesDesc && !matchesLead && !matchesAmount) return false;
      }

      return true;
    });
  }, [transactions, selectedAccountId, typeFilter, selectedCategoryId, searchQuery]);

  const visibleTransactions = useMemo(() => {
    return filteredTransactions.slice(0, visibleCount);
  }, [filteredTransactions, visibleCount]);

  const handleDelete = useCallback(async (id: string) => {
    triggerHaptic("warning");
    if (!confirm(dict.deleteConfirmTitle + "\n" + dict.deleteConfirmDesc)) return;

    setDeletingId(id);
    try {
      const res = await deleteTransaction(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(dict.deleteBtn + " успешно");
        onRefresh();
      }
    } finally {
      setDeletingId(null);
    }
  }, [dict, onRefresh]);

  const getTypeBadge = useCallback((t: FinanceTransactionItem) => {
    switch (t.type) {
      case "INCOME":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
            Доход
          </span>
        );
      case "EXPENSE_COMPANY":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            <ArrowUpRight className="w-3 h-3 text-rose-600" />
            Расход
          </span>
        );
      case "TRANSFER_BETWEEN_ACCOUNTS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
            <ArrowRightLeft className="w-3 h-3 text-blue-600" />
            Перевод
          </span>
        );
      case "WITHDRAWAL_PARTNER":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-50 text-orange-700 border border-orange-200">
            <UserCheck className="w-3 h-3 text-orange-600" />
            {t.partner === "ELISEY" ? "Елисей" : "Даниил"}
          </span>
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden space-y-3">
      {/* ── ВЕРХНИЙ БАР: ТАБЫ ТИПОВ + ПОИСК + КАТЕГОРИИ ── */}
      <div className="p-3 sm:p-4 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Табы типов */}
        <div className="inline-flex bg-slate-100 p-1 rounded-2xl select-none max-w-full overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => handleTypeChange("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              typeFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {dict.typeAll}
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("INCOME")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              typeFilter === "INCOME" ? "bg-white text-emerald-700 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {dict.typeIncome}
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("EXPENSE_COMPANY")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              typeFilter === "EXPENSE_COMPANY" ? "bg-white text-rose-700 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {dict.typeExpense}
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("TRANSFER_BETWEEN_ACCOUNTS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              typeFilter === "TRANSFER_BETWEEN_ACCOUNTS" ? "bg-white text-blue-700 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {dict.typeTransfer}
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("WITHDRAWAL_PARTNER")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              typeFilter === "WITHDRAWAL_PARTNER" ? "bg-white text-orange-700 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {dict.typeWithdrawal}
          </button>
        </div>

        {/* Поиск и фильтр категории */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-9 pr-8 py-2 text-base sm:text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedCategoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 outline-none shrink-0"
          >
            <option value="ALL">Все статьи</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── СПИСОК ПРОВОДОК ── */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 text-center text-slate-400 font-medium text-xs">
          {dict.emptyState}
        </div>
      ) : (
        <>
          {/* МОБИЛЬНЫЙ ВИД (APPLE HIG CARD FEED) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {visibleTransactions.map((t) => {
              const dateStr = new Date(t.transactionDate || t.createdAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short",
              });
              const isIncome = t.type === "INCOME";
              const isExpense = t.type === "EXPENSE_COMPANY";
              const isTransfer = t.type === "TRANSFER_BETWEEN_ACCOUNTS";
              const isWithdrawal = t.type === "WITHDRAWAL_PARTNER";

              return (
                <div key={t.id} className="p-3.5 hover:bg-slate-50/80 transition space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getTypeBadge(t)}
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          {dateStr}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-2">
                        {t.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black font-mono text-sm block">
                        {isIncome ? (
                          <span className="text-emerald-600">
                            +{t.amount.toLocaleString("ru-RU")}&nbsp;₸
                          </span>
                        ) : isExpense ? (
                          <span className="text-rose-600">
                            -{t.amount.toLocaleString("ru-RU")}&nbsp;₸
                          </span>
                        ) : isWithdrawal ? (
                          <span className="text-orange-600">
                            -{t.amount.toLocaleString("ru-RU")}&nbsp;₸
                          </span>
                        ) : (
                          <span className="text-blue-600">
                            ⇄ {t.amount.toLocaleString("ru-RU")}&nbsp;₸
                          </span>
                        )}
                      </span>

                      <button
                        type="button"
                        disabled={deletingId === t.id}
                        onClick={() => handleDelete(t.id)}
                        className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 inline-flex items-center justify-center transition cursor-pointer mt-1 disabled:opacity-50 touch-manipulation"
                        title={dict.deleteBtn}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 truncate">
                      {isTransfer ? (
                        <span className="font-bold text-slate-700 truncate">
                          {t.account?.name} → {t.targetAccount?.name}
                        </span>
                      ) : (
                        <span className="font-bold text-slate-700 truncate">
                          {t.account?.name || "Основной"}
                        </span>
                      )}
                      {t.category && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-extrabold truncate">
                          {t.category.name}
                        </span>
                      )}
                    </div>

                    {t.lead && (
                      <a
                        href={`/admin/leads?search=${encodeURIComponent(t.lead.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-black text-orange-600 hover:underline shrink-0"
                      >
                        📦 {t.lead.name}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ДЕСКТОПНЫЙ ВИД (ПОЛНОЦЕННАЯ ТАБЛИЦА) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">{dict.colDate}</th>
                  <th className="py-3 px-4">{dict.colType}</th>
                  <th className="py-3 px-4">{dict.colAccount}</th>
                  <th className="py-3 px-4">{dict.colCategory}</th>
                  <th className="py-3 px-4">{dict.colDescription}</th>
                  <th className="py-3 px-4">{dict.colProject}</th>
                  <th className="py-3 px-4 text-right">{dict.colAmount}</th>
                  <th className="py-3 px-4 text-right">{dict.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleTransactions.map((t) => {
                  const dateStr = new Date(t.transactionDate || t.createdAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                  });
                  const isIncome = t.type === "INCOME";
                  const isExpense = t.type === "EXPENSE_COMPANY";
                  const isTransfer = t.type === "TRANSFER_BETWEEN_ACCOUNTS";
                  const isWithdrawal = t.type === "WITHDRAWAL_PARTNER";

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      {/* Дата */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-bold font-mono">
                        {dateStr}
                      </td>

                      {/* Тип */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getTypeBadge(t)}
                      </td>

                      {/* Счет */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isTransfer ? (
                          <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                            <span>{t.account?.name || "Счет"}</span>
                            <span className="text-slate-400">→</span>
                            <span className="text-blue-600">{t.targetAccount?.name || "Счет"}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-800 text-[11px]">
                            {t.account?.name || "Основной"}
                          </span>
                        )}
                      </td>

                      {/* Статья */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {t.category ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {t.category.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>

                      {/* Описание */}
                      <td className="py-3 px-4 max-w-xs truncate text-slate-800 font-medium">
                        {t.description}
                      </td>

                      {/* Сделка / Лид */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {t.lead ? (
                          <a
                            href={`/admin/leads?search=${encodeURIComponent(t.lead.name)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-black text-orange-600 hover:text-orange-700 hover:underline block truncate max-w-[160px]"
                          >
                            📦 {t.lead.name}
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>

                      {/* Сумма */}
                      <td className="py-3 px-4 whitespace-nowrap text-right font-black font-mono text-sm">
                        {isIncome ? (
                          <span className="text-emerald-600">
                            +{t.amount.toLocaleString("ru-RU")}&nbsp;₸
                          </span>
                        ) : isExpense ? (
                          <span className="text-rose-600">
                            -{t.amount.toLocaleString("ru-RU")}&nbsp;₸
                          </span>
                        ) : isWithdrawal ? (
                          <span className="text-orange-600">
                            -{t.amount.toLocaleString("ru-RU")}&nbsp;₸
                          </span>
                        ) : (
                          <span className="text-blue-600">
                            ⇄ {t.amount.toLocaleString("ru-RU")}&nbsp;₸
                          </span>
                        )}
                      </td>

                      {/* Действия */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          disabled={deletingId === t.id}
                          onClick={() => handleDelete(t.id)}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition cursor-pointer ml-auto touch-manipulation disabled:opacity-50"
                          title={dict.deleteBtn}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ПАГИНАЦИЯ / ПОКАЗАТЬ ЕЩЕ */}
          {filteredTransactions.length > visibleCount && (
            <div className="p-3 text-center border-t border-slate-100 bg-slate-50/50 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setVisibleCount((prev) => prev + 30);
                }}
                className="px-4 py-2 rounded-2xl bg-white border border-slate-200 hover:border-orange-500 font-extrabold text-xs text-slate-800 shadow-2xs transition cursor-pointer touch-manipulation"
              >
                Показать еще 30 (осталось {filteredTransactions.length - visibleCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setVisibleCount(filteredTransactions.length);
                }}
                className="px-3 py-2 rounded-2xl text-slate-500 hover:text-slate-900 font-bold text-xs transition cursor-pointer"
              >
                Показать все ({filteredTransactions.length})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
