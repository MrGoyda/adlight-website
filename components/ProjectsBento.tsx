"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProjectsBentoProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function ProjectsBento({ 
  title = "Свежие проекты", 
  subtitle = "То, что мы сдали на прошлой неделе",
  className = ""
}: ProjectsBentoProps) {
  return (
    <section data-aos="fade-up" className={`py-24 bg-slate-950 border-t border-slate-800/50 relative ${className}`}>
      {/* Декоративная линия сверху */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        {/* Заголовок секции */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h2>
            <p className="text-gray-400 text-lg">{subtitle}</p>
          </div>
          <Link href="#" className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 rounded-xl text-white hover:bg-slate-800 hover:border-slate-600 transition group">
            Все 300+ работ <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition"/>
          </Link>
        </div>

        {/* Сетка Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          
          {/* 1. Большая карточка (QazPost) */}
          <div className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800">
            <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/qazpost.jpg')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="inline-block px-3 py-1 mb-3 text-xs font-bold text-white bg-orange-600 rounded-full">Объемные буквы</div>
              <h3 className="text-3xl font-bold text-white mb-2">БЦ "Monolith"</h3>
              <p className="text-gray-300 line-clamp-2">Изготовление и монтаж вывесок для QazPost. Лицевое свечение + контражур.</p>
            </div>
          </div>

          {/* 2. Широкая карточка (1Solution) */}
          <div className="md:col-span-2 group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800 min-h-[250px]">
            <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/1solution.jpg')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <div className="text-orange-400 text-xs font-bold mb-1 tracking-wider uppercase">Объемные буквы и лайтбокс</div>
              <h3 className="text-xl font-bold text-white">Юридическая компания 1Solution</h3>
            </div>
          </div>

          {/* 3. Малая карточка (Agro/Neon) */}
          <div className="md:col-span-1 group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800 min-h-[250px]">
            <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/agro.jpg')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <div className="text-blue-400 text-xs font-bold mb-1 tracking-wider uppercase">Неон и вывеска</div>
              <h3 className="text-lg font-bold text-white">Аптека "Агро Семья"</h3>
            </div>
          </div>

          {/* 4. Малая карточка (Fortuna) */}
          <div className="md:col-span-1 group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800 min-h-[250px]">
            <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/fortuna.jpg')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <div className="text-green-400 text-xs font-bold mb-1 tracking-wider uppercase">Панель-кронштейн</div>
              <h3 className="text-lg font-bold text-white">Агентство Fortuna</h3>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}