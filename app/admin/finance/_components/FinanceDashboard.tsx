"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { 
  FinanceAccountItem, 
  FinanceCategoryItem, 
  CompanyFundItem, 
  FinanceTransactionItem 
} from "../_types/financeTypes";
import FinanceTabBar, { FinanceTabType } from "./FinanceTabBar";
import FinanceAccountsBento from "./treasury/FinanceAccountsBento";
import FinanceTransactionsTable from "./treasury/FinanceTransactionsTable";
import FinanceAnalyticsView from "./analytics/FinanceAnalyticsView";
import FinanceProjectsView from "./projects/FinanceProjectsView";
import FinancePartnersView from "./partners/FinancePartnersView";

// Ленивая загрузка модальных окон для минимизации начального бандла
const FinanceIncomeModal = dynamic(() => import("./treasury/FinanceIncomeModal"), { ssr: false });
const FinanceExpenseModal = dynamic(() => import("./treasury/FinanceExpenseModal"), { ssr: false });
const FinanceTransferModal = dynamic(() => import("./treasury/FinanceTransferModal"), { ssr: false });
const FinanceWithdrawalModal = dynamic(() => import("./treasury/FinanceWithdrawalModal"), { ssr: false });

interface FinanceDashboardProps {
  accounts: FinanceAccountItem[];
  categories: FinanceCategoryItem[];
  funds: CompanyFundItem[];
  transactions: FinanceTransactionItem[];
  leads?: { id: string; name: string; phone: string }[];
  totalCashbox?: number;
}

export default function FinanceDashboard({
  accounts = [],
  categories = [],
  funds = [],
  transactions = [],
  leads = [],
}: FinanceDashboardProps) {
  const router = useRouter();

  // Активная вкладка рабочего пространства
  const [activeTab, setActiveTab] = useState<FinanceTabType>("TREASURY");

  // Выбранный счет для быстрой фильтрации в Казначействе
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Состояния модальных окон
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  // Обработка входящего URL параметра ?action=add-expense
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "add-expense") {
        setIsExpenseModalOpen(true);
      } else if (params.get("action") === "add-income") {
        setIsIncomeModalOpen(true);
      }
    }
  }, []);

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16">
      {/* ── СЕГМЕНТИРОВАННЫЙ ТАБ-БАР (APPLE / LINEAR STYLE) ── */}
      <FinanceTabBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* ── 1. ПРОСТРАНСТВО: КАЗНАЧЕЙСТВО И СЧЕТА ── */}
      {activeTab === "TREASURY" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <FinanceAccountsBento
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onSelectAccount={setSelectedAccountId}
            onOpenTransferModal={() => setIsTransferModalOpen(true)}
            onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
            onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
          />

          <FinanceTransactionsTable
            transactions={transactions}
            categories={categories}
            selectedAccountId={selectedAccountId}
            onRefresh={handleRefresh}
          />
        </div>
      )}

      {/* ── 2. ПРОСТРАНСТВО: ОТЧЕТ ДДС И P&L ── */}
      {activeTab === "ANALYTICS" && (
        <FinanceAnalyticsView />
      )}

      {/* ── 3. ПРОСТРАНСТВО: ПЛАН-ФАКТ ПРОЕКТОВ ── */}
      {activeTab === "PROJECTS" && (
        <FinanceProjectsView />
      )}

      {/* ── 4. ПРОСТРАНСТВО: ПАРТНЕРЫ И ФОНДЫ ── */}
      {activeTab === "PARTNERS" && (
        <FinancePartnersView
          funds={funds}
          onOpenWithdrawalModal={() => setIsWithdrawalModalOpen(true)}
        />
      )}

      {/* ── ЛЕНИВЫЕ МОДАЛЬНЫЕ ОКНА БЫСТРЫХ ОПЕРАЦИЙ ── */}
      {isIncomeModalOpen && (
        <FinanceIncomeModal
          isOpen={isIncomeModalOpen}
          onClose={() => setIsIncomeModalOpen(false)}
          accounts={accounts}
          categories={categories}
          leads={leads}
          onSuccess={handleRefresh}
        />
      )}

      {isExpenseModalOpen && (
        <FinanceExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          accounts={accounts}
          categories={categories}
          leads={leads}
          onSuccess={handleRefresh}
        />
      )}

      {isTransferModalOpen && (
        <FinanceTransferModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          accounts={accounts}
          onSuccess={handleRefresh}
        />
      )}

      {isWithdrawalModalOpen && (
        <FinanceWithdrawalModal
          isOpen={isWithdrawalModalOpen}
          onClose={() => setIsWithdrawalModalOpen(false)}
          accounts={accounts}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
