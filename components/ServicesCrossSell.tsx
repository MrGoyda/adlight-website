"use client";

import Link from "next/link";
import { ArrowRight, Layers, Zap } from "lucide-react";

interface ServicesCrossSellProps {
  title?: string;
  subtitle?: string;
}

export default function ServicesCrossSell({ 
  title = "Что еще мы производим", 
  subtitle = "Комплексное оформление вашего бизнеса" 
}: ServicesCrossSellProps) {
  return (
    <section data-aos="fade-up" className="py-24 bg-[#0F172A] border-t border-slate-800">
       <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
             <div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{title}</h2>
                <p className="text-gray-400">{subtitle}</p>
             </div>
             <Link href="/" className="text-orange-500 font-medium hover:text-orange-400 flex items-center gap-2 transition">
                Весь каталог <ArrowRight className="w-4 h-4"/>
             </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
              {/* Карточка 1: Лайтбоксы */}
              <Link href="#" className="group relative h-[400px] rounded-3xl overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-all duration-500 shadow-lg">
                 <div className="absolute inset-0 bg-slate-800">
                    <img 
                      src="/images/calc/lightbox-1.jpg" 
                      alt="Световые короба" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      onError={(e) => e.currentTarget.src = '/1solution.jpg'} // Fallback если картинки нет
                    />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                 
                 <div className="absolute bottom-0 left-0 p-8 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-900/30 group-hover:scale-110 transition-transform">
                       <Layers className="w-6 h-6"/>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Световые короба</h3>
                    <p className="text-gray-300 text-sm line-clamp-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                       Лайтбоксы любой сложной формы. Отличная альтернатива буквам, если нужно разместить логотип или много текста.
                    </p>
                    <div className="flex items-center text-sm font-bold text-white group-hover:gap-2 transition-all">
                       Подробнее <ArrowRight className="w-4 h-4 ml-1 text-blue-500"/>
                    </div>
                 </div>
              </Link>

              {/* Карточка 2: Неон */}
              <Link href="#" className="group relative h-[400px] rounded-3xl overflow-hidden border border-slate-800 hover:border-purple-500/50 transition-all duration-500 shadow-lg">
                 <div className="absolute inset-0 bg-slate-800">
                    <img 
                      src="/neon.jpg" 
                      alt="Неон" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                 
                 <div className="absolute bottom-0 left-0 p-8 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-900/30 group-hover:scale-110 transition-transform">
                       <Zap className="w-6 h-6"/>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Неоновые вывески</h3>
                    <p className="text-gray-300 text-sm line-clamp-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                       Гибкий неон для интерьера, баров и фотозон. Ярко, стильно и безопасно. Создаем атмосферу.
                    </p>
                    <div className="flex items-center text-sm font-bold text-white group-hover:gap-2 transition-all">
                       Подробнее <ArrowRight className="w-4 h-4 ml-1 text-purple-500"/>
                    </div>
                 </div>
              </Link>

              {/* Карточка 3: Крышные */}
              <Link href="#" className="group relative h-[400px] rounded-3xl overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-all duration-500 shadow-lg">
                 <div className="absolute inset-0 bg-slate-800">
                    <img 
                      src="/krisha.jpg" 
                      alt="Крышные установки" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                 
                 <div className="absolute bottom-0 left-0 p-8 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-900/30 group-hover:scale-110 transition-transform">
                       <ArrowRight className="w-6 h-6 -rotate-45"/>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">Крышные установки</h3>
                    <p className="text-gray-300 text-sm line-clamp-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                       Масштабные конструкции с проектной документацией. Расчет ветровых нагрузок и монтаж на любой высоте.
                    </p>
                    <div className="flex items-center text-sm font-bold text-white group-hover:gap-2 transition-all">
                       Подробнее <ArrowRight className="w-4 h-4 ml-1 text-orange-500"/>
                    </div>
                 </div>
              </Link>
          </div>
       </div>
    </section>
  );
}