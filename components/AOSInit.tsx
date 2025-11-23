"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";

export default function AOSInit() {
  const pathname = usePathname(); // Следим за изменением пути (страницы)

  useEffect(() => {
    // Инициализация один раз при загрузке
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    // ЖЕСТКИЙ ПЕРЕСЧЕТ при каждой смене страницы
    // Небольшая задержка, чтобы DOM успел обновиться
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, [pathname]);

  return null;
}