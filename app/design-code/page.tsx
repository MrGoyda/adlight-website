import Link from "next/link";
import { Metadata } from "next";
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Ruler, 
  Building,
  ChevronRight,
  BookOpen,
  MapPin,
  Layout,
  Ban,
  Megaphone,
  Store,
  Armchair,
  Layers,
  Languages, 
  FileText,  
  Copyright, 
  Clock,     
  Info,
  ShieldAlert
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import DesignCodeHeroButtons from "@/components/DesignCodeHeroButtons"; 
import DesignCodeTabs from "@/components/DesignCodeTabs"; 

// 1. УЛУЧШЕННЫЕ METADATA (SEO/GEO)
export const metadata: Metadata = {
  title: "Дизайн-код Астаны 2025 | Требования к вывескам и рекламе",
  description: "Правила размещения наружной рекламы в Астане. Как избежать штрафов и демонтажа? Согласование эскизов, получение паспорта рекламы, языковые нормы.",
  keywords: ["дизайн код астана", "паспорт рекламы", "согласование вывески", "штраф за рекламу", "закон о языках", "урбанистика астана"],
  openGraph: {
    title: "Гид по Дизайн-коду Астаны",
    description: "Единые правила оформления фасадов. Узнайте, соответствует ли ваша вывеска закону.",
    images: ["/images/design-code/hero.webp"]
  }
};

export default function DesignCodePage() {

  // 2. SCHEMA.ORG (FAQ + Article)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Правила Дизайн-кода Астаны для вывесок",
        "description": "Руководство по размещению наружной рекламы: разрешенные размеры, места и типы конструкций.",
        "author": { "@type": "Organization", "name": "ADLight" },
        "publisher": { "@type": "Organization", "name": "ADLight", "logo": { "@type": "ImageObject", "url": "https://adlight.kz/logo.png" } }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Как узаконить вывеску на иностранном языке?",
            "acceptedAnswer": { "@type": "Answer", "text": "Есть 3 способа: 1) Сделать транслитерацию на казахский. 2) Использовать название, совпадающее с юридическим (по документам). 3) Зарегистрировать товарный знак." }
          },
          {
            "@type": "Question",
            "name": "Где можно вешать вывеску?",
            "acceptedAnswer": { "@type": "Answer", "text": "Строго в пределах, определенных паспортом фасада здания. Обычно это фриз над входом или простенок между окнами 1 и 2 этажа." }
          },
          {
            "@type": "Question",
            "name": "Разрешены ли баннеры на фасаде?",
            "acceptedAnswer": { "@type": "Answer", "text": "Нет. Использование баннерной ткани, натянутой на каркас, на фасадах зданий в Астане запрещено Дизайн-кодом." }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-orange-500/30">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-blue-900/10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Хлебные крошки */}
           <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-blue-500 font-medium">Дизайн-код</span>
           </div>

           <div className="max-w-3xl">
              <div data-aos="fade-right" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 uppercase tracking-wider">
                 <BookOpen className="w-4 h-4"/> Гид по Дизайн-коду Астаны
              </div>
              <h1 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                 Создаем облик <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">столицы вместе</span>
              </h1>
              <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 text-lg mb-10 leading-relaxed">
                 Единые правила оформления фасадов, вывесок и городской среды. Узнайте требования для вашего бизнеса за 3 минуты, чтобы избежать штрафов и демонтажа.
              </p>
              
              {/* КНОПКИ (КЛИЕНТСКИЙ КОМПОНЕНТ) */}
              <DesignCodeHeroButtons />
           </div>
        </div>
      </section>

      {/* 2. ТРИ ПУТИ СОГЛАСОВАНИЯ */}
      <section id="check" className="py-24 bg-[#0B1120] scroll-mt-20 border-b border-slate-800">
         <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">3 способа узаконить название</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                   Есть только три официальных варианта согласования вывески с отделом языков. Выберите свой путь.
                </p>
             </div>

             

             <div className="grid lg:grid-cols-3 gap-8">
                {/* ВАРИАНТ 1 */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-green-500/30 transition duration-300">
                   <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500">
                      <Languages className="w-7 h-7"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-4">Перевод на казахский</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6 min-h-[60px]">
                      Прямой перевод названия или транслитерация. Самый простой и быстрый способ.
                      <br/><span className="text-slate-500 text-xs">Пример: "Express repair" → "Жылдам жөндеу"</span>
                   </p>
                   <div className="pt-6 border-t border-slate-800">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-white font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Для ИП и малого бизнеса</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 font-mono">
                         <Clock className="w-4 h-4"/> Срок: 3-5 дней
                      </div>
                   </div>
                </div>

                {/* ВАРИАНТ 2 */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-blue-500/30 transition duration-300">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                      <FileText className="w-7 h-7"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-4">По документам</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6 min-h-[60px]">
                      Использование названия точь-в-точь как в свидетельстве о регистрации ТОО или ИП.
                      <br/><span className="text-slate-500 text-xs">Пример: ТОО "Express repair"</span>
                   </p>
                   <div className="pt-6 border-t border-slate-800">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-white font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500"/> Без товарного знака</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 font-mono">
                         <Clock className="w-4 h-4"/> Срок: 3-5 дней
                      </div>
                   </div>
                </div>

                {/* ВАРИАНТ 3 */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-purple-500/30 transition duration-300">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500">
                      <Copyright className="w-7 h-7"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-4">Товарный знак (ТЗ)</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6 min-h-[60px]">
                      Регистрация бренда в Комитете интеллектуальной собственности. Дает право писать на любом языке.
                   </p>
                   <div className="pt-6 border-t border-slate-800">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-white font-bold flex items-center gap-2"><Info className="w-4 h-4 text-purple-500"/> Защита бренда</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 font-mono">
                         <Clock className="w-4 h-4"/> Срок: 6-7 месяцев
                      </div>
                   </div>
                </div>
             </div>
         </div>
      </section>

      {/* 3. ПАМЯТКА ДЛЯ БИЗНЕСА (CHECKLIST) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Технические требования</h2>
               <p className="text-gray-400">Где и как размещать вывеску</p>
            </div>
            
            

            <div className="grid lg:grid-cols-3 gap-8">
               {/* Правило 1 */}
               <div className="bg-[#0F172A] p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
                     <MapPin className="w-20 h-20 text-blue-500"/>
                  </div>
                  <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold mb-6">ПРАВИЛО 1</div>
                  <h3 className="text-xl font-bold text-white mb-6">Место размещения</h3>
                  <ul className="space-y-4">
                     <li className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"/>
                        <span className="text-gray-400 text-sm"><strong>Информационное поле:</strong> Строго в отведенном паспортом фасада месте.</span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"/>
                        <span className="text-gray-400 text-sm"><strong>Входная группа:</strong> Над входом или сбоку от него.</span>
                     </li>
                  </ul>
               </div>

               {/* Правило 2 */}
               <div className="bg-[#0F172A] p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
                     <Layout className="w-20 h-20 text-green-500"/>
                  </div>
                  <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold mb-6">ПРАВИЛО 2</div>
                  <h3 className="text-xl font-bold text-white mb-6">Дизайн и Технологии</h3>
                  <div className="space-y-6">
                     <div>
                        <div className="flex items-center gap-2 text-green-500 font-bold mb-2"><CheckCircle className="w-5 h-5"/> РАЗРЕШЕНО</div>
                        <p className="text-gray-400 text-sm">Только отдельные объемные или плоские буквы без подложки.</p>
                     </div>
                     <div>
                        <div className="flex items-center gap-2 text-red-500 font-bold mb-2"><XCircle className="w-5 h-5"/> ЗАПРЕЩЕНО</div>
                        <p className="text-gray-400 text-sm">Баннерная ткань, сплошные световые короба на фасаде.</p>
                     </div>
                  </div>
               </div>

               {/* Правило 3 */}
               <div className="bg-[#0F172A] p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
                     <Ruler className="w-20 h-20 text-orange-500"/>
                  </div>
                  <div className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold mb-6">ПРАВИЛО 3</div>
                  <h3 className="text-xl font-bold text-white mb-6">Допустимые габариты</h3>
                  <div className="space-y-0 divide-y divide-slate-800">
                     {[
                        {f: "1–2 этажа", h: "до 0,80 м"},
                        {f: "3–5 этажей", h: "до 1,20 м"},
                        {f: "6–9 этажей", h: "до 1,80 м"},
                        {f: "10+ этажей", h: "до 2,20 м"},
                     ].map((row, i) => (
                        <div key={i} className="flex justify-between py-2 text-sm">
                           <span className="text-gray-400">{row.f}</span>
                           <span className="text-white font-mono font-bold">{row.h}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. СТОП-ЛИСТ (ЗАПРЕТЫ) */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
               <div className="h-px flex-1 bg-slate-800"></div>
               <h2 className="text-3xl font-bold text-white text-center flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-red-500"/>
                  <span>СТОП-ЛИСТ: Как делать нельзя</span>
               </h2>
               <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            

            <div className="grid md:grid-cols-3 gap-6">
               {[
                  {t: "Вертикальное размещение", d: "Буквы нельзя писать столбиком (сверху вниз)."},
                  {t: "Перекрытие архитектуры", d: "Запрещено закрывать окна, витражи, декор."},
                  {t: "Балконы и козырьки", d: "Нельзя вешать конструкции на ограждениях балконов."},
                  {t: "Выступ за фасад", d: "Конструкции не должны выступать за плоскость фасада."},
                  {t: "Жилые подъезды", d: "Запрещено размещение на входах в подъезды."},
                  {t: "Без разрешения", d: "Размещение без согласия собственника запрещено."},
               ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-red-900/5 border border-red-900/20 rounded-2xl hover:bg-red-900/10 transition">
                     <Ban className="w-6 h-6 text-red-500 flex-shrink-0 mt-1"/>
                     <div>
                        <h4 className="text-white font-bold mb-2">{item.t}</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">{item.d}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. КАТАЛОГ ФОРМАТОВ (ИНТЕРАКТИВНЫЙ КОМПОНЕНТ) */}
      <DesignCodeTabs />

      {/* 6. ЛИД-МАГНИТ */}
      <CallToAction 
          source="Страница: Дизайн-код" 
          title="Сделаем вывеску строго по Дизайн-коду" 
          subtitle="Мы знаем все требования наизусть. Проверим ваш фасад, подготовим эскиз и гарантируем отсутствие штрафов."
          buttonText="Проверить вывеску"
      />

      {/* 7. ДРУГИЕ УСЛУГИ */}
      <ServicesCarousel title="Наши услуги" subtitle="Производство по Дизайн-коду" />

    </div>
  );
}