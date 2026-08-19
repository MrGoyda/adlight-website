"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HOME_B2B_NICHES } from "@/dictionaries/home";
import { cn } from "@/lib/utils";
import NicheCard from "@/components/services/NicheCard";
import { Scissors, Heart, Wrench, Store, Coffee } from "lucide-react";
import { useModalStore } from "@/lib/store/useModalStore";

export default function NicheServices() {
  const [activeNiche, setActiveNiche] = useState<string>("cafe");
  const { openConsultation: openGlobalConsultation } = useModalStore();

  const currentNiche = HOME_B2B_NICHES.find(n => n.id === activeNiche) || HOME_B2B_NICHES[0];

  // Dynamic Lucide icon mapping to support all niches safely
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Scissors": return Scissors;
      case "Heart": return Heart;
      case "Wrench": return Wrench;
      case "Store": return Store;
      default: return Coffee;
    }
  };

  const IconComponent = getIcon(currentNiche.iconName);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleNicheChange = (nicheId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveNiche(nicheId);
    triggerHaptic();

    // Smooth horizontal scroll tabs alignment for mobile screens
    const clickedButton = event.currentTarget;
    clickedButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });

    // Smoothly scroll the entire window to align the content card immediately below sticky elements
    setTimeout(() => {
      const anchor = document.getElementById("niche-services-content-anchor");
      if (anchor) {
        anchor.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 150);
  };

  const openConsultation = (nicheTitle: string) => {
    openGlobalConsultation({
      source: `Блок решений: ${nicheTitle}`,
      title: `Вывески для: ${nicheTitle}`,
      subtitle: "Оставьте контакты. Разработаем индивидуальную концепцию оформления и вывески под ваш бизнес.",
      buttonText: "Получить предложение",
    });
  };

  return (
    <section id="niche-services-section" className="relative py-16 md:py-24 bg-white text-slate-900 overflow-x-clip border-b border-slate-200/80">
      {/* Subtle modern ambient background radial light flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/[0.015] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="max-w-3xl mb-14 md:mb-20 text-left">
          <div className="inline-flex">
            <span className="px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/40 rounded-full mb-4">
              Решения под Ваш Бизнес
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none mb-6">
            Какая вывеска нужна <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
              именно вашему бизнесу?
            </span>
          </h2>
          <p className="text-slate-650 text-base sm:text-lg font-medium leading-relaxed">
            В наружной рекламе нет универсальных решений. Каждая ниша диктует свои правила привлечения клиентов, а архитектурные требования Астаны накладывают жесткие рамки. Мы подготовили специализированные проекты под вашу специфику.
          </p>
        </div>

        {/* STICKY CENTERING INTERACTIVE TABS */}
        <div className="sticky top-[58px] sm:top-[68px] lg:top-[76px] z-30 -mx-4 px-4 py-6 md:py-8 bg-white/95 backdrop-blur-md border-b border-slate-200/30 flex justify-start lg:justify-center overflow-x-auto scrollbar-hide -webkit-overflow-scrolling-touch mb-12 md:mb-20 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60 w-max shrink-0 gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">

            {HOME_B2B_NICHES.map((niche) => {
              const isActive = niche.id === activeNiche;
              const TabIcon = getIcon(niche.iconName);

              return (
                <button
                  key={niche.id}
                  onClick={(e) => handleNicheChange(niche.id, e)}
                  className={cn(
                    "relative flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 select-none focus:outline-none shrink-0 cursor-pointer",
                    isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNicheIndicator"
                      className="absolute inset-0 bg-white border border-slate-250/60 shadow-[0_4px_14px_rgba(15,23,42,0.06)] rounded-xl z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <TabIcon className={cn("w-4 h-4 transition-colors", isActive ? "text-orange-600" : "text-slate-450")} />
                    {niche.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DETAIL INTERACTIVE CONTAINER WITH SCROLL ANCHOR */}
        <div className="relative">
          <div id="niche-services-content-anchor" className="absolute -top-[140px] sm:-top-[160px] lg:-top-[190px]" />
          
          <div className="relative rounded-3xl border border-slate-200/60 bg-slate-50/40 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            {/* Gentle background gradient mapped to active niche */}
            <div className={cn("absolute inset-0 bg-gradient-to-br transition-all duration-500", currentNiche.gradient, "pointer-events-none -z-10")} />
            
            <AnimatePresence mode="wait">
              <NicheCard
                key={activeNiche}
                activeNiche={activeNiche}
                currentNiche={currentNiche}
                IconComponent={IconComponent}
                triggerHaptic={triggerHaptic}
                openConsultation={openConsultation}
              />
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
