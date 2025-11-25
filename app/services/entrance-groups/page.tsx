import Link from "next/link";
import { 
  Calculator, 
  ArrowRight, 
  ChevronRight, 
  Umbrella,    // Зонт (Козырек)
  DoorOpen,    // Дверь (Портал)
  Frame,       // Рама (Фасад)
  Hammer,      // Монтаж
  Ruler,
  ShieldCheck,
  Layers,
  Thermometer, // Утепление
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
  title: "Входные группы в Астане | Оформление фасадов | ADLight",
  description: "Обшивка фасадов композитом (Алюкобонд), изготовление козырьков, входных порталов. Комплексное оформление под ключ. Гарантия.",
};

export default function EntranceGroupsPage() {
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
              <span className="text-orange-500 font-medium">Входные группы</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div data-aos="fade-right" className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full uppercase tracking-wider">
                    Полное преображение фасада
                 </div>
                 <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Оформление <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">входных групп</span>
                 </h1>
                 <p data-aos="fade-right" data-aos-delay="200" className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Превращаем серый фасад в магнит для клиентов. Обшивка алюминиевым композитом, монтаж козырьков и подсветки. Капитальный подход.
                 </p>
                 
                 {/* КНОПКИ */}
                 <div data-aos="fade-right" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать смету
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-slate-500 transition active:scale-95">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Написать в WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал */}
              <div className="relative" data-aos="zoom-in" data-aos-delay="200">
                 <div className="aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative group shadow-2xl">
                    <img src="/agro.jpg" alt="Входная группа аптеки" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                          <Layers className="w-6 h-6"/>
                       </div>
                       <div>
                          <div className="text-white font-bold">Алюминиевый композит</div>
                          <div className="text-gray-400 text-xs">Срок службы 15+ лет</div>
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
                <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-4">Капитальный подход</h2>
                <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 max-w-2xl mx-auto">
                   Входная группа — это стройка. Мы варим металл, утепляем стены и гарантируем герметичность.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Карточка 1 */}
                <div data-aos="fade-up" data-aos-delay="0" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                      <Layers className="w-7 h-7 text-blue-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Алюкобонд (ACP)</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Используем алюминиевые композитные панели 3-4 мм. Идеально ровная поверхность, любые цвета по RAL, не ржавеет и не выцветает.
                   </p>
                </div>

                {/* Карточка 2 */}
                <div data-aos="fade-up" data-aos-delay="100" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition">
                      <Hammer className="w-7 h-7 text-purple-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Силовой каркас</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Свариваем независимый каркас из профильной трубы. Конструкция надежно крепится к зданию анкерами и выдерживает снеговые нагрузки.
                   </p>
                </div>

                {/* Карточка 3 */}
                <div data-aos="fade-up" data-aos-delay="200" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition">
                      <Umbrella className="w-7 h-7 text-orange-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Гидроизоляция</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Особое внимание уделяем стыкам козырька со стеной. Используем отливы и герметики, чтобы вода не текла по фасаду.
                   </p>
                </div>

                {/* Карточка 4 */}
                <div data-aos="fade-up" data-aos-delay="300" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition">
                      <Thermometer className="w-7 h-7 text-red-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Утепление</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      При необходимости прокладываем слой утеплителя (минвата/пеноплекс) между стеной и композитом. Актуально для тамбуров.
                   </p>
                </div>

                {/* Карточка 5 */}
                <div data-aos="fade-up" data-aos-delay="400" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                      <Ruler className="w-7 h-7 text-green-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Фрезеровка (Кассеты)</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Композит гнется в кассеты на фрезерном станке. Стыки получаются ровными, без видимых саморезов на лицевой части.
                   </p>
                </div>

                {/* Карточка 6 */}
                <div data-aos="fade-up" data-aos-delay="500" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition">
                      <ShieldCheck className="w-7 h-7 text-cyan-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Антивандальность</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Алюминиевый композит легко моется и сложно царапается. Идеальное решение для первого этажа с высокой проходимостью.
                   </p>
                </div>
             </div>
         </div>
      </section>

      {/* 4. ВАРИАНТЫ ОФОРМЛЕНИЯ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Что включает входная группа</h2>
            
            <div className="space-y-24">
               {/* Тип 1: Обшивка фасада */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Обшивка фасада композитом</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-blue-500 font-bold mb-6">База</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Полное закрытие старой стены декоративными панелями. Скрывает дефекты, трубы и провода. Создает идеальный фон для вывески.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <Frame className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Вид:</span>
                              Здание выглядит современно и дорого.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <Layers className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Цвет:</span>
                              Любой цвет по шкале RAL, матовый или глянец.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-blue-500 font-bold hover:text-blue-400 transition text-lg">
                        Рассчитать обшивку <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/kmg.jpeg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Обшивка фасада"/>
                  </div>
               </div>

               {/* Тип 2: Входной портал */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                   <div data-aos="fade-right" className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/agro.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Входной портал"/>
                   </div>
                  <div data-aos="fade-left">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Входной портал</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-purple-500 font-bold mb-6">Акцент на дверь</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        П-образная конструкция вокруг двери. Визуально увеличивает вход, делает его заметнее. Часто дополняется подсветкой.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <DoorOpen className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Задача:</span>
                              Выделить вход среди витрин или на длинном фасаде.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <Layers className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Исполнение:</span>
                              Объемный портал с выносом 10-30 см от стены.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-purple-500 font-bold hover:text-purple-400 transition text-lg">
                        Рассчитать портал <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
               </div>

               {/* Тип 3: Козырек */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Козырек с подсветкой</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-orange-500 font-bold mb-6">Защита + Реклама</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Навес над входом. Защищает крыльцо от осадков. В козырек часто встраивают светильники ("глазки") или делают его лицевую часть световым коробом.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <Umbrella className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Функция:</span>
                              Комфорт для посетителей и защита двери от снега.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <ShieldCheck className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Прочность:</span>
                              Металлический каркас, рассчитанный на падение сосулек.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-orange-500 font-bold hover:text-orange-400 transition text-lg">
                        Рассчитать козырек <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      {/* Используем фото крыши или портала как пример */}
                      <img src="/qazpost.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Козырек"/>
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
                 {step: "01", title: "Замер", desc: "Снимаем размеры фасада, проверяем уровень стен и геометрию."},
                 {step: "02", title: "Проект", desc: "Чертим схему каркаса, раскрой композита (чтобы минимизировать отходы)."},
                 {step: "03", title: "Каркас", desc: "Сварка и покраска металлоконструкции на месте или в цеху."},
                 {step: "04", title: "Обшивка", desc: "Фрезеровка кассет и монтаж алюкобонда на каркас."},
                 {step: "05", title: "Вывеска", desc: "Установка объемных букв и электрики на готовый фасад."}
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
        title="Примеры входных групп" 
        subtitle="Наши работы в Астане" 
      />
      
      <ReviewsCarousel />
      
      <ServicesCarousel 
        title="Что еще мы производим" 
        subtitle="Другие виды наружной рекламы" 
        hiddenLink="/services/entrance-groups" 
      />

      <CallToAction source="Услуга: Входные группы" />

    </div>
  );
}