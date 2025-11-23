"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Info, CheckCircle, ArrowRight, Box, Settings, Phone, Ruler, Hammer, Truck } from "lucide-react";

// Импортируем UI компоненты
import { Slider } from "@/components/ui/slider";

// --- БАЗА ДАННЫХ ---
const PRICING = {
  letters: {
    types: {
      face: { price: 550, name: "Лицевая подсветка", desc: "Светится только лицо", image: "/images/calc/face.jpg" },
      full: { price: 1100, name: "Лицо + Борт (Премиум)", desc: "Максимальная яркость", image: "/images/calc/full.jpg" },
      back: { price: 600, name: "Контражур", desc: "Эффект парения", image: "/images/calc/back.jpg" },
      pvc_acryl: { price: 200, name: "Псевдообъем (Акрил)", desc: "Без подсветки", image: "/images/calc/acryl.jpg" },
    },
    highMountPrice: 40000 
  },
  lightbox: {
    types: {
      single: { price: 80000, name: "Односторонний", image: "/images/calc/lightbox-1.jpg" },
      double: { price: 110000, name: "Двусторонний", image: "/images/calc/lightbox-2.jpg" }
    },
    highMountPrice: 40000
  },
};

type TabType = 'letters' | 'lightbox';
type LetterType = keyof typeof PRICING.letters.types;
type LightboxType = keyof typeof PRICING.lightbox.types;

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<TabType>('letters');
  const [totalPriceRange, setTotalPriceRange] = useState<{min: number, max: number} | null>(null);

  // --- STATE ---
  const [letterParams, setLetterParams] = useState({
    type: 'face' as LetterType,
    mainText: "ADLIGHT", 
    mainHeight: 35, 
    subText: "",
    subHeight: 15,
    isHighMount: false
  });

  const [lightboxParams, setLightboxParams] = useState({
    widthM: 1, 
    heightM: 0.6, 
    type: 'single' as LightboxType,
    isHighMount: false
  });

  const countLetters = (str: string) => str.replace(/\s/g, '').length;

  // --- КАЛЬКУЛЯЦИЯ ---
  useEffect(() => {
    let basePrice = 0;

    if (activeTab === 'letters') {
      const pricePerCm = PRICING.letters.types[letterParams.type].price;
      const mainCount = countLetters(letterParams.mainText);
      const mainCost = (letterParams.mainHeight * pricePerCm) * mainCount;
      const subCount = countLetters(letterParams.subText);
      const subCost = (letterParams.subHeight * pricePerCm) * subCount;
      const mountCost = letterParams.isHighMount ? PRICING.letters.highMountPrice : 0;
      basePrice = mainCost + subCost + mountCost;
    } else if (activeTab === 'lightbox') {
      const area = lightboxParams.widthM * lightboxParams.heightM;
      const pricePerSqM = PRICING.lightbox.types[lightboxParams.type].price;
      const mountCost = lightboxParams.isHighMount ? PRICING.lightbox.highMountPrice : 0;
      basePrice = (area * pricePerSqM) + mountCost;
    }

    const round = (n: number) => Math.floor(n / 1000) * 1000;
    
    if (basePrice > 0) {
      setTotalPriceRange({ min: round(basePrice * 0.95), max: round(basePrice * 1.15) });
    } else {
      setTotalPriceRange(null);
    }
  }, [activeTab, letterParams, lightboxParams]);

  // --- ОТПРАВКА ---
  const handleOrder = () => {
    let text = "👋 Здравствуйте! Расчет с сайта ADLight:\n\n";

    if (activeTab === 'letters') {
      text += `🅰 *Тип:* ${PRICING.letters.types[letterParams.type].name}\n`;
      if (letterParams.mainText) text += `🔹 *Вывеска:* "${letterParams.mainText}" (${letterParams.mainHeight} см)\n`;
      if (letterParams.subText) text += `🔸 *Подпись:* "${letterParams.subText}" (${letterParams.subHeight} см)\n`;
      text += `🏗 *Монтаж:* ${letterParams.isHighMount ? "Автовышка (>5м)" : "Стандарт (<5м)"}\n`;
    } else if (activeTab === 'lightbox') {
      text += `💡 *Лайтбокс:* ${PRICING.lightbox.types[lightboxParams.type].name}\n`;
      text += `📏 *Размер:* ${lightboxParams.widthM} x ${lightboxParams.heightM} м\n`;
      text += `🏗 *Монтаж:* ${lightboxParams.isHighMount ? "Автовышка (>5м)" : "Стандарт (<5м)"}\n`;
    }

    if (totalPriceRange) {
      text += `\n💰 *Бюджет:* ${totalPriceRange.min.toLocaleString()} - ${totalPriceRange.max.toLocaleString()} ₸`;
    }
    
    window.open(`https://wa.me/77071356701?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleComplexOrder = () => {
    const text = "👋 Здравствуйте! Нужен индивидуальный расчет (Крупногабарит / Неон).";
    window.open(`https://wa.me/77071356701?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    // Добавил pb-32 (padding-bottom), чтобы контент не перекрывался мобильной плашкой
    <div className="min-h-screen bg-[#0F172A] pb-32 lg:pb-20 font-sans">
      
      {/* HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">На Главную</span>
          </Link>
          <div className="text-white font-bold text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-orange-500"/> Калькулятор стоимости
          </div>
          <div className="w-10 sm:w-20"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8 sm:pt-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Рассчитайте стоимость вывески онлайн</h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
             Введите название и размеры, и получите ориентировачную стоимость.<span className="text-orange-500"> <br></br>Просчет проекта под ключ и финальная стоимость будет только после бесплатного замера</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          
          {/* ЛЕВАЯ КОЛОНКА (Контроллеры) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ТАБЫ */}
            <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex">
              {(['letters', 'lightbox'] as TabType[]).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}>
                  {tab === 'letters' ? 'Объемные буквы' : 'Лайтбоксы'}
                </button>
              ))}
            </div>

            {/* ПРЕВЬЮ */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden aspect-video sm:aspect-[2/1] group shadow-2xl">
               {/* 1. Логика для БУКВ */}
               {activeTab === 'letters' && (
                 <>
                    {/* Картинка как фон (Заливка) */}
                    <img 
                      src={PRICING.letters.types[letterParams.type].image} 
                      alt={PRICING.letters.types[letterParams.type].name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        // Если картинки нет, показываем серый фон (чтобы не было битой иконки)
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    
                    {/* Градиент поверх картинки для читаемости текста */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90"></div>

                    {/* Текст поверх картинки */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                        <div className="relative z-10 animate-in slide-in-from-bottom-2 duration-500">
                           <div className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Выбранный тип</div>
                           <div className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
                              {PRICING.letters.types[letterParams.type].name}
                           </div>
                           <div className="text-gray-300 text-sm sm:text-base max-w-md">
                              {PRICING.letters.types[letterParams.type].desc}
                           </div>
                        </div>
                    </div>
                 </>
               )}

               {/* 2. Логика для ЛАЙТБОКСОВ */}
               {activeTab === 'lightbox' && (
                 <>
                    <img 
                      src={PRICING.lightbox.types[lightboxParams.type].image}
                      alt={PRICING.lightbox.types[lightboxParams.type].name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {e.currentTarget.style.display = 'none'}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                        <div className="relative z-10 animate-in slide-in-from-bottom-2 duration-500">
                           <div className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Тип лайтбокса</div>
                           <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                              {PRICING.lightbox.types[lightboxParams.type].name}
                           </div>
                        </div>
                    </div>
                 </>
               )}
            </div>

            {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
            <div className="bg-slate-900 p-5 sm:p-8 rounded-3xl border border-slate-800 space-y-8">
              
              {activeTab === 'letters' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  
                  {/* ТИП */}
                  <div>
                    <h3 className="text-white font-bold text-lg mb-4">1. Тип свечения</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(PRICING.letters.types).map(([key, val]) => (
                        <button key={key} onClick={() => setLetterParams({...letterParams, type: key as LetterType})} 
                            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${letterParams.type === key ? 'bg-slate-800 border-orange-500 ring-1 ring-orange-500' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'}`}>
                            <div className={`font-bold text-sm ${letterParams.type === key ? 'text-orange-500' : 'text-white'}`}>{val.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ПОЛЯ */}
                  <div className="space-y-6">
                    <h3 className="text-white font-bold text-lg">2. Размеры</h3>
                    
                    <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                        <label className="text-gray-400 text-xs font-bold uppercase mb-2 block">Вывеска</label>
                        <input type="text" placeholder="Например: ADLIGHT" value={letterParams.mainText} onChange={(e) => setLetterParams({...letterParams, mainText: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 mb-4 font-medium"/>
                        <div className="flex justify-between mb-2"><span className="text-sm text-gray-300">Высота букв</span><span className="text-orange-500 font-bold">{letterParams.mainHeight} см</span></div>
                        <Slider value={[letterParams.mainHeight]} onValueChange={(v) => setLetterParams({...letterParams, mainHeight: v[0]})} min={10} max={200} step={5} />
                    </div>

                    <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                        <label className="text-gray-400 text-xs font-bold uppercase mb-2 block">Подпись (опционально)</label>
                        <input type="text" placeholder="Деятельность" value={letterParams.subText} onChange={(e) => setLetterParams({...letterParams, subText: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 mb-4 text-sm"/>
                        <div className="flex justify-between mb-2"><span className="text-sm text-gray-300">Высота</span><span className="text-gray-300 font-bold">{letterParams.subHeight} см</span></div>
                        <Slider value={[letterParams.subHeight]} onValueChange={(v) => setLetterParams({...letterParams, subHeight: v[0]})} min={10} max={100} step={5} />
                    </div>
                  </div>

                  {/* МОНТАЖ */}
                  <div>
                    <h3 className="text-white font-bold text-lg mb-4">3. Монтаж</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setLetterParams({...letterParams, isHighMount: false})} className={`p-4 rounded-xl border text-left transition-all ${!letterParams.isHighMount ? 'bg-slate-800 border-green-500' : 'bg-slate-950/50 border-slate-800'}`}>
                           <div className="font-bold text-sm text-white">До 5м</div>
                           <div className="text-xs text-gray-500">Стандарт</div>
                        </button>
                        <button onClick={() => setLetterParams({...letterParams, isHighMount: true})} className={`p-4 rounded-xl border text-left transition-all ${letterParams.isHighMount ? 'bg-slate-800 border-orange-500' : 'bg-slate-950/50 border-slate-800'}`}>
                           <div className="font-bold text-sm text-white">Свыше 5м</div>
                           <div className="text-xs text-gray-500">Автовышка</div>
                        </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lightbox' && (
                <div className="space-y-8 animate-in fade-in">
                   <div className="grid grid-cols-2 gap-4">
                      {Object.entries(PRICING.lightbox.types).map(([key, val]) => (
                        <button key={key} onClick={() => setLightboxParams({...lightboxParams, type: key as LightboxType})} className={`p-4 rounded-xl border text-center transition-all ${lightboxParams.type === key ? 'bg-slate-800 border-orange-500' : 'bg-slate-950/50 border-slate-800'}`}>
                            <div className={`font-bold text-sm ${lightboxParams.type === key ? 'text-orange-500' : 'text-white'}`}>{val.name}</div>
                        </button>
                      ))}
                   </div>
                   <div className="space-y-6 p-4 bg-slate-950/30 rounded-xl border border-slate-800/50">
                      <div><div className="flex justify-between mb-4"><label className="text-white font-bold">Ширина (м)</label><span className="text-orange-500 font-bold">{lightboxParams.widthM}</span></div><Slider value={[lightboxParams.widthM]} onValueChange={(v) => setLightboxParams({...lightboxParams, widthM: v[0]})} min={0.5} max={6} step={0.1} /></div>
                      <div><div className="flex justify-between mb-4"><label className="text-white font-bold">Высота (м)</label><span className="text-orange-500 font-bold">{lightboxParams.heightM}</span></div><Slider value={[lightboxParams.heightM]} onValueChange={(v) => setLightboxParams({...lightboxParams, heightM: v[0]})} min={0.3} max={2} step={0.1} /></div>
                   </div>
                   <div>
                    <h3 className="text-white font-bold text-lg mb-4">Монтаж</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setLightboxParams({...lightboxParams, isHighMount: false})} className={`p-4 rounded-xl border text-left transition-all ${!lightboxParams.isHighMount ? 'bg-slate-800 border-green-500' : 'bg-slate-950/50 border-slate-800'}`}><div className="font-bold text-sm text-white">До 5м</div></button>
                        <button onClick={() => setLightboxParams({...lightboxParams, isHighMount: true})} className={`p-4 rounded-xl border text-left transition-all ${lightboxParams.isHighMount ? 'bg-slate-800 border-orange-500' : 'bg-slate-950/50 border-slate-800'}`}><div className="font-bold text-sm text-white">Свыше 5м</div></button>
                    </div>
                  </div>
                </div>
              )}

              {/* ИНДИВИДУАЛЬНЫЙ РАСЧЕТ */}
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 mt-6 space-y-4 relative overflow-hidden group">
                  {/* Декоративный фон (еле заметное свечение) */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-yellow-500/20 transition duration-700"></div>

                  <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                        <Settings className="w-6 h-6 text-yellow-500"/>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                        Масштабные проекты и <br className="hidden sm:block"/>Крышные установки
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                          Реализуем имиджевые конструкции любой сложности: расчет ветровых нагрузок, проектная документация и монтаж на любой высоте.
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleComplexOrder} 
                    className="w-full py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-500 shadow-lg"
                  >
                     Обсудить индивидуальный проект
                  </button>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА (ДЕСКТОП) - ВИДНА ТОЛЬКО НА LG */}
          <div className="hidden lg:col-span-1 lg:block">
            <div className="lg:sticky lg:top-24 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden self-start">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-orange-600/10 blur-[80px] rounded-full pointer-events-none"></div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Ориентировочная стоимость под ключ</h3>
                
                {totalPriceRange ? (
                  <div className="mb-6 relative z-10">
                    <div className="text-5xl font-black text-white leading-none mb-2 tracking-tight">
                       {totalPriceRange.min.toLocaleString()} <span className="text-2xl text-gray-500 font-normal">₸</span>
                    </div>
                    <div className="text-sm text-gray-400">до {totalPriceRange.max.toLocaleString()} ₸</div>
                  </div>
                ) : (
                   <div className="text-xl font-bold text-white mb-8 relative z-10">Параметры...</div>
                )}

                <div className="space-y-3 mb-8 relative z-10 pt-6 border-t border-slate-800">
                   <div className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle className="w-5 h-5 text-green-500"/> Согласование в акимате</div>
                   <div className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle className="w-5 h-5 text-green-500"/> Блок питания IP67</div>
                   <div className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle className="w-5 h-5 text-green-500"/> Гарантия 1 год</div>
                </div>

                <button onClick={handleOrder} className="w-full py-4 bg-orange-600 text-white font-bold text-lg rounded-xl hover:bg-orange-700 transition shadow-lg flex items-center justify-center gap-2 relative z-10">
                   Заказать <ArrowRight className="w-5 h-5"/>
                </button>
            </div>
          </div>

        </div>
        {/* --- НОВЫЙ БЛОК: ПОЧЕМУ ЭТО СТОИТ СВОИХ ДЕНЕГ --- */}
        <div className="mt-20 lg:mt-32 max-w-5xl mx-auto">
           <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Что входит в стоимость?</h2>
              <p className="text-gray-400">Мы не экономим на "начинке". Ваша вывеска будет гореть ярко минимум 3 года.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
              {/* Карточка 1 */}
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                     <Settings className="w-6 h-6 text-blue-500"/>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Светодиоды (Линзованные)</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Используем модули с линзой 160°. Это дает равномерную заливку без "пятен". Ресурс — 50 000 часов.
                  </p>
              </div>

              {/* Карточка 2 */}
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                     <Box className="w-6 h-6 text-orange-500"/>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Акрил Plexiglas</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Лицевая часть из заводского акрила, который не желтеет на солнце (в отличие от дешевого полистирола).
                  </p>
              </div>

              {/* Карточка 3 */}
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                     <CheckCircle className="w-6 h-6 text-green-500"/>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Блоки питания IP67</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Герметичные блоки питания с защитой от короткого замыкания. Не боятся дождя и снега.
                  </p>
              </div>
           </div>
        </div>

        {/* --- НОВЫЙ БЛОК: ВОПРОС-ОТВЕТ (FAQ) --- */}
        <div className="mt-20 max-w-3xl mx-auto pb-20">
           <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Частые вопросы</h2>
           
           <div className="space-y-4">
              {/* Вопрос 1 */}
              <details className="group bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-all duration-300 open:bg-slate-800">
                 <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-white font-medium hover:text-orange-500 transition">
                    <span>Как происходит оплата? Работаете с НДС?</span>
                    <span className="transition-transform group-open:rotate-180">
                       <ArrowRight className="w-5 h-5 rotate-90"/>
                    </span>
                 </summary>
                 <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                    Мы работаем официально. Для юрлиц выставляем счет (есть ТОО с НДС и без). Для физлиц — Kaspi QR, Kaspi Red/Kredit или наличные. Предоплата 50-70% перед началом работ.
                 </div>
              </details>

              {/* Вопрос 2 */}
              <details className="group bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-all duration-300 open:bg-slate-800">
                 <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-white font-medium hover:text-orange-500 transition">
                    <span>Нужно ли согласовывать вывеску с Акиматом?</span>
                    <span className="transition-transform group-open:rotate-180">
                       <ArrowRight className="w-5 h-5 rotate-90"/>
                    </span>
                 </summary>
                 <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                    Да, в Астане действует дизайн-код. Мы помогаем подготовить эскизный проект и подать его на согласование через E-Otinish, чтобы вашу вывеску не демонтировали.
                 </div>
              </details>

              {/* Вопрос 3 */}
              <details className="group bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-all duration-300 open:bg-slate-800">
                 <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-white font-medium hover:text-orange-500 transition">
                    <span>Какой срок изготовления?</span>
                    <span className="transition-transform group-open:rotate-180">
                       <ArrowRight className="w-5 h-5 rotate-90"/>
                    </span>
                 </summary>
                 <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                    Стандартный срок для объемных букв — 3-5 рабочих дней. Для крупных крышных установок сроки рассчитываются индивидуально (обычно 10-15 дней).
                 </div>
              </details>
           </div>
        </div>
      </main>

      {/* НИЖНЯЯ ПАНЕЛЬ (МОБИЛЬНАЯ) - ВИДНА ТОЛЬКО НА МОБИЛКАХ (< LG) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0F172A] border-t border-slate-800 p-4 z-50 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
         <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Итоговая смета</span>
               {totalPriceRange ? (
                  <div className="text-white font-black text-xl leading-none">
                     {totalPriceRange.min.toLocaleString()} <span className="text-sm text-gray-500 font-normal">₸</span>
                  </div>
               ) : (
                  <div className="text-gray-500 font-bold text-lg">---</div>
               )}
            </div>
            <button 
              onClick={handleOrder} 
              disabled={!totalPriceRange}
              className="bg-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-900/20"
            >
               Заказать
            </button>
         </div>
      </div>

    </div>
  );
}