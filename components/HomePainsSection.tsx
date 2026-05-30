"use client";

import { HOME_PILLARS } from "@/dictionaries/home";
import HomePainsCard from "@/components/HomePainsCard";

export default function HomePainsSection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden border-b border-slate-200 bg-slate-50">
      {/* --- Чертежная сетка на фоне (Blueprint Grid) --- */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.02) 1px, transparent 1px),
            linear-gradient(to right, rgba(15, 23, 42, 0.005) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.005) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
        }}
      />
      
      {/* Декоративное свечение */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.025)_0%,transparent_70%)] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 space-y-16 md:space-y-24">
        {/* Шапка секции */}
        <div className="max-w-3xl text-left space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
            Стандарты надежности при заказе{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
              наружной рекламы
            </span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg md:text-xl leading-relaxed font-medium">
            Предприниматели Астаны часто сталкиваются со скрытыми рисками при выборе подрядчиков. Мы открыто говорим о болях рынка и показываем, как наши стандарты производства защищают ваш бизнес.
          </p>
        </div>

        {/* Сетка из 4 раздельных Pillars */}
        <div className="space-y-16 md:space-y-24">
          {HOME_PILLARS.map((item, index) => (
            <HomePainsCard
              key={item.id}
              item={item}
              isEven={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
