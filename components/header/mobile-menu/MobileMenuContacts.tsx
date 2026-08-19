"use client";

import React from "react";
import Link from "next/link";
import { Calculator, ChevronRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import { COMPANY_NAP } from "@/dictionaries/common";

interface MobileMenuContactsProps {
  onLinkClick: () => void;
}

export default function MobileMenuContacts({ onLinkClick }: MobileMenuContactsProps) {
  return (
    <>
      {/* Инструменты */}
      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
          Инструменты
        </h4>
        <Link
          href="/calculator"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 border border-orange-200/50 text-orange-600 hover:text-orange-700 hover:bg-orange-100/50 transition duration-300 active:scale-[0.98]"
          onClick={onLinkClick}
        >
          <span className="flex items-center gap-3 font-extrabold text-sm">
            <Calculator className="w-5 h-5" />
            Онлайн-калькулятор вывесок
          </span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Контактные данные */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 text-left">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Контактная информация
        </h4>
        <div className="space-y-2.5 text-xs font-semibold text-slate-700">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-900 font-extrabold block">Наше производство:</span>
              <span>г. {COMPANY_NAP.locality}, {COMPANY_NAP.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-orange-500 shrink-0" />
            <div>
              <span className="text-slate-900 font-extrabold block">Телефон:</span>
              <a href={`tel:${COMPANY_NAP.phoneRaw}`} className="hover:text-orange-600 transition">
                {COMPANY_NAP.phone}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-orange-500 shrink-0" />
            <div>
              <span className="text-slate-900 font-extrabold block">Email:</span>
              <a href={`mailto:${COMPANY_NAP.email}`} className="hover:text-orange-600 transition">
                {COMPANY_NAP.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-900 font-extrabold block">Часы работы цеха:</span>
              <span>{COMPANY_NAP.workingHours}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
