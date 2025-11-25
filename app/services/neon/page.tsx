import Link from "next/link";
import { 
  Calculator, 
  ArrowRight, 
  ChevronRight, 
  Thermometer, 
  PaintBucket, 
  FileCheck,
  Box,         
  Zap,
  Scissors,
  Plug,
  Lightbulb,
  MessageCircle,
  Store,
  ShieldCheck,
  Coins,
  CheckCircle, // <-- ДОБАВИЛ
  Layers       // <-- ДОБАВИЛ
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export const metadata = {
  title: "Неоновые вывески в Астане | Flex Neon 2.0 | ADLight",
  description: "Изготовление вывесок из гибкого неона. Для бизнеса, дома и фотозон. Силиконовый неон, прозрачная подложка, гарантия.",
};

export default function NeonPage() {
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
              <span className="text-purple-500 font-medium">Неоновые вывески</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div data-aos="fade-right" className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full uppercase tracking-wider">
                    Тренд 2025 года
                 </div>
                 <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Сочные вывески <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">из гибкого неона</span>
                 </h1>
                 <p data-aos="fade-right" data-aos-delay="200" className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Создаем атмосферу для кофеен, баров, салонов красоты и офисов. Используем премиальный силиконовый неон (Flex Neon), который служит 50 000 часов.
                 </p>
                 
                 {/* КНОПКИ */}
                 <div data-aos="fade-right" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg shadow-purple-900/20 active:scale-95">
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
                    <img src="/neon.jpg" alt="Неоновая вывеска" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                          <Zap className="w-6 h-6"/>
                       </div>
                       <div>
                          <div className="text-white font-bold">Безопасно 12V</div>
                          <div className="text-gray-400 text-xs">Не бьется, не греется</div>
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
                <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-4">Только премиум материалы</h2>
                <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 max-w-2xl mx-auto">
                   Мы не используем дешевый ПВХ-неон, который тускнеет через полгода. Только 100% силикон.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Карточка 1 */}
                <div data-aos="fade-up" data-aos-delay="0" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition">
                      <Zap className="w-7 h-7 text-purple-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Силиконовый неон</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Мягкий, эластичный, равномерно светится. Устойчив к ультрафиолету (не выцветает) и перепадам температур.
                   </p>
                </div>

                {/* Карточка 2 */}
                <div data-aos="fade-up" data-aos-delay="100" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition">
                      <Layers className="w-7 h-7 text-blue-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Прозрачный акрил</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      В качестве основы используем литой прозрачный акрил 4-5 мм. Он практически невидим, создается эффект парения.
                   </p>
                </div>

                {/* Карточка 3 */}
                <div data-aos="fade-up" data-aos-delay="200" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition">
                      <Scissors className="w-7 h-7 text-orange-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Фигурная резка</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Подложка вырезается лазером точно по контуру букв или логотипа. Никаких грубых прямоугольников (если не задумано).
                   </p>
                </div>

                {/* Карточка 4 */}
                <div data-aos="fade-up" data-aos-delay="300" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition">
                      <Plug className="w-7 h-7 text-green-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Безопасные 12 Вольт</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Работает через блок питания. Абсолютно безопасно для людей и животных. Можно трогать руками, не греется.
                   </p>
                </div>

                {/* Карточка 5 */}
                <div data-aos="fade-up" data-aos-delay="400" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition">
                      <PaintBucket className="w-7 h-7 text-cyan-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">15+ оттенков</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Большая палитра цветов: от классического белого и теплого желтого до кислотного розового и Ice Blue.
                   </p>
                </div>

                {/* Карточка 6 */}
                <div data-aos="fade-up" data-aos-delay="500" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                   <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition">
                      <Lightbulb className="w-7 h-7 text-red-500"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Аккуратные провода</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Используем тонкий прозрачный провод и специальные заглушки. Пайка скрыта. Вывеска выглядит идеально даже вблизи.
                   </p>
                </div>
             </div>
         </div>
      </section>

      {/* 4. ВАРИАНТЫ ИСПОЛНЕНИЯ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Варианты исполнения</h2>
            
            <div className="space-y-24">
               {/* Тип 1 */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div data-aos="fade-right" className="order-2 lg:order-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Интерьерный неон</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-purple-500 font-bold mb-6">Для бизнеса и дома</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Яркие надписи, логотипы, фигуры. Станут магнитом для клиентов и фотозоной в Instagram. Крепится на стену, подвесы или ставится на полку.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где:</span>
                              Кофейни, бары, салоны красоты, офисы, домашний декор.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Монтаж:</span>
                              На дистанционные держатели или леску (подвес).
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-purple-500 font-bold hover:text-purple-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
                  <div data-aos="fade-left" className="order-1 lg:order-2 h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/neon.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Интерьерный неон"/>
                  </div>
               </div>

               {/* Тип 2 */}
               <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                   <div data-aos="fade-right" className="h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 relative group">
                      <img src="/agro.jpg" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Уличный неон"/>
                   </div>
                  <div data-aos="fade-left">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Уличный неон (IP65)</h3>
                     <div className="inline-block bg-slate-800 px-3 py-1 rounded text-xs md:text-sm text-green-500 font-bold mb-6">Влагозащита</div>
                     <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                        Специальная серия неона и герметизация всех стыков. Не боится дождя, снега и мороза. Отличная альтернатива классическим вывескам.
                     </p>
                     <ul className="space-y-4 mb-8 text-gray-300">
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Где:</span>
                              Фасады зданий, входные группы, летние террасы.
                           </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"/> 
                           <div>
                              <span className="block text-white font-bold mb-1">Особенность:</span>
                              Дополнительная гидроизоляция контактов и блока питания.
                           </div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="inline-flex items-center text-green-500 font-bold hover:text-green-400 transition text-lg">
                        Рассчитать этот тип <ArrowRight className="ml-2 w-5 h-5"/>
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. ЛАЙФХАК: НЕОН В ВИТРИНЕ (ВМЕСТО DESIGN CODE) */}
      <section className="py-24 bg-slate-900 relative overflow-hidden border-y border-slate-800">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-green-600/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               {/* Текст */}
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold mb-6">
                     <ShieldCheck className="w-4 h-4"/> Законный лайфхак для Астаны
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                     Неон в витрине — <br/><span className="text-green-500">без согласования</span>
                  </h2>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                     Вывески, установленные <strong>внутри помещения за стеклом</strong> (10-15 см от окна), считаются интерьерным оформлением. Их не нужно согласовывать в Акимате, и за них не нужно платить налог на рекламу.
                  </p>
                  
                  <ul className="space-y-4">
                     <li className="flex items-center gap-3 text-white font-medium p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <Coins className="w-6 h-6 text-yellow-500"/>
                        Экономия на налогах и паспорте рекламы
                     </li>
                     <li className="flex items-center gap-3 text-white font-medium p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <Store className="w-6 h-6 text-purple-500"/>
                        Привлекает внимание прохожих так же ярко
                     </li>
                     <li className="flex items-center gap-3 text-white font-medium p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <FileCheck className="w-6 h-6 text-green-500"/>
                        Никаких штрафов и демонтажа
                     </li>
                  </ul>
               </div>

               {/* Визуал (Схематично окно) */}
               <div className="relative h-[400px] rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-2xl">
                   {/* Улица */}
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                   
                   {/* Рама окна */}
                   <div className="absolute inset-4 border-4 border-slate-600 rounded-lg z-10 pointer-events-none"></div>
                   
                   {/* Неон за стеклом */}
                   <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="text-center">
                          <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse">
                             OPEN
                          </div>
                          <div className="mt-4 inline-block px-4 py-1 bg-green-600/90 text-white text-xs font-bold rounded uppercase">
                             За стеклом (Интерьер)
                          </div>
                      </div>
                   </div>

                   {/* Блик стекла */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-30"></div>
               </div>
            </div>
         </div>
      </section>

      {/* 6. ЭТАПЫ РАБОТЫ */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4">
           <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Этапы работы</h2>
           <div className="grid md:grid-cols-5 gap-8">
              {[
                 {step: "01", title: "Идея", desc: "Вы присылаете фото стены или пример из интернета."},
                 {step: "02", title: "Макет", desc: "Мы отрисовываем векторный макет и считаем точную длину."},
                 {step: "03", title: "Резка", desc: "Лазерная резка акриловой подложки с отверстиями под крепеж."},
                 {step: "04", title: "Пайка", desc: "Монтаж неона, пайка контактов, проверка на стенде."},
                 {step: "05", title: "Монтаж", desc: "Доставка и установка (сверлим стену или вешаем на тросы)."}
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
        title="Примеры неоновых работ" 
        subtitle="Ярко, стильно, атмосферно" 
      />
      
      <ReviewsCarousel />
      
      {/* Скрываем ссылку на саму себя */}
      <ServicesCarousel 
        title="Что еще мы производим" 
        subtitle="Другие виды наружной рекламы" 
        hiddenLink="/services/neon" 
      />

      <CallToAction source="Услуга: Неон" />

    </div>
  );
}