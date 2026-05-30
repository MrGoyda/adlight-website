"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Shield, Coins, ChevronRight } from "lucide-react";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";

export default function ServicesBento() {
  // Получаем нужные услуги по их slugs для построения Bento-сетки
  const allItems = CATALOG_SERVICES.flatMap(group => group.items);

  const letters = allItems.find(i => i.link === "/services/volume-letters") || allItems[0];
  const lightboxes = allItems.find(i => i.link === "/services/lightboxes") || allItems[1];
  const neon = allItems.find(i => i.link === "/services/neon") || allItems[4];
  const carBranding = allItems.find(i => i.link === "/services/branding-cars") || allItems[8] || allItems[0];
  const interior = allItems.find(i => i.link === "/services/interior") || allItems[5];
  const console = allItems.find(i => i.link === "/services/panel-brackets") || allItems[2];
  const facade = allItems.find(i => i.link === "/services/facade-decoration") || allItems[3];

  return (
    <section className="py-20 lg:py-32 bg-[#080B11] border-t border-slate-900 relative overflow-hidden">
      {/* Изысканный градиент фона */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-orange-600/5 to-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Заголовок с LSI-ключами */}
        <div className="max-w-3xl mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-500 text-xs font-bold uppercase tracking-wider mb-6">
             Каталог рекламных конструкций
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none mb-6">
            Изготовление вывесок <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
              для любого бизнеса в Астане
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
            ADLight — рекламное агентство наружной рекламы со своим сборочным цехом. Мы создаем световые вывески, объемные буквы и лайтбоксы, которые на 100% соответствуют новому Дизайн-коду Акимата.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-stretch">
          
          {/* 1. ОБЪЕМНЫЕ БУКВЫ (Большая карточка 2x4 - Место 1) - md:col-span-3 md:row-span-2 */}
          <div 
            
            className="md:col-span-3 md:row-span-2 group relative rounded-3xl overflow-hidden border border-slate-900 hover:border-orange-500/35 bg-slate-950 flex flex-col justify-between p-8 min-h-[460px] transition-all duration-300 shadow-2xl hover:shadow-orange-950/10"
          >
             <div className="absolute inset-0 z-0">
                <Image 
                   src={letters.image}
                   alt="Изготовление объемных букв в Астане"
                   fill
                   className="object-cover opacity-35 group-hover:scale-[1.02] transition duration-700 pointer-events-none"
                   sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20"></div>
             </div>

             <div className="relative z-10 flex justify-between items-start">
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange-600/90 text-white uppercase tracking-wider shadow-lg">
                   {letters.tags[0]}
                </span>
                <span className="text-xs text-orange-400 font-extrabold flex items-center gap-1">
                   <Coins className="w-3.5 h-3.5"/> {letters.price}
                </span>
             </div>

             <div className="relative z-10 mt-auto pt-16">
                <h3 className="text-2xl md:text-3.5xl font-extrabold text-white mb-3 group-hover:text-orange-400 transition-colors">
                   {letters.title}
                </h3>
                <p className="text-slate-440 text-sm md:text-base leading-relaxed mb-6">
                   {letters.description} Все виды подсветки: цельноклееный акрил, классическое свечение, неон и изысканный контражур с гарантией 3 года.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                   <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800/80 px-2.5 py-1 rounded-md font-semibold">СНиП 2026</span>
                   <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800/80 px-2.5 py-1 rounded-md font-semibold">Samsung диоды</span>
                   <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800/80 px-2.5 py-1 rounded-md font-semibold">Влагозащита IP67</span>
                </div>
                <Link 
                   href={letters.link}
                   className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-950 font-extrabold text-sm rounded-xl hover:bg-slate-100 transition active:scale-98 shadow-xl"
                >
                   Подробнее об объемных буквах <ArrowUpRight className="w-4 h-4 text-orange-500"/>
                </Link>
             </div>
          </div>

          {/* 2. СВЕТОВЫЕ КОРОБА / ЛАЙТБОКСЫ (md:col-span-3) */}
          <div 
            
           
            className="md:col-span-3 group relative rounded-3xl overflow-hidden border border-slate-900 hover:border-blue-500/35 bg-slate-950 flex flex-col justify-between p-6 md:p-8 min-h-[250px] transition-all duration-300 shadow-xl"
          >
             <div className="absolute inset-0 z-0">
                <Image 
                   src={lightboxes.image}
                   alt="Световые короба и лайтбоксы Астана"
                   fill
                   className="object-cover opacity-30 group-hover:scale-105 transition duration-700 pointer-events-none"
                   sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
             </div>

             <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-600/90 text-white uppercase tracking-wider">
                   {lightboxes.tags[0]}
                </span>
                <span className="text-xs text-blue-400 font-extrabold">
                   {lightboxes.price}
                </span>
             </div>

             <div className="relative z-10 mt-auto">
                <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2 group-hover:text-blue-400 transition-colors">
                   {lightboxes.title}
                </h3>
                <p className="text-slate-450 text-xs md:text-sm leading-relaxed mb-4 max-w-xl">
                   {lightboxes.description} Изготовление фигурных лайтбоксов и композитных коробов с инкрустацией. Идеально для круглосуточного привлечения клиентов.
                </p>
                <Link href={lightboxes.link} className="text-white hover:text-blue-400 font-bold text-xs flex items-center gap-1 transition-colors">
                   Перейти к коробам <ChevronRight className="w-3.5 h-3.5"/>
                </Link>
             </div>
          </div>

          {/* 3. НЕОНОВЫЕ ВЫВЕСКИ (md:col-span-2) */}
          <div 
            
           
            className="md:col-span-2 group relative rounded-3xl overflow-hidden border border-slate-900 hover:border-pink-500/35 bg-slate-950 flex flex-col justify-between p-6 min-h-[220px] transition-all duration-300 shadow-xl"
          >
             <div className="absolute inset-0 z-0">
                <Image 
                   src={neon.image}
                   alt="Неоновые вывески Астана"
                   fill
                   className="object-cover opacity-25 group-hover:scale-105 transition duration-700 pointer-events-none"
                   sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
             </div>

             <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-600/90 text-white uppercase tracking-wider">
                   {neon.tags[0]}
                </span>
             </div>

             <div className="relative z-10 mt-auto">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
                   {neon.title}
                </h3>
                <p className="text-slate-450 text-[11px] leading-relaxed mb-3">
                   {neon.description} Гибкий неон 12V для интерьеров, студий и ярких инстаграм-фотозон.
                </p>
                <Link href={neon.link} className="text-white hover:text-pink-400 font-bold text-[11px] flex items-center gap-1 transition-colors">
                   Подробнее <ChevronRight className="w-3.5 h-3.5"/>
                </Link>
             </div>
          </div>

          {/* 4. ОФОРМЛЕНИЕ ФАСАДОВ (md:col-span-2) */}
          <div 
            
           
            className="md:col-span-2 group relative rounded-3xl overflow-hidden border border-slate-900 hover:border-green-500/35 bg-slate-950 flex flex-col justify-between p-6 min-h-[220px] transition-all duration-300 shadow-xl"
          >
             <div className="absolute inset-0 z-0">
                <Image 
                   src={facade.image}
                   alt="Оформление фасадов композитом Астана"
                   fill
                   className="object-cover opacity-25 group-hover:scale-105 transition duration-700 pointer-events-none"
                   sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
             </div>

             <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-green-600/90 text-white uppercase tracking-wider rounded">
                   {facade.tags[0]}
                </span>
                <span className="text-[10px] text-green-400 font-bold">
                   {facade.price}
                </span>
             </div>

             <div className="relative z-10 mt-auto">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                   {facade.title}
                </h3>
                <p className="text-slate-450 text-[11px] leading-relaxed mb-3">
                   Облицовка фасадов алюкобондом и керамогранитом под ключ. Монтаж подсистемы, утепление.
                </p>
                <Link href={facade.link} className="text-white hover:text-green-400 font-bold text-[11px] flex items-center gap-1 transition-colors">
                   Подробнее <ChevronRight className="w-3.5 h-3.5"/>
                </Link>
             </div>
          </div>

          {/* 5. ИНТЕРЬЕРНЫЕ ЛОГОТИПЫ (md:col-span-2) */}
          <div 
            
           
            className="md:col-span-2 group relative rounded-3xl overflow-hidden border border-slate-900 hover:border-purple-500/35 bg-slate-950 flex flex-col justify-between p-6 min-h-[220px] transition-all duration-300 shadow-xl"
          >
             <div className="absolute inset-0 z-0">
                <Image 
                   src={interior.image}
                   alt="Интерьерный логотип в офис Астана"
                   fill
                   className="object-cover opacity-25 group-hover:scale-105 transition duration-700 pointer-events-none"
                   sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
             </div>

             <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-600/90 text-white uppercase tracking-wider rounded">
                   {interior.tags[0]}
                </span>
                <span className="text-[10px] text-purple-400 font-bold">
                   {interior.price}
                </span>
             </div>

             <div className="relative z-10 mt-auto">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                   {interior.title}
                </h3>
                <p className="text-slate-450 text-[11px] leading-relaxed mb-3">
                   {interior.description} Премиальный тонкий акрил, шлифованный металл и контражур на ресепшн.
                </p>
                <Link href={interior.link} className="text-white hover:text-purple-400 font-bold text-[11px] flex items-center gap-1 transition-colors">
                   Подробнее <ChevronRight className="w-3.5 h-3.5"/>
                </Link>
             </div>
          </div>

          {/* 6. БРЕНДИРОВАНИЕ АВТО (md:col-span-3) */}
          <div 
            
           
            className="md:col-span-3 group relative rounded-3xl overflow-hidden border border-slate-900 hover:border-yellow-500/35 bg-slate-950 flex flex-col justify-between p-6 md:p-8 min-h-[250px] transition-all duration-300 shadow-xl"
          >
             <div className="absolute inset-0 z-0">
                <Image 
                   src={carBranding.image}
                   alt="Брендирование автомобилей Астана"
                   fill
                   className="object-cover opacity-25 group-hover:scale-105 transition duration-700 pointer-events-none"
                   sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
             </div>

             <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-yellow-600/90 text-white uppercase tracking-wider">
                   {carBranding.tags[0]}
                </span>
                <span className="text-xs text-yellow-400 font-bold">
                   {carBranding.price}
                </span>
             </div>

             <div className="relative z-10 mt-auto">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                   {carBranding.title}
                </h3>
                <p className="text-slate-450 text-xs md:text-sm leading-relaxed mb-4">
                   {carBranding.description} Оклейка коммерческого транспорта износостойкой пленкой KPMF с ламинацией. Мобильная реклама, которая работает на вас круглые сутки.
                </p>
                <Link href={carBranding.link} className="text-white hover:text-yellow-400 font-bold text-xs flex items-center gap-1 transition-colors">
                   Смотреть автооклейку <ChevronRight className="w-3.5 h-3.5"/>
                </Link>
             </div>
          </div>

          {/* 7. КОНСОЛЬНЫЕ ВЫВЕСКИ И ПАНЕЛЬ-КРОНШТЕЙНЫ (md:col-span-3) */}
          <div 
            
           
            className="md:col-span-3 group relative rounded-3xl overflow-hidden border border-slate-900 hover:border-orange-500/35 bg-slate-950 flex flex-col justify-between p-6 md:p-8 min-h-[250px] transition-all duration-300 shadow-xl"
          >
             <div className="absolute inset-0 z-0">
                <Image 
                   src={console.image}
                   alt="Круглые вывески и панель кронштейны в Астане"
                   fill
                   className="object-cover opacity-25 group-hover:scale-105 transition duration-700 pointer-events-none"
                   sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
             </div>

             <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-orange-600/90 text-white uppercase tracking-wider">
                   {console.tags[0]}
                </span>
                <span className="text-xs text-orange-400 font-bold">
                   {console.price}
                </span>
             </div>

             <div className="relative z-10 mt-auto">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                   {console.title}
                </h3>
                <p className="text-slate-450 text-xs md:text-sm leading-relaxed mb-4">
                   {console.description} Торцевые двусторонние круглые и фигурные вывески для охвата пешеходного трафика. Компактное и яркое решение.
                </p>
                <Link href={console.link} className="text-white hover:text-orange-400 font-bold text-xs flex items-center gap-1 transition-colors">
                   Подробнее о консолях <ChevronRight className="w-3.5 h-3.5"/>
                </Link>
             </div>
          </div>

        </div>

        {/* Все услуги */}
        <div className="mt-16 text-center">
           <Link 
              href="/services" 
              className="inline-flex items-center gap-2.5 px-8 py-5 bg-[#0F172A] border border-slate-800 rounded-full text-white hover:bg-slate-900 transition-all font-bold group"
           >
              Посмотреть все 15 услуг компании
              <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform"/>
           </Link>
        </div>

      </div>
    </section>
  );
}
