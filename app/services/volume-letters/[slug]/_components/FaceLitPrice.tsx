// app/services/volume-letters/[slug]/_components/FaceLitPrice.tsx
'use client';

import Link from "next/link";
import { Calculator, CheckCircle } from "lucide-react";
import { VolumeLetterDetailData } from "@/dictionaries/services/volume-letters";

interface FaceLitPriceProps {
  data: VolumeLetterDetailData;
}

export default function FaceLitPrice({ data }: FaceLitPriceProps) {
  return (
    <section className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-100/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-stretch">
          
          <div className="md:w-5/12 bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Calculator className="w-32 h-32 text-slate-900"/>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-orange-600 font-extrabold text-sm uppercase tracking-wider mb-4">
                <CheckCircle className="w-4 h-4 text-orange-600"/> Прозрачная смета
              </div>
              <h2 className="text-3xl font-bold text-slate-950 mb-4 tracking-tight">Стоимость производства</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Собственное современное производство в Астане позволяет нам предлагать честные фабричные цены без посреднических накруток и скрытых платежей.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs uppercase font-extrabold tracking-wider mb-1">Базовая ставка</p>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-500 text-sm">от</span>
                <span className="text-5xl font-black text-slate-950">{data.price}</span>
                <span className="text-orange-600 text-xl font-bold">₸ / см</span>
              </div>
            </div>
          </div>

          <div className="md:w-7/12 bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.02)]">
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
                <div>
                  <h3 className="text-slate-950 font-bold text-xl tracking-tight">Пример сметного расчета</h3>
                  <p className="text-slate-500 text-sm">{data.priceExample.title}</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-slate-900 font-mono text-sm font-semibold shadow-sm">
                  {data.priceExample.quantity}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm p-2 rounded bg-white/60 border border-slate-100">
                  <span className="text-slate-500 font-medium">Высота букв</span>
                  <span className="text-slate-900 font-mono font-bold">{data.priceExample.height}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded bg-white/60 border border-slate-100">
                  <span className="text-slate-500 font-medium">Комплектация / Материалы</span>
                  <span className="text-slate-900 font-semibold text-right max-w-[240px] truncate">{data.priceExample.face}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded bg-white/60 border border-slate-100">
                  <span className="text-slate-500 font-medium">LED Подсветка</span>
                  <span className="text-green-600 font-mono font-bold text-xs">ВКЛЮЧЕНО (Класс защиты IP67)</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex justify-between items-end mb-6">
                <span className="text-slate-500 text-sm font-medium">Итоговая ориентировочная стоимость:</span>
                <span className="text-3xl font-black text-slate-950 tracking-tight">{data.priceExample.total}</span>
              </div>
              <Link href="/calculator" className="group block w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-center transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-600/10">
                <Calculator className="w-5 h-5"/> Рассчитать вывеску онлайн
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
