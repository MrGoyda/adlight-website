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
  ChevronRight,
  Info,
  Play,
  CheckCircle2,
  Layers,
  Zap,
  ShieldCheck,
  Hammer
} from "lucide-react";

import { PROJECTS, CATEGORIES } from "@/lib/projectsData";
import CallToAction from "@/components/CallToAction";
import ImageGallery from "@/components/ImageGallery";
import VideoModalWrapper from "@/components/VideoModalWrapper";

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

// Получаем лейблы категорий на русском
const getCategoryLabels = (catIds: string[]) => {
  return catIds.map(id => {
    const category = CATEGORIES.find(c => c.id === id);
    return category ? category.label : id;
  });
};

// Получаем случайные проекты (кроме текущего)
const getRelatedProjects = (currentId: string) => {
  const others = PROJECTS.filter(p => p.id !== currentId);
  // Перемешиваем и берем 3
  return others.sort(() => 0.5 - Math.random()).slice(0, 3);
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.slug === resolvedParams.slug);
  if (!project) return { title: "Проект не найден" };
  return {
    title: `${project.title} | Портфолио ADLight`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(project.id);
  const categoryLabels = getCategoryLabels(project.categories);

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-orange-500/30">
      
      {/* 1. HERO SECTION (Новый дизайн) */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 overflow-hidden">
         {/* Фон - легкое свечение */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10">
            
            {/* Хлебные крошки */}
            <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm mb-8">
               <Link href="/" className="hover:text-white transition">Главная</Link>
               <ChevronRight className="w-3 h-3"/>
               <Link href="/portfolio" className="hover:text-white transition">Портфолио</Link>
               <ChevronRight className="w-3 h-3"/>
               <span className="text-orange-500 font-medium truncate max-w-[200px]">{project.title}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
               {/* Левая колонка: Текст */}
               <div className="flex flex-col justify-center h-full pt-4">
                  <div className="flex flex-wrap gap-3 mb-6">
                     {categoryLabels.map((label, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider">
                           {label}
                        </span>
                     ))}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1]">
                     {project.title}
                  </h1>

                  <div className="flex flex-wrap gap-y-4 gap-x-8 text-gray-400 text-sm font-medium mb-10">
                     {project.location && (
                        <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-orange-500"/> {project.location}
                        </div>
                     )}
                     <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500"/> {project.year} год
                     </div>
                     {project.completionTime && (
                        <div className="flex items-center gap-2">
                           <Clock className="w-4 h-4 text-orange-500"/> {project.completionTime}
                        </div>
                     )}
                  </div>

                  {/* Кнопка ВИДЕО (Client Component Wrapper) */}
                  {project.videoUrl && (
                     <div className="mb-8">
                        <VideoModalWrapper videoUrl={project.videoUrl} />
                     </div>
                  )}

                  <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                     {project.description}
                  </p>
               </div>

               {/* Правая колонка: Фото (Большое) */}
               <div className="relative aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
                  <Image 
                     src={project.image} 
                     alt={project.title} 
                     fill 
                     className="object-cover transition-transform duration-1000 group-hover:scale-105"
                     priority
                     sizes="(max-width: 1024px) 100vw, 50vw" // <--- ДОБАВЛЕНО
                  />
                  {/* Градиент снизу для объема */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent opacity-60"></div>
               </div>
            </div>
         </div>
      </section>

      {/* 2. MAIN CONTENT (CASE STUDY) */}
      <section className="py-12 lg:py-24 bg-[#020617]">
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-12">
               
               {/* ЛЕВАЯ КОЛОНКА: ИСТОРИЯ (8 cols) */}
               <div className="lg:col-span-8 space-y-16">
                  
                  {/* Задача */}
                  <div className="group">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xl border border-red-500/20 group-hover:scale-110 transition-transform">01</div>
                        <h2 className="text-3xl font-bold text-white">Задача</h2>
                     </div>
                     <p className="text-gray-400 text-lg leading-relaxed pl-4 border-l-2 border-slate-800">
                        {project.challenge}
                     </p>
                  </div>

                  {/* Процесс (если есть) */}
                  {project.process && (
                     <div className="group">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xl border border-blue-500/20 group-hover:scale-110 transition-transform">02</div>
                           <h2 className="text-3xl font-bold text-white">Процесс</h2>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed pl-4 border-l-2 border-slate-800">
                           {project.process}
                        </p>
                     </div>
                  )}

                  {/* Решение */}
                  <div className="group">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center font-bold text-xl border border-green-500/20 group-hover:scale-110 transition-transform">
                           {project.process ? '03' : '02'}
                        </div>
                        <h2 className="text-3xl font-bold text-white">Решение</h2>
                     </div>
                     <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                        <p className="text-gray-300 text-lg leading-relaxed">
                           {project.solution}
                        </p>
                     </div>
                  </div>

                  {/* CTA ВНУТРИ ТЕКСТА */}
                  <div className="py-8">
                     <Link 
                        href={project.relatedServiceSlug ? `/services/${project.relatedServiceSlug}` : "/calculator"}
                        className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-orange-900/20 to-transparent border border-orange-500/30 hover:border-orange-500/60 transition-all"
                     >
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-orange-500 rounded-lg text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                              <Calculator className="w-6 h-6"/>
                           </div>
                           <div>
                              <h4 className="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">Понравился результат?</h4>
                              <p className="text-gray-400 text-sm">Рассчитайте стоимость похожей вывески</p>
                           </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-orange-500 transition-colors">
                           <ArrowRight className="w-5 h-5"/>
                        </div>
                     </Link>
                  </div>

               </div>

               {/* ПРАВАЯ КОЛОНКА: ДЕТАЛИ (4 cols - Sticky) */}
               <div className="lg:col-span-4">
                  <div className="sticky top-32 space-y-8">
                     
                     {/* Блок характеристик */}
                     <div className="bg-[#0B1120] border border-slate-800 rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                           <Info className="w-5 h-5 text-blue-500"/> Детали проекта
                        </h3>
                        
                        <div className="space-y-6">
                           <div className="flex gap-4">
                              <Layers className="w-5 h-5 text-slate-500 shrink-0 mt-1"/>
                              <div>
                                 <p className="text-xs text-slate-500 uppercase font-bold mb-1">Лицевая часть</p>
                                 <p className="text-white text-sm leading-snug">{project.techSpecs.face}</p>
                              </div>
                           </div>
                           
                           <div className="flex gap-4">
                              <Hammer className="w-5 h-5 text-slate-500 shrink-0 mt-1"/>
                              <div>
                                 <p className="text-xs text-slate-500 uppercase font-bold mb-1">Борт / Корпус</p>
                                 <p className="text-white text-sm leading-snug">{project.techSpecs.body}</p>
                              </div>
                           </div>

                           <div className="flex gap-4">
                              <Zap className="w-5 h-5 text-slate-500 shrink-0 mt-1"/>
                              <div>
                                 <p className="text-xs text-slate-500 uppercase font-bold mb-1">Светотехника</p>
                                 <p className="text-white text-sm leading-snug">{project.techSpecs.light}</p>
                              </div>
                           </div>

                           <div className="flex gap-4">
                              <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0 mt-1"/>
                              <div>
                                 <p className="text-xs text-slate-500 uppercase font-bold mb-1">Гарантия</p>
                                 <p className="text-green-400 text-sm font-bold leading-snug">{project.techSpecs.warranty || "12 месяцев"}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Менеджер (Опционально - заглушка для доверия) */}
                     <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden relative">
                           {/* Можно вставить фото менеджера */}
                           <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">AD</div> 
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">Есть вопросы?</p>
                           <a href="https://wa.me/77071356701" className="text-green-500 text-xs font-bold hover:underline">Написать в WhatsApp →</a>
                        </div>
                     </div>

                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 3. ГАЛЕРЕЯ */}
      {project.gallery && project.gallery.length > 0 && (
         <section className="pb-24 bg-[#020617]">
            <div className="container mx-auto px-4">
               <h2 className="text-2xl font-bold text-white mb-8">Фотоотчет</h2>
               <ImageGallery images={project.gallery} />
            </div>
         </section>
      )}

      {/* 4. СМОТРИТЕ ТАКЖЕ (3 ПРОЕКТА) */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Другие проекты</h2>
                  <p className="text-gray-400">Посмотрите, что еще мы умеем</p>
               </div>
               <Link href="/portfolio" className="hidden md:flex items-center gap-2 text-orange-500 font-bold hover:text-orange-400 transition">
                  В портфолио <ArrowRight className="w-4 h-4"/>
               </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               {relatedProjects.map((p) => (
                  <Link key={p.id} href={`/portfolio/${p.slug}`} className="group block relative h-[350px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                     <Image 
                        src={p.image} 
                        alt={p.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                        sizes="(max-width: 768px) 100vw, 33vw" // <--- ДОБАВЛЕНО
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                     <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="mb-2">
                           {getCategoryLabels(p.categories).slice(0, 1).map((cat, i) => (
                              <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-900/30 px-2 py-1 rounded border border-orange-500/20">
                                 {cat}
                              </span>
                           ))}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">{p.title}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                           <MapPin className="w-3 h-3"/> {p.location}
                        </p>
                     </div>
                  </Link>
               ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
               <Link href="/portfolio" className="inline-flex items-center gap-2 text-white font-bold bg-slate-800 px-6 py-3 rounded-xl">
                  Все проекты <ArrowRight className="w-4 h-4"/>
               </Link>
            </div>
         </div>
      </section>

      <CallToAction source={`Кейс: ${project.title}`} />
    </div>
  );
}