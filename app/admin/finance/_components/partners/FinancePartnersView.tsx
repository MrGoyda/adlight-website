"use client";

import React, { useState, useEffect } from "react";
import { getPartnersEquity } from "../../actions";
import { PartnerEquityBreakdown, CompanyFundItem } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";
import PartnerEquityCard from "./PartnerEquityCard";
import CompanyFundsCard from "./CompanyFundsCard";

interface FinancePartnersViewProps {
  funds: CompanyFundItem[];
  onOpenWithdrawalModal: () => void;
}

export default function FinancePartnersView({
  funds,
  onOpenWithdrawalModal,
}: FinancePartnersViewProps) {
  const dict = FINANCE_DICTIONARY.partners;
  const [equity, setEquity] = useState<PartnerEquityBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    getPartnersEquity().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setEquity(res.data);
      }
      if (!isCancelled) setLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* ── ЗАГОЛОВОК ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs">
        <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
          {dict.title}
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {dict.subtitle}
        </p>
      </div>

      {/* ── КАРТОЧКИ ПАРТНЕРОВ (ЕЛИСЕЙ & ДАНИИЛ) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {equity.map((eq) => (
          <PartnerEquityCard
            key={eq.partner}
            equity={eq}
            onOpenWithdrawalModal={onOpenWithdrawalModal}
          />
        ))}
      </div>

      {/* ── ФОНДЫ КОМПАНИИ ── */}
      <CompanyFundsCard funds={funds} />
    </div>
  );
}
