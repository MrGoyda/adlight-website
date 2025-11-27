"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  FileCheck, 
  Ruler, 
  Building,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  MapPin,
  Layout,
  Ban,
  Megaphone,
  Store,
  Armchair,
  Search,
  Layers,
  MessageCircle // Иконка для консультации
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ConsultationModal from "@/components/ConsultationModal"; // <-- ИМПОРТ МОДАЛКИ

// Тип для табов
type TabType = 'ads' | 'trade' | 'urban';

// Данные для табов
const TAB_DATA = {
  ads: [
    { t: "Билборд", d: "Щит от 2х3 м для улиц.", i: <Megaphone className="w-6 h-6"/> },
    { t: "Стела", d: "Отдельно стоящая конструкция (не более 2 сторон).", i: <MapPin className="w-6 h-6"/> },
    { t: "Сити-формат", d: "Световая панель до 2,5 кв.м (Лайт-постер).", i: <Layout className="w-6 h-6"/> },
    { t: "Крышные установки", d: "Объемные буквы или панно строго на крыше.", i: <Building className="w-6 h-6"/> },
    { t: "Брендмауэр", d: "Панно на глухой стене здания.", i: <Layers className="w-6 h-6"/> },
  ],
  trade: [
    { t: "Киоск", d: "Компактное сооружение без торгового зала.", i: <Store className="w-6 h-6"/> },
    { t: "Павильон", d: "Легкая конструкция с возможностью входа внутрь.", i: <Store className="w-6 h-6"/> },
    { t: "Автолавка", d: "Мобильная торговля на колесах.", i: <ArrowRight className="w-6 h-6"/> },
  ],
  urban: [
    { t: "Остановки", d: "Открытые и теплые павильоны закрытого типа.", i: <Store className="w-6 h-6"/> },
    { t: "Навигация", d: "Информационные панели и табло с погодой/картой.", i: <MapPin className="w-6 h-6"/> },
    { t: "Скамьи", d: "Единый стиль уличной мебели.", i: <Armchair className="w-6 h-6"/> },
  ]
};

export default function DesignCodePage() {
  const [activeTab, setActiveTab] = useState<TabType>('ads');
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модалки

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-orange-500/30">
      
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
              
              <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col sm:flex-row gap-4">
                 {/* Кнопка открытия модалки */}
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                 >
                    <MessageCircle className="w-5 h-5"/> Бесплатная консультация
                 </button>
                 
                 <Link href="#check" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition border border-slate-700 flex items-center justify-center gap-2">
                    <Search className="w-5 h-5"/> Проверить вывеску
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* 2. ПАМЯТКА ДЛЯ БИЗНЕСА (CHECKLIST) */}
      <section id="check" className="py-24 bg-slate-950 scroll-mt-20">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Памятка для бизнеса</h2>
               <p className="text-gray-400">Как оформить вывеску правильно: 3 шага</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
               {/* Шаг 1: Место */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
                     <MapPin className="w-20 h-20 text-blue-500"/>
                  </div>
                  <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold mb-6">ШАГ 1</div>
                  <h3 className="text-xl font-bold text-white mb-6">Место размещения</h3>
                  <ul className="space-y-4">
                     <li className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"/>
                        <span className="text-gray-400 text-sm"><strong>Информационное поле:</strong> Строго в отведенном паспортом фасада месте.</span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"/>
                        <span className="text-gray-400 text-sm"><strong>Входная группа:</strong> Над входом или сбоку от него (не далее пределов входа).</span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"/>
                        <span className="text-gray-400 text-sm"><strong>Боковые:</strong> Не более 40% от высоты двери.</span>
                     </li>
                  </ul>
               </div>

               {/* Шаг 2: Дизайн */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
                     <Layout className="w-20 h-20 text-green-500"/>
                  </div>
                  <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold mb-6">ШАГ 2</div>
                  <h3 className="text-xl font-bold text-white mb-6">Дизайн и Технологии</h3>
                  <div className="space-y-6">
                     <div>
                        <div className="flex items-center gap-2 text-green-500 font-bold mb-2"><CheckCircle className="w-5 h-5"/> РАЗРЕШЕНО</div>
                        <p className="text-gray-400 text-sm">Только отдельные объемные или плоские буквы без подложки.</p>
                     </div>
                     <div>
                        <div className="flex items-center gap-2 text-red-500 font-bold mb-2"><XCircle className="w-5 h-5"/> ЗАПРЕЩЕНО</div>
                        <p className="text-gray-400 text-sm">Баннерная ткань, сплошные световые короба (лайтбоксы) на фасаде.</p>
                     </div>
                     <div className="pt-4 border-t border-slate-800">
                        <p className="text-white text-xs font-bold">ВАЖНО: Текст обязательно на государственном языке.</p>
                     </div>
                  </div>
               </div>

               {/* Шаг 3: Размеры */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
                     <Ruler className="w-20 h-20 text-orange-500"/>
                  </div>
                  <div className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold mb-6">ШАГ 3</div>
                  <h3 className="text-xl font-bold text-white mb-6">Допустимые габариты</h3>
                  <div className="space-y-0 divide-y divide-slate-800">
                     {[
                        {f: "1–2 этажа", h: "до 0,80 м"},
                        {f: "3–5 этажей", h: "до 1,20 м"},
                        {f: "6–9 этажей", h: "до 1,80 м"},
                        {f: "10–15 этажей", h: "до 2,20 м"},
                        {f: "16+ этажей", h: "до 3,00 м"},
                     ].map((row, i) => (
                        <div key={i} className="flex justify-between py-2 text-sm">
                           <span className="text-gray-400">{row.f}</span>
                           <span className="text-white font-mono font-bold">{row.h}</span>
                        </div>
                     ))}
                  </div>
                  <p className="text-xs text-orange-500 mt-4 font-medium">
                     Макс. длина вывески — 30% от длины фасада (но не более 10м).
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 3. СТОП-ЛИСТ (ЗАПРЕТЫ) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
               <div className="h-px flex-1 bg-slate-800"></div>
               <h2 className="text-3xl font-bold text-white text-center"><span className="text-red-500">СТОП-ЛИСТ:</span> Как делать нельзя</h2>
               <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               {[
                  {t: "Вертикальное размещение", d: "Буквы нельзя писать столбиком или вешать вывеску вертикально."},
                  {t: "Перекрытие архитектуры", d: "Запрещено закрывать окна, карнизы, колонны и адресные таблички."},
                  {t: "Балконы и козырьки", d: "Нельзя вешать вывески на ограждениях балконов и лоджий."},
                  {t: "Выступ за фасад", d: "Конструкции не должны торчать из стены. Исключение — панель-кронштейны."},
                  {t: "Визуальный шум", d: "Запрещено нагромождение нескольких вывесок одного бренда у одного входа."},
                  {t: "Этика и цензура", d: "Никаких бранных слов и непристойных образов в рекламе."},
               ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-red-900/10 border border-red-900/30 rounded-xl hover:bg-red-900/20 transition">
                     <Ban className="w-8 h-8 text-red-500 flex-shrink-0"/>
                     <div>
                        <h4 className="text-white font-bold mb-1">{item.t}</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">{item.d}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. КАТАЛОГ ФОРМАТОВ (TABS) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Каталог форматов</h2>
            
            {/* Табы */}
            <div className="flex justify-center gap-2 mb-12">
               <button onClick={() => setActiveTab('ads')} className={`px-6 py-3 rounded-full font-bold text-sm transition ${activeTab === 'ads' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>Реклама</button>
               <button onClick={() => setActiveTab('trade')} className={`px-6 py-3 rounded-full font-bold text-sm transition ${activeTab === 'trade' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>Торговля</button>
               <button onClick={() => setActiveTab('urban')} className={`px-6 py-3 rounded-full font-bold text-sm transition ${activeTab === 'urban' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>Город</button>
            </div>

            {/* Контент табов */}
            <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {TAB_DATA[activeTab].map((item, i) => (
                  <div key={i} className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 flex gap-4 items-start">
                     <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">{item.i}</div>
                     <div><h4 className="text-white font-bold">{item.t}</h4><p className="text-gray-400 text-sm mt-1">{item.d}</p></div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. ТИПОЛОГИЯ АРХИТЕКТУРЫ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Типология архитектуры</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {[
                  {t: "Малоэтажные", d: "до 3 этажей"},
                  {t: "Среднеэтажные", d: "4–6 этажей"},
                  {t: "Высотные", d: "7+ этажей"},
                  {t: "ЖК с коммерцией", d: "1 этаж - магазины"},
                  {t: "Торговые центры", d: "ТРЦ и рынки"},
                  {t: "Бизнес-центры", d: "Офисы"},
               ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center hover:border-blue-500/30 transition">
                     <Building className="w-8 h-8 text-blue-500 mx-auto mb-3"/>
                     <div className="text-white font-bold text-sm">{item.t}</div>
                     <div className="text-gray-500 text-xs">{item.d}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
         <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Вопросы и ответы</h2>
            <div className="space-y-4">
               <details className="group bg-[#0F172A] rounded-2xl p-6 border border-slate-800 open:border-blue-500/30 transition">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-white">
                     Зачем нужен дизайн-код?
                     <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition"/>
                  </summary>
                  <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                     Чтобы сохранить архитектурный облик Астаны, сделать город удобным и визуально приятным для жителей и гостей.
                  </p>
               </details>
               <details className="group bg-[#0F172A] rounded-2xl p-6 border border-slate-800 open:border-blue-500/30 transition">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-white">
                     Для кого эти правила?
                     <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition"/>
                  </summary>
                  <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                     Они обязательны для всех: от мелких ИП до крупных корпораций и госучреждений, владеющих зданиями или вывесками в столице.
                  </p>
               </details>
               <details className="group bg-[#0F172A] rounded-2xl p-6 border border-slate-800 open:border-blue-500/30 transition">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-white">
                     Кто следит за соблюдением?
                     <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition"/>
                  </summary>
                  <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                     Администратор дизайн-кода. Проводятся мониторинг, фотофиксация нарушений и проверка обращений граждан.
                  </p>
               </details>
               <details className="group bg-[#0F172A] rounded-2xl p-6 border border-slate-800 open:border-blue-500/30 transition">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-white">
                     Что будет за нарушение?
                     <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition"/>
                  </summary>
                  <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                     За несоблюдение требований и искажение облика зданий предусмотрена ответственность по законам РК.
                  </p>
               </details>
            </div>
         </div>
      </section>

      {/* 7. ЛИД-МАГНИТ */}
      <CallToAction 
        source="Страница: Дизайн-код" 
        title="Сделаем вывеску в соответствии с Дизайн-кодом"
        subtitle="Оставьте заявку, мы бесплатно проверим ваш фасад, подготовим правильный эскиз и гарантируем прохождение согласования в Акимате."
        buttonText="Проверить фасад"
      />
      
      {/* 8. ДРУГИЕ УСЛУГИ */}
      <ServicesCarousel title="Наши услуги" subtitle="Производство по Дизайн-коду" />

      {/* 9. МОДАЛЬНОЕ ОКНО */}
      <ConsultationModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         source="Страница: Дизайн-код (Hero)"
      />

    </div>
  );
}