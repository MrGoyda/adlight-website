import Link from "next/link";
import { 
  Calculator, 
  Shield, 
  Ruler, 
  ArrowRight, 
  ChevronRight, 
  Thermometer, 
  PaintBucket, 
  Layers, 
  FileCheck,
  Box,         
  Maximize,    
  Zap,
  CheckCircle,
  Clock,
  MessageCircle,
  Repeat,      // Иконка "Повтор/Двусторонний"
  Wind         // Иконка "Ветер"
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export const metadata = {
  title: "Панель-кронштейны в Астане | Двусторонние вывески ADLight",
  description: "Изготовление торцевых вывесок (консолей). Круглые, фигурные, световые. Монтаж на фасад или столб. Гарантия 1 год.",
};

export default function PanelBracketsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-orange-600/5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* ХЛЕБНЫЕ КРОШКИ */}
           <div data-aos="fade-down" className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-orange-500 font-medium">Панель-кронштейны</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div data-aos="fade-right" className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase tracking-wider">
                    Ловит пешеходный трафик
                 </div>
                 <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Двусторонние <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">торцевые вывески</span>
                 </h1>
                 <p data-aos="fade-right" data-aos-delay="200" className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Идеальное дополнение к основной вывеске. Крепятся перпендикулярно фасаду, чтобы вас видели люди, идущие вдоль улицы.
                 </p>
                 
                 {/* КНОПКИ */}
                 <div data-aos="fade-right" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать стоимость
                    </Link>
                    
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-slate-500 transition active:scale-95">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Написать в WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал */}
              <div className="relative" data-aos="zoom-in" data-aos-delay="200">
                 <div className="aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative group shadow-2xl">
                    <img src="/panel.jpg" alt="Панель кронштейн" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                          <Repeat className="w-6 h-6"/>
                       </div>
                       <div>
                          <div className="text-white font-bold">Обзор 360°</div>
                          <div className="text-gray-400 text-xs">Работает на 2 стороны</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. ТЕХНИЧЕСКИЕ СТАНДАРТЫ */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-4">Особенности конструкции</h2>
                <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 max-w-2xl mx-auto">
                   Кронштейны испытывают повышенную ветровую нагрузку, поэтому мы делаем упор на прочность каркаса.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Карточка 1 */}
                <div data-aos="fade-up" data-aos-delay="0" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                      <Repeat className="w-7 h-7 text-blue-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Двусторонний обзор</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Реклама работает в обе стороны движения. Идеально для узких улиц и тротуаров, где основную вывеску плохо видно.
                   </p>
                </div>

                {/* Карточка 2 */}
                <div data-aos="fade-up" data-aos-delay="100" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition">
                      <Wind className="w-7 h-7 text-purple-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Ветроустойчивость</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Усиленный внутренний металлокаркас и прочные ножки крепления. Конструкция не шатается и выдерживает порывы ветра Астаны.
                   </p>
                </div>

                {/* Карточка 3 */}
                <div data-aos="fade-up" data-aos-delay="200" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition">
                      <Zap className="w-7 h-7 text-orange-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Блокирующая прослойка</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Внутри устанавливается светоблокирующая перегородка, чтобы изображение с одной стороны не просвечивало на другую.
                   </p>
                </div>

                {/* Карточка 4 */}
                <div data-aos="fade-up" data-aos-delay="300" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition">
                      <Thermometer className="w-7 h-7 text-red-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Акрил + Композит</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Лицевые части из молочного акрила, борта из алюминиевого композита или ПВХ. Не ржавеет и выглядит эстетично.
                   </p>
                </div>

                {/* Карточка 5 */}
                <div data-aos="fade-up" data-aos-delay="400" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                      <Ruler className="w-7 h-7 text-green-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Любая форма</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Не обязательно прямоугольник. Мы делаем круглые аптечные кресты, овальные логотипы и сложные фигурные консоли.
                   </p>
                </div>

                {/* Карточка 6 */}
                <div data-aos="fade-up" data-aos-delay="500" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition">
                      <PaintBucket className="w-7 h-7 text-cyan-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Фотопечать</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Нанесение изображения методом прямой УФ-печати или аппликацией пленками Oracal. Яркость 100%.
                   </p>
                </div>
             </div>
         </div>
      </section>

      {/* 4. ВИДЫ КРОНШТЕЙНОВ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Популярные форматы</h2>
            
            <div className="space-y-24">
               {/* Тип 1: Круглый/Прямоугольный */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Круглая / Прямоугольная консоль</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-orange-500 font-bold mb-6">Классика</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Самый распространенный формат. Аккуратно смотрится на фасаде, подходит для любого логотипа. 
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где лучше:</span>
                              Кофейни, нотариусы, салоны красоты, магазины.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Плюсы:</span>
                              Максимально полезная площадь для рекламы.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/panel.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Круглая консоль"/>
                  </div>
               </div>

               {/* Тип 2: Фигурный */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                   <div data-aos="fade-right" className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/lightbox-2.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Фигурный кронштейн"/>
                   </div>
                  <div data-aos="fade-left">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Фигурный кронштейн</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-purple-500 font-bold mb-6">По форме логотипа</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Консоль повторяет контуры вашего знака или предмета (например, зуб для стоматологии или ножницы для парикмахерской).
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Эффект:</span>
                              Моментально считывается сфера деятельности.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Технология:</span>
                              Фрезеровка на ЧПУ, борт из ПВХ или алюминия.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
               </div>

               {/* Тип 3: Аптечный крест (Динамика) */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Аптечный крест (LED)</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-green-500 font-bold mb-6">Динамика</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Специализированная вывеска с открытыми пиксельными диодами. Может мигать, показывать время, температуру или анимацию.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где лучше:</span>
                              Аптеки, клиники, оптики.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Яркость:</span>
                              Самый яркий тип вывески, виден даже днем на солнце.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/neon.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Аптечный крест"/>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. ДИЗАЙН КОД */}
      <DesignCodeBlock />

      {/* 6. ЭТАПЫ РАБОТЫ */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4">
           <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Этапы работы</h2>
           <div className="grid md:grid-cols-5 gap-8">
              {[
                 {step: "01", title: "Заявка", desc: "Оставляете заявку. Мы уточняем размеры и тип крепления."},
                 {step: "02", title: "Замер", desc: "Проверяем фасад на прочность для крепления консоли."},
                 {step: "03", title: "Макет", desc: "Разрабатываем двусторонний макет и фотопривязку."},
                 {step: "04", title: "Цех", desc: "Сварка силового каркаса, сборка короба, электрика."},
                 {step: "05", title: "Монтаж", desc: "Крепление на анкеры, подключение, проверка на ветровую нагрузку."}
              ].map((item, i) => (
                 <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="relative group">
                    <div className="text-6xl font-black text-slate-800 mb-4 group-hover:text-slate-700 transition">{item.step}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 7. КОМПОНЕНТЫ */}
      <ProjectsBento 
        title="Наши работы" 
        subtitle="Панель-кронштейны и вывески" 
      />
      
      <ReviewsCarousel />
      
      {/* Скрываем ссылку на саму себя */}
      <ServicesCarousel 
        title="Что еще мы производим" 
        subtitle="Другие виды наружной рекламы" 
        hiddenLink="/services/panel-brackets" 
      />

      <CallToAction source="Услуга: Панель-кронштейны" />

    </div>
  );
}