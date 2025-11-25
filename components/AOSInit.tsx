"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";

export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Инициализируем AOS (каждый раз при смене пути)
    AOS.init({
      once: true, // Анимация проигрывается 1 раз
      disable: "phone", // Отключаем на телефонах (чтобы не грузить проц и не ломать скролл)
      duration: 700,
      easing: "ease-out-cubic",
    });

    // 2. ЖЕСТКИЙ РЕФРЕШ
    // Мы используем setTimeout, чтобы дать React время отрисовать новый DOM
    // перед тем, как AOS начнет искать элементы.
    const timer = setTimeout(() => {
      AOS.refreshHard(); // .refreshHard() сильнее, чем просто .refresh()
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname]); // <- Срабатывает при любом изменении URL

  return null;
}