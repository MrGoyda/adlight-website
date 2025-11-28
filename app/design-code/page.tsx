"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
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
  Download,
  Search,
  Layers,
  MessageCircle,
  Languages, // Иконка языка
  FileText,  // Иконка документа
  Copyright, // Иконка товарного знака
  Clock,     // Иконка часов
  Info       // Иконка инфо
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ConsultationModal from "@/components/ConsultationModal";

// Тип для табов
type TabType = 'ads' | 'trade' | 'urban';

// Данные для табов
const TAB_DATA = {
  ads: [
    { t: "Крышные установки", d: "Сложные конструкции (объемные буквы/панно), размещаемые строго на крыше зданий.", i: <Building className="w-6 h-6"/> },
    { t: "Брандмауэр", d: "Панно на глухой стене здания. Используется винил или баннерная сетка.", i: <Layers className="w-6 h-6"/> },
    { t: "Стела", d: "Отдельно стоящая конструкция на собственном фундаменте. Не более 2 сторон.", i: <MapPin className="w-6 h-6"/> },
    { t: "Билборд", d: "Щит размером от 2х3 м. Устанавливается вдоль улиц и дорог.", i: <Megaphone className="w-6 h-6"/> },
    { t: "Сити-формат", d: "Лайт-постер до 2.5 кв.м с внутренней подсветкой.", i: <Layout className="w-6 h-6"/> },
    { t: "Панель-кронштейн", d: "Плоская конструкция перпендикулярно фасаду. Допускается подсветка.", i: <Layout className="w-6 h-6"/> }, // Заменил Maximize на Layout, так как Maximize нет в импорте
    { t: "Штендер", d: "Выносная мобильная конструкция до 2 кв.м. Убирается в нерабочее время.", i: <Store className="w-6 h-6"/> },
  ],
  trade: [
    { t: "Киоск", d: "Сооружение без торгового зала, на 1-2 рабочих места.", i: <Store className="w-6 h-6"/> },
    { t: "Павильон", d: "Легкая конструкция с входом внутрь для покупателей.", i: <Store className="w-6 h-6"/> },
    { t: "Автолавка", d: "Специализированный автомобиль с торговым оборудованием.", i: <ArrowRight className="w-6 h-6"/> },
  ],
  urban: [
    { t: "Остановки", d: "Открытые и теплые павильоны закрытого типа для ожидания транспорта.", i: <Store className="w-6 h-6"/> },
    { t: "Информационные панели", d: "Электронные табло с навигацией, погодой и трафиком.", i: <MapPin className="w-6 h-6"/> },
    { t: "Скамьи", d: "Уличная мебель в едином архитектурном стиле.", i: <Armchair className="w-6 h-6"/> },
  ]
};

export default function DesignCodePage() {
  const [activeTab, setActiveTab] = useState<TabType>('ads');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      {/* 2. ТРИ ПУТИ СОГЛАСОВАНИЯ (НОВЫЙ БЛОК) */}
      <section id="check" className="py-24 bg-[#0B1120] scroll-mt-20 border-b border-slate-800">
         <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">3 способа узаконить название</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                   Есть только три официальных варианта согласования вывески с отделом языков. Выберите свой путь.
                </p>
             </div>

             <div className="grid lg:grid-cols-3 gap-8">
                
                {/* ВАРИАНТ 1: ПЕРЕВОД */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-green-500/30 transition duration-300">
                   <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500">
                      <Languages className="w-7 h-7"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-4">Перевод на казахский</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6 min-h-[60px]">
                      Прямой перевод названия или транслитерация. Самый простой и быстрый способ.
                      <br/><span className="text-slate-500 text-xs">Пример: "FastHelp" → "Жедел Көмек"</span>
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

                {/* ВАРИАНТ 2: ЮРИДИЧЕСКИЙ */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-blue-500/30 transition duration-300">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                      <FileText className="w-7 h-7"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-4">По документам</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6 min-h-[60px]">
                      Использование названия точь-в-точь как в свидетельстве о регистрации ТОО или ИП. Отдел языков не вправе требовать перевод.
                      <br/><span className="text-slate-500 text-xs">Пример: ТОО "FastHelp Group"</span>
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

                {/* ВАРИАНТ 3: ТОВАРНЫЙ ЗНАК */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-purple-500/30 transition duration-300">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500">
                      <Copyright className="w-7 h-7"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-4">Товарный знак (ТЗ)</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6 min-h-[60px]">
                      Регистрация бренда в Комитете интеллектуальной собственности. Дает право писать на любом языке (хоть на английском).
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
               {/* Шаг 1: Место */}
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
                        <span className="text-gray-400 text-sm"><strong>Входная группа:</strong> Над входом или сбоку от него (не далее пределов входа).</span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"/>
                        <span className="text-gray-400 text-sm"><strong>Боковые:</strong> Не более 40% от высоты двери.</span>
                     </li>
                  </ul>
               </div>

               {/* Шаг 2: Дизайн */}
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
                        <p className="text-gray-400 text-sm">Баннерная ткань, сплошные световые короба (лайтбоксы) на фасаде.</p>
                     </div>
                  </div>
               </div>

               {/* Шаг 3: Размеры */}
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

      {/* 4. СТОП-ЛИСТ (ЗАПРЕТЫ) */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
               <div className="h-px flex-1 bg-slate-800"></div>
               <h2 className="text-3xl font-bold text-white text-center"><span className="text-red-500">СТОП-ЛИСТ:</span> Как делать нельзя</h2>
               <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               {[
                  {t: "Вертикальное размещение", d: "Буквы нельзя писать столбиком (сверху вниз) или располагать вывеску вертикально."},
                  {t: "Перекрытие архитектуры", d: "Запрещено закрывать окна, витражи, декоративные элементы, карнизы и колонны."},
                  {t: "Балконы и козырьки", d: "Нельзя вешать конструкции на ограждениях балконов, лоджий и эркеров."},
                  {t: "Адресные таблички", d: "Вывеска не должна перекрывать аншлаги с названием улицы и номером дома."},
                  {t: "Выступ за фасад", d: "Конструкции не должны выступать за плоскость фасада (консольно). Исключение — панель-кронштейны."},
                  {t: "Жилые подъезды", d: "Запрещено размещение в пределах входов в жилые подъезды домов."},
                  {t: "Визуальный шум", d: "Более 1 вывески одного бренда на один вход запрещено."},
                  {t: "Искажение цвета", d: "Нельзя использовать подложку, цвет которой отличается от архитектурного облика здания."},
                  {t: "Без разрешения", d: "Размещение без согласия собственника здания категорически запрещено."},
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

      {/* 5. КАТАЛОГ ФОРМАТОВ (TABS) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Типы рекламных конструкций</h2>
            
            {/* Табы */}
            <div className="flex justify-center gap-2 mb-12 overflow-x-auto hide-scrollbar">
               <button onClick={() => setActiveTab('ads')} className={`shrink-0 px-6 py-3 rounded-full font-bold text-sm transition ${activeTab === 'ads' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>Реклама</button>
               <button onClick={() => setActiveTab('trade')} className={`shrink-0 px-6 py-3 rounded-full font-bold text-sm transition ${activeTab === 'trade' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>Торговля</button>
               <button onClick={() => setActiveTab('urban')} className={`shrink-0 px-6 py-3 rounded-full font-bold text-sm transition ${activeTab === 'urban' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>Городская среда</button>
            </div>

            {/* Контент табов */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {TAB_DATA[activeTab].map((item, i) => (
                  <div key={i} className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 flex gap-4 items-start hover:border-blue-500/30 transition">
                     <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">{item.i}</div>
                     <div><h4 className="text-white font-bold mb-1">{item.t}</h4><p className="text-gray-400 text-sm leading-relaxed">{item.d}</p></div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. ТИПОЛОГИЯ ЗДАНИЙ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Классификация зданий</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {[
                  {t: "Малоэтажные", d: "Административные до 3 этажей"},
                  {t: "Среднеэтажные", d: "Административные 4–6 этажей"},
                  {t: "Высотные", d: "Административные 7+ этажей"},
                  {t: "Многоквартирные", d: "Жилые дома без коммерции"},
                  {t: "ЖК с коммерцией", d: "Жилые дома с магазинами на 1 этаже"},
                  {t: "Торговые дома", d: "Рынки и ТЦ"},
               ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center hover:border-blue-500/30 transition">
                     <Building className="w-8 h-8 text-blue-500 mx-auto mb-3"/>
                     <div className="text-white font-bold text-sm mb-1">{item.t}</div>
                     <div className="text-gray-500 text-[10px] leading-tight">{item.d}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. FAQ */}
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

      {/* 8. ЛИД-МАГНИТ */}
      <CallToAction 
         source="Страница: Дизайн-код" 
         title="Сделаем вывеску строго по Дизайн-коду" 
         subtitle="Мы знаем все требования наизусть. Проверим ваш фасад, подготовим эскиз и гарантируем отсутствие штрафов."
         buttonText="Проверить вывеску"
      />

      {/* 9. ДРУГИЕ УСЛУГИ */}
      <ServicesCarousel title="Наши услуги" subtitle="Производство по Дизайн-коду" />

      {/* 10. МОДАЛЬНОЕ ОКНО */}
      <ConsultationModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         source="Страница: Дизайн-код (Hero)"
      />

    </div>
  );
}