import Link from "next/link";
import { 
  CheckCircle, 
  Calculator, 
  Shield, 
  Ruler, 
  ArrowRight, 
  ArrowLeft,
  Thermometer, 
  PaintBucket, 
  Layers, 
  FileCheck,
  Snowflake,
  Type,
  MessageCircle // Добавил иконку для WhatsApp
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export const metadata = {
  title: "Объемные буквы в Астане | Производство ADLight",
  description: "Изготовление вывесок: акрил 3мм, пленка Oracal, алюминиевый борт. Согласование. Гарантия 1 год.",
};

export default function VolumeLettersPage() {
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
              <span className="text-gray-600">/</span>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <span className="text-gray-600">/</span>
              <span className="text-orange-500 font-medium">Объемные буквы</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div data-aos="fade-right" className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase tracking-wider">
                    Гарантия 1 год по договору
                 </div>
                 <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Объемные буквы, которые <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">пройдут согласование</span>
                 </h1>
                 <p data-aos="fade-right" data-aos-delay="200" className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Производим вывески, устойчивые к климату Астаны. Используем плотный качественный акрил (не выцветает), оригинальные пленки Oracal и алюминиевый борт. Морозостойкая электрика.
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
                    <img src="/images/calc/full.jpg" alt="Объемные буквы" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                          <FileCheck className="w-6 h-6"/>
                       </div>
                       <div>
                          <div className="text-white font-bold">Соответствует ГОСТ</div>
                          <div className="text-gray-400 text-xs">И Дизайн-коду столицы</div>
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
                <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-4">Наши технические стандарты</h2>
                <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 max-w-2xl mx-auto">
                   Мы не экономим на материалах. Используем только проверенные компоненты для долговечности.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div data-aos="fade-up" data-aos-delay="0" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                      <Layers className="w-7 h-7 text-blue-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Акрил 3 мм</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Используем только плотный качественный акрил толщиной минимум 3 мм. Он не деформируется от жары и отлично рассеивает свет.
                   </p>
                </div>

                <div data-aos="fade-up" data-aos-delay="100" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition">
                      <Shield className="w-7 h-7 text-purple-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">ПВХ 0.60 плотности</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Для задних стенок берем ПВХ повышенной плотности (0.60). Это гарантирует жесткость конструкции — буквы не поведет на солнце.
                   </p>
                </div>

                <div data-aos="fade-up" data-aos-delay="200" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition">
                      <PaintBucket className="w-7 h-7 text-orange-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Пленки Oracal</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Оклейка только оригинальными пленками Oracal (Германия). Они не выцветают на солнце и не отклеиваются по краям через год.
                   </p>
                </div>

                <div data-aos="fade-up" data-aos-delay="300" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition">
                      <Thermometer className="w-7 h-7 text-red-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Морозостойкость</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Вывески не боятся перепадов температур от -40°C до +40°C. Блоки питания IP67 с "холодным стартом" (не замерзают).
                   </p>
                </div>

                <div data-aos="fade-up" data-aos-delay="400" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                      <Ruler className="w-7 h-7 text-green-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Алюминиевый борт</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Для букв сложного шрифта или небольшого размера используем алюминиевый профиль. Это дает идеальную геометрию.
                   </p>
                </div>

                <div data-aos="fade-up" data-aos-delay="500" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                   <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition">
                      <PaintBucket className="w-7 h-7 text-cyan-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Покраска в цвет</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Мы не экономим на краске. Металлокаркас всегда красим в цвет фасада (по RAL), чтобы он не выделялся.
                   </p>
                </div>
             </div>
         </div>
      </section>

      {/* 5. КАТАЛОГ ТИПОВ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Виды объемных букв</h2>
            
            <div className="space-y-24">
               {/* Тип 1: Лицевая */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Лицевая подсветка</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-orange-500 font-bold mb-6">Самый популярный выбор</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Светится только лицевая поверхность. Борта выполнены из ПВХ или алюминия (непрозрачные). Отлично читается с большого расстояния.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где лучше:</span>
                              Фасады магазинов, ТРЦ, крышные установки.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Материал:</span>
                              Лицо — Акрил 3мм, Борт — ПВХ/Алюминий.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/face.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Лицевая подсветка"/>
                  </div>
               </div>

               {/* Тип 2: Полная */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                   <div data-aos="fade-right" className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/full.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Полная подсветка"/>
                   </div>
                  <div data-aos="fade-left">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Полная подсветка (Премиум)</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-purple-500 font-bold mb-6">Максимальная яркость</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Светится и лицо, и боковые части. Создает эффект "леденца". Буква полностью изготовлена из акрила.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где лучше:</span>
                              Интерьер ТЦ, бутики, рестораны, ресепшн.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Материал:</span>
                              Цельный акрил + пленка.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
               </div>

               {/* Тип 3: Контражур */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Контражурная подсветка</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-cyan-500 font-bold mb-6">Эффект "парения"</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Свет направлен назад, на фасад. Вокруг буквы образуется мягкий световой ореол. Буквы устанавливаются на дистанционные держатели.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где лучше:</span>
                              Салоны красоты, офисы (где важен стиль).
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Нюанс:</span>
                              Требует ровной матовой стены.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/back.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Контражур"/>
                  </div>
               </div>

               {/* Тип 4: Псевдообъем (Накладные) */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                   <div data-aos="fade-right" className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/acryl.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Псевдообъем"/>
                   </div>
                  <div data-aos="fade-left">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Псевдообъем (Накладные)</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-gray-400 font-bold mb-6">Бюджетный выбор</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Плоские буквы из акрила или ПВХ на дистанционных держателях. Без внутренней подсветки, но выглядят объемно за счет тени.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где лучше:</span>
                              Оформление офиса, зоны ресепшн, светлые помещения.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Цена:</span>
                              Самый доступный вариант рекламы.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 6. ДИЗАЙН КОД */}
      <DesignCodeBlock />

      {/* 7. ЭТАПЫ РАБОТЫ */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4">
           <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Этапы работы над вывеской</h2>
           <div className="grid md:grid-cols-5 gap-8">
              {[
                 {step: "01", title: "Заявка", desc: "Вы оставляете заявку. Мы предварительно оцениваем бюджет."},
                 {step: "02", title: "Замер", desc: "Бесплатный выезд на объект для замеров и оценки фасада."},
                 {step: "03", title: "Дизайн", desc: "Делаем фотопривязку (дневной/ночной вид) и технический эскиз."},
                 {step: "04", title: "Цех", desc: "Фрезеровка акрила, гибка борта, сборка и проверка электрики."},
                 {step: "05", title: "Монтаж", desc: "Установка в любое время года. Подключение, документы, гарантия."}
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

      {/* 8. КОМПОНЕНТЫ */}
      <ProjectsBento 
        title="Примеры объемных букв" 
        subtitle="Наши работы в Астане" 
      />
      
      <ReviewsCarousel />
      
      <ServicesCarousel 
        title="Что еще мы производим" 
        subtitle="Другие виды наружной рекламы" 
        hiddenLink="/services/volume-letters"
      />

      <CallToAction source="Услуга: Объемные буквы" />

    </div>
  );
}