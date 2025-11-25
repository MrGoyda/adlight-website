"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROJECTS, CATEGORIES } from "@/lib/projectsData";

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

  // 1. Получаем 4 последних проекта (сортировка по дате)
  const latestProjects = [...PROJECTS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  // Хелпер: Получить красивое название категории по ID (например 'letters' -> 'Объемные буквы')
  const getCategoryLabel = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.label : "Проект";
  };

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
          <Link href="/portfolio" className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 rounded-xl text-white hover:bg-slate-800 hover:border-slate-600 transition group">
            Все работы <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition"/>
          </Link>
        </div>

        {/* Сетка Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          
          {latestProjects.map((project, index) => {
            // Определяем размеры ячеек
            let gridClass = "";
            if (index === 0) gridClass = "md:col-span-2 md:row-span-2"; // Большая (Слева)
            else if (index === 1) gridClass = "md:col-span-2";          // Широкая (Справа верх)
            else gridClass = "md:col-span-1";                           // Маленькие (Справа низ)

            // Получаем название главной категории
            const mainCategoryLabel = getCategoryLabel(project.categories[0]);

            return (
              <Link 
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800 min-h-[250px] ${gridClass}`}
              >
                {/* Картинка */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" 
                  style={{ backgroundImage: `url(${project.image})` }}
                ></div>
                
                {/* Градиент (на большой карточке он сильнее) */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition ${index === 0 ? '' : 'via-transparent'}`}></div>
                
                {/* Контент */}
                <div className={`absolute bottom-0 left-0 w-full ${index === 0 ? 'p-8' : 'p-6'}`}>
                  
                  {/* ТЕГ / КАТЕГОРИЯ */}
                  <div className={`inline-block mb-2 text-xs font-bold uppercase tracking-wider ${
                      index === 0 
                        ? "px-3 py-1 text-white bg-orange-600 rounded-full" // Большая кнопка
                        : index === 1 
                            ? "text-orange-400" // Цветной текст
                            : "text-blue-400"   // Цветной текст
                  }`}>
                      {mainCategoryLabel}
                  </div>

                  {/* ЗАГОЛОВОК */}
                  <h3 className={`${index === 0 ? 'text-3xl' : index === 1 ? 'text-xl' : 'text-lg'} font-bold text-white mb-1 group-hover:text-orange-500 transition-colors line-clamp-1`}>
                    {project.title}
                  </h3>
                  
                  {/* ОПИСАНИЕ (Только для большой и широкой карточки) */}
                  {(index === 0 || index === 1) && (
                      <p className="text-gray-300 text-sm line-clamp-2 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {project.description}
                      </p>
                  )}
                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
}