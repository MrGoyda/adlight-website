"use client";

import { ArrowRight, CheckCircle, FileCheck, BookOpen } from "lucide-react";

export default function DesignCodeBlock() {
  return (
    <section data-aos="fade-up" className="py-24 bg-slate-900 relative overflow-hidden border-y border-slate-800">
      {/* Фоновое свечение */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-yellow-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* ЛЕВАЯ ЧАСТЬ: ТЕКСТ */}
          <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-bold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                Важно для бизнеса в Астане
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Спасаем от штрафов и <span className="text-yellow-500">демонтажа</span>
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                В Астане действует строгий Дизайн-код. 80% вывесок, установленных "гаражными мастерами", приходится снимать через месяц из-за несоответствия архитектурному облику столицы. <br/><br/>
                Мы знаем требования Управления урбанистики наизусть. Ваша вывеска будет законной.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-green-500/10 rounded mt-1"><CheckCircle className="w-5 h-5 text-green-500"/></div>
                  <div><strong className="text-white block">Проверка фасада</strong><span className="text-gray-400 text-sm">Проверим, разрешена ли вывеска на вашем здании.</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-green-500/10 rounded mt-1"><CheckCircle className="w-5 h-5 text-green-500"/></div>
                  <div><strong className="text-white block">Эскизный проект</strong><span className="text-gray-400 text-sm">Подготовим альбом для подачи в Акимат.</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-green-500/10 rounded mt-1"><CheckCircle className="w-5 h-5 text-green-500"/></div>
                  <div><strong className="text-white block">Сопровождение</strong><span className="text-gray-400 text-sm">Помогаем подать заявку через E-Otinish.</span></div>
                </li>
              </ul>

              {/* ОБНОВЛЕННАЯ КРАСИВАЯ КНОПКА (используем <a> для совместимости) */}
              <a 
                href="/design-code" 
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5"
              >
                <BookOpen className="w-5 h-5"/>
                <span>Открыть Гид по Дизайн-коду</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                
                {/* Блик */}
                <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-yellow-400/50 transition-all"></div>
              </a>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: ДОКУМЕНТ */}
          <div className="relative">
             <div className="relative bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl transform md:rotate-2 transition hover:rotate-0 duration-500">
                <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white"><FileCheck/></div>
                      <div>
                         <div className="text-white font-bold text-sm">Эскизный проект</div>
                         <div className="text-green-500 text-xs font-bold uppercase tracking-wider">Одобрено</div>
                      </div>
                   </div>
                   <div className="text-gray-500 text-xs font-mono">№ 482-А</div>
                </div>
                
                {/* Изображение документа (Заглушка или реальное фото) */}
                <div 
                  className="aspect-video bg-slate-900 rounded-lg border border-slate-700/50 relative overflow-hidden bg-cover bg-center group"
                  style={{ 
                      // Если картинки нет, будет просто темный фон. 
                      // Лучше положить скриншот реального эскиза в public/dk.png
                      backgroundImage: "url('/images/pages/dk.webp')" 
                  }}
                >
                    {/* Если картинки нет, показываем заглушку */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs font-mono opacity-50">
                        [Скан документа]
                    </div>
                </div>

                <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-3">
                   <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                   <p className="text-green-400 text-xs leading-relaxed font-medium">
                      Объект соответствует требованиям архитектурного облика столицы. Размещение разрешено.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}