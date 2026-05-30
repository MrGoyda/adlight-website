"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import * as Icons from "lucide-react";

export default function DynamicServicesHub() {
  const [activeTab, setActiveTab] = useState<string>("facade");

  // Тактильный отклик при переключении табов
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleTabChange = (tabId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(tabId);
    triggerHaptic();
    
    // Smooth horizontal scroll tabs alignment for mobile screens
    const clickedButton = event.currentTarget;
    clickedButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });

    // Smoothly scroll the entire window to align the content grid immediately below sticky elements
    setTimeout(() => {
      const anchor = document.getElementById("dynamic-services-hub-content-anchor");
      if (anchor) {
        anchor.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 150);
  };

  return (
    <section id="dynamic-services-hub-section" className="relative py-16 md:py-24 bg-white text-slate-900 overflow-x-clip border-b border-slate-200">
      {/* Decorative background vectors */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.015)_0%,transparent_70%)] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.02)_0%,transparent_70%)] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* BLOCK HEADER */}
        <div className="max-w-3xl text-left space-y-4 mb-14 md:mb-20">
          <div className="inline-flex">
            <span className="px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/50 rounded-full">
              Комплексные решения
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
            Категории рекламных решений <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
              для любого масштаба бизнеса
            </span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg md:text-xl leading-relaxed font-medium">
            От точечного ремонта и интерьерных табличек до грандиозных крышных установок и брендирования коммерческих автопарков.
          </p>
        </div>

        {/* STICKY SEGMENTED CONTROL TABS */}
        <div className="sticky top-[58px] sm:top-[68px] lg:top-[76px] z-30 -mx-4 px-4 py-6 md:py-8 bg-white/95 backdrop-blur-md border-b border-slate-200/30 flex justify-start lg:justify-center overflow-x-auto scrollbar-hide -webkit-overflow-scrolling-touch mb-12 md:mb-20 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60 w-max shrink-0 gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
            {CATALOG_SERVICES.map((group) => {
              const isActive = activeTab === group.id;
              
              // Dynamic category icon loading
              let IconComponent = Icons.Store;
              if (group.iconName === "Zap") IconComponent = Icons.Zap;
              if (group.iconName === "Building") IconComponent = Icons.Building;
              if (group.iconName === "Wrench") IconComponent = Icons.Wrench;

              return (
                <button
                  key={group.id}
                  onClick={(e) => handleTabChange(group.id, e)}
                  className={cn(
                    "relative flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-200 select-none focus:outline-none shrink-0",
                    isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {/* Sliding active indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white border border-slate-200 shadow-[0_4px_12px_rgba(15,23,42,0.06)] rounded-xl z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <IconComponent className={cn("w-4 h-4 transition-colors", isActive ? "text-orange-600" : "text-slate-450")} />
                    {group.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SERVICE GRID WITH ANCHOR */}
        <div className="relative">
          <div id="dynamic-services-hub-content-anchor" className="absolute -top-[140px] sm:-top-[160px] lg:-top-[190px]" />

          <AnimatePresence mode="wait">
            {CATALOG_SERVICES.map((group) => {
              if (group.id !== activeTab) return null;

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex lg:grid lg:grid-cols-4 gap-6 lg:gap-8 overflow-x-auto lg:overflow-x-visible pb-6 lg:pb-0 scrollbar-hide -webkit-overflow-scrolling-touch snap-x snap-mandatory w-full -mx-4 px-4 lg:mx-0 lg:px-0"
                >
                  {group.items.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/80 hover:border-orange-500/20 p-5 shadow-sm hover:shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition-all duration-500 relative shrink-0 w-[280px] sm:w-[320px] lg:w-full lg:shrink snap-start"
                      >
                        <div>
                          {/* Картинка */}
                          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-slate-50 border border-slate-100">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover rounded-2xl group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                              sizes="(max-width: 768px) 100vw, 25vw"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 rounded-2xl border border-black/[0.03] z-20 pointer-events-none" />
                          </div>

                          {/* Тексты */}
                          <div className="space-y-2 mb-4">
                            <h3 className="text-lg md:text-xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Цена и кнопка */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                          <span className="text-xs sm:text-sm font-black text-slate-900">
                            {item.price}
                          </span>
                          
                          <Link
                            href={item.link}
                            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors"
                          >
                            Смотреть
                            <span className="inline-block transform group-hover:translate-x-0.5 transition-transform">→</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
