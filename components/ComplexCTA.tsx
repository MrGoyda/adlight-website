"use client";

import Link from "next/link";
import { useState } from "react";
import { Calculator, CheckCircle, ArrowRight, ShieldCheck, Ruler, Zap } from "lucide-react";

interface ComplexCTAProps {
  source: string;
}

export default function ComplexCTA({ source }: ComplexCTAProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `👋 Заявка на комплексное оформление!\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}\n📍 Источник: ${source}`;
    window.open(`https://wa.me/77071356701?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative overflow-hidden">
      {/* Фоновый эффект */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
           <div className="grid lg:grid-cols-2">
              
              {/* ЛЕВАЯ ЧАСТЬ: ОФФЕР И КАЛЬКУЛЯТОР */}
              <div className="p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-center">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold mb-6 w-fit">
                    <Zap className="w-4 h-4"/> Скидка 10% на комплекс
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Открываете новую точку? <br/>
                    <span className="text-orange-500">Оформите всё сразу.</span>
                 </h2>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Вывеска + Режимник + Уголок покупателя. Мы берем на себя замеры, дизайн и согласование.
                 </p>
                 
                 <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 text-white font-medium">
                       <CheckCircle className="w-5 h-5 text-orange-500"/> Бесплатный выезд на замер
                    </li>
                    <li className="flex items-center gap-3 text-white font-medium">
                       <CheckCircle className="w-5 h-5 text-orange-500"/> 3 варианта дизайна в подарок
                    </li>
                    <li className="flex items-center gap-3 text-white font-medium">
                       <CheckCircle className="w-5 h-5 text-orange-500"/> Монтаж в удобное время (24/7)
                    </li>
                 </ul>

                 <Link href="/calculator" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition border border-slate-700">
                    <Calculator className="w-5 h-5 text-orange-500"/> 
                    Рассчитать стоимость самому
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                 </Link>
              </div>

              {/* ПРАВАЯ ЧАСТЬ: ФОРМА ЗАЯВКИ */}
              <div className="p-8 md:p-12 lg:p-16 bg-slate-900 flex flex-col justify-center relative">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
                 <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">Получите консультацию инженера</h3>
                    <p className="text-gray-400 mb-8">Оставьте номер, мы подскажем, как сэкономить бюджет без потери качества.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                       <div>
                          <input 
                            type="text" 
                            placeholder="Ваше имя" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl placeholder:text-gray-500 focus:ring-2 focus:ring-orange-600 outline-none transition" 
                            required
                          />
                       </div>
                       <div>
                          <input 
                            type="tel" 
                            placeholder="+7 (___) ___-__-__" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl placeholder:text-gray-500 focus:ring-2 focus:ring-orange-600 outline-none transition" 
                            required
                          />
                       </div>
                       <button 
                          type="submit" 
                          className="w-full py-4 bg-orange-600 text-white font-bold text-lg rounded-xl hover:bg-orange-700 transition active:scale-95 shadow-lg shadow-orange-900/30"
                       >
                          Жду звонка
                       </button>
                    </form>

                    <div className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-slate-800">
                       <div className="flex items-center gap-2 text-xs text-gray-500">
                          <ShieldCheck className="w-4 h-4 text-green-500"/> Гарантия по договору
                       </div>
                       <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Ruler className="w-4 h-4 text-orange-500"/> Точный замер
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </section>
  );
}