"use client";

import { useState } from "react";
import { Check, Info } from "lucide-react";

export default function Calculator() {
  // 1. Переменные (Состояние)
  const [height, setHeight] = useState(30);
  const [letters, setLetters] = useState(5);
  const [type, setType] = useState("simple");
  const [isAluminum, setIsAluminum] = useState(false);
  const [isHighMontage, setIsHighMontage] = useState(false);

  // 2. Логика расчета (считаем прямо при рендере)
  let basePrice = 400;

  switch (type) {
    case "flat": basePrice = 200; break;    // Плоские
    case "simple": basePrice = 400; break;  // Простые
    case "complex": basePrice = 500; break; // С засечками
    case "backlit": basePrice = 450; break; // Контражур
  }

  if (isAluminum) basePrice += 200; // Наценка за борт

  let total = basePrice * height * letters;
  
  if (isHighMontage) total += 25000; // Автовышка

  // 3. Верстка
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6">Рассчитать вывеску</h3>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* ЛЕВАЯ КОЛОНКА: Ввод данных */}
        <div className="space-y-6">
          
          {/* Выбор типа */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Технология</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-orange-500 transition cursor-pointer"
            >
               <option value="simple">Объемные (Простые)</option>
               <option value="complex">Объемные (С засечками)</option>
               <option value="backlit">Контражур (Свет сзади)</option>
               <option value="flat">Плоские (Не световые)</option>
            </select>
          </div>

          {/* Ползунки */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Высота буквы: <span className="text-white font-bold">{height} см</span></label>
            <input 
              type="range" min="10" max="100" step="5" 
              value={height} onChange={(e) => setHeight(Number(e.target.value))} 
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
          
          <div>
             <label className="text-gray-400 text-sm mb-2 block">Количество букв: <span className="text-white font-bold">{letters} шт</span></label>
             <input 
               type="range" min="1" max="30" 
               value={letters} onChange={(e) => setLetters(Number(e.target.value))} 
               className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
             />
          </div>

          {/* Чекбоксы */}
          <div className="space-y-3 pt-2">
             <label className="flex items-center space-x-3 cursor-pointer hover:bg-slate-700/30 p-2 rounded transition">
               <input type="checkbox" checked={isAluminum} onChange={(e) => setIsAluminum(e.target.checked)} className="rounded text-orange-500 bg-slate-900 border-slate-600 w-5 h-5 accent-orange-500"/>
               <span className="text-gray-300 text-sm">Алюминиевый борт (+200тг/см)</span>
             </label>
             <label className="flex items-center space-x-3 cursor-pointer hover:bg-slate-700/30 p-2 rounded transition">
               <input type="checkbox" checked={isHighMontage} onChange={(e) => setIsHighMontage(e.target.checked)} className="rounded text-orange-500 bg-slate-900 border-slate-600 w-5 h-5 accent-orange-500"/>
               <span className="text-gray-300 text-sm">Автовышка (+25 000тг)</span>
             </label>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Итог */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 flex flex-col justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

           <div className="relative z-10">
             <div className="text-gray-500 text-sm">Итоговая смета:</div>
             <div className="text-4xl font-bold text-white mt-1 tracking-tight">{total.toLocaleString()} ₸</div>
             <div className="text-sm text-gray-500 mt-1">~ {Math.round(total * 1.15).toLocaleString()} ₸ (макс)</div>
             
             <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400"><Check className="w-3 h-3 text-green-500"/> Блок питания в комплекте</div>
                <div className="flex items-center gap-2 text-xs text-gray-400"><Check className="w-3 h-3 text-green-500"/> Макет бесплатно</div>
                <div className="flex items-center gap-2 text-xs text-gray-400"><Info className="w-3 h-3 text-blue-500"/> Монтаж до 3м включен</div>
             </div>

             <button className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-orange-900/20 active:scale-95">
               Заказать замер
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}