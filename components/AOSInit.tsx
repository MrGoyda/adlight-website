"use client";

import { useEffect } from "react";
import AOS from "aos";
// УБИРАЕМ импорт отсюда: import "aos/dist/aos.css"; 
import { usePathname } from "next/navigation";

export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Проверка на ширину экрана (чтобы не грузить CSS на мобилках, раз у тебя disable: phone)
    // 768px - стандартная граница планшета/мобилки
    const isMobile = window.innerWidth < 768; 

    const initAOS = async () => {
      // Динамически импортируем CSS только если это НЕ мобилка
      // или если ты решишь включить анимацию везде — убери if (!isMobile)
      if (!isMobile) {
        await import("aos/dist/aos.css"); // <--- ВОТ МАГИЯ (Lazy Load)
        
        AOS.init({
          once: true,
          disable: "phone",
          duration: 700,
          easing: "ease-out-cubic",
        });
      }
    };

    initAOS();

    // Жесткий рефреш при смене страниц
    const timer = setTimeout(() => {
      if (!isMobile) {
         AOS.refreshHard();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}