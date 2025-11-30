import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  MessageCircle,
  Zap,            // Энергия/Неон
  Scissors,       // Резка
  Plug,           // 12V
  Camera,         // Фотозона
  Eye,
  Heart,          // Эмоции
  ShieldCheck,    // Защита/Закон
  Store,          // Магазин
  Coins,          // Экономия
  FileCheck,      // Документы
  AlertTriangle
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "neon", // Папка public/images/neon
  title: "Неоновые вывески (Flex)",
  subtitle: "Сочный свет, который притягивает взгляды. Идеально для кофеен, баров и домашних фотозон.",
  price: "15 000" // Старт за простую надпись
};

export const metadata = {
  title: "Гибкий неон в Астане | Изготовление неоновых вывесок ADLight",
  description: "Неоновые надписи на заказ. 100% силиконовый неон (не желтеет). Прозрачная подложка, аккуратная пайка. Гарантия 1 год.",
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Он стеклянный или мягкий?",
    answer: "Это современный LED-неон (Flex). Он сделан из мягкого силикона, внутри которого находится светодиодная лента. Он не бьется, не греется и абсолютно безопасен (12 Вольт), в отличие от старого стеклянного газа.",
    icon: <Zap className="w-5 h-5 text-purple-500"/>
  },
  {
    question: "Как его подключить?",
    answer: "Вывеска работает от розетки 220В через блок питания (идет в комплекте, как зарядка от ноутбука). Длина провода обычно 2-3 метра. Можно подключить через диммер (пульт) для управления яркостью.",
    icon: <Plug className="w-5 h-5 text-green-500"/>
  },
  {
    question: "Видны ли провода?",
    answer: "Между буквами идут соединительные провода. Мы используем специальный тонкий прозрачный кабель и делаем пайку максимально незаметной. На прозрачной подложке провода практически не видны.",
    icon: <Eye className="w-5 h-5 text-blue-500"/>
  }
];

// --- ЦВЕТОВАЯ ПАЛИТРА (ОБНОВЛЕННАЯ) ---
const NEON_COLORS = [
  { name: "Cold White", hex: "#E0F2FE", main: "#38bdf8" },
  { name: "Warm White", hex: "#FEF3C7", main: "#fbbf24" },
  { name: "Pink",       hex: "#FCE7F3", main: "#ec4899" },
  { name: "Purple",     hex: "#F3E8FF", main: "#a855f7" },
  { name: "Red",        hex: "#FEE2E2", main: "#ef4444" },
  { name: "Blue",       hex: "#DBEAFE", main: "#3b82f6" },
  { name: "Green",      hex: "#DCFCE7", main: "#22c55e" },
  { name: "Orange",     hex: "#FFEDD5", main: "#f97316" },
];

export default async function NeonPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  // Заглушки, если папка пуста
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/calc/neon-1.jpg", "/images/calc/neon-2.jpg"];

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-purple-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Фиолетовый неон */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-purple-500 font-medium">Гибкий неон</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                 <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full uppercase tracking-wider">
                    Тренд 2025 года
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Атмосферные <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">неоновые вывески</span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Создаем "вау-эффект" для вашего бизнеса или дома. Используем премиальный силиконовый неон 2-го поколения: не желтеет, светит ровно, служит 5 лет.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать надпись
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Написать в WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-purple-900/20">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500"><Zap className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Безопасно 12V</div><div className="text-gray-400 text-xs">Не бьется, не греется</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. CONCEPT (ФОТОЗОНА) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Бизнес, который хочется фотографировать</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                     В эру Instagram интерьер продает лучше, чем реклама. Неоновая надпись — это готовая фотозона. Клиенты делают селфи, отмечают вас в сторис — вы получаете бесплатный охват.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                     <div className="bg-purple-900/20 border border-purple-500/30 px-4 py-3 rounded-xl flex items-center gap-3">
                        <Camera className="w-5 h-5 text-purple-400"/>
                        <span className="text-white font-medium">UGC-контент</span>
                     </div>
                     <div className="bg-pink-900/20 border border-pink-500/30 px-4 py-3 rounded-xl flex items-center gap-3">
                        <Heart className="w-5 h-5 text-pink-400"/>
                        <span className="text-white font-medium">Лояльность</span>
                     </div>
                  </div>
               </div>
               
               <div className="lg:w-1/2 w-full">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video group">
                      {/* Имитация неона */}
                      <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-6xl md:text-8xl font-script text-white drop-shadow-[0_0_15px_#d946ef] animate-pulse" style={{fontFamily: 'cursive'}}>
                             Beauty
                          </h3>
                      </div>
                      {/* Отражение на полу */}
                      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-pink-500/20 to-transparent blur-2xl"></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. ПАЛИТРА ЦВЕТОВ (ОБНОВЛЕННАЯ) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">12 Сочных оттенков</h2>
               <p className="text-gray-400">Цветной силикон: вывеска выглядит ярко даже в выключенном состоянии</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
               {NEON_COLORS.map((color, i) => (
                  <div key={i} className="group flex flex-col items-center gap-4 cursor-pointer">
                     {/* Неоновый Круг */}
                     <div 
                        className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform group-active:scale-90"
                        style={{ 
                           // Базовое свечение + Цветная обводка
                           boxShadow: `0 0 20px ${color.main}60`,
                           border: `2px solid ${color.main}`
                        }}
                     >
                        {/* Сердцевина (Сам неон) */}
                        <div 
                            className="w-14 h-14 rounded-full bg-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_currentColor] group-active:scale-95 group-active:shadow-[0_0_50px_currentColor]"
                            style={{ 
                                backgroundColor: color.hex,
                                color: color.main // Используем для shadow в inline-style
                            }}
                        ></div>

                        {/* Сильное размытое пятно (Glow Effect) */}
                        <div 
                            className="absolute inset-0 rounded-full opacity-40 group-hover:opacity-80 group-active:opacity-100 transition-opacity duration-300 blur-lg"
                            style={{ backgroundColor: color.main }}
                        ></div>
                     </div>
                     
                     <span className="text-slate-400 text-xs font-bold group-hover:text-white transition uppercase tracking-wider">{color.name}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. ТЕХНИЧЕСКИЙ БЛОК (СИЛИКОН VS ПВХ) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
               <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Силикон или ПВХ?</h2>
                  <p className="text-gray-400 max-w-xl text-lg">
                     На рынке много дешевого неона. Важно знать разницу, чтобы не платить дважды.
                  </p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
               {/* СИЛИКОН (МЫ) */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-purple-500/50 relative overflow-hidden shadow-lg shadow-purple-900/20">
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">ВЫБОР ADLIGHT</div>
                  <div className="flex items-center gap-4 mb-6">
                     <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><ShieldCheck className="w-8 h-8"/></div>
                     <h3 className="text-2xl font-bold text-white">100% Силикон</h3>
                  </div>
                  <ul className="space-y-4 text-gray-300">
                     <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/>
                        <span><strong>Не желтеет.</strong> Силикон устойчив к ультрафиолету. Цвет остается чистым годами.</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/>
                        <span><strong>Мягкий свет.</strong> Идеальная диффузия, не видно отдельных диодов ("точек").</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/>
                        <span><strong>Эластичность.</strong> Позволяет выгибать сложные шрифты и мелкие детали (от 2 см).</span>
                     </li>
                  </ul>
               </div>

               {/* ПВХ (ДЕШЕВО) */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 opacity-75 hover:opacity-100 transition">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="p-3 bg-red-500/10 rounded-xl text-red-400"><AlertTriangle className="w-8 h-8"/></div>
                     <h3 className="text-2xl font-bold text-gray-400">Дешевый ПВХ</h3>
                  </div>
                  <ul className="space-y-4 text-gray-500">
                     <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-red-500/50 flex items-center justify-center text-red-500 text-xs shrink-0">✕</div>
                        <span><strong>Желтеет.</strong> Через 6-8 месяцев на солнце превращается в "грязный" пластик.</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-red-500/50 flex items-center justify-center text-red-500 text-xs shrink-0">✕</div>
                        <span><strong>Жесткий.</strong> Трудно гнуть, часто ломается на сгибах, видно заломы.</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-red-500/50 flex items-center justify-center text-red-500 text-xs shrink-0">✕</div>
                        <span><strong>Запах.</strong> При нагреве может выделять неприятный запах дешевого пластика.</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 6. ЦЕНА */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                   <h2 className="text-3xl font-bold text-white mb-4">Из чего складывается цена?</h2>
                   <p className="text-purple-200 mb-6">
                      В отличие от букв, неон считается по общей длине трубки (в погонных метрах), а не по высоте букв.
                   </p>
                   <ul className="space-y-3">
                      <li className="flex justify-between text-sm border-b border-purple-500/20 pb-2">
                         <span className="text-gray-300">Неон 6мм (Силикон)</span>
                         <span className="text-white font-bold">от 15 000 ₸ / м</span>
                      </li>
                      <li className="flex justify-between text-sm border-b border-purple-500/20 pb-2">
                         <span className="text-gray-300">Подложка (Акрил 4мм)</span>
                         <span className="text-white font-bold">включено</span>
                      </li>
                      <li className="flex justify-between text-sm border-b border-purple-500/20 pb-2">
                         <span className="text-gray-300">Блок питания</span>
                         <span className="text-white font-bold">включено</span>
                      </li>
                   </ul>
                </div>

                <div className="md:w-1/2 text-center">
                   <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/30 animate-pulse">
                      <Calculator className="w-10 h-10 text-white"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Узнать длину своей надписи?</h3>
                   <p className="text-gray-400 text-sm mb-6">Пришлите текст, мы нарисуем макет и посчитаем метраж.</p>
                   <Link href="/calculator" className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-900 font-bold rounded-xl hover:bg-purple-50 transition">
                      Рассчитать бесплатно
                   </Link>
                </div>
             </div>
         </div>
      </section>

      {/* === [NEW] БЛОК 7: LEGAL LIFEHACK (ЗАМЕСТО ДИЗАЙН-КОДА) === */}
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
                    Знаете ли вы? Вывески, установленные <strong>внутри помещения за стеклом</strong> (10-15 см от окна), считаются интерьерным оформлением (мебелью/светильником). Их не нужно согласовывать в Акимате, и за них не нужно платить налог на рекламу!
                 </p>
                 
                 <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-white font-medium p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                       <Coins className="w-6 h-6 text-yellow-500"/>
                       Экономия на налогах и паспорте рекламы
                    </li>
                    <li className="flex items-center gap-3 text-white font-medium p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                       <Store className="w-6 h-6 text-purple-500"/>
                       Привлекает внимание прохожих так же ярко, как наружка
                    </li>
                    <li className="flex items-center gap-3 text-white font-medium p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                       <FileCheck className="w-6 h-6 text-green-500"/>
                       Никаких штрафов и риска демонтажа
                    </li>
                 </ul>
              </div>

              {/* Визуал (Схематично окно) */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-2xl">
                  {/* Улица */}
                  <div className="absolute inset-0 bg-[url('/images/22.jpg')] bg-cover bg-center opacity-20"></div>
                  
                  {/* Рама окна */}
                  <div className="absolute inset-4 border-4 border-slate-600 rounded-lg z-10 pointer-events-none"></div>
                  
                  {/* Неон за стеклом */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className="text-center">
                         <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse" style={{fontFamily: 'cursive'}}>
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

      {/* 8. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-4 mb-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Живые примеры</h2>
              <p className="text-gray-400">Неон в интерьерах наших клиентов</p>
          </div>
          <div className="container mx-auto px-4">
             {/* Если картинки есть - показываем, если нет - заглушка */}
             {galleryImages.length > 0 ? (
                <ImageGallery images={galleryImages} /> 
             ) : (
                <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">
                   Загрузите фото в папку public/images/neon
                </div>
             )}
          </div>
      </section>

      {/* 9. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/neon"/>
      <CallToAction source="Услуга: Неон" />

    </div>
  );
}