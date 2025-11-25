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
  Info
} from "lucide-react";

import { PROJECTS, CATEGORIES } from "@/lib/projectsData";
import CallToAction from "@/components/CallToAction";
import ImageGallery from "@/components/ImageGallery";

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

  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS[currentIndex + 1] || PROJECTS[0]; 

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-orange-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] min-h-[600px] flex flex-col justify-end pb-12 lg:pb-20 overflow-hidden">
         
         {/* СЛОЙ 1: ФОНОВАЯ КАРТИНКА (z-0) */}
         <div className="absolute inset-0 z-0">
            <img 
               src={project.image} 
               alt={project.title} 
               className="w-full h-full object-cover"
            />
         </div>

         {/* СЛОЙ 2: ГРАДИЕНТЫ (z-10) */}
         <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent pointer-events-none"></div>
         <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none"></div>

         {/* СЛОЙ 3: КОНТЕНТ (z-20) */}
         <div className="container mx-auto px-4 relative z-20 pt-32">
            <div className="max-w-5xl">
               
               {/* ХЛЕБНЫЕ КРОШКИ */}
               <div className="flex flex-wrap items-center gap-2 text-white/70 text-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Link href="/" className="hover:text-white transition hover:underline">Главная</Link>
                  <ChevronRight className="w-4 h-4 opacity-50"/>
                  <Link href="/portfolio" className="hover:text-white transition hover:underline">Портфолио</Link>
                  <ChevronRight className="w-4 h-4 opacity-50"/>
                  <span className="text-orange-500 font-medium truncate max-w-[200px] sm:max-w-md">{project.title}</span>
               </div>

               {/* ТЕГИ */}
               <div className="flex flex-wrap gap-3 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  {project.categories.map((catId, i) => {
                     const category = CATEGORIES.find(c => c.id === catId);
                     const label = category ? category.label : catId;
                     return (
                        <span key={i} className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                           {label}
                        </span>
                     );
                  })}
               </div>
               
               {/* ЗАГОЛОВОК */}
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-10 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 drop-shadow-lg">
                  {project.title}
               </h1>

               {/* ИНФО */}
               <div className="flex flex-wrap gap-y-4 gap-x-8 text-gray-200 text-sm md:text-base font-medium animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100">
                  {project.location && (
                     <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                        <MapPin className="w-5 h-5 text-orange-500"/> {project.location}
                     </div>
                  )}
                  <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                     <Calendar className="w-5 h-5 text-orange-500"/> {project.date}
                  </div>
                  {project.completionTime && (
                     <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                        <Clock className="w-5 h-5 text-orange-500"/> Срок: {project.completionTime}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </section>

      {/* 2. КОНТЕНТ: ЗАДАЧА И РЕШЕНИЕ */}
      <section className="py-20 lg:py-32 relative z-20 bg-[#020617]">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] pointer-events-none"></div>

         <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
               
               <div className="lg:col-span-2 space-y-16">
                  {project.challenge && (
                     <div data-aos="fade-up">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-4">
                           <span className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-mono border border-red-500/20 shrink-0">01</span>
                           Задача
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed pl-4 border-l-2 border-slate-800 ml-5">
                           {project.challenge}
                        </p>
                     </div>
                  )}
                  
                  {project.solution && (
                     <div data-aos="fade-up" data-aos-delay="100">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-4">
                           <span className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-sm font-mono border border-green-500/20 shrink-0">02</span>
                           Решение
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed pl-4 border-l-2 border-slate-800 ml-5">
                           {project.solution}
                        </p>
                     </div>
                  )}

                  {/* CTA */}
                  <div className="pt-8 pl-5">
                     <Link href="/calculator" className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95">
                        <Calculator className="w-5 h-5"/>
                        Рассчитать похожую вывеску
                     </Link>
                  </div>
               </div>

               <div className="lg:col-span-1">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-24 backdrop-blur-sm">
                     <div className="flex items-center gap-3 mb-6">
                        <Info className="w-5 h-5 text-blue-500"/>
                        <h3 className="text-xl font-bold text-white">Детали проекта</h3>
                     </div>
                     
                     {project.specs && project.specs.length > 0 ? (
                        <div className="space-y-0 divide-y divide-white/5">
                           {project.specs.map((spec, i) => (
                              <div key={i} className="flex justify-between items-start py-4 gap-4">
                                 <span className="text-gray-500 text-sm shrink-0">{spec.label}</span>
                                 <span className="text-white font-medium text-right text-sm leading-tight">{spec.value}</span>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-gray-500 text-sm">Характеристики не указаны</p>
                     )}
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 3. ВИДЕООБЗОР */}
      {project.videoUrl && (
        <section className="py-12 bg-[#050b1a] border-y border-white/5 relative z-20">
           <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                 <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                 Видеообзор
              </h2>
              <div className="aspect-video w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
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
         <section className="pb-24 bg-[#020617] relative z-20">
            <div className="container mx-auto px-4">
               <div className="flex items-end justify-between mb-12">
                  <h2 className="text-3xl font-bold text-white">Фотографии проекта</h2>
                  <span className="text-gray-500 text-sm">{project.gallery.length} фото</span>
               </div>
               
               <ImageGallery images={project.gallery} />
            </div>
         </section>
      )}

      {/* 5. NEXT PROJECT */}
      <section className="py-0 bg-black border-t border-slate-800 relative z-20">
         <Link href={`/portfolio/${nextProject.slug}`} className="group block relative h-[500px] w-full overflow-hidden cursor-pointer">
            
            <div className="absolute inset-0">
               <img 
                  src={nextProject.image} 
                  alt={nextProject.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-1000 ease-out opacity-50 group-hover:opacity-100"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent opacity-100 group-hover:opacity-60 transition-opacity duration-700"></div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
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

      <CallToAction source={`Кейс: ${project.title}`} />
    </div>
  );
}