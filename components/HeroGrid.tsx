"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Пропсы: принимаем 4 массива картинок для разных зон
interface HeroGridProps {
  imagesLetters: string[]; // Окно 1: Буквы
  imagesLarge: string[];   // Окно 2: Крупные формы (Крыши, Стелы)
  imagesInterior: string[];// Окно 3: Интерьер и Неон
  imagesNav: string[];     // Окно 4: Навигация и Короба
}

// Мини-компонент для одного "живого" окна
const LiveWindow = ({ 
  images, 
  title, 
  subtitle, 
  baseDelay 
}: { 
  images: string[], 
  title: string, 
  subtitle: string, 
  baseDelay: number 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    // Функция смены слайда
    const cycleImage = () => {
      setIsFading(true); // 1. Уходим в прозрачность
      
      setTimeout(() => {
        // 2. Меняем картинку (пока невидима)
        setCurrentIndex((prev) => {
            // Стараемся не повторять одну и ту же картинку подряд
            let next = Math.floor(Math.random() * images.length);
            if (next === prev && images.length > 1) {
                next = (next + 1) % images.length;
            }
            return next;
        });
        setIsFading(false); // 3. Возвращаем видимость
      }, 500); // Время фейда (должно совпадать с duration-500 в CSS)
    };

    // Запускаем "плавающий" интервал
    const startLoop = () => {
        // Рандом от 3 до 6 секунд + индивидуальная задержка
        const randomTime = Math.random() * 3000 + 3000; 
        return setTimeout(() => {
            cycleImage();
            // Рекурсивно запускаем следующий таймер
            timerId = startLoop();
        }, randomTime);
    };

    // Начальная задержка, чтобы все окна не мигнули одновременно при загрузке
    let timerId = setTimeout(startLoop, baseDelay);

    return () => clearTimeout(timerId);
  }, [images, baseDelay]);

  // Заглушка, если картинок нет
  if (images.length === 0) return <div className="w-full h-full bg-slate-800 border border-slate-700 rounded-2xl"></div>;

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl group">
      {/* Картинка */}
      <Image
        src={images[currentIndex]}
        alt={title}
        fill
        className={`object-cover transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      
      {/* Градиент для читаемости текста */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
      
      {/* Текст (всегда поверх) */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <p className="text-white font-bold text-lg leading-none mb-1 shadow-black drop-shadow-md">{title}</p>
        <p className="text-xs text-orange-400 font-medium">{subtitle}</p>
      </div>
    </div>
  );
};

export default function HeroGrid({ imagesLetters, imagesLarge, imagesInterior, imagesNav }: HeroGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 h-full min-h-[400px] lg:min-h-[500px]">
      {/* Окно 1: Буквы */}
      <div className="aspect-square transform transition hover:scale-[1.02] duration-300">
         <LiveWindow 
            images={imagesLetters} 
            title="Вывески" 
            subtitle="Объемные буквы" 
            baseDelay={0} 
         />
      </div>

      {/* Окно 2: Масштаб (сдвинуто вниз на десктопе для ритма) */}
      <div className="aspect-square mt-8 lg:mt-12 transform transition hover:scale-[1.02] duration-300">
         <LiveWindow 
            images={imagesLarge} 
            title="Масштаб" 
            subtitle="Крышные и Стелы" 
            baseDelay={1500} 
         />
      </div>

      {/* Окно 3: Интерьер (сдвинуто вверх) */}
      <div className="aspect-square -mt-8 lg:-mt-12 transform transition hover:scale-[1.02] duration-300">
         <LiveWindow 
            images={imagesInterior} 
            title="Атмосфера" 
            subtitle="Неон и Интерьер" 
            baseDelay={800} 
         />
      </div>

      {/* Окно 4: Навигация */}
      <div className="aspect-square transform transition hover:scale-[1.02] duration-300">
         <LiveWindow 
            images={imagesNav} 
            title="Навигация" 
            subtitle="Лайтбоксы и Таблички" 
            baseDelay={2500} 
         />
      </div>
    </div>
  );
}