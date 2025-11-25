"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar, Layers, ChevronRight } from "lucide-react";

// Импортируем данные
import { PROJECTS, CATEGORIES, ProjectCategory } from "@/lib/projectsData";
import CallToAction from "@/components/CallToAction";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all');

  // Логика фильтрации
  const filteredProjects = activeCategory === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(project => project.categories.includes(activeCategory));

  // Сортировка (сначала новые)
  const sortedProjects = [...filteredProjects].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-orange-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
         {/* Инженерная сетка на фоне */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617]"></div>
         
         {/* Оранжевое свечение */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10 text-center">
            
            {/* ХЛЕБНЫЕ КРОШКИ (ДОБАВЛЕНО) */}
            <div data-aos="fade-down" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-orange-500 font-medium">Портфолио</span>
            </div>

            <div data-aos="fade-down" data-aos-delay="100" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium mb-6 backdrop-blur-md">
               <Layers className="w-3 h-3 text-orange-500"/> Галерея проектов ADLight
            </div>
            
            <h1 data-aos="fade-up" data-aos-delay="200" className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
               Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">работы</span>
            </h1>
            
            <p data-aos="fade-up" data-aos-delay="300" className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
               Более 300 реализованных проектов в Астане. От интерьерных логотипов до крышных установок.
            </p>
         </div>
      </section>

      {/* 2. STICKY FILTER (СТЕКЛЯННЫЙ) */}
      <section className="sticky top-4 z-40 mb-12">
         <div className="container mx-auto px-4">
            <div className="bg-[#0B1221]/70 backdrop-blur-xl border border-white/10 rounded-full p-1.5 max-w-4xl mx-auto shadow-2xl shadow-black/50">
               <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                  {CATEGORIES.map((cat) => (
                     <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                           activeCategory === cat.id 
                              ? "bg-white text-black shadow-lg" 
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                     >
                        {cat.label}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 3. СЕТКА ПРОЕКТОВ */}
      <section className="container mx-auto px-4 pb-32">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProjects.map((project, i) => (
               <Link 
                  href={`/portfolio/${project.slug}`} 
                  key={project.id}
                  data-aos="fade-up"
                  data-aos-delay={i * 50}
                  className="group relative flex flex-col gap-4 cursor-pointer"
               >
                  {/* Картинка */}
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-800 border border-white/5">
                     <div className="absolute inset-0 bg-slate-800 animate-pulse" /> 
                     
                     <img 
                        src={project.image} 
                        alt={project.title} 
                        className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
                     />
                     
                     {/* Градиент снизу */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition duration-500" />

                     {/* Теги ПОВЕРХ картинки */}
                     <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {project.categories.slice(0, 2).map(catId => {
                           const catLabel = CATEGORIES.find(c => c.id === catId)?.label;
                           return (
                              <span key={catId} className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
                                 {catLabel}
                              </span>
                           );
                        })}
                     </div>

                     {/* Кнопка-стрелка */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transform translate-y-4 group-hover:translate-y-0 transition duration-500">
                           <ArrowUpRight className="w-8 h-8"/>
                        </div>
                     </div>
                  </div>

                  {/* Информация */}
                  <div className="px-2">
                     <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors leading-tight">
                           {project.title}
                        </h3>
                        <span className="text-xs font-mono text-gray-500 pt-1 whitespace-nowrap">
                           {formatDate(project.date)}
                        </span>
                     </div>
                     <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                        {project.description}
                     </p>
                  </div>
               </Link>
            ))}
         </div>

         {/* Пустое состояние */}
         {sortedProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/5">
               <div className="text-6xl mb-4 grayscale opacity-50">📂</div>
               <h3 className="text-xl font-bold text-white mb-2">Проектов не найдено</h3>
               <p className="text-gray-400">Попробуйте выбрать другую категорию</p>
            </div>
         )}
      </section>

      {/* 4. CTA */}
      <CallToAction source="Страница: Портфолио" />
    </div>
  );
}