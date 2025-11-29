import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  MessageCircle,
  Layers,         
  Shield,         
  Sun, 
  Moon, 
  Palette,        // Палитра
  Feather,        // Легкость
  DollarSign,     // Цена
  Briefcase,      // Офис
  Factory,        // Завод
  MapPin,         // Навигация
  Hammer,         // Монтаж
  Lightbulb,      // Для совета про прожекторы
  ArrowRight,
  ChevronDown
} from "lucide-react";

// --- ИМПОРТ КЛИЕНТСКИХ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ КАТАЛОГА ---
import { volumeLettersCatalog } from "@/lib/volumeLettersData";

// --- ДАННЫЕ ТЕКУЩЕЙ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "non-lit", 
  title: "Объемные буквы без подсветки",
  subtitle: "Визуальный объем и ничего лишнего. Практичное решение для интерьеров, офисов и светлых помещений.",
  price: "200" 
};

export const metadata = {
  title: "Несветовые буквы (ПВХ) | Изготовление в Астане",
  description: "Объемные буквы из пластика без подсветки. Бюджетная наружная реклама. Фрезеровка ПВХ, оклейка пленкой Oracal.",
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Их будет видно ночью?",
    answer: "Сами по себе они не светятся. В темноте они будут видны только при наличии уличного освещения. Для круглосуточной работы мы рекомендуем установить внешние светодиодные прожекторы (на кронштейнах).",
    icon: <Moon className="w-5 h-5 text-slate-500"/>
  },
  {
    question: "Насколько они долговечны?",
    answer: "ПВХ пластик не гниет и не боится морозов. Слабое место — пленка (цвет). На солнечной стороне она может выгореть за 3-4 года. В тени или интерьере вывеска служит 10+ лет.",
    icon: <Shield className="w-5 h-5 text-blue-500"/>
  },
  {
    question: "Как их крепить?",
    answer: "Легкие буквы (до 30 см) можно клеить прямо на стену на двусторонний скотч или силикон. Крупные буквы устанавливаются на дистанционные держатели (ножки) для создания дополнительного объема.",
    icon: <Hammer className="w-5 h-5 text-green-500"/>
  }
];

// --- ОСНОВНОЙ КОМПОНЕНТ (SERVER SIDE) ---
export default async function NonLitLettersPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/non-lit-night.png", "/images/letters/non-lit-day.png"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = volumeLettersCatalog.filter(item => item.slug !== PAGE_DATA.slug);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-slate-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        {/* Спокойное серое свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-slate-400 font-medium">Без подсветки</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-slate-400 bg-slate-500/10 border border-slate-500/20 rounded-full uppercase tracking-wider">
                    <DollarSign className="w-4 h-4"/> Лучшая цена
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-slate-500"/> Экономия бюджета до 60%
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-slate-500"/> Срок изготовления от 2 дней
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-slate-500"/> Идеально для офиса и светлых залов
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition shadow-lg shadow-white/10 active:scale-95">
                       <Calculator className="w-5 h-5"/> Узнать стоимость
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-slate-500/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-slate-500/10 rounded-full flex items-center justify-center text-slate-400"><Sun className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Дневной вид</div><div className="text-gray-400 text-xs">Объемная реклама</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT === */}
      <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-slate-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-500/10 text-slate-500 mb-6">
                  <Feather className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Разумная экономия</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Несветовые буквы — это классика 3D-рекламы. Они имеют тот же объем и форму, что и дорогие световые аналоги, но лишены электрической начинки. Вы получаете солидную рельефную вывеску, не переплачивая за диоды и блоки питания.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-slate-600 transition group text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400 group-hover:scale-110 transition"><Factory className="w-6 h-6"/></div>
                  <h4 className="text-white font-bold mb-2">Производство</h4>
                  <p className="text-gray-500 text-sm">Маркировка цехов, ангаров и складов, где свет не нужен.</p>
               </div>
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-slate-600 transition group text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400 group-hover:scale-110 transition"><Briefcase className="w-6 h-6"/></div>
                  <h4 className="text-white font-bold mb-2">Офис / Ресепшн</h4>
                  <p className="text-gray-500 text-sm">Логотип компании на стене. Строго, объемно и стильно.</p>
               </div>
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-slate-600 transition group text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-400 group-hover:scale-110 transition"><MapPin className="w-6 h-6"/></div>
                  <h4 className="text-white font-bold mb-2">Навигация</h4>
                  <p className="text-gray-500 text-sm">Крупные указатели "ВХОД", "КАССА", этажи и кабинеты.</p>
               </div>
            </div>
         </div>
      </section>

      {/* === БЛОК 3: MATERIALS === */}
      <section className="py-24 bg-[#0B1221] relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <span className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-2 block">Из чего делаем</span>
               <h2 className="text-3xl md:text-5xl font-black text-white">Материаловедение</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-white/30 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] flex flex-col">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-6 text-white font-bold group-hover:scale-110 transition-all duration-300 border border-slate-600">PVC</div>
                  <h3 className="text-xl font-bold text-white mb-3">ПВХ (Стандарт)</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Вспененный пластик. Легкий, матовый. Оклеивается цветной пленкой Oracal. Самый популярный вариант.</p>
                  <span className="text-xs font-bold text-green-500 uppercase tracking-wider bg-green-500/10 px-3 py-1 rounded w-fit">Хит продаж</span>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-all duration-300"><Layers className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Акрил + ПВХ</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Борт из ПВХ, а лицо из цветного глянцевого акрила. Выглядит дороже, имеет красивый стеклянный блеск.</p>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded w-fit">Глянец</span>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-slate-500/30 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(148,163,184,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-400 group-hover:scale-110 transition-all duration-300 border border-slate-700"><Layers className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Псевдообъем</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Плоские буквы (3-10 мм) на дистанционных держателях. Создают тень на стене.</p>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-500/10 px-3 py-1 rounded w-fit">Эконом</span>
               </div>
            </div>
         </div>
      </section>

      {/* === БЛОК 4: PALETTE (STATIC) === */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-slate-500/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container mx-auto px-4 relative z-10">
             <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="lg:w-1/3">
                   <div className="inline-flex items-center gap-2 text-slate-400 font-bold mb-4">
                      <Palette className="w-5 h-5"/> Палитра Oracal 641
                   </div>
                   <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Цвет решает всё</h2>
                   <p className="text-gray-400 text-lg leading-relaxed">
                      Так как подсветки нет, цвет пленки играет ключевую роль. Мы используем немецкую пленку Oracal 641 (матовая/глянцевая). Вот самые популярные цвета бизнеса.
                   </p>
                </div>
                
                <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4">
                   {/* COLOR CARDS */}
                   <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-600 shadow-md"></div>
                      <div>
                         <h4 className="text-white font-bold text-sm">Белый</h4>
                         <p className="text-gray-500 text-xs">Классика для темных стен</p>
                      </div>
                   </div>
                   <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-black border-2 border-slate-600 shadow-md"></div>
                      <div>
                         <h4 className="text-white font-bold text-sm">Черный</h4>
                         <p className="text-gray-500 text-xs">Строгий стиль, Лофт</p>
                      </div>
                   </div>
                   <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-600 border-2 border-slate-600 shadow-md"></div>
                      <div>
                         <h4 className="text-white font-bold text-sm">Красный</h4>
                         <p className="text-gray-500 text-xs">Распродажи, Акции</p>
                      </div>
                   </div>
                   <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-700 border-2 border-slate-600 shadow-md"></div>
                      <div>
                         <h4 className="text-white font-bold text-sm">Синий</h4>
                         <p className="text-gray-500 text-xs">Банки, Юристы</p>
                      </div>
                   </div>
                   <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500 border-2 border-slate-600 shadow-md"></div>
                      <div>
                         <h4 className="text-white font-bold text-sm">Зеленый</h4>
                         <p className="text-gray-500 text-xs">Аптеки, Эко-лавки</p>
                      </div>
                   </div>
                   <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-slate-600 shadow-md"></div>
                      <div>
                         <h4 className="text-white font-bold text-sm">Желтый</h4>
                         <p className="text-gray-500 text-xs">Детские, Фастфуд</p>
                      </div>
                   </div>
                </div>
             </div>
         </div>
      </section>

      {/* === [NEW] БЛОК 5: PRO TIPS === */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               
               {/* Карточка 1: НОЧЬ */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-slate-500 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400"><Lightbulb className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Как быть ночью?</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Главный минус — в темноте их не видно. Если вы работаете до поздна, это проблема.
                     </p>
                     <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                        <p className="text-xs text-slate-300 font-medium">
                           <span className="text-white font-bold">Решение:</span> Установка внешних LED-прожекторов на кронштейнах. Дешево и сердито.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Карточка 2: СТОИМОСТЬ */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-green-500 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-green-900/20 rounded-2xl flex items-center justify-center text-green-500"><DollarSign className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Реальная экономия</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Нет диодов = минус 30% цены. Нет блоков питания = минус 10%. Простой монтаж = минус 20%.
                     </p>
                     <div className="p-3 bg-green-900/10 border border-green-500/20 rounded-xl">
                        <p className="text-xs text-green-400 font-bold">
                           Итог: Вывеска в 2 раза дешевле световой.
                        </p>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* === БЛОК 6: FAQ === */}
      <section className="py-24 bg-[#0B1221]">
         <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white mb-4">Частые вопросы</h2>
            </div>

            <div className="space-y-4">
               {FAQ_ITEMS.map((item, index) => (
                  <details key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-slate-500/50 open:bg-slate-900/80">
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-800 rounded-lg group-open:bg-slate-700 transition">
                              {item.icon}
                           </div>
                           <span className="font-bold text-white text-base md:text-lg group-open:text-slate-300 transition">{item.question}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 group-open:rotate-180 transition ml-4 shrink-0"><ChevronDown className="w-4 h-4"/></div>
                     </summary>
                     <div className="px-6 pb-6 pl-[4.5rem] text-gray-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        {item.answer}
                     </div>
                  </details>
               ))}
            </div>
         </div>
      </section>

      {/* === БЛОК 7: ГАЛЕРЕЯ === */}
      <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-4 mb-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Наши работы</h2>
              <p className="text-gray-400">Просто и со вкусом</p>
          </div>
          <div className="container mx-auto px-4">
             {galleryImages.length > 0 ? <ImageGallery images={galleryImages} /> : <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">Загрузите фото в папку public/images/letters-galery/non-lit</div>}
             
             <div className="mt-16 flex justify-center">
                <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                   <span className="relative z-10 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-slate-500"/>
                      Посмотреть все работы в Портфолио
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-slate-700/50 to-gray-700/50 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                </Link>
             </div>
          </div>
      </section>

      {/* === БЛОК 8: СМОТРИТЕ ТАКЖЕ === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-slate-500/5 blur-[100px] rounded-full pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10">
             <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div>
                   <h2 className="text-3xl font-bold text-white mb-2">Другие варианты букв</h2>
                   <p className="text-gray-400 text-sm">Если бюджет позволяет, рассмотрите световые варианты</p>
                </div>
                <Link href="/services/volume-letters" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition">
                   Смотреть весь каталог <ArrowRight className="w-4 h-4"/>
                </Link>
             </div>
             
             <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:grid md:grid-cols-4 gap-6 md:overflow-visible md:pb-0 md:px-0 hide-scrollbar snap-x snap-mandatory">
                {otherTypes.map((type) => (
                   <Link 
                      key={type.id} 
                      href={`/services/volume-letters/${type.slug}`}
                      className="group min-w-[280px] md:min-w-0 snap-center relative flex flex-col"
                   >
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 transition-all duration-300 group-hover:border-slate-600 group-hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] h-full flex flex-col">
                         <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mb-4">
                             <Image 
                                src={type.images.night} 
                                alt={type.title} 
                                fill 
                                sizes="(max-width: 768px) 100vw, 25vw"
                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                             />
                             <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-lg">
                                <span className="text-orange-500 font-bold text-xs">{type.price}</span>
                             </div>
                         </div>
                         <div className="px-2 pb-2 flex flex-col flex-1">
                             <div className="flex items-start justify-between gap-4">
                                <h4 className="text-white font-bold text-lg leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                                   {type.title}
                                </h4>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0 group-hover:rotate-[-45deg]">
                                   <ArrowRight className="w-4 h-4"/>
                                </div>
                             </div>
                             <div className="mt-auto pt-4">
                                <div className="w-full h-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors relative overflow-hidden rounded-full">
                                   <div className="absolute top-0 left-0 h-full w-0 bg-blue-500 group-hover:w-full transition-all duration-700 ease-out"></div>
                                </div>
                             </div>
                         </div>
                      </div>
                   </Link>
                ))}
             </div>
         </div>
      </section>

      <ReviewsCarousel />
      <CallToAction source={`Услуга: ${PAGE_DATA.title}`} />

    </div>
  );
}