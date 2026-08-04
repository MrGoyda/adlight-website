"use client";

import React from "react";
import { PartnerName } from "@prisma/client";
import Button from "@/components/ui/Button";
import { crmDict } from "@/dictionaries/crm";

interface CompanyOption {
  id: string;
  name: string;
  projects: { id: string; title: string }[];
  contacts: { id: string; name: string; position: string | null }[];
}

interface LeadParamsSidebarProps {
  name: string;
  onNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  manager: PartnerName | "";
  onManagerChange: (val: PartnerName | "") => void;
  companyId: string;
  onCompanyChange: (val: string) => void;
  projectId: string;
  onProjectChange: (val: string) => void;
  companies?: CompanyOption[];
  address: string;
  onAddressChange: (val: string) => void;
  appDate: string;
  onAppDateChange: (val: string) => void;
  deadline: string;
  onDeadlineChange: (val: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function LeadParamsSidebar({
  name,
  onNameChange,
  phone,
  onPhoneChange,
  manager,
  onManagerChange,
  companyId,
  onCompanyChange,
  projectId,
  onProjectChange,
  companies = [],
  address,
  onAddressChange,
  appDate,
  onAppDateChange,
  deadline,
  onDeadlineChange,
  onSave,
  isSaving,
}: LeadParamsSidebarProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-sm font-black text-slate-900 pb-3 border-b border-slate-100 uppercase tracking-wider">
        {crmDict.leadDetail.parametersTitle}
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {crmDict.leadDetail.fioLabel}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {crmDict.leadDetail.phoneLabel}
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {crmDict.leadDetail.managerLabel}
          </label>
          <select
            value={manager}
            onChange={(e) => onManagerChange(e.target.value as PartnerName | "")}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-orange-500/50 cursor-pointer"
          >
            <option value="">{crmDict.leadDetail.notAssigned}</option>
            <option value="DANIIL">Даниил</option>
            <option value="ELISEY">Елисей</option>
          </select>
        </div>

        {/* B2B Компания */}
        <div>
          <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">
            🏢 B2B Компания
          </label>
          <select
            value={companyId}
            onChange={(e) => {
              onCompanyChange(e.target.value);
              onProjectChange(""); // сбросить проект при смене компании
            }}
            className="w-full bg-orange-50/40 border border-orange-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="">Не привязана к компании</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* B2B Проект (если выбрана компания) */}
        {companyId && (() => {
          const activeCompanyObj = companies.find(c => c.id === companyId);
          const projects = activeCompanyObj?.projects || [];

          return (
            <div>
              <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1">
                📂 Проект / Объект
              </label>
              <select
                value={projectId}
                onChange={(e) => onProjectChange(e.target.value)}
                className="w-full bg-purple-50/40 border border-purple-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="">Общая сделка компании</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          );
        })()}

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {crmDict.leadDetail.addressLabel}
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="г. Астана, ул. Аспара, 7..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {crmDict.leadDetail.appointmentDateLabel}
            </label>
            <input
              type="datetime-local"
              value={appDate}
              onChange={(e) => onAppDateChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-orange-500/50 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {crmDict.leadDetail.deadlineLabel}
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => onDeadlineChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-orange-500/50 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={() => onSave()}
        disabled={isSaving}
        variant="solid"
        className="w-full text-xs font-black py-2.5 mt-2"
      >
        {isSaving ? crmDict.leadDetail.saving : crmDict.leadDetail.saveParametersBtn}
      </Button>
    </div>
  );
}
