"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Calculator, ChevronRight } from "lucide-react";
import { HOME_B2B_NICHES } from "@/dictionaries/home";
import { cn } from "@/lib/utils";
import ConsultationModal from "./ConsultationModal";
import * as Icons from "lucide-react";

export default function NicheServices() {
  const [activeNiche, setActiveNiche] = useState<string>("cafe");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState("Блок нишевых решений");

  const currentNiche = HOME_B2B_NICHES.find(n => n.id === activeNiche) || HOME_B2B_NICHES[0];

  // Dynamic Lucide icon mapping to support all niches safely
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Scissors": return Icons.Scissors;
      case "Heart": return Icons.Heart;
      case "Wrench": return Icons.Wrench;
      case "Store": return Icons.Store;
      default: return Icons.Coffee;
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
    setModalSource(`Блок решений: ${nicheTitle}`);
    setIsModalOpen(true);
  };

  return (
    <section id="niche-services-section" className="relative py-16 md:py-24 bg-white text-slate-900 overflow-x-clip border-b border-slate-200/80">
      {/* Subtle modern ambient background radial light flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/[0.015] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="max-w-3xl mb-14 md:mb-20">
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
                    "relative flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 select-none focus:outline-none shrink-0",
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
                        <IconComponent className="w-3.5 h-3.5"/>
                        <span>{currentNiche.badge}</span>
                     </div>
                     <span className="text-xs text-slate-500 font-bold">Сметный бюджет: <span className="text-slate-950 font-black">{currentNiche.priceRange}</span></span>
                  </div>

                  <h3 className="text-2xl sm:text-3.5xl font-black text-slate-950 leading-tight" itemProp="name">
                     Идеальная {currentNiche.keywordTitle}
                  </h3>

                  <p className="text-slate-650 text-sm sm:text-base leading-relaxed font-medium" itemProp="description">
                     {currentNiche.description}
                  </p>


                  {/* Engineer Recommendation Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-150/70 shadow-sm space-y-2">
                     <span className="text-xs font-black text-slate-950 tracking-wider uppercase block">Рекомендация инженера:</span>
                     <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        {currentNiche.recommendation}
                     </p>
                  </div>

                  {/* Astana Design-Code requirements info block */}
                  <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50 space-y-2">
                     <span className="text-xs font-black text-orange-800 tracking-wider uppercase block flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-orange-600"/> Дизайн-код Астаны:
                     </span>
                     <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {currentNiche.designCodeTip}
                     </p>
                  </div>

                  {/* Premium Option 1: Clean, clickable sub-niches that route to landing pages */}
                  <div className="space-y-3.5 pt-2">
                     <span className="text-xs font-black text-slate-950 tracking-wider uppercase block">
                        {currentNiche.subNicheTitle}
                     </span>
                     <div className="flex flex-wrap gap-2.5">
                        {currentNiche.lsiKeywords.map((kw, i) => (
                           <Link 
                              key={i} 
                              href={kw.link}
                              onClick={triggerHaptic}
                              className="group/tag inline-flex items-center gap-1.5 pl-3.5 pr-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(249,115,22,0.06)] hover:border-orange-500/20 active:scale-95"
                              title={`Подробнее про вывески для: ${kw.label}`}
                           >
                              <span>{kw.label}</span>
                              <span className="inline-flex items-center justify-center pl-1 text-[9px] font-black uppercase text-slate-400 group-hover/tag:text-orange-600 transition-colors">
                                 Подробнее
                                 <ChevronRight className="w-3 h-3 ml-0.5 transform group-hover/tag:translate-x-0.5 transition-transform" />
                              </span>
                           </Link>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right Column: Key Configurations and Forms */}
               <div className="lg:col-span-5 space-y-6 h-full flex flex-col justify-between self-stretch">
                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Рекомендуемые конструкции:</h4>
                     
                     <div className="space-y-3">
                        {currentNiche.optimalSigns.map((sign, idx) => (
                           <div 
                              key={idx} 
                              className="group/item flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-orange-500/15 hover:shadow-md transition duration-300"
                           >
                              <div className="text-left space-y-1">
                                 <span className="text-xs font-extrabold text-slate-900 group-hover/item:text-orange-600 transition-colors block">
                                    {sign.type}
                                 </span>
                                 <span className="text-[10px] text-slate-450 block font-semibold">
                                    {sign.reason}
                                 </span>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                 <span className="text-xs font-black text-slate-900">{sign.price}</span>
                                 <Link 
                                    href={sign.link} 
                                    onClick={triggerHaptic}
                                    className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition duration-200 border border-slate-200/50"
                                    title="Посмотреть примеры работ"
                                 >
                                    <ChevronRight className="w-4 h-4"/>
                                 </Link>
                              </div>
                           </div>
                        ))}

                        {/* All Services custom redirect card */}
                        <Link 
                           href="/services"
                           onClick={triggerHaptic}
                           className="group/all-services flex items-center justify-between p-4 rounded-2xl bg-slate-100/40 border border-dashed border-slate-300 hover:bg-slate-100/80 hover:border-slate-400 hover:shadow-sm transition-all duration-300"
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
                        <span className="text-slate-450">Сроки производства:</span>
                        <span className="text-slate-900 font-extrabold">3-5 рабочих дней</span>
                     </div>
                     <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-450">Гарантия в договоре:</span>
                        <span className="text-slate-900 font-extrabold">от 12 до 36 месяцев</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3 pt-2">
                        <button 
                           onClick={() => openConsultation(currentNiche.title)}
                           className="h-12 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs uppercase tracking-wider rounded-xl transition border border-slate-200 shadow-sm active:scale-97"
                        >
                           Консультация
                        </button>
                        <Link 
                           href="/calculator"
                           onClick={triggerHaptic}
                           className="h-12 flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-950/10 active:scale-97 transition gap-1.5"
                        >
                           <Calculator className="w-4 h-4"/> Расчет сметы
                        </Link>
                      </div>
                  </div>
               </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
      
      </div>

      {/* CONSULTATION POPUP */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source={modalSource}
      />
    </section>
  );
}
