"use client";

import { useState } from "react";
import { Building, Layers, MapPin, Megaphone, Layout, Store, ArrowRight, Armchair } from "lucide-react";

type TabType = 'ads' | 'trade' | 'urban';

const TAB_DATA = {
  ads: [
    { t: "Крышные установки", d: "Сложные конструкции (объемные буквы/панно), размещаемые строго на крыше зданий.", i: <Building className="w-6 h-6"/> },
    { t: "Брандмауэр", d: "Панно на глухой стене здания. Используется винил или баннерная сетка.", i: <Layers className="w-6 h-6"/> },
    { t: "Стела", d: "Отдельно стоящая конструкция на собственном фундаменте. Не более 2 сторон.", i: <MapPin className="w-6 h-6"/> },
    { t: "Билборд", d: "Щит размером от 2х3 м. Устанавливается вдоль улиц и дорог.", i: <Megaphone className="w-6 h-6"/> },
    { t: "Сити-формат", d: "Лайт-постер до 2.5 кв.м с внутренней подсветкой.", i: <Layout className="w-6 h-6"/> },
    { t: "Панель-кронштейн", d: "Плоская конструкция перпендикулярно фасаду. Допускается подсветка.", i: <Layout className="w-6 h-6"/> },
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

export default function DesignCodeTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('ads');

  return (
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
  );
}