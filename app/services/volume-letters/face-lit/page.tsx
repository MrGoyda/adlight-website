"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  ChevronRight, 
  Calculator, 
  MessageCircle, 
  CheckCircle, 
  Layers, 
  Shield, 
  Zap, 
  Sun, 
  Moon, 
  Ruler, 
  Palette,
  Lightbulb,
  Eye,
  Clock,
  Info,
  ChevronDown
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ProjectsBento from "@/components/ProjectsBento";

// Данные конкретно для этого типа (можно вынести в отдельный файл, если страниц будет много)
const PAGE_DATA = {
  title: "Объемные буквы со световым лицом",
  subtitle: "Классика наружной рекламы. Самый яркий и читаемый вид вывесок в Астане.",
  price: "450", // Цена за см
  images: {
    day: "/images/letters/face-lit-day.png",
    night: "/images/letters/face-lit-night.png"
  }
};

export default function FaceLitLettersPage() {
  const [isNightMode, setIsNightMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-orange-500/30">
      
      {/* 1. PRODUCT HERO (ИНТЕРАКТИВНЫЙ) */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        {/* Фон */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-orange-500 font-medium">Световое лицо</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Максимальная яркость лицевой панели
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Читаемость с расстояния до 300 метров
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Герметичность IP67 (защита от снега и дождя)
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать стоимость
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Задать вопрос
                    </a>
                 </div>
              </div>

              {/* Интерактивное фото (День/Ночь) */}
              <div className="relative">
                 {/* Переключатель */}
                 <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md border border-white/10 p-1 rounded-full flex gap-1">
                    <button 
                       onClick={() => setIsNightMode(false)}
                       className={`p-2 rounded-full transition-all ${!isNightMode ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                       <Sun className="w-5 h-5"/>
                    </button>
                    <button 
                       onClick={() => setIsNightMode(true)}
                       className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 {/* Изображение */}
                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-orange-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Объемные буквы" 
                       fill 
                       className="object-cover transition-all duration-500"
                    />
                    {/* Подпись */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-white/10">
                       {isNightMode ? "Вид в ночное время" : "Вид в дневное время"}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. CONCEPT (РЕДИЗАЙН - BENTO STYLE) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
               
               {/* Левая часть: Текст */}
               <div className="lg:w-1/3 sticky top-24">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 mb-6">
                     <Lightbulb className="w-6 h-6"/>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                     Технология, которая <span className="text-blue-500">работает</span>
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                     Светится только лицо, борта остаются темными. Этот контраст создает «эффект четкости». Глаз моментально считывает текст, даже если вокруг сотни других огней.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 shrink-0">
                           <CheckCircle className="w-5 h-5"/>
                        </div>
                        <div>
                           <h4 className="text-white font-bold">Идеально для ТРЦ</h4>
                           <p className="text-gray-500 text-xs">Соответствует требованиям всех молов</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                           <CheckCircle className="w-5 h-5"/>
                        </div>
                        <div>
                           <h4 className="text-white font-bold">Читаемость 100%</h4>
                           <p className="text-gray-500 text-xs">Четкий контур без засветов</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Правая часть: Визуальная сетка */}
               <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[500px]">
                  
                  {/* Большая карточка (Улица) */}
                  <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group">
                     <Image 
                        src="/images/letters/street-letters.jpg" 
                        alt="Пример на фасаде" 
                        fill 
                        className="object-cover transition duration-700 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                     <div className="absolute bottom-6 left-6">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-2 inline-block">Фасады</span>
                        <h3 className="text-xl font-bold text-white">Максимальная заметность на улице</h3>
                     </div>
                  </div>

                  {/* Маленькая карточка 1 (Крыша) */}
                  <div className="relative rounded-3xl overflow-hidden group h-[240px] md:h-auto">
                     <Image 
                        src="/krisha.jpg" 
                        alt="Крышная установка" 
                        fill 
                        className="object-cover transition duration-700 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                     <div className="absolute bottom-6 left-6">
                        <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full mb-2 inline-block">Крыши</span>
                        <h3 className="text-lg font-bold text-white">Имиджевые установки</h3>
                     </div>
                  </div>

                  {/* Маленькая карточка 2 (Интерьер) */}
                  <div className="relative rounded-3xl overflow-hidden group h-[240px] md:h-auto">
                     <Image 
                        src="/images/letters/butik.png" 
                        alt="Интерьер" 
                        fill 
                        className="object-cover transition duration-700 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                     <div className="absolute bottom-6 left-6">
                        <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full mb-2 inline-block">Интерьер</span>
                        <h3 className="text-lg font-bold text-white">Бутики и офисы</h3>
                     </div>
                  </div>

               </div>

            </div>
         </div>
      </section>

      {/* 3. ANATOMY (ТЕХНИЧЕСКИЙ РАЗБОР) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Анатомия качества ADLight</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {/* Карточка 1 */}
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition">
                     <Layers className="w-6 h-6"/>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Лицевая панель</h3>
                  <p className="text-gray-400 text-sm mb-3">Литой акрил 3–4 мм.</p>
                  <div className="text-xs text-slate-500 bg-slate-950 p-2 rounded border border-slate-800">
                     <span className="text-green-500 font-bold">Важно:</span> Защита от УФ. Не желтеет 10 лет.
                  </div>
               </div>

               {/* Карточка 2 */}
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 text-purple-500 group-hover:scale-110 transition">
                     <Shield className="w-6 h-6"/>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Боковой борт</h3>
                  <p className="text-gray-400 text-sm mb-3">ПВХ пластик или алюминий.</p>
                  <div className="text-xs text-slate-500 bg-slate-950 p-2 rounded border border-slate-800">
                     Любой цвет пленки Oracal 641 или покраска.
                  </div>
               </div>

               {/* Карточка 3 */}
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 text-orange-500 group-hover:scale-110 transition">
                     <Zap className="w-6 h-6"/>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Подсветка</h3>
                  <p className="text-gray-400 text-sm mb-3">Линзованные модули.</p>
                  <div className="text-xs text-slate-500 bg-slate-950 p-2 rounded border border-slate-800">
                     Равномерный свет без пятен. Влагозащита IP67.
                  </div>
               </div>

               {/* Карточка 4 */}
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-green-500/30 transition group">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 text-green-500 group-hover:scale-110 transition">
                     <Layers className="w-6 h-6"/>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Задняя стенка</h3>
                  <p className="text-gray-400 text-sm mb-3">ПВХ 8-10 мм или сталь.</p>
                  <div className="text-xs text-slate-500 bg-slate-950 p-2 rounded border border-slate-800">
                     Основа жесткости. Выдерживает ветра Астаны.
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. ПРЕИМУЩЕСТВА */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
               <div className="md:w-1/3">
                  <h2 className="text-3xl font-bold text-white mb-4">Почему выбирают <br/>этот тип?</h2>
                  <p className="text-gray-400">Идеальный баланс цены, яркости и надежности для любого бизнеса.</p>
               </div>
               <div className="md:w-2/3 grid sm:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                     <Eye className="w-6 h-6 text-blue-500 shrink-0"/>
                     <div>
                        <h4 className="text-white font-bold mb-1">Высокая читаемость</h4>
                        <p className="text-gray-400 text-xs">Текст четко виден и не сливается в пятно благодаря контрастным бортам.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <Ruler className="w-6 h-6 text-green-500 shrink-0"/>
                     <div>
                        <h4 className="text-white font-bold mb-1">Универсальность</h4>
                        <p className="text-gray-400 text-xs">Можно изготовить любой шрифт: от строгого прямого до сложной рукописи.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <Zap className="w-6 h-6 text-yellow-500 shrink-0"/>
                     <div>
                        <h4 className="text-white font-bold mb-1">Энергоэффективность</h4>
                        <p className="text-gray-400 text-xs">Потребляет в 10 раз меньше энергии, чем неон или старые лампы.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <Shield className="w-6 h-6 text-red-500 shrink-0"/>
                     <div>
                        <h4 className="text-white font-bold mb-1">Стойкость к ветрам</h4>
                        <p className="text-gray-400 text-xs">Аэродинамичная форма и прочные борта выдерживают нагрузки Астаны.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. ЦЕНА И РАСЧЕТ (ОФФЕР) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center">
                 
                 <div className="lg:w-1/2">
                    <div className="inline-block bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">Честная цена</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Пример расчета стоимости</h2>
                    <p className="text-gray-400 mb-8">
                       Допустим, вам нужна вывеска <strong className="text-white">"ЦВЕТЫ"</strong> (5 букв).
                       Высота букв — 40 см (стандарт для ТЦ).
                    </p>
                    
                    <div className="bg-black/30 rounded-xl p-6 border border-white/5 space-y-4 font-mono text-sm">
                       <div className="flex justify-between">
                          <span className="text-gray-400">Цена за 1 см высоты:</span>
                          <span className="text-white">{PAGE_DATA.price} ₸</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-gray-400">Расчет одной буквы:</span>
                          <span className="text-white">40 см × {PAGE_DATA.price} ₸ = 18 000 ₸</span>
                       </div>
                       <div className="flex justify-between border-t border-white/10 pt-4">
                          <span className="text-gray-400">Итого за 5 букв:</span>
                          <span className="text-orange-500 font-bold text-lg">90 000 ₸</span>
                       </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-4">* В цену включен блок питания и коммутация. Монтаж рассчитывается отдельно.</p>
                 </div>

                 <div className="lg:w-1/2 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Хотите точную смету?</h3>
                    <p className="text-gray-400 mb-8">
                       Наш калькулятор считает точнее, чем менеджеры конкурентов. Попробуйте сами.
                    </p>
                    <Link href="/calculator" className="w-full sm:w-auto px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-xl shadow-orange-900/20 flex items-center justify-center gap-2">
                       <Calculator className="w-5 h-5"/> Перейти в калькулятор
                    </Link>
                    <div className="mt-6 flex items-center gap-2 text-gray-500 text-xs">
                       <Clock className="w-4 h-4"/> Срок изготовления: 3-5 дней
                    </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 6. PRO TIPS (ВАЖНЫЕ ДЕТАЛИ) */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Советы эксперта</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               
               <div className="bg-blue-900/10 border border-blue-500/20 p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Palette className="w-32 h-32 text-blue-500"/></div>
                  <h3 className="text-xl font-bold text-blue-400 mb-4">Какие цвета светят ярче?</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                     Белый акрил пропускает 100% света. Цветные пленки (красный, синий) «съедают» до 30% яркости. 
                     <br/><br/>
                     <strong>Совет:</strong> Если нужна максимальная яркость в цвете — используйте заводской цветной акрил, а не пленку. Это чуть дороже, но светит в 2 раза ярче.
                  </p>
               </div>

               <div className="bg-purple-900/10 border border-purple-500/20 p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Moon className="w-32 h-32 text-purple-500"/></div>
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Что насчет черных букв?</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                     Черный цвет не пропускает свет. Но решение есть!
                     <br/><br/>
                     <strong>Технология «День/Ночь»:</strong> Мы используем специальный перфорированный акрил. Днем буквы выглядят черными (строго), а ночью светятся ярко-белым. Магия технологий.
                  </p>
               </div>

            </div>
         </div>
      </section>

      {/* 8. SEO TEXT (STYLIZED) */}
      <section className="py-16 bg-[#0B1221]">
         <div className="container mx-auto px-4 max-w-4xl">
            <details className="group bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-500 open:bg-slate-900">
               <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Info className="w-5 h-5"/>
                     </div>
                     <span className="font-bold text-white text-lg">Подробнее о технологии производства</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 group-open:rotate-180 transition-transform duration-300">
                     <ChevronDown className="w-4 h-4"/>
                  </div>
               </summary>
               
               <div className="px-6 pb-8 text-gray-400 text-sm leading-relaxed space-y-4 border-t border-slate-800/50 pt-4 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-white font-bold text-base">Изготовление букв с лицевой подсветкой в Астане</h3>
                  <p>
                     Объемные буквы со световым лицом — самый востребованный вид наружной рекламы в Казахстане. Компания ADLight предлагает производство полного цикла. Мы учитываем климатические особенности региона: используем морозостойкий пластик и герметичную коммутацию, чтобы вывеска работала бесперебойно при температурах от -40°C до +40°C.
                  </p>
                  <h3 className="text-white font-bold text-base">Почему это выгодно?</h3>
                  <p>
                     В отличие от плоских коробов, каждая буква является отдельным световым элементом, что повышает статус заведения. Мы производим конструкции на собственном оборудовании (ЧПУ-фрезеровка), что гарантирует идеальную геометрию и отсутствие зазоров. Закажите расчет стоимости онлайн или вызовите замерщика на объект.
                  </p>
               </div>
            </details>
         </div>
      </section>

      {/* 8. OTHER COMPONENTS */}
      <ProjectsBento title="Примеры работ" subtitle="Световые буквы в деле" />
      <CallToAction source="Страница: Объемные буквы (Face Lit)" />

    </div>
  );
}