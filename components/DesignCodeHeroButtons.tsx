"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";
import ConsultationModal from "@/components/ConsultationModal";

export default function DesignCodeHeroButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col sm:flex-row gap-4">
         <button 
           onClick={() => setIsModalOpen(true)}
           className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-95"
         >
            <MessageCircle className="w-5 h-5"/> Бесплатная консультация
         </button>
         
         <Link 
            href="#check" 
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition border border-slate-700 flex items-center justify-center gap-2 active:scale-95"
         >
            <Search className="w-5 h-5"/> Проверить вывеску
         </Link>
      </div>

      <ConsultationModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         source="Страница: Дизайн-код (Hero)"
      />
    </>
  );
}