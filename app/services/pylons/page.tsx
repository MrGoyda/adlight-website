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
  MapPin,        // Локация/Навигация
  Navigation,    // Навигация
  Construction,  // Стройка/Фундамент
  Car,           // Автомобильный трафик
  Zap,
  CheckCircle,
  Clock,
  MessageCircle
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export const metadata = {
  title: "Рекламные стелы и пилоны в Астане | Изготовление и Монтаж | ADLight",
  description: "Производство уличных стел, навигационных пилонов и указателей. Заливка фундамента, металлокаркас, обшивка композитом. Гарантия на ветровые нагрузки.",
};

export default function PylonsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-blue-600/5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* ХЛЕБНЫЕ КРОШКИ */}
           <div data-aos="fade-down" className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-blue-500 font-medium">Рекламные стелы</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div data-aos="fade-right" className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full uppercase tracking-wider">
                    Навигация для водителей и пешеходов
                 </div>
                 <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Стелы и пилоны <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">любой высоты</span>
                 </h1>
                 <p data-aos="fade-right" data-aos-delay="200" className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Отдельно стоящие рекламные конструкции. Работаем «под ключ»: от заливки фундамента до подключения электрики. Надежный каркас, устойчивый к ветрам Астаны.
                 </p>
                 
                 {/* КНОПКИ */}
                 <div data-aos="fade-right" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать проект
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-slate-500 transition active:scale-95">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Написать в WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал */}
              <div className="relative" data-aos="zoom-in" data-aos-delay="200">
                 <div className="aspect-[4/5] md:aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative group shadow-2xl">
                    {/* Используем фото стелы АЗС или похожей */}
                    <img src="/kmg.jpeg" alt="Рекламная стела" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                          <Car className="w-6 h-6"/>
                       </div>
                       <div>
                          <div className="text-white font-bold">Видно с дороги</div>
                          <div className="text-gray-400 text-xs">Привлекает автомобильный трафик</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. ОСОБЕННОСТИ КОНСТРУКЦИИ */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-4">Капитальное строительство</h2>
                <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 max-w-2xl mx-auto">
                   Стела — это не просто вывеска, это инженерное сооружение. Мы гарантируем устойчивость.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Карточка 1 */}
                <div data-aos="fade-up" data-aos-delay="0" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                      <Construction className="w-7 h-7 text-blue-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Фундамент</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      В зависимости от грунта и высоты стелы, мы заливаем бетонный фундамент с армированием или используем винтовые сваи.
                   </p>
                </div>

                {/* Карточка 2 */}
                <div data-aos="fade-up" data-aos-delay="100" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition">
                      <Layers className="w-7 h-7 text-purple-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Металлокаркас</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Силовой каркас из профильной трубы или швеллера. Расчет на ветровые нагрузки III снегового района (Астана). Антикоррозийная обработка.
                   </p>
                </div>

                {/* Карточка 3 */}
                <div data-aos="fade-up" data-aos-delay="200" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition">
                      <PaintBucket className="w-7 h-7 text-orange-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Композитная обшивка</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Облицовка алюминиевым композитом (Алюкобонд). Это вандалостойкий материал, который не выгорает и легко моется.
                   </p>
                </div>

                {/* Карточка 4 */}
                <div data-aos="fade-up" data-aos-delay="300" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition">
                      <Thermometer className="w-7 h-7 text-red-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Утепление электрики</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Блоки питания и контроллеры размещаются в герметичных щитках внутри стелы или в специальном люке обслуживания.
                   </p>
                </div>

                {/* Карточка 5 */}
                <div data-aos="fade-up" data-aos-delay="400" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                      <Ruler className="w-7 h-7 text-green-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Проект КМ/КМД</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Разрабатываем полный пакет проектной документации для согласования с Акиматом и ГАСК.
                   </p>
                </div>

                {/* Карточка 6 */}
                <div data-aos="fade-up" data-aos-delay="500" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition">
                      <Zap className="w-7 h-7 text-cyan-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Световые элементы</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Инкрустация акрилом, объемные буквы или светодиодные экраны. Ваша стела будет видна за сотни метров ночью.
                   </p>
                </div>
             </div>
         </div>
      </section>

      {/* 4. ВИДЫ СТЕЛ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Виды конструкций</h2>
            
            <div className="space-y-24">
               {/* Тип 1: Навигационная стела (Пилон) */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Навигационный пилон</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-orange-500 font-bold mb-6">Для ТРЦ и БЦ</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Компактная конструкция (1.5 - 3 метра) для установки возле входа или на парковке. Содержит список арендаторов или схему проезда.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Удобство:</span>
                              Сменные панели позволяют легко менять названия компаний.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Дизайн:</span>
                              Строгий стиль, часто с внутренней подсветкой.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать пилон <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      {/* Можно использовать фото пилона, если есть, или заглушку */}
                      <img src="/images/calc/lightbox-1.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Навигационный пилон"/>
                  </div>
               </div>

               {/* Тип 2: Рекламная стела (АЗС/Автосалон) */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                   <div data-aos="fade-right" className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/kmg.jpeg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Стела АЗС"/>
                   </div>
                  <div data-aos="fade-left">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Рекламная стела (5-15м)</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-blue-500 font-bold mb-6">Масштаб</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Высотная конструкция для обозначения объекта с большого расстояния (трасса, проспект). Обязательна для АЗС и автосалонов.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">LED-экраны:</span>
                              Часто встраиваем табло обмена валют или бегущие строки.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Фундамент:</span>
                              Требует серьезных бетонных работ (заливка анкерной группы).
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-blue-500 font-bold hover:text-blue-400 transition text-lg">
                        Рассчитать стелу <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
               </div>

               {/* Тип 3: Интерьерный пилон */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Интерьерный пилон</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-purple-500 font-bold mb-6">Навигация внутри</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Тонкие, изящные конструкции для холлов, торговых центров и бизнес-центров. Помогают посетителям найти нужный кабинет или магазин.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Дизайн:</span>
                              Стекло, акрил, нержавеющая сталь.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Мобильность:</span>
                              Могут быть переносными (без крепления к полу).
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-purple-500 font-bold hover:text-purple-400 transition text-lg">
                        Рассчитать пилон <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/1solution.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Интерьерный пилон"/>
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
           <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Этапы строительства</h2>
           <div className="grid md:grid-cols-5 gap-8">
              {[
                 {step: "01", title: "Геология", desc: "Изучаем грунт и место установки. Проверяем наличие подземных коммуникаций."},
                 {step: "02", title: "Проект", desc: "Конструктор рассчитывает нагрузки и готовит чертежи КМД."},
                 {step: "03", title: "Фундамент", desc: "Копаем котлован, вяжем арматуру, заливаем бетон (срок застывания 3-7 дней)."},
                 {step: "04", title: "Металл", desc: "Сварка каркаса в цеху, обшивка композитом, установка электрики."},
                 {step: "05", title: "Монтаж", desc: "Доставка манипулятором, установка на анкеры, подключение."}
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
        title="Примеры наших стел" 
        subtitle="Работы в Астане и области" 
      />
      
      <ReviewsCarousel />
      
      <ServicesCarousel 
        title="Что еще мы производим" 
        subtitle="Другие виды наружной рекламы" 
        hiddenLink="/services/pylons" // Скрываем ссылку на саму себя
      />

      <CallToAction source="Услуга: Стелы и Пилоны" />

    </div>
  );
}