"use client";

import React from "react";
import Link from "next/link";
import { 
  X, 
  Home, 
  Store, 
  Building, 
  MapPin, 
  ChevronDown, 
  ChevronRight, 
  Zap, 
  ArrowUpRight, 
  Calculator, 
  Instagram, 
  Send, 
  User, 
  FileText 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";
import { COMPANY_NAP } from "@/dictionaries/common";
import Button from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
}

const GroupIconMap = {
  Store,
  Zap,
  Building,
  Wrench: Zap // fallback or custom mapping if needed
};

function renderGroupIcon(iconName: keyof typeof GroupIconMap, className = "w-5 h-5") {
  const IconComponent = GroupIconMap[iconName] || Store;
  return <IconComponent className={className} />;
}

export default function MobileMenu({ isOpen, onClose, onOpenConsultation }: MobileMenuProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [isLettersOpen, setIsLettersOpen] = React.useState(false);

  const toggleCategory = (catId: string) => {
    setActiveCategory(activeCategory === catId ? null : catId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] h-screen w-screen"
            onClick={onClose}
          />

          {/* Sliding Menu Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[480px] md:w-[580px] bg-slate-950 border-l border-slate-900/60 z-[100] shadow-2xl flex flex-col"
          >
             {/* Header */}
             <div className="flex items-center justify-between p-6 border-b border-slate-900 bg-slate-950">
                <span className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                   Навигация по сайту
                </span>
                <button 
                   onClick={onClose} 
                   className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition"
                   aria-label="Закрыть меню"
                >
                   <X className="w-5 h-5"/>
                </button>
             </div>

             {/* Main Scrollable Area */}
             <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
                
                {/* Group 1: General pages */}
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Основные страницы</h4>
                   <div className="grid grid-cols-2 gap-2">
                      <Link 
                         href="/" 
                         className="flex items-center gap-2.5 text-sm font-bold text-gray-300 p-3 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/80 hover:text-orange-400 transition duration-200" 
                         onClick={onClose}
                      >
                         <Home className="w-4 h-4 text-slate-500"/>
                         <span>Главная</span>
                      </Link>
                      <Link 
                         href="/portfolio" 
                         className="flex items-center gap-2.5 text-sm font-bold text-gray-300 p-3 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/80 hover:text-orange-400 transition duration-200" 
                         onClick={onClose}
                      >
                         <Store className="w-4 h-4 text-slate-500"/>
                         <span>Портфолио</span>
                      </Link>
                      <Link 
                         href="/design-code" 
                         className="flex items-center gap-2.5 text-sm font-bold text-gray-300 p-3 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/80 hover:text-orange-400 transition duration-200" 
                         onClick={onClose}
                      >
                         <Building className="w-4 h-4 text-slate-500"/>
                         <span>Дизайн-код</span>
                      </Link>
                      <Link 
                         href="/contacts" 
                         className="flex items-center gap-2.5 text-sm font-bold text-gray-300 p-3 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/80 hover:text-orange-400 transition duration-200" 
                         onClick={onClose}
                      >
                         <MapPin className="w-4 h-4 text-slate-500"/>
                         <span>Контакты</span>
                      </Link>
                   </div>
                </div>

                {/* Group 2: Services catalog accordion */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Каталог конструкций</h4>
                   
                   <div className="space-y-2.5">
                      {CATALOG_SERVICES.map((group) => {
                         const isGroupActive = activeCategory === group.id;
                         return (
                            <div key={group.id} className="border border-slate-900 rounded-2xl bg-slate-900/20 overflow-hidden">
                               <button 
                                  onClick={() => toggleCategory(group.id)}
                                  className="w-full flex items-center justify-between p-4 hover:bg-slate-900/40 transition duration-200 text-left"
                               >
                                  <span className="flex items-center gap-3 font-extrabold text-sm text-white">
                                     <span className={group.color}>
                                        {renderGroupIcon(group.iconName as keyof typeof GroupIconMap, "w-5 h-5")}
                                     </span>
                                     {group.category}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                                     isGroupActive ? "rotate-180 text-orange-500" : ""
                                  }`}/>
                               </button>
                               
                               <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                  isGroupActive ? "max-h-[500px] opacity-100 border-t border-slate-900" : "max-h-0 opacity-0"
                                }`}>
                                  <div className="p-3 bg-slate-950/60 grid gap-1">
                                     {group.items.map((item, idx) => (
                                        <Link 
                                           key={idx}
                                           href={item.link}
                                           className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-gray-400 hover:text-orange-400 hover:bg-slate-900/40 transition duration-200"
                                           onClick={onClose}
                                        >
                                           <span>{item.title}</span>
                                           <ChevronRight className="w-3.5 h-3.5 text-slate-700"/>
                                        </Link>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         );
                      })}
                   </div>
                </div>

                {/* Group 3: Letters subcatalog */}
                <div className="border border-slate-900 rounded-2xl bg-slate-900/20 overflow-hidden">
                   <button 
                      onClick={() => setIsLettersOpen(!isLettersOpen)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-900/40 transition duration-200 text-left"
                   >
                      <span className="flex items-center gap-3 font-extrabold text-sm text-white">
                         <span className="text-orange-500">
                            <Zap className="w-5 h-5"/>
                         </span>
                         Технологии объемных букв
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                         isLettersOpen ? "rotate-180 text-orange-500" : ""
                      }`}/>
                   </button>
                   
                   <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isLettersOpen ? "max-h-[500px] opacity-100 border-t border-slate-900" : "max-h-0 opacity-0"
                   }`}>
                      <div className="p-3 bg-slate-950/60 grid gap-1">
                         <Link 
                            href="/services/volume-letters"
                            className="flex items-center justify-between p-2.5 rounded-lg text-xs font-black text-white bg-slate-900/60 hover:text-orange-400 hover:bg-slate-900 transition duration-200"
                            onClick={onClose}
                         >
                            <span>Все виды объемных букв</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-orange-500"/>
                         </Link>
                         
                         {VOLUME_LETTERS_CATALOG.slice(0, 7).map((tech) => (
                            <Link 
                               key={tech.id}
                               href={`/services/volume-letters/${tech.slug}`}
                               className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-gray-400 hover:text-orange-400 hover:bg-slate-900/40 transition duration-200"
                               onClick={onClose}
                            >
                               <span>{tech.title}</span>
                               <ChevronRight className="w-3.5 h-3.5 text-slate-700"/>
                            </Link>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Group 4: Tools */}
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 font-sans">Инструменты</h4>
                   <Link 
                      href="/calculator" 
                      className="flex items-center justify-between p-4 rounded-2xl bg-orange-600/10 border border-orange-500/20 text-orange-400 hover:text-orange-300 hover:bg-orange-600/20 transition duration-300"
                      onClick={onClose}
                   >
                      <span className="flex items-center gap-3 font-extrabold text-sm">
                         <Calculator className="w-5 h-5"/>
                         Онлайн-калькулятор вывесок
                      </span>
                      <ChevronRight className="w-4 h-4"/>
                   </Link>
                </div>

             </div>

             {/* Footer Info Area */}
             <div className="p-6 bg-slate-950 border-t border-slate-900 space-y-4">
                 <div className="flex justify-center gap-5">
                     <a 
                        href={COMPANY_NAP.socials.instagram} 
                        target="_blank" 
                        rel="nofollow noreferrer" 
                        className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white hover:border-transparent transition-all duration-300" 
                        aria-label="Наш Instagram"
                     >
                        <Instagram className="w-5 h-5"/>
                     </a>
                     <a 
                        href={COMPANY_NAP.socials.telegram} 
                        target="_blank" 
                        rel="nofollow noreferrer" 
                        className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all duration-300" 
                        aria-label="Наш Telegram"
                     >
                        <Send className="w-5 h-5 ml-0.5"/>
                     </a>
                     <a 
                        href={COMPANY_NAP.socials.whatsapp} 
                        target="_blank" 
                        rel="nofollow noreferrer" 
                        className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white hover:border-transparent transition-all duration-300" 
                        aria-label="Наш WhatsApp"
                     >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                           <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.03 22l4.31-1.83c1.55.98 3.39 1.54 5.37 1.54 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.72 13.91c-.24.68-1.2 1.24-1.93 1.39-.49.1-1.13.17-3.29-.71-2.76-1.12-4.53-3.93-4.67-4.12-.14-.19-1.14-1.51-1.14-2.87a3 3 0 01.91-2.22c.26-.26.56-.33.75-.33h.49c.16 0 .37.01.53.39.17.41.59 1.43.64 1.54.05.11.09.24.01.39-.08.15-.12.24-.24.38-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.03 1.35 1.67.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.59-.69.75-.92.16-.23.32-.19.53-.11.22.08 1.37.65 1.61.76.24.12.4.17.46.28.06.11.06.64-.18 1.32z"/>
                        </svg>
                     </a>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <Button 
                       variant="glass"
                       className="w-full text-white border border-slate-800 text-xs py-3.5"
                       onClick={onClose}
                    >
                       <span className="flex items-center gap-2 justify-center">
                          <User className="w-4 h-4"/> Кабинет
                       </span>
                    </Button>
                    <Button 
                       variant="solid"
                       onClick={() => { onClose(); onOpenConsultation(); }}
                       className="w-full text-white py-3.5 text-xs bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                    >
                       <span className="flex items-center gap-2 justify-center">
                          <FileText className="w-4 h-4"/> Оставить заявку
                       </span>
                    </Button>
                 </div>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
