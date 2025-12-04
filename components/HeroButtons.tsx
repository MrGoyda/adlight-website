"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, MessageCircle } from "lucide-react";
import ConsultationModal from "@/components/ConsultationModal";

interface HeroButtonsProps {
  source: string; // Чтобы знать, с какой услуги пришла заявка
  priceColor?: string; // Цвет кнопки калькулятора (orange, blue, purple...)
}

export default function HeroButtons({ source, priceColor = "orange" }: HeroButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Словарь цветов для кнопки "Рассчитать" (чтобы подстраиваться под стиль страницы)
  const colorClasses: Record<string, string> = {
    orange: "bg-orange-600 hover:bg-orange-700 shadow-orange-900/20",
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20",
    purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-900/20",
    green: "bg-green-600 hover:bg-green-700 shadow-green-900/20",
    pink: "bg-pink-600 hover:bg-pink-700 shadow-pink-900/20",
    cyan: "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-900/20",
    indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20",
    teal: "bg-teal-600 hover:bg-teal-700 shadow-teal-900/20",
    yellow: "bg-yellow-600 text-black hover:bg-yellow-500 shadow-yellow-900/20",
    white: "bg-white text-black hover:bg-gray-200 shadow-white/10",
  };

  const btnClass = colorClasses[priceColor] || colorClasses.orange;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        
        {/* Кнопка 1: Калькулятор */}
        <Link 
          href="/calculator" 
          className={`h-14 px-8 flex items-center justify-center rounded-xl font-bold text-lg transition shadow-lg active:scale-95 hover:scale-105 ${btnClass}`}
        >
          <Calculator className="w-5 h-5 mr-2"/>
          Рассчитать стоимость
        </Link>

        {/* Кнопка 2: Модалка (Заявка) */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-14 px-8 flex items-center justify-center border border-slate-600 text-white rounded-xl font-medium text-lg hover:bg-slate-800 hover:border-slate-500 transition active:scale-95"
        >
          <MessageCircle className="w-5 h-5 mr-2 text-green-500"/>
          Оставить заявку
        </button>

      </div>

      {/* Сама модалка */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source={`Hero Section: ${source}`}
      />
    </>
  );
}