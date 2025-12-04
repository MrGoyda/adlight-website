import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  DraftingCompass, // Чертежи
  HardHat,         // Каска/Стройка
  Wind,            // Ветер
  FileText,        // Документы
  Zap,
  ScanFace,
  Grid3X3,
  // MessageCircle убрал, теперь он внутри HeroButtons
  Anchor,          // Крепеж
  Shield,
  Building2,       // Здание
  Ruler,
  MonitorPlay,
  Maximize
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";
import HeroButtons from "@/components/HeroButtons"; // <--- НАШ НОВЫЙ КОМПОНЕНТ

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "roof-installations", // Папка public/images/roof-installations
  title: "Крышные установки",
  subtitle: "Имиджевые конструкции любого масштаба. Проектирование, расчет нагрузок и монтаж по СНиП РК.",
  price: "Проектно" 
};

export const metadata = {
  title: "Крышные установки в Астане | Изготовление и Монтаж | ADLight",
  description: "Реклама на крыше здания. Разработка проекта КМ/КМД, экспертиза кровли, согласование. Собственные монтажные бригады.",
};

// --- ТИПЫ КОНСТРУКЦИЙ ---
const ROOF_TYPES = [
  {
    title: "Объемные буквы на раме",
    desc: "Классика имиджевой рекламы. Отдельные световые буквы высотой от 1 до 5 метров. Устанавливаются на силовой металлокаркас.",
    image: "/images/roof/type-letters.jpg", 
    tag: "Статус"
  },
  {
    title: "Баннерные короба",
    desc: "Бюджетное решение для огромных площадей. Световой короб с натянутым транслюцентным баннером. Идеально для ТРЦ.",
    image: "/images/roof/type-box.jpg", 
    tag: "Масштаб"
  },
  {
    title: "Медиаэкраны",
    desc: "Динамическая видеореклама. LED-кабинеты, собранные в единый экран. Позволяет менять контент хоть каждый час.",
    image: "/images/roof/type-screen.jpg", 
    tag: "Digital"
  },
];

export default async function RoofPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/krisha.jpg", "/images/calc/lightbox-2.jpg"];

  return (
    <div className="min-h-screen bg-[#0B1120] font-sans selection:bg-blue-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative py-24 lg:py-36 overflow-hidden border-b border-slate-800">
        {/* Фон - имитация чертежной сетки */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-transparent"></div>
        
        {/* Акцентное свечение (Инженерный синий) */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-blue-500 font-medium">Крышные установки</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-sm uppercase tracking-wider">
                    <DraftingCompass className="w-4 h-4"/> Полный цикл: Проект → Монтаж
                 </div>
                 <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                    Масштаб вашего <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">бизнеса</span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl border-l-2 border-blue-500/30 pl-6">
                    Самый престижный вид наружной рекламы. Разрабатываем проектную документацию (КМ, КМД, ЭО), рассчитываем ветровые нагрузки для Астаны и монтируем на любой высоте.
                 </p>
                 
                 {/* --- НОВЫЙ ИЗОЛИРОВАННЫЙ КОМПОНЕНТ КНОПОК --- */}
                 <HeroButtons source={PAGE_DATA.title} priceColor="blue" />

              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-[4/5] md:aspect-square rounded-sm overflow-hidden shadow-2xl border border-slate-700 group">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent pointer-events-none"></div>
                 
                 {/* Плашка с характеристиками */}
                 <div className="absolute bottom-8 left-8 bg-[#0B1120]/90 backdrop-blur border border-slate-700 p-6 rounded-sm max-w-xs pointer-events-none z-20">
                    <div className="flex items-center gap-4 mb-4">
                       <Wind className="w-8 h-8 text-blue-500"/>
                       <div>
                          <div className="text-white font-bold text-lg">Ветровая нагрузка</div>
                          <div className="text-gray-400 text-xs">III снеговой район</div>
                       </div>
                    </div>
                    <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full w-3/4 bg-blue-500 animate-pulse"></div>
                    </div>
                    <div className="mt-2 text-right text-xs text-blue-400 font-mono">Запас прочности 1.5x</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. ИНЖЕНЕРНЫЙ ПОДХОД (БЕЗОПАСНОСТЬ) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                   <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Безопасность превыше всего</h2>
                   <p className="text-gray-400 max-w-2xl text-lg">
                      Крышная установка — это капитальное строительство. Мы несем юридическую ответственность за надежность конструкции.
                   </p>
                </div>
                <div className="hidden md:block">
                   <div className="px-6 py-3 bg-blue-900/20 border border-blue-500/30 rounded text-blue-400 font-mono text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4"/> Лицензия на СМР II категории
                   </div>
                </div>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                {/* 1. Проектирование */}
                <div className="bg-[#0B1120] p-8 border border-slate-800 hover:border-blue-500/50 transition group relative overflow-hidden">
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
                <div className="bg-[#0B1120] p-8 border border-slate-800 hover:border-blue-500/50 transition group relative overflow-hidden">
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
                      <strong className="text-white">Пригрузы:</strong> используем бетонные блоки, чтобы не дырявить мягкую кровлю.
                   </p>
                </div>

                {/* 3. Электрика */}
                <div className="bg-[#0B1120] p-8 border border-slate-800 hover:border-blue-500/50 transition group relative overflow-hidden">
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

      {/* 4. ТИПЫ КРЫШНЫХ УСТАНОВОК (С ФОТО) */}
      <section className="py-24 bg-[#0B1120] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Технологии исполнения</h2>
               <p className="text-gray-400">Выбор зависит от размера вывески и вашего бюджета</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {ROOF_TYPES.map((type, i) => (
                  <div key={i} className="group relative h-[400px] rounded-sm overflow-hidden border border-slate-800 bg-slate-900 cursor-default">
                     {/* ФОТО ФОНОМ */}
                     <Image 
                        src={type.image} 
                        alt={type.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-40"
                     />
                     
                     {/* ГРАДИЕНТ */}
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/50 to-transparent"></div>

                     {/* КОНТЕНТ */}
                     <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                           {type.tag}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{type.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed opacity-90 mb-6">
                           {type.desc}
                        </p>
                        {/* Иконка типа */}
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur">
                           {i === 0 && <ScanFace className="w-5 h-5 text-white"/>}
                           {i === 1 && <Maximize className="w-5 h-5 text-white"/>}
                           {i === 2 && <MonitorPlay className="w-5 h-5 text-white"/>}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. ЭТАПЫ РЕАЛИЗАЦИИ */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Этапы реализации под ключ</h2>
           <div className="grid md:grid-cols-5 gap-8 relative">
              {/* Линия */}
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
              {[
                 {step: "01", title: "Экспертиза", desc: "Осмотр кровли, проверка закладных, оценка 'пирога' кровли."},
                 {step: "02", title: "Проект", desc: "Разработка КМ и КМД. Расчет нагрузок инженером."},
                 {step: "03", title: "Акимат", desc: "Получение разрешения на размещение (паспорт рекламы)."},
                 {step: "04", title: "Цех", desc: "Сварка ферм, грунтовка, покраска, сборка букв."},
                 {step: "05", title: "Монтаж", desc: "Подъем краном/альпинистами, пригрузы, электрика."}
              ].map((item, i) => (
                 <div key={i} className="relative group bg-[#0F172A] p-4 pt-0">
                    <div className="w-16 h-16 bg-slate-900 border-2 border-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto shadow-lg shadow-blue-900/20 z-10 relative">{item.step}</div>
                    <h3 className="text-lg font-bold text-white text-center mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-center text-xs leading-relaxed">{item.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. ДИЗАЙН КОД */}
      <DesignCodeBlock />

      {/* 7. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-4 mb-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Примеры масштабных проектов</h2>
              <p className="text-gray-400">Имиджево, мощно, завораживающе</p>
          </div>
          <div className="container mx-auto px-4">
              {galleryImages.length > 0 ? (
                 <ImageGallery images={galleryImages} /> 
              ) : (
                 <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">
                    Загрузите фото в папку public/images/roof-installations
                 </div>
              )}
          </div>
      </section>

      {/* 8. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/roof-installations"/>
      <CallToAction source="Услуга: Крышные установки" />

    </div>
  );
}