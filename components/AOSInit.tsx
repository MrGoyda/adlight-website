"use client"; // Обязательно, так как здесь используется useEffect

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      once: true, // Анимация проигрывается только один раз при прокрутке
      disable: "phone", // Отключить анимацию на мобильных (опционально, можно убрать)
      duration: 700, // Длительность анимации: 0.7 секунды
      easing: "ease-out-cubic", // Плавный и естественный эффект
    });
  }, []);

  return null; // Компонент ничего не рендерит, только запускает логику
}