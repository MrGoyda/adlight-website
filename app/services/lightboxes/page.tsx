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
  MessageCircle // <-- ИКОНКА WHATSAPP
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export const metadata = {
  title: "Световые короба и Лайтбоксы в Астане | ADLight",
  description: "Изготовление лайтбоксов любой формы. Акриловые, баннерные и композитные короба. Яркая подсветка, гарантия 1 год.",
};

export default function LightboxesPage() {
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
              <span className="text-orange-500 font-medium">Световые короба</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div data-aos="fade-right" className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full uppercase tracking-wider">
                    Максимальная площадь свечения
                 </div>
                 <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Яркие лайтбоксы <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">любой формы</span>
                 </h1>
                 <p data-aos="fade-right" data-aos-delay="200" className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    От бюджетных прямоугольных коробов до сложных фигурных логотипов. Используем светодиодные модули с линзой для равномерной засветки без "пятен".
                 </p>
                 
                 {/* КНОПКИ (Калькулятор + WhatsApp) */}
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
                    <img src="/images/calc/lightbox-1.jpg" alt="Световой короб" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                          <Box className="w-6 h-6"/>
                       </div>
                       <div>
                          <div className="text-white font-bold">Герметичность IP65</div>
                          <div className="text-gray-400 text-xs">Защита от пыли и влаги</div>
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
                <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-4">Из чего мы делаем короба</h2>
                <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 max-w-2xl mx-auto">
                   Материал лицевой части зависит от размера вывески. Мы подбираем оптимальное решение.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Карточка 1 */}
                <div data-aos="fade-up" data-aos-delay="0" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                      <Layers className="w-7 h-7 text-blue-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Акрил (Оргстекло)</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Используется для коробов размером до 3 метров. Идеально ровная глянцевая поверхность. Самая яркая засветка.
                   </p>
                </div>

                {/* Карточка 2 */}
                <div data-aos="fade-up" data-aos-delay="100" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition">
                      <Maximize className="w-7 h-7 text-purple-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Транслюцентный баннер</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Для огромных вывесок (более 3м). Баннерная ткань натягивается на каркас. Позволяет создавать бесшовные короба любой длины.
                   </p>
                </div>

                {/* Карточка 3 */}
                <div data-aos="fade-up" data-aos-delay="200" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition">
                      <Zap className="w-7 h-7 text-orange-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Светодиоды ELF</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Только линзованные модули с углом рассеивания 160°. Это гарантирует отсутствие темных пятен на лицевой части.
                   </p>
                </div>

                {/* Карточка 4 */}
                <div data-aos="fade-up" data-aos-delay="300" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition">
                      <Thermometer className="w-7 h-7 text-red-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Каркас из металла</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Внутренний силовой каркас из профильной трубы 20x20 или 40x20 мм. Грунтуется и красится для защиты от ржавчины.
                   </p>
                </div>

                {/* Карточка 5 */}
                <div data-aos="fade-up" data-aos-delay="400" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                      <Ruler className="w-7 h-7 text-green-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Профиль Quatro</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Для боковин используем специальный пластиковый или алюминиевый профиль. Это обеспечивает герметичность и аккуратный вид.
                   </p>
                </div>

                {/* Карточка 6 */}
                <div data-aos="fade-up" data-aos-delay="500" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition">
                      <PaintBucket className="w-7 h-7 text-cyan-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Фотопечать 1440 dpi</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Изображение наносится методом УФ-печати или пленкой Oracal. Яркие, насыщенные цвета, которые не выгорают годами.
                   </p>
                </div>
             </div>
         </div>
      </section>

      {/* 4. ВИДЫ ЛАЙТБОКСОВ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Какие короба мы делаем</h2>
            
            <div className="space-y-24">
               {/* Тип 1: Прямоугольный */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Прямоугольный лайтбокс</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-orange-500 font-bold mb-6">Самый доступный</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Классический вариант вывески. Позволяет разместить любое изображение, логотип и много текста. Отличное соотношение цены и площади рекламы.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где лучше:</span>
                              Продуктовые магазины, СТО, аптеки, фастфуд.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Плюсы:</span>
                              Низкая цена, быстрый монтаж, легко менять изображение.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/lightbox-1.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Прямоугольный лайтбокс"/>
                  </div>
               </div>

               {/* Тип 2: Фигурный */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                   <div data-aos="fade-right" className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/lightbox-2.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Фигурный лайтбокс" />
                   </div>
                  <div data-aos="fade-left">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Фигурный лайтбокс</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-purple-500 font-bold mb-6">Выделяется формой</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Короб в форме круга, овала, логотипа или любой сложной фигуры. Изготавливается методом фрезеровки на ЧПУ станке.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где лучше:</span>
                              Логотипы брендов, кофейни, барбершопы.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Особенность:</span>
                              Привлекает больше внимания, чем простой прямоугольник.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
               </div>

               {/* Тип 3: Композитный с инкрустацией */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Композитный с инкрустацией</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-cyan-500 font-bold mb-6">Премиум вид</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Короб выполнен из непрозрачного композита (алюминия). Светятся только вырезанные буквы, инкрустированные толстым акрилом (10-15мм).
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где лучше:</span>
                              Бутики в ТРЦ, бизнес-центры, дорогие салоны.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Эффект:</span>
                              Буквы светятся и немного выступают из плоскости.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/1solution.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Инкрустация"/>
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
                 {step: "01", title: "Заявка", desc: "Вы оставляете заявку на сайте или по телефону."},
                 {step: "02", title: "Замер", desc: "Мастер приезжает на объект, снимает размеры."},
                 {step: "03", title: "Макет", desc: "Дизайнер рисует фотопривязку на ваш фасад."},
                 {step: "04", title: "Сборка", desc: "Сварка каркаса, пайка диодов, накатка пленки."},
                 {step: "05", title: "Монтаж", desc: "Установка короба, подключение к сети, гарантия."}
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
        title="Примеры наших работ" 
        subtitle="Лайтбоксы и вывески в Астане" 
      />
      
      <ReviewsCarousel />
      
      {/* Скрываем ссылку на саму себя */}
      <ServicesCarousel 
        title="Что еще мы производим" 
        subtitle="Другие виды наружной рекламы" 
        hiddenLink="/services/lightboxes" 
      />

      <CallToAction source="Услуга: Лайтбоксы" />

    </div>
  );
}