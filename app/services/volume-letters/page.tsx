import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Zap, Shield, Ruler, ArrowRight, ChevronRight, Calculator, Flame } from "lucide-react";

export const metadata = {
  title: "Объемные буквы в Астане | Производство вывесок ADLight",
  description: "Изготовление объемных букв с подсветкой. Срок от 3 дней. Гарантия 1 год. Свое производство в Астане.",
};

export default function VolumeLettersPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-orange-600/5"></div>
        {/* Фоновое свечение */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Хлебные крошки */}
           <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-4 h-4"/>
              <span className="text-orange-500">Объемные буквы</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Объемные буквы <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">с гарантией яркости</span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Главный инструмент наружной рекламы. Изготавливаем из немецкого акрила Plexiglas и алюминия. Не желтеют, не трескаются, горят равномерно.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать цену
                    </Link>
                    <button className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-800 transition">
                       Скачать прайс PDF
                    </button>
                 </div>
              </div>

              {/* Правая часть - Визуал букв (можно поставить фото готовой работы) */}
              <div className="relative">
                 <div className="aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative group">
                    {/* Тут должна быть крутая фотка буквы крупным планом */}
                    <img src="/images/calc/full.jpg" alt="Объемные буквы" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    {/* Плашка с преимуществом */}
                    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                          <Zap className="w-6 h-6"/>
                       </div>
                       <div>
                          <div className="text-white font-bold">Сверхъяркие линзы</div>
                          <div className="text-gray-400 text-xs">Никаких темных пятен</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. ВИДЫ БУКВ (ТЕХНОЛОГИИ) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Какие буквы мы делаем</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {/* 1. Лицевая */}
               <div className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-orange-500/50 transition duration-300">
                  <div className="h-48 bg-slate-800 relative overflow-hidden">
                     <img src="/images/calc/face.jpg" alt="Лицевая" className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"/>
                  </div>
                  <div className="p-6">
                     <h3 className="text-xl font-bold text-white mb-2">Лицевая подсветка</h3>
                     <p className="text-gray-400 text-sm mb-4 min-h-[40px]">Классический вариант. Светится только лицевая часть. Борта непрозрачные.</p>
                     <div className="text-orange-500 font-bold text-lg">от 400 ₸/см</div>
                  </div>
               </div>

               {/* 2. Полная */}
               <div className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-orange-500/50 transition duration-300">
                  <div className="h-48 bg-slate-800 relative overflow-hidden">
                     <img src="/images/calc/full.jpg" alt="Полная" className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"/>
                     <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">ХИТ</div>
                  </div>
                  <div className="p-6">
                     <h3 className="text-xl font-bold text-white mb-2">Полная подсветка</h3>
                     <p className="text-gray-400 text-sm mb-4 min-h-[40px]">Светятся лицо и борта. Максимальная яркость и заметность ночью.</p>
                     <div className="text-orange-500 font-bold text-lg">от 650 ₸/см</div>
                  </div>
               </div>

               {/* 3. Контражур */}
               <div className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-orange-500/50 transition duration-300">
                  <div className="h-48 bg-slate-800 relative overflow-hidden">
                     <img src="/images/calc/back.jpg" alt="Контражур" className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"/>
                  </div>
                  <div className="p-6">
                     <h3 className="text-xl font-bold text-white mb-2">Контражур</h3>
                     <p className="text-gray-400 text-sm mb-4 min-h-[40px]">Свет падает на фасад, создавая ореол вокруг буквы. Премиальный вид.</p>
                     <div className="text-orange-500 font-bold text-lg">от 550 ₸/см</div>
                  </div>
               </div>

               {/* 4. Акрил */}
               <div className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-orange-500/50 transition duration-300">
                  <div className="h-48 bg-slate-800 relative overflow-hidden">
                     <img src="/images/calc/acryl.jpg" alt="Акрил" className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"/>
                  </div>
                  <div className="p-6">
                     <h3 className="text-xl font-bold text-white mb-2">Псевдообъем</h3>
                     <p className="text-gray-400 text-sm mb-4 min-h-[40px]">Плоские буквы на дистанционных держателях. Без внутренней подсветки.</p>
                     <div className="text-orange-500 font-bold text-lg">от 200 ₸/см</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. СРАВНЕНИЕ (ПОЧЕМУ МЫ) */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
             <div className="grid lg:grid-cols-2 gap-16">
                 <div>
                     <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Не все буквы одинаковы</h2>
                     <p className="text-gray-400 text-lg mb-8">
                        Рынок Астаны переполнен дешевыми вывесками, которые тускнеют через полгода. 
                        Мы используем технологию <span className="text-orange-500 font-bold">LongLife LED</span>.
                     </p>
                     
                     <div className="space-y-6">
                        <div className="flex gap-4">
                           <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mt-1 shrink-0">X</div>
                           <div>
                              <h4 className="text-gray-300 font-bold">Как делают "в гаражах":</h4>
                              <p className="text-gray-500 text-sm">Дешевый полистирол (желтеет), обычная LED-лента (перегревается), клей "Момент" (отваливается).</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mt-1 shrink-0"><CheckCircle/></div>
                           <div>
                              <h4 className="text-white font-bold">Как делаем мы (ADLight):</h4>
                              <p className="text-gray-400 text-sm">Литой акрил (Plexiglas), линзованные модули (IP67), алюминиевый борт, станки с ЧПУ.</p>
                           </div>
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                       <Shield className="w-8 h-8 text-blue-500 mb-4"/>
                       <div className="text-white font-bold text-lg mb-1">Гарантия 1-3 года</div>
                       <div className="text-gray-500 text-sm">Прописываем в договоре</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                       <Flame className="w-8 h-8 text-orange-500 mb-4"/>
                       <div className="text-white font-bold text-lg mb-1">Краска Flame</div>
                       <div className="text-gray-500 text-sm">Устойчива к сколам</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                       <Ruler className="w-8 h-8 text-purple-500 mb-4"/>
                       <div className="text-white font-bold text-lg mb-1">Точность 0.1 мм</div>
                       <div className="text-gray-500 text-sm">Лазерная резка</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                       <Zap className="w-8 h-8 text-yellow-500 mb-4"/>
                       <div className="text-white font-bold text-lg mb-1">Экономия 40%</div>
                       <div className="text-gray-500 text-sm">Энергоэффективные диоды</div>
                    </div>
                 </div>
             </div>
         </div>
      </section>

      {/* 4. CTA (ПРИЗЫВ К ДЕЙСТВИЮ) */}
      <section className="py-20 bg-orange-600 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
         <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Узнайте стоимость вашей вывески</h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
               Воспользуйтесь нашим онлайн-калькулятором. Это займет 1 минуту. Вы получите точную смету с учетом монтажа.
            </p>
            <Link href="/calculator" className="inline-flex items-center gap-2 bg-white text-orange-600 px-10 py-5 rounded-xl font-bold text-xl hover:bg-gray-100 transition shadow-2xl active:scale-95">
               Перейти в калькулятор <ArrowRight className="w-6 h-6"/>
            </Link>
         </div>
      </section>

    </div>
  );
}