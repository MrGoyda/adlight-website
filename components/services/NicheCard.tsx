"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ChevronRight, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface NicheCardProps {
  activeNiche: string;
  currentNiche: any;
  IconComponent: any;
  triggerHaptic: () => void;
  openConsultation: (nicheTitle: string) => void;
}

export default function NicheCard({
  activeNiche,
  currentNiche,
  IconComponent,
  triggerHaptic,
  openConsultation
}: NicheCardProps) {
  return (
    <motion.div
      key={activeNiche}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10"
      itemScope
      itemType="https://schema.org/Service"
    >
      {/* Left Column: Context, Advice, and SEO Landing Pages tags */}
      <div className="lg:col-span-7 space-y-6">
        {/* Semantic Meta for AISO and Search Engines */}
        <meta itemProp="serviceType" content={currentNiche.title} />
        <meta itemProp="provider" content="ADLight" />
        <meta itemProp="areaServed" content="Astana" />
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="hidden">
          <meta itemProp="priceCurrency" content="KZT" />
          <meta itemProp="price" content={currentNiche.priceRange.replace(/\D/g, '') || "100000"} />
          <meta itemProp="priceSpecification" content={currentNiche.priceRange} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] uppercase font-black border tracking-wider", currentNiche.tagColor)}>
            <IconComponent className="w-3.5 h-3.5" />
            <span>{currentNiche.badge}</span>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            Сметный бюджет: <span className="text-slate-950 font-black">{currentNiche.priceRange}</span>
          </span>
        </div>

        <h3 className="text-2xl sm:text-3.5xl font-black text-slate-950 leading-tight text-left" itemProp="name">
          Идеальная {currentNiche.keywordTitle}
        </h3>

        <p className="text-slate-650 text-sm sm:text-base leading-relaxed font-medium text-left" itemProp="description">
          {currentNiche.description}
        </p>

        {/* Engineer Recommendation Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-150/70 shadow-sm space-y-2 text-left">
          <span className="text-xs font-black text-slate-950 tracking-wider uppercase block">Рекомендация инженера:</span>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            {currentNiche.recommendation}
          </p>
        </div>

        {/* Astana Design-Code requirements info block */}
        <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50 space-y-2 text-left">
          <span className="text-xs font-black text-orange-800 tracking-wider uppercase block flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-600" /> Дизайн-код Астаны:
          </span>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            {currentNiche.designCodeTip}
          </p>
        </div>

        {/* Premium Option 1: Clean, clickable sub-niches that route to landing pages */}
        <div className="space-y-3.5 pt-2 text-left">
          <span className="text-xs font-black text-slate-950 tracking-wider uppercase block">
            {currentNiche.subNicheTitle}
          </span>
          <div className="flex flex-wrap gap-2.5">
            {currentNiche.lsiKeywords.map((kw: any, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  triggerHaptic();
                  openConsultation(kw.label);
                }}
                className="group/tag inline-flex items-center gap-1.5 pl-3.5 pr-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(249,115,22,0.06)] hover:border-orange-500/20 active:scale-95 cursor-pointer"
                title={`Заказать вывеску для: ${kw.label}`}
              >
                <span>{kw.label}</span>
                <span className="inline-flex items-center justify-center pl-1 text-[9px] font-black uppercase text-slate-400 group-hover/tag:text-orange-600 transition-colors">
                  Подробнее
                  <ChevronRight className="w-3 h-3 ml-0.5 transform group-hover/tag:translate-x-0.5 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Key Configurations and Forms */}
      <div className="lg:col-span-5 space-y-6 h-full flex flex-col justify-between self-stretch">
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 text-left">Рекомендуемые конструкции:</h4>

          <div className="space-y-3">
            {currentNiche.optimalSigns.map((sign: any, idx: number) => (
              <div
                key={idx}
                className="group/item flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-orange-500/15 hover:shadow-md transition duration-300"
              >
                <div className="text-left space-y-1">
                  <span className="text-xs font-extrabold text-slate-900 group-hover/item:text-orange-600 transition-colors block">
                    {sign.type}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    {sign.reason}
                  </span>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-xs font-black text-slate-900">{sign.price}</span>
                  <Link
                    href={sign.link}
                    onClick={triggerHaptic}
                    className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition duration-200 border border-slate-200/50 cursor-pointer"
                    title="Посмотреть примеры работ"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}

            {/* All Services custom redirect card */}
            <Link
              href="/services"
              onClick={triggerHaptic}
              className="group/all-services flex items-center justify-between p-4 rounded-2xl bg-slate-100/40 border border-dashed border-slate-300 hover:bg-slate-100/80 hover:border-slate-400 hover:shadow-sm transition-all duration-300 text-left"
            >
              <div className="text-left space-y-1 max-w-[70%]">
                <span className="text-xs font-extrabold text-slate-900 group-hover/all-services:text-orange-600 transition-colors block">
                  Любая другая конструкция
                </span>
                <span className="text-[10px] text-slate-500 block font-semibold leading-tight">
                  Реализуем абсолютно любой проект под ключ по вашим эскизам или ТЗ
                </span>
              </div>
              <div className="text-right flex items-center gap-1 text-xs font-black text-orange-600 group-hover/all-services:text-orange-700 transition-colors pl-2 shrink-0">
                <span>Все услуги</span>
                <ChevronRight className="w-3.5 h-3.5 transform group-hover/all-services:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 space-y-4 mt-auto">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">Сроки производства:</span>
            <span className="text-slate-900 font-extrabold">3-5 рабочих дней</span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">Гарантия в договоре:</span>
            <span className="text-slate-900 font-extrabold">от 12 до 36 месяцев</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => openConsultation(currentNiche.title)}
              variant="lightOutline"
              className="w-full text-xs font-extrabold h-12"
              title="Получить консультацию"
            >
              Консультация
            </Button>
            <Button
              href="/calculator"
              onClick={triggerHaptic}
              variant="solid"
              className="w-full text-xs font-extrabold h-12"
              leftIcon={<Calculator className="w-4 h-4" />}
              title="Рассчитать смету вывески"
            >
              Расчет сметы
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
