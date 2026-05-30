"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image"; 
import { 
  Calculator, 
  Type, 
  Box,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Settings,
  Languages,
  ImageIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";

// --- БАЗОВЫЕ СТАВКИ (Тенге) ---
const PRICES = {
  letters: {
    'face-lit': 550,
    'full-lit': 850,
    'back-lit': 650,
    'combo-lit': 950,
    'side-lit': 700,
    'perforated': 750,
    'acrylic-slim': 1000,
    'pixel-led': 1000,
    'loft-lamps': 1200,
    'wood-style': 350,
    'day-night-effect': 700,
    'non-lit': 200,
  },
  lightboxes: {
    'acrylic': 80000,
    'banner': 90000,
    'composite': 120000,
    'figured': 80000,
  }
};

// --- КАТАЛОГ ТИПОВ ---
const LETTER_TYPES = [
  { id: 'face-lit', name: 'Световое лицо', desc: 'Классика. Самый популярный выбор.', image: '/images/letters/face-lit-night.webp' },
  { id: 'full-lit', name: 'Полное свечение', desc: 'Светятся лицо и борта (360°).', image: '/images/letters/full-lit-night.webp' },
  { id: 'back-lit', name: 'Контражур', desc: 'Эффект парения, ореол на стену.', image: '/images/letters/back-lit-night.webp' },
  { id: 'combo-lit', name: 'Комбо (Лицо+Бэк)', desc: 'Максимальная яркость и премиальность.', image: '/images/letters/combo-lit-night.webp' },
  { id: 'side-lit', name: 'Светятся борта', desc: 'Строгий стиль. Лицо темное.', image: '/images/letters/side-lit-night.webp' },
  { id: 'acrylic-slim', name: 'Цельноклееный акрил', desc: 'Бесшовный, монолитный и яркий.', image: '/images/letters/acrylic-slim-night.webp' },

  { id: 'perforated', name: 'Перфорация', desc: 'Эффект "бриллиантового" мерцания.', image: '/images/letters/perforated-night.webp' },
  { id: 'day-night-effect', name: 'День / Ночь', desc: 'Черные днем, белые ночью.', image: '/images/letters/day-night-effect-night.webp' },
  { id: 'pixel-led', name: 'Пиксельные', desc: 'Открытые диоды. Очень ярко.', image: '/images/letters/pixel-led-night.webp' },
  { id: 'loft-lamps', name: 'Ретро (Лофт)', desc: 'С лампами накаливания.', image: '/images/letters/loft-lamps-night.webp' },
  { id: 'wood-style', name: 'Эко / Дерево', desc: 'Натуральные материалы.', image: '/images/letters/wood-style-night.webp' },
  { id: 'non-lit', name: 'Без подсветки', desc: 'Бюджетно. ПВХ или Акрил.', image: '/images/letters/non-lit-day.webp' },
];

const BOX_TYPES = [
  { id: 'acrylic', name: 'Акриловый короб', desc: 'Глянцевый, до 3 метров.', image: '/images/lightboxes/lightboxes-08.webp' },
  { id: 'banner', name: 'Баннерный короб', desc: 'Любой размер без стыков.', image: '/images/lightboxes/lightboxes-12.webp' },
  { id: 'composite', name: 'Композитный', desc: 'Светятся только прорезные буквы.', image: '/images/lightboxes/lightboxes-13.webp' },
  { id: 'figured', name: 'Фигурный', desc: 'Логотип любой формы.', image: '/images/lightboxes/lightboxes-02.webp' },
];

type CalculatorTab = 'letters' | 'lightbox';

export default function CalculatorPage() {
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState<CalculatorTab>('letters');

  const [titleText, setTitleText] = useState("ADLight");
  const [subTextRu, setSubTextRu] = useState("");
  const [subTextKz, setSubTextKz] = useState("");
  const [height, setHeight] = useState(30);
  const [subHeight, setSubHeight] = useState(15);
  const [letterType, setLetterType] = useState('face-lit');

  const [boxWidth, setBoxWidth] = useState(200);
  const [boxHeight, setBoxHeight] = useState(50);
  const [boxType, setBoxType] = useState('acrylic');

  const calculation = useMemo(() => {
    let basePrice = 0;
    let details = "";

    if (activeTab === 'letters') {
       const countTitle = titleText.replace(/\s/g, '').length;
       const countRu = subTextRu.replace(/\s/g, '').length;
       const countKz = subTextKz.replace(/\s/g, '').length;
       const pricePerCm = PRICES.letters[letterType as keyof typeof PRICES.letters] || 450;
       
       const costTitle = height * countTitle * pricePerCm;
       const costSubs = subHeight * (countRu + countKz) * pricePerCm;

       basePrice = costTitle + costSubs;
       details = `${countTitle} букв (${height}см) + ${countRu + countKz} букв (${subHeight}см). Тип: ${LETTER_TYPES.find(t=>t.id===letterType)?.name}`;
    } 
    else {
       const area = (boxWidth * boxHeight) / 10000;
       const pricePerM2 = PRICES.lightboxes[boxType as keyof typeof PRICES.lightboxes];
       const finalArea = area < 0.5 ? 0.5 : area;
       
       basePrice = finalArea * pricePerM2;
       details = `Размер ${boxWidth}x${boxHeight} см (${finalArea.toFixed(2)} м²). Тип: ${BOX_TYPES.find(t=>t.id===boxType)?.name}`;
    }

    basePrice = Math.ceil(basePrice / 100) * 100;
    const min = Math.round(basePrice * 0.8);
    const max = Math.round(basePrice * 1.2);

    return { min, max, details, basePrice };
  }, [activeTab, titleText, subTextRu, subTextKz, height, subHeight, letterType, boxWidth, boxHeight, boxType]);

  const whatsappLink = useMemo(() => {
     let content = "";
     if (activeTab === 'letters') {
       content = `🔠 *Текст:* ${titleText || '-'}\n📏 *Высота:* ${height} см\n\n📝 *Подпись RU:* ${subTextRu || '-'}\n📝 *Подпись KZ:* ${subTextKz || '-'}\n📏 *Высота подписи:* ${subHeight} см\n\n💡 *Тип:* ${LETTER_TYPES.find(t=>t.id===letterType)?.name}`;
     } else {
       content = `📦 *Тип:* ${BOX_TYPES.find(t=>t.id===boxType)?.name}\n📏 *Размер:* ${boxWidth}x${boxHeight} см`;
     }
     const message = `👋 Здравствуйте! Расчет с сайта:\n\n${content}\n\n💰 *Бюджет:* ${calculation.min.toLocaleString()} - ${calculation.max.toLocaleString()} ₸\n\nИнтересуют точные сроки и замер.`;
     return `https://wa.me/77071356701?text=${encodeURIComponent(message)}`;
  }, [calculation, activeTab, titleText, subTextRu, subTextKz, height, subHeight, letterType, boxWidth, boxHeight, boxType]);

  const selectedType = activeTab === 'letters' 
    ? LETTER_TYPES.find(t => t.id === letterType) 
    : BOX_TYPES.find(t => t.id === boxType);

  // SCHEMA.ORG для WebApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Калькулятор наружной рекламы ADLight",
    "description": "Интерактивный онлайн калькулятор для расчета ориентировочной стоимости световых вывесок, объемных букв и лайтбоксов в Астане.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "KZT"
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] font-sans pb-12">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button 
               onClick={() => router.back()} 
               className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
               aria-label="Вернуться назад"
            >
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/> 
               <span className="hidden sm:inline font-medium">Назад</span>
            </button>
            
            <Typography variant="h4" className="font-bold text-lg">Калькулятор вывески</Typography>
            
            <div className="w-20 flex justify-end"></div>
         </div>
      </header>

      <div className="container mx-auto px-4 py-8">
         <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-6">
               {/* 1. ВЫБОР РЕЖИМА */}
               <Card rounded="xl" className="p-1.5 border border-slate-800 flex gap-2">
                  <Button 
                    type="button"
                    onClick={() => setActiveTab('letters')} 
                    variant={activeTab === 'letters' ? 'solid' : 'ghost'}
                    className={cn(
                      "flex-1 py-3 h-12 text-sm font-bold flex items-center justify-center gap-2 border-transparent focus:ring-0 active:scale-100",
                      activeTab === 'letters' ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    )}
                    leftIcon={<Type className="w-4 h-4"/>}
                  >
                    Объемные буквы
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setActiveTab('lightbox')} 
                    variant={activeTab === 'lightbox' ? 'solid' : 'ghost'}
                    className={cn(
                      "flex-1 py-3 h-12 text-sm font-bold flex items-center justify-center gap-2 border-transparent focus:ring-0 active:scale-100",
                      activeTab === 'lightbox' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-950/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    )}
                    leftIcon={<Box className="w-4 h-4"/>}
                  >
                    Лайтбокс
                  </Button>
               </Card>

               {/* 2. ВЫБОР ТИПА */}
               <Card rounded="2xl" className="p-6 border border-slate-800/80 bg-slate-900/40">
                  <div className="flex justify-between items-center mb-6">
                     <Typography variant="h4" className="flex items-center gap-2 text-lg">
                        <Settings className="w-5 h-5 text-slate-500"/> Выберите технологию
                     </Typography>
                     <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-800/50">Скролл →</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-950/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700 transition-colors">
                     {(activeTab === 'letters' ? LETTER_TYPES : BOX_TYPES).map(t => {
                        const isSelected = (activeTab === 'letters' ? letterType : boxType) === t.id;
                        return (
                          <button 
                             key={t.id} 
                             type="button"
                             onClick={() => activeTab === 'letters' ? setLetterType(t.id) : setBoxType(t.id)}
                             className={cn(
                               "relative group flex flex-col text-left rounded-xl overflow-hidden border transition-all h-28 shrink-0 active:scale-[0.98]",
                               isSelected 
                                 ? 'border-orange-500 ring-2 ring-orange-500/30' 
                                 : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
                             )}
                          >
                             <div className="absolute inset-0 bg-slate-900">
                               <Image 
                                 src={t.image} 
                                 alt={t.name} 
                                 fill 
                                 className="object-cover opacity-40 group-hover:opacity-60 transition duration-500"
                                 onError={(e) => {e.currentTarget.src = "/images/calc/face.jpg"}}
                                 sizes="(max-width: 640px) 50vw, 33vw"
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                             </div>
                             
                             <div className="relative z-10 mt-auto p-3 w-full">
                               <div className="text-xs font-bold text-white leading-tight mb-0.5">{t.name}</div>
                               <div className="text-[10px] text-gray-400 leading-tight line-clamp-1">{t.desc}</div>
                             </div>
                             
                             {isSelected && (
                                <div className="absolute top-2 right-2 z-20 bg-orange-500 rounded-full p-0.5 shadow-lg shadow-orange-950/50">
                                  <CheckCircle className="w-3 h-3 text-white"/>
                                </div>
                             )}
                          </button>
                        );
                     })}
                  </div>
               </Card>

               {/* 3. ПАРАМЕТРЫ */}
               <Card rounded="2xl" className="p-6 border border-slate-800/80 bg-slate-900/40">
                  <Typography variant="h4" className="mb-6 flex items-center gap-2 text-lg">
                     <Calculator className="w-5 h-5 text-slate-500"/> Размеры и Текст
                  </Typography>
                  
                  {activeTab === 'letters' ? (
                    <div className="space-y-6">
                       <div>
                          <Input 
                             label="Главная надпись"
                             id="calc-main-text"
                             name="mainText"
                             autoComplete="off"
                             value={titleText} 
                             onChange={(e) => setTitleText(e.target.value)}
                             placeholder="Например: ADLight"
                             required
                          />
                       </div>

                       <div>
                          <div className="flex justify-between mb-2">
                             <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Высота букв</span>
                             <span className="text-sm text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/10">{height} см</span>
                          </div>
                          <input 
                             id="calc-height-range"
                             name="heightRange"
                             type="range" 
                             min="10" 
                             max="210" 
                             step="1" 
                             value={height}
                             onChange={(e) => setHeight(Number(e.target.value))}
                             className="w-full accent-orange-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer border border-slate-850"
                          />
                          <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                             <span>10 см</span>
                             <span>210 см</span>
                          </div>
                       </div>

                       <div className="pt-6 border-t border-slate-800">
                          <div className="flex items-center gap-2 mb-4">
                             <Languages className="w-4 h-4 text-slate-500"/>
                             <span className="text-xs font-bold text-white uppercase tracking-wider">Подписи (RU / KZ)</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                             <div>
                                <Input 
                                   label="Подпись RU"
                                   id="calc-sub-ru"
                                   name="subRu"
                                   autoComplete="off"
                                   value={subTextRu} 
                                   onChange={(e) => setSubTextRu(e.target.value)}
                                   placeholder="Магазин"
                                />
                             </div>
                             <div>
                                <Input 
                                   label="Подпись KZ"
                                   id="calc-sub-kz"
                                   name="subKz"
                                   autoComplete="off"
                                   value={subTextKz} 
                                   onChange={(e) => setSubTextKz(e.target.value)}
                                   placeholder="Дүкені"
                                />
                             </div>
                          </div>

                          <div>
                             <div className="flex justify-between mb-2">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Высота подписи</span>
                                <span className="text-xs text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10">{subHeight} см</span>
                             </div>
                             <input 
                                id="calc-sub-height"
                                name="subHeightRange"
                                type="range" 
                                min="5" 
                                max="150" 
                                step="1" 
                                value={subHeight}
                                onChange={(e) => setSubHeight(Number(e.target.value))}
                                className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer border border-slate-850"
                             />
                          </div>
                       </div>
                    </div>
                  ) : (
                     <div className="space-y-6">
                        <div>
                           <div className="flex justify-between mb-2">
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ширина (см)</span>
                              <span className="text-sm text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10">{boxWidth} см</span>
                           </div>
                           <input 
                              id="calc-box-width"
                              name="boxWidth"
                              type="range" 
                              min="50" max="600" step="5"
                              value={boxWidth} onChange={(e) => setBoxWidth(Number(e.target.value))}
                              className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer border border-slate-850"
                           />
                        </div>
                        <div>
                           <div className="flex justify-between mb-2">
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Высота (см)</span>
                              <span className="text-sm text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10">{boxHeight} см</span>
                           </div>
                           <input 
                              id="calc-box-height"
                              name="boxHeight"
                              type="range" 
                              min="30" max="200" step="5"
                              value={boxHeight} onChange={(e) => setBoxHeight(Number(e.target.value))}
                              className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer border border-slate-850"
                           />
                        </div>
                     </div>
                  )}
               </Card>
            </div>

            {/* ПРАВАЯ КОЛОНКА */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
               <Card rounded="2xl" className="border border-slate-700 shadow-2xl relative aspect-video group bg-black">
                  {selectedType && (
                     <Image 
                        src={selectedType.image}
                        alt={selectedType.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-90 transition duration-500"
                        onError={(e) => {e.currentTarget.src = "/images/calc/face.jpg"}}
                        sizes="(max-width: 768px) 100vw, 50vw"
                     />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                     <Typography variant="caption" className="text-orange-400 font-bold mb-1">
                        Выбрано:
                     </Typography>
                     <Typography variant="h3" className="text-xl md:text-2xl font-bold mb-2">
                        {selectedType?.name}
                     </Typography>
                     <Typography variant="body" className="text-sm text-gray-400 line-clamp-2">
                        {selectedType?.desc}
                     </Typography>
                  </div>

                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2">
                     <ImageIcon className="w-4 h-4 text-white"/>
                     <span className="text-xs text-white font-medium">Пример</span>
                  </div>
               </Card>

               <Card glass intensity="heavy" rounded="2xl" className="p-6 border border-slate-700 shadow-xl bg-slate-900/80">
                  <div className="flex items-start gap-4 mb-6">
                     <div className="p-3 bg-green-500/10 rounded-full text-green-500 border border-green-500/20 mt-1">
                        <CheckCircle className="w-6 h-6"/>
                     </div>
                     <div>
                        <Typography variant="caption" className="text-slate-400 font-bold mb-1">
                           Предварительный расчет
                        </Typography>
                        <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black text-white tracking-tight">
                              {calculation.min.toLocaleString()} 
                           </span>
                           <span className="text-lg text-slate-500 font-medium">–</span>
                           <span className="text-3xl font-black text-white tracking-tight">
                              {calculation.max.toLocaleString()}
                           </span>
                           <span className="text-xl text-slate-500 font-bold">₸</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                           <AlertCircle className="w-3 h-3 text-orange-500"/> Цена может измениться после замера
                        </p>
                     </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-700/50">
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Изготовление:</span>
                        <span className="text-white font-medium">3-5 дней</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Макет и замер:</span>
                        <span className="text-green-400 font-bold">Бесплатно (0 ₸)</span>
                     </div>
                  </div>

                  <Button 
                     href={whatsappLink} 
                     variant="solid"
                     size="lg"
                     className="mt-8 w-full py-4 bg-[#25D366] hover:bg-[#20b858] border-transparent text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                     leftIcon={<MessageCircle className="w-5 h-5"/>}
                  >
                     Заказать этот расчет
                  </Button>
                  <p className="text-center text-[10px] text-slate-500 mt-3">
                     Менеджер ответит в WhatsApp и уточнит детали
                  </p>
               </Card>
            </div>

         </div>
      </div>
    </div>
  );
}