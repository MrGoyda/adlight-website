import Link from "next/link";
import { 
  Calculator, 
  ArrowRight, 
  ChevronRight, 
  DraftingCompass,
  HardHat,
  Wind,
  FileText,
  Zap,
  ScanFace,
  Grid3X3,
  MessageCircle,
  Anchor,
  Shield // <-- ДОБАВИЛ ЭТОТ ИМПОРТ
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export const metadata = {
  title: "Крышные установки в Астане | Проектирование и Монтаж | ADLight",
  description: "Изготовление крышных рекламных конструкций. Расчет ветровых нагрузок, проектная документация (КМ, КМД, ЭО), согласование. Собственные монтажные бригады.",
};

export default function RoofPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] font-sans">
      
      {/* 1. HERO SECTION (SERIOUS & INDUSTRIAL) */}
      <section className="relative py-24 lg:py-36 overflow-hidden border-b border-slate-800">
        {/* Фон - имитация чертежной сетки */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-transparent"></div>
        
        {/* Акцентное свечение (Холодный синий - инженерия) */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* ХЛЕБНЫЕ КРОШКИ */}
           <div data-aos="fade-down" className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-blue-500 font-medium">Крышные установки</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                 <div data-aos="fade-right" className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-sm uppercase tracking-wider">
                    {/* ИСПРАВЛЕНО: заменена стрелка на → */}
                    <DraftingCompass className="w-4 h-4"/> Полный цикл: Проект → Цех → Монтаж
                 </div>
                 <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Масштаб вашего <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">бизнеса</span>
                 </h1>
                 <p data-aos="fade-right" data-aos-delay="200" className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl border-l-2 border-blue-500/30 pl-6">
                    Самый престижный вид наружной рекламы. Разрабатываем проектную документацию (КМ, КМД, ЭО), рассчитываем ветровые нагрузки для Астаны и монтируем на любой высоте.
                 </p>
                 
                 {/* КНОПКИ */}
                 <div data-aos="fade-right" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать проект
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-slate-500 transition active:scale-95">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Задать вопрос инженеру
                    </a>
                 </div>
              </div>

              {/* Визуал */}
              <div className="relative" data-aos="fade-left" data-aos-delay="300">
                 <div className="aspect-[4/5] md:aspect-square rounded-sm overflow-hidden relative shadow-2xl border border-slate-700">
                    <img src="/krisha.jpg" alt="Крышная установка" className="absolute inset-0 w-full h-full object-cover opacity-90"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent"></div>
                    
                    {/* Плашка с характеристиками */}
                    <div className="absolute bottom-8 left-8 bg-[#0B1120]/90 backdrop-blur border border-slate-700 p-6 rounded-sm max-w-xs">
                       <div className="flex items-center gap-4 mb-4">
                          <Wind className="w-8 h-8 text-blue-500"/>
                          <div>
                             <div className="text-white font-bold text-lg">Ветровая нагрузка</div>
                             <div className="text-gray-400 text-xs">III снеговой район</div>
                          </div>
                       </div>
                       <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-blue-500"></div>
                       </div>
                       <div className="mt-2 text-right text-xs text-blue-400 font-mono">Запас прочности 1.5x</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. ИНЖЕНЕРНЫЙ ПОДХОД */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                   <h2 data-aos="fade-up" className="text-3xl md:text-5xl font-bold text-white mb-4">Безопасность превыше всего</h2>
                   <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 max-w-2xl text-lg">
                      Крышная установка — это капитальное строительство. Мы несем юридическую ответственность за надежность конструкции.
                   </p>
                </div>
                <div data-aos="fade-left" className="hidden md:block">
                   <div className="px-6 py-3 bg-blue-900/20 border border-blue-500/30 rounded text-blue-400 font-mono text-sm">
                      Лицензия на СМР II категории
                   </div>
                </div>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                {/* 1. Проектирование */}
                <div data-aos="fade-up" className="bg-[#0B1120] p-8 border border-slate-800 hover:border-blue-500/50 transition group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                      <DraftingCompass className="w-24 h-24 text-blue-500"/>
                   </div>
                   <div className="w-14 h-14 bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500">
                      <FileText className="w-7 h-7"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-4">Проектная документация</h3>
                   <ul className="space-y-2 text-gray-400 text-sm list-disc pl-4 marker:text-blue-500">
                      <li>Эскизный проект для Акимата</li>
                      <li>КМ (Конструкции Металлические)</li>
                      <li>КМД (Деталировка узлов)</li>
                      <li>ЭО (Электрооборудование)</li>
                   </ul>
                </div>

                {/* 2. Нагрузки */}
                <div data-aos="fade-up" data-aos-delay="100" className="bg-[#0B1120] p-8 border border-slate-800 hover:border-blue-500/50 transition group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                      <Wind className="w-24 h-24 text-blue-500"/>
                   </div>
                   <div className="w-14 h-14 bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500">
                      <Anchor className="w-7 h-7"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-4">Расчет нагрузок</h3>
                   <p className="text-gray-400 text-sm mb-4">
                      Учитываем ветровую нагрузку Астаны (до 25 м/с), снеговую шапку и вес самой конструкции.
                   </p>
                   <p className="text-gray-400 text-sm border-t border-slate-800 pt-4">
                      <strong className="text-white">Пригрузы:</strong> используем бетонные блоки, чтобы не дырявить кровлю (если возможно).
                   </p>
                </div>

                {/* 3. Электрика */}
                <div data-aos="fade-up" data-aos-delay="200" className="bg-[#0B1120] p-8 border border-slate-800 hover:border-blue-500/50 transition group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                      <Zap className="w-24 h-24 text-blue-500"/>
                   </div>
                   <div className="w-14 h-14 bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500">
                      <Zap className="w-7 h-7"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-4">Энергоэффективность</h3>
                   <ul className="space-y-2 text-gray-400 text-sm list-disc pl-4 marker:text-blue-500">
                      <li>Герметичные щиты управления (IP67)</li>
                      <li>Автоматы защиты и УЗО</li>
                      <li>Астро-таймеры (вкл/выкл по солнцу)</li>
                      <li>Кабель ГОСТ (негорючий)</li>
                   </ul>
                </div>
             </div>
         </div>
      </section>

      {/* 4. ТИПЫ КРЫШНЫХ УСТАНОВОК */}
      <section className="py-24 bg-[#0B1120] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Технологии изготовления букв</h2>
            
            <div className="space-y-16">
               {/* Тип 1: Акриловые */}
               <div className="group grid lg:grid-cols-2 gap-8 items-center border border-slate-800 bg-slate-900/50 p-6 md:p-10 hover:border-blue-500/30 transition duration-500">
                  <div className="order-2 lg:order-1">
                     {/* ИСПРАВЛЕНО: заменено > на &gt; */}
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Внутренняя подсветка (Акрил/Баннер)</h3>
                     <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                        Классический вариант. Лицо буквы выполнено из специального транслюцентного баннера (для букв &gt; 1.5м) или акрила.
                     </p>
                     <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                           <ScanFace className="w-6 h-6 text-blue-500 shrink-0"/>
                           <div className="text-gray-300 text-sm"><strong>Эстетика:</strong> Идеально ровное свечение, выглядит монолитно и дорого.</div>
                        </li>
                        <li className="flex items-start gap-3">
                           <Shield className="w-6 h-6 text-blue-500 shrink-0"/>
                           <div className="text-gray-300 text-sm"><strong>Защита:</strong> Диоды спрятаны внутри короба, не боятся осадков.</div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="text-blue-400 font-bold hover:text-white transition flex items-center gap-2">
                        Рассчитать стоимость <ArrowRight className="w-4 h-4"/>
                     </Link>
                  </div>
                  <div className="order-1 lg:order-2 h-[300px] bg-black relative overflow-hidden">
                      <img src="/kmg.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Крышная установка акрил"/>
                  </div>
               </div>

               {/* Тип 2: Открытые диоды */}
               <div className="group grid lg:grid-cols-2 gap-8 items-center border border-slate-800 bg-slate-900/50 p-6 md:p-10 hover:border-orange-500/30 transition duration-500">
                  <div className="h-[300px] bg-black relative overflow-hidden">
                      <img src="/images/city.png" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Открытые диоды"/>
                      <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay"></div>
                  </div>
                  <div>
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Открытые светодиоды (Пиксели)</h3>
                     <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                        В лицевую поверхность (алюминий) врезаются отдельные яркие диоды-пиксели. Самый яркий вариант рекламы.
                     </p>
                     <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                           <Zap className="w-6 h-6 text-orange-500 shrink-0"/>
                           <div className="text-gray-300 text-sm"><strong>Яркость x3:</strong> Видно даже днем. Ночью пробивает туман и дождь.</div>
                        </li>
                        <li className="flex items-start gap-3">
                           <Grid3X3 className="w-6 h-6 text-orange-500 shrink-0"/>
                           <div className="text-gray-300 text-sm"><strong>Динамика:</strong> Можно настроить анимацию (переливы, мерцание).</div>
                        </li>
                     </ul>
                     <Link href="/calculator" className="text-orange-400 font-bold hover:text-white transition flex items-center gap-2">
                        Рассчитать стоимость <ArrowRight className="w-4 h-4"/>
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. ЭТАПЫ */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4">
           <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Этапы реализации проекта</h2>
           <div className="grid md:grid-cols-5 gap-8 relative">
              {/* Линия соединения */}
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
              
              {[
                 {step: "01", title: "Экспертиза", desc: "Осмотр кровли, проверка закладных, оценка состояния пирога кровли."},
                 {step: "02", title: "Проект", desc: "Разработка КМ и КМД. Расчет нагрузок инженером-конструктором."},
                 {step: "03", title: "Акимат", desc: "Получение разрешения на размещение (паспорт рекламы)."},
                 {step: "04", title: "Цех", desc: "Сварка ферм, покраска, сборка световых элементов."},
                 {step: "05", title: "Монтаж", desc: "Подъем краном/альпинистами, монтаж пригрузов, подключение."}
              ].map((item, i) => (
                 <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="relative bg-[#0F172A]">
                    <div className="w-16 h-16 bg-slate-900 border-2 border-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto z-10 shadow-lg shadow-blue-900/20">{item.step}</div>
                    <h3 className="text-lg font-bold text-white text-center mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-center text-xs leading-relaxed">{item.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. КОМПОНЕНТЫ */}
      <ProjectsBento 
        title="Наши крышные проекты" 
        subtitle="Масштабные работы в Астане" 
      />
      
      <ReviewsCarousel />
      
      <ServicesCarousel 
        title="Другие услуги" 
        subtitle="Комплексное оформление" 
        hiddenLink="/services/roof-installations" 
      />

      <CallToAction source="Услуга: Крышные установки" />

    </div>
  );
}