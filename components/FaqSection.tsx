"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Сколько стоит вывеска?",
    a: "Стоимость зависит от технологии (световая/несветовая), размеров и сложности шрифта. Например, объемные буквы начинаются от 450 ₸/см высоты. Точную смету мы даем после бесплатного замера и создания макета."
  },
  {
    q: "Какие сроки изготовления?",
    a: "Стандартный срок — от 3 до 7 рабочих дней. Срочные заказы (например, к открытию магазина) можем выполнить за 24-48 часов при наличии технической возможности."
  },
  {
    q: "Нужно ли разрешение от Акимата?",
    a: "Да, для наружной рекламы нужен паспорт. Мы помогаем подготовить эскизный проект в соответствии с Дизайн-кодом Астаны, чтобы у вас не было проблем с законом."
  },
  {
    q: "Какую гарантию вы даете?",
    a: "Гарантия по договору — 12 месяцев на конструкцию и электрику (блоки питания, диоды). Мы используем влагозащищенные модули IP67, которые служат до 5 лет."
  },
  {
    q: "Выезжаете ли на замер?",
    a: "Да, выезд мастера на замер в пределах Астаны бесплатный. Мы привезем образцы материалов, чтобы вы могли выбрать цвет и фактуру вживую."
  }
];

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section data-aos="fade-up" className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800">
      {/* Фоновый блик */}
      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Частые вопросы</h2>
          <p className="text-gray-400">Отвечаем на то, что волнует вас больше всего</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((item, index) => (
            <div 
              key={index} 
              className={`group rounded-2xl transition-all duration-300 ${openFaq === index ? 'bg-slate-900 ring-1 ring-orange-500/30 shadow-2xl shadow-orange-900/10' : 'bg-slate-900/50 hover:bg-slate-900 border border-slate-800'}`}
            >
              <button 
                onClick={() => toggleFaq(index)} 
                className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
              >
                <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${openFaq === index ? 'text-orange-500' : 'text-white group-hover:text-orange-400'}`}>
                  {item.q}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === index ? 'bg-orange-500 text-white rotate-180' : 'bg-slate-800 text-gray-400 group-hover:bg-slate-700'}`}>
                  <ChevronDown className="w-6 h-6"/>
                </div>
              </button>
              
              <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="px-6 md:px-8 pb-8 text-gray-400 leading-relaxed text-base md:text-lg border-t border-slate-800/50 pt-4">
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}