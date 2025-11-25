import Link from "next/link";
import { 
  Calculator, 
  Shield, 
  Ruler, 
  ArrowRight, 
  ChevronRight, 
  Gem,          // Драгоценный камень (Премиум)
  ScanEye,      // Глаз (Вид вблизи)
  Zap,
  CheckCircle,
  Clock,
  MessageCircle,
  Plug,
  Scissors,
  Palette
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import DesignCodeBlock from "@/components/DesignCodeBlock"; // Можно оставить, но лучше заменить на блок про монтаж
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export const metadata = {
  title: "Интерьерные вывески и Логотипы в Астане | ADLight",
  description: "Изготовление вывесок для офиса, зоны ресепшн и бутиков. Световые и несветовые буквы. Скрытый монтаж. Идеальная детализация.",
};

export default function InteriorPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-purple-600/5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* ХЛЕБНЫЕ КРОШКИ */}
           <div data-aos="fade-down" className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-purple-400 font-medium">Интерьерные вывески</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div data-aos="fade-right" className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full uppercase tracking-wider">
                    Лицо вашего бизнеса
                 </div>
                 <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Вывески для офиса <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">и зоны ресепшн</span>
                 </h1>
                 <p data-aos="fade-right" data-aos-delay="200" className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Ювелирная работа с материалами. Изготавливаем логотипы из акрила, нержавейки и неона. Идеальный вид даже с расстояния вытянутой руки. Скрытая проводка.
                 </p>
                 
                 {/* КНОПКИ */}
                 <div data-aos="fade-right" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg shadow-purple-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-slate-500 transition active:scale-95">
                       <MessageCircle className="w-5 h-5 text-green-500"/> WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал */}
              <div className="relative" data-aos="zoom-in" data-aos-delay="200">
                 <div className="aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative group shadow-2xl">
                    <img src="/1solution.jpg" alt="Интерьерная вывеска" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                          <ScanEye className="w-6 h-6"/>
                       </div>
                       <div>
                          <div className="text-white font-bold">Макро-детализация</div>
                          <div className="text-gray-400 text-xs">Без видимых проводов</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. СТАНДАРТЫ (ОСОБЕННОСТИ ИНТЕРЬЕРА) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-4">Требования к интерьерной рекламе</h2>
                <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 max-w-2xl mx-auto">
                   В помещении вывеска находится близко к глазам клиента. Огрехи сборки недопустимы.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Карточка 1 */}
                <div data-aos="fade-up" data-aos-delay="0" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition">
                      <ScanEye className="w-7 h-7 text-purple-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Идеально вблизи</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Лазерная резка с точностью 0.01 мм. Полировка торцов акрила до зеркального блеска. Никаких следов клея или пыли внутри.
                   </p>
                </div>

                {/* Карточка 2 */}
                <div data-aos="fade-up" data-aos-delay="100" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                      <Plug className="w-7 h-7 text-blue-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Скрытая проводка</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Прячем провода за фальш-стену, в микро-штробы или используем декоративные дистанционные держатели. Блок питания выносим в доступное место.
                   </p>
                </div>

                {/* Карточка 3 */}
                <div data-aos="fade-up" data-aos-delay="200" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition">
                      <Palette className="w-7 h-7 text-orange-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Цветной акрил</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Используем заводской цветной акрил (а не пленку), который имеет глубокий насыщенный цвет и глянцевый торец. Выглядит дорого.
                   </p>
                </div>

                {/* Карточка 4 */}
                <div data-aos="fade-up" data-aos-delay="300" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition">
                      <Gem className="w-7 h-7 text-red-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Нержавеющая сталь</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Для VIP-офисов предлагаем буквы из нержавейки (золото, серебро, шлифованный металл). Вечная классика.
                   </p>
                </div>

                {/* Карточка 5 */}
                <div data-aos="fade-up" data-aos-delay="400" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                      <Ruler className="w-7 h-7 text-green-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Толщина от 3 мм</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Изготавливаем как плоские буквы (3-10 мм), так и объемные (от 20 мм). Подберем вариант под ваш дизайн-проект.
                   </p>
                </div>

                {/* Карточка 6 */}
                <div data-aos="fade-up" data-aos-delay="500" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition">
                      <Scissors className="w-7 h-7 text-cyan-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Инкрустация</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Врезка толстого прозрачного акрила (10-15 мм) в композитную панель. Эффект свечения "изнутри стены".
                   </p>
                </div>
             </div>
         </div>
      </section>

      {/* 4. ВИДЫ ВЫВЕСОК */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Варианты исполнения</h2>
            
            <div className="space-y-24">
               {/* Тип 1: Контражур (Свет) */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Контражурная подсветка</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-purple-500 font-bold mb-6">Выбор №1 для офиса</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Буквы устанавливаются на небольшом расстоянии от стены (15-20 мм). Свет падает назад, создавая мягкое свечение вокруг логотипа.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где:</span>
                              Зона ресепшн, переговорные, бутики в ТРЦ.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Эффект:</span>
                              Стильно, не слепит глаза, подчеркивает фактуру стены.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-purple-500 font-bold hover:text-purple-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/back.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Контражур"/>
                  </div>
               </div>

               {/* Тип 2: Псевдообъем (Без света) */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                   <div data-aos="fade-right" className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/acryl.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Псевдообъем"/>
                   </div>
                  <div data-aos="fade-left">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Псевдообъем (Несветовые)</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-gray-400 font-bold mb-6">Строго и доступно</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Плоские буквы из акрила (3-10 мм) или ПВХ, установленные на дистанционные держатели. Создают объем за счет тени.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Применение:</span>
                              Оформление кабинетов, навигация, логотип в светлом офисе.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Материалы:</span>
                              Цветной акрил, зеркальный полистирол (золото/серебро), крашеный ПВХ.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-gray-400 font-bold hover:text-white transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
               </div>

               {/* Тип 3: Лицевая/Полная (Свет) */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Лицевое свечение (Мини)</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-blue-500 font-bold mb-6">Максимальная яркость</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Уменьшенная копия уличных букв. Аккуратные борта, яркое лицо. Возможно изготовление букв высотой всего от 15 см.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где:</span>
                              Торговые островки, фудкорты, витрины.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Технология:</span>
                              Цельноклеевой акриловый корпус для идеальной эстетики.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-blue-500 font-bold hover:text-blue-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/full.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Лицевая подсветка"/>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. ЭТАПЫ РАБОТЫ */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4">
           <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Этапы работы</h2>
           <div className="grid md:grid-cols-5 gap-8">
              {[
                 {step: "01", title: "Замер", desc: "Осматриваем стену, проверяем возможность скрытой проводки."},
                 {step: "02", title: "Дизайн", desc: "Подбираем материалы (акрил, пленки) под ваш интерьер."},
                 {step: "03", title: "Производство", desc: "Лазерная резка и сборка с ювелирной точностью."},
                 {step: "04", title: "Электрика", desc: "Пайка контактов, установка блока питания (прячем в потолок)."},
                 {step: "05", title: "Монтаж", desc: "Установка по бумажному шаблону. Чистовая уборка."}
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

      {/* 6. КОМПОНЕНТЫ */}
      <ProjectsBento 
        title="Примеры в интерьере" 
        subtitle="Офисы, бутики и ресепшн" 
      />
      
      <ReviewsCarousel />
      
      {/* Скрываем ссылку на саму себя */}
      <ServicesCarousel 
        title="Что еще мы производим" 
        subtitle="Другие виды наружной рекламы" 
        hiddenLink="/services/interior" 
      />

      <CallToAction source="Услуга: Интерьер" />

    </div>
  );
}