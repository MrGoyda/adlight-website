"use client";

import { useState } from "react";
import { ShieldCheck, XCircle, Ruler } from "lucide-react";

interface CallToActionProps {
  source: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function CallToAction({ 
  source, 
  title = "Получите бесплатный дизайн-проект", 
  subtitle = "Оставьте контакты, и мы пришлём пример фотопривязки для вашей вывески.",
  buttonText = "Отправить"
}: CallToActionProps) {
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `👋 Заявка с сайта (ADLight)!\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}\n📍 Источник: ${source}`;
    window.open(`https://wa.me/77071356701?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- НОВАЯ УМНАЯ ПОДСВЕТКА ---
  const renderTitle = () => {
    // Список фраз для подсветки.
    // ВАЖНО: Сортируем их от длинных к коротким, чтобы части слов не заменялись раньше времени.
    const highlights = [
      "Дизайн-кодом", 
      "Дизайн-коду", 
      "Дизайн-код", 
      "Дизайн код",
      "дизайн-проект", 
      "бесплатно", 
      "подарок"
    ].sort((a, b) => b.length - a.length);
    
    let html = title;

    // Создаем единый шаблон поиска: (Слово1|Слово2|Слово3)
    // gi = global (все вхождения) + insensitive (без учета регистра)
    const regex = new RegExp(`(${highlights.join('|')})`, 'gi');
    
    // Оборачиваем найденное в цветной span
    html = html.replace(regex, '<span class="text-orange-500">$1</span>');

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <section data-aos="fade-up" className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-16 relative border border-slate-800 shadow-2xl shadow-black/50 overflow-hidden">
          <div className="absolute top-0 left-1/2 w-full h-full bg-orange-600/10 blur-[150px] -z-10 rounded-full pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            
            {/* УМНЫЙ ЗАГОЛОВОК */}
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              {renderTitle()}
            </h2>
            
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              {subtitle}
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mx-auto mb-6">
              <input 
                type="text" 
                placeholder="Ваше имя" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-5 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl placeholder:text-gray-500 focus:ring-2 focus:ring-orange-600 outline-none transition" 
                required
              />
              <input 
                type="tel" 
                placeholder="+7 (___) ___-__-__" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 px-5 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl placeholder:text-gray-500 focus:ring-2 focus:ring-orange-600 outline-none transition" 
                required
              />
              <button 
                type="submit" 
                className="h-auto px-8 py-3 bg-orange-600 text-white font-bold text-lg rounded-xl hover:bg-orange-700 transition active:scale-95 shadow-lg shadow-orange-900/30 whitespace-nowrap"
              >
                {buttonText}
              </button>
            </form>
            
            <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400"><ShieldCheck className="w-5 h-5 text-green-500"/> Гарантия по договору</div>
              <div className="flex items-center gap-2 text-gray-400"><XCircle className="w-5 h-5 text-red-500"/> Без спама и звонков</div>
              <div className="flex items-center gap-2 text-gray-400"><Ruler className="w-5 h-5 text-orange-500"/> Замер бесплатно</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}