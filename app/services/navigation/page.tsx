import Link from "next/link";
import { 
  Calculator, 
  ArrowRight, 
  ChevronRight, 
  Map,             // Карта/Навигация
  Signpost,        // Указатель
  User,            // Табличка на дверь
  Layers,          // Материалы
  PenTool,         // Дизайн
  Printer,         // Печать
  Scan,            // Гравировка
  Building,
  MessageCircle,
  CheckCircle,
  Info
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export const metadata = {
  title: "Таблички и Навигация в Астане | Изготовление указателей | ADLight",
  description: "Изготовление офисных табличек, навигационных указателей, стендов. Металл, акрил, гравировка. Комплексная навигация для БЦ и ТРЦ.",
};

export default function NavigationPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-purple-600/5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* ХЛЕБНЫЕ КРОШКИ */}
           <div data-aos="fade-down" className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-purple-500 font-medium">Таблички и Навигация</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div data-aos="fade-right" className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full uppercase tracking-wider">
                    Wayfinding Systems
                 </div>
                 <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Системы навигации <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">и таблички</span>
                 </h1>
                 <p data-aos="fade-right" data-aos-delay="200" className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Помогаем вашим клиентам не заблудиться. Разрабатываем и производим стильные системы навигации для бизнес-центров, отелей и офисов. От таблички на дверь до этажных указателей.
                 </p>
                 
                 {/* КНОПКИ */}
                 <div data-aos="fade-right" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg shadow-purple-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать заказ
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-slate-500 transition active:scale-95">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Написать в WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал */}
              <div className="relative" data-aos="zoom-in" data-aos-delay="200">
                 <div className="aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative group shadow-2xl">
                    {/* Здесь хорошо бы поставить фото таблички или указателя */}
                    <img src="/1solution.jpg" alt="Офисная навигация" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                          <Map className="w-6 h-6"/>
                       </div>
                       <div>
                          <div className="text-white font-bold">Понятная логистика</div>
                          <div className="text-gray-400 text-xs">Удобство для посетителей</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. МАТЕРИАЛЫ И ТЕХНОЛОГИИ */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-4">Материалы премиум-класса</h2>
                <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 max-w-2xl mx-auto">
                   Табличка — это первое, что видит клиент перед входом в кабинет. Она должна выглядеть безупречно.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Карточка 1 */}
                <div data-aos="fade-up" data-aos-delay="0" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                      <Layers className="w-7 h-7 text-blue-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Металл (Нержавейка)</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Золото, серебро, шлифованный или зеркальный металл. Самый статусный вариант для табличек руководителей и фасадных вывесок.
                   </p>
                </div>

                {/* Карточка 2 */}
                <div data-aos="fade-up" data-aos-delay="100" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition">
                      <Scan className="w-7 h-7 text-purple-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Гравировка (Rowmark)</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Двухслойный пластик Rowmark. Лазер выжигает верхний слой, открывая цвет нижнего. Долговечно, четко, стильно (под металл).
                   </p>
                </div>

                {/* Карточка 3 */}
                <div data-aos="fade-up" data-aos-delay="200" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition">
                      <Layers className="w-7 h-7 text-orange-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Акрил (Оргстекло)</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Прозрачный, цветной или молочный акрил. Эффект стекла, но безопаснее. Часто используется с дистанционными держателями.
                   </p>
                </div>

                {/* Карточка 4 */}
                <div data-aos="fade-up" data-aos-delay="300" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                      <Printer className="w-7 h-7 text-green-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">УФ-Печать</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Прямая печать на пластике или металле. Позволяет нанести полноцветный логотип, градиенты и сложные узоры.
                   </p>
                </div>

                {/* Карточка 5 */}
                <div data-aos="fade-up" data-aos-delay="400" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition">
                      <PenTool className="w-7 h-7 text-red-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Модульные системы</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Алюминиевые профили со сменными вставками. Идеально для указателей в БЦ, где часто меняются арендаторы.
                   </p>
                </div>

                {/* Карточка 6 */}
                <div data-aos="fade-up" data-aos-delay="500" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition">
                      <Building className="w-7 h-7 text-cyan-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Аппликация</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Оклейка виниловой пленкой Oracal. Бюджетный и быстрый способ оформления навигации на стенах или стеклах.
                   </p>
                </div>
             </div>
         </div>
      </section>

      {/* 4. ВИДЫ ПРОДУКЦИИ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Виды продукции</h2>
            
            <div className="space-y-24">
               {/* Тип 1: Таблички на дверь */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Кабинетные таблички</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-purple-500 font-bold mb-6">Обязательный атрибут</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Классические таблички с номером кабинета, ФИО и должностью. Могут быть плоскими (на скотче) или объемными (на дистанционных держателях).
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Материалы:</span>
                              ПВХ, Акрил, Двухслойный пластик (золото/серебро).
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Крепление:</span>
                              Двусторонний скотч 3M (без сверления) или декоративные болты.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-purple-500 font-bold hover:text-purple-400 transition text-lg">
                        Рассчитать партию <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/acryl.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Табличка на дверь"/>
                  </div>
               </div>

               {/* Тип 2: Настенная навигация */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                   <div data-aos="fade-right" className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      {/* Заглушка, лучше заменить на фото стенда */}
                      <img src="/panel.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Навигационный стенд"/>
                   </div>
                  <div data-aos="fade-left">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Настенные указатели и стенды</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-blue-500 font-bold mb-6">Логистика</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Списки компаний в холле, указатели этажей, стрелки направления. Помогают ориентироваться в больших зданиях.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Модульность:</span>
                              Легкая замена информации (сменные ламели).
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Дизайн:</span>
                              Разработка единого стиля навигации для всего здания.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-blue-500 font-bold hover:text-blue-400 transition text-lg">
                        Заказать навигацию <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
               </div>

               {/* Тип 3: Подвесные указатели */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Подвесные системы</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-green-500 font-bold mb-6">Видно издалека</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Указатели, свисающие с потолка на тросах. Идеальны для длинных коридоров, супермаркетов и аэропортов, где стены заняты или далеко.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Двусторонние:</span>
                              Информация видна с обоих концов коридора.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Материал:</span>
                              Легкий ПВХ или композит, чтобы не нагружать потолок.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-green-500 font-bold hover:text-green-400 transition text-lg">
                        Рассчитать подвесы <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/images/calc/lightbox-1.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Подвесной указатель"/>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. ЭТАПЫ РАБОТЫ */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4">
           <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Как мы работаем</h2>
           <div className="grid md:grid-cols-5 gap-8">
              {[
                 {step: "01", title: "Задача", desc: "Вы присылаете список кабинетов или план помещения."},
                 {step: "02", title: "Дизайн", desc: "Мы разрабатываем макет табличек в вашем фирменном стиле."},
                 {step: "03", title: "Материал", desc: "Утверждаем образцы: пластик, металл или акрил."},
                 {step: "04", title: "Цех", desc: "Лазерная резка, гравировка или печать изображений."},
                 {step: "05", title: "Монтаж", desc: "Крепление на скотч или дистанционные держатели."}
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
        title="Наши работы в интерьере" 
        subtitle="Таблички, указатели, логотипы" 
      />
      
      <ReviewsCarousel />
      
      <ServicesCarousel 
        title="Что еще мы производим" 
        subtitle="Другие виды наружной рекламы" 
        hiddenLink="/services/navigation" 
      />

      <CallToAction source="Услуга: Таблички и Навигация" />

    </div>
  );
}