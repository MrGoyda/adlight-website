import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Calculator,
  Clock,
  ChevronRight
} from "lucide-react";

import { PROJECTS } from "@/lib/projectsData";
import CallToAction from "@/components/CallToAction";
import ImageGallery from "@/components/ImageGallery";

// Тип для Props (Next.js 15+)
type Props = {
  params: Promise<{ slug: string }>;
};

// 1. Генерация мета-тегов
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.slug === resolvedParams.slug);
  
  if (!project) return { title: "Проект не найден" };
  
  return {
    title: `${project.title} | Портфолио ADLight`,
    description: project.description,
  };
}

// 2. Компонент страницы
export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  // Находим следующий проект для навигации
  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS[currentIndex + 1] || PROJECTS[0]; 

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-orange-500/30">
      
      {/* 1. HERO SECTION (FULLSCREEN IMAGE) 
          pt-32 — чтобы контент спустился ниже глобального хедера
      */}
      <section className="relative h-[85vh] min-h-[600px] flex flex-col justify-end pb-12 lg:pb-20 overflow-hidden pt-32">
         {/* Фон-картинка */}
         <div className="absolute inset-0">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover"/>
            {/* Градиент, чтобы текст читался */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-black/30"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl">
               
               {/* ХЛЕБНЫЕ КРОШКИ + КНОПКА НАЗАД */}
               <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Link 
                    href="/portfolio" 
                    className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition text-white font-medium"
                  >
                     <ArrowLeft className="w-4 h-4"/> Назад
                  </Link>
                  
                  <div className="hidden sm:flex items-center gap-2 text-white/60">
                     <span className="opacity-20">|</span>
                     <Link href="/" className="hover:text-white transition">Главная</Link>
                     <ChevronRight className="w-3 h-3 opacity-50"/>
                     <Link href="/portfolio" className="hover:text-white transition">Портфолио</Link>
                     <ChevronRight className="w-3 h-3 opacity-50"/>
                     <span className="text-orange-500 font-medium truncate max-w-[200px] sm:max-w-none">{project.title}</span>
                  </div>
               </div>

               {/* Теги */}
               <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  {project.categories.map((cat, i) => (
                     <span key={i} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                        {cat}
                     </span>
                  ))}
               </div>
               
               {/* Заголовок */}
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[0.95] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  {project.title}
               </h1>

               {/* Инфо-строка */}
               <div className="flex flex-wrap gap-y-4 gap-x-8 text-gray-300 text-sm md:text-base font-medium animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100">
                  {project.location && (
                     <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-full bg-orange-500/20 text-orange-500"><MapPin className="w-4 h-4"/></div>
                        {project.location}
                     </div>
                  )}
                  <div className="flex items-center gap-2.5">
                     <div className="p-1.5 rounded-full bg-blue-500/20 text-blue-500"><Calendar className="w-4 h-4"/></div>
                     {project.date}
                  </div>
                  {project.completionTime && (
                     <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-full bg-green-500/20 text-green-500"><Clock className="w-4 h-4"/></div>
                        Срок: {project.completionTime}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </section>

      {/* 3. КОНТЕНТ: ЗАДАЧА И РЕШЕНИЕ */}
      <section className="py-20 lg:py-32 relative">
         {/* Декор */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
               
               {/* Левая колонка: Текст */}
               <div className="lg:col-span-2 space-y-16">
                  {project.challenge && (
                     <div data-aos="fade-up">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-4">
                           <span className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-mono border border-red-500/20">01</span>
                           Задача
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed pl-2">
                           {project.challenge}
                        </p>
                     </div>
                  )}
                  
                  {project.solution && (
                     <div data-aos="fade-up" data-aos-delay="100">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-4">
                           <span className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-sm font-mono border border-green-500/20">02</span>
                           Решение
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed pl-2">
                           {project.solution}
                        </p>
                     </div>
                  )}

                  {/* CTA Кнопка в тексте */}
                  <div className="pt-8">
                     <Link href="/calculator" className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95">
                        <Calculator className="w-5 h-5"/>
                        Рассчитать похожую вывеску
                     </Link>
                  </div>
               </div>

               {/* Правая колонка: Характеристики (Sticky) */}
               <div className="lg:col-span-1">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-24 backdrop-blur-sm">
                     <h3 className="text-xl font-bold text-white mb-6">Детали проекта</h3>
                     <div className="space-y-4">
                        {project.specs?.map((spec, i) => (
                           <div key={i} className="flex justify-between items-start py-3 border-b border-white/5 last:border-0 gap-4">
                              <span className="text-gray-500 text-sm shrink-0">{spec.label}</span>
                              <span className="text-white font-medium text-right text-sm">{spec.value}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

{/* 3.5. ВИДЕООБЗОР (ЕСЛИ ЕСТЬ) */}
      {project.videoUrl && (
        <section className="py-12 bg-[#050b1a]">
           <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                 <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                 Видеообзор проекта
              </h2>
              <div className="aspect-video w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                 <iframe 
                    width="100%" 
                    height="100%" 
                    src={project.videoUrl} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                 ></iframe>
              </div>
           </div>
        </section>
      )}

      {/* 4. ГАЛЕРЕЯ */}
      {project.gallery && project.gallery.length > 0 && (
         <section className="pb-24">
            <div className="container mx-auto px-4">
               <div className="flex items-end justify-between mb-12">
                  <h2 className="text-3xl font-bold text-white">Фотографии проекта</h2>
                  <span className="text-gray-500 text-sm">{project.gallery.length} фото</span>
               </div>
               
               <ImageGallery images={project.gallery} />
               
            </div>
         </section>
      )}

      {/* 5. NEXT PROJECT (ОБНОВЛЕННЫЙ ДИЗАЙН) */}
      <section className="py-0 bg-black border-t border-slate-800">
         <Link href={`/portfolio/${nextProject.slug}`} className="group block relative h-[500px] w-full overflow-hidden cursor-pointer">
            
            {/* Фон-картинка (Ч/Б -> Цвет) */}
            <div className="absolute inset-0">
               <img 
                  src={nextProject.image} 
                  alt={nextProject.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-1000 ease-out opacity-50 group-hover:opacity-100"
               />
               {/* Градиент, чтобы фото не спорило с текстом */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent opacity-100 group-hover:opacity-60 transition-opacity duration-700"></div>
            </div>

            {/* Контент по центру */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
               
               {/* Стеклянная карточка */}
               <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl text-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 max-w-2xl w-full">
                  
                  <div className="inline-flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                     <span className="w-8 h-px bg-orange-500"></span>
                     Следующий кейс
                     <span className="w-8 h-px bg-orange-500"></span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                     {nextProject.title}
                  </h2>

                  <div className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 group-hover:bg-orange-500 group-hover:scale-105 transition-all duration-300 gap-2">
                     Смотреть проект <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                  </div>
               
               </div>
            </div>
         </Link>
      </section>

      {/* 6. ЛИД-МАГНИТ */}
      <CallToAction source={`Кейс: ${project.title}`} />

    </div>
  );
}