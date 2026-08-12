"use client";

import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    // 1. Сбор UTM-меток из URL и сохранение в sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    
    let hasUtm = false;
    utmKeys.forEach((key) => {
      const value = urlParams.get(key);
      if (value) {
        sessionStorage.setItem(key, value);
        hasUtm = true;
      }
    });

    // 1.05 Проверяем реферальные параметры (рекомендации)
    const refKeys = ["ref", "from", "partner", "recommend"];
    let refValue = "";
    for (const rKey of refKeys) {
      const val = urlParams.get(rKey);
      if (val) {
        refValue = val;
        break;
      }
    }

    if (refValue) {
      sessionStorage.setItem("utm_source", "recommendation");
      sessionStorage.setItem("utm_medium", refValue);
      sessionStorage.setItem("utm_campaign", "recommendation_visit");
      hasUtm = true;
    }

    // 1.1 Если UTM-меток в URL нет и они еще не записаны в сессии, определяем канал по referrer
    if (!hasUtm && !sessionStorage.getItem("utm_source")) {
      const referrer = typeof document !== "undefined" ? document.referrer : "";
      
      if (!referrer) {
        // Прямой переход / Рекомендация (нет реферера)
        sessionStorage.setItem("utm_source", "direct");
        sessionStorage.setItem("utm_medium", "none");
        sessionStorage.setItem("utm_campaign", "direct_visit");
      } else {
        try {
          const refUrl = new URL(referrer);
          const host = refUrl.hostname.toLowerCase();
          
          // Проверяем, не является ли реферер нашим собственным сайтом
          const isOwnSite = host.includes("adlight.kz") || host.includes("localhost") || host.includes("127.0.0.1");
          
          if (!isOwnSite) {
            if (
              host.includes("google.") ||
              host.includes("yandex.") ||
              host.includes("bing.com") ||
              host.includes("duckduckgo.") ||
              host.includes("rambler.ru") ||
              host.includes("mail.ru")
            ) {
              // SEO / Органический поиск
              let sourceName = "organic_search";
              if (host.includes("google.")) sourceName = "google";
              else if (host.includes("yandex.")) sourceName = "yandex";
              else if (host.includes("bing.com")) sourceName = "bing";
              
              sessionStorage.setItem("utm_source", sourceName);
              sessionStorage.setItem("utm_medium", "organic");
              sessionStorage.setItem("utm_campaign", "seo");
            } else {
              // Реферальный переход с другого сайта (например, Instagram, 2gis, другой ресурс)
              sessionStorage.setItem("utm_source", host);
              sessionStorage.setItem("utm_medium", "referral");
              sessionStorage.setItem("utm_campaign", "referral_visit");
            }
          }
        } catch (e) {
          // В случае ошибки парсинга URL записываем общую категорию
          sessionStorage.setItem("utm_source", "referral");
          sessionStorage.setItem("utm_medium", "referral");
          sessionStorage.setItem("utm_campaign", "referral_visit");
        }
      }
    }

    // 2. Получение Client ID из кук
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    // Сохраняем в sessionStorage, чтобы формы могли легко прочитать без разбора кук
    const yandexId = getCookie("_ym_uid");
    if (yandexId) sessionStorage.setItem("yandexClientId", yandexId);

    const googleId = getCookie("_ga");
    if (googleId) {
      // Обычно Google ID имеет формат GA1.2.XXXXXX.XXXXXX. Нам нужна только последняя часть
      const cleanGoogleId = googleId.startsWith("GA1.") 
        ? googleId.split(".").slice(2).join(".") 
        : googleId;
      sessionStorage.setItem("googleClientId", cleanGoogleId);
    }

    const fbp = getCookie("_fbp");
    if (fbp) sessionStorage.setItem("fbBrowserId", fbp);

    // 3. ГЛОБАЛЬНЫЙ CATCH-ALL ПЕРЕХВАТЧИК КЛИКОВ (100% Всеохватывающий скролл/клики)
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ищем ближайший кликабельный элемент (button, a, input, data-analytics)
      const clickable = target.closest("button, a, input[type='submit'], [data-analytics]") as HTMLElement | null;
      if (!clickable) return;

      // Если это плавающая кнопка WhatsApp или телефона — их уже обрабатывает клик-трекер
      const href = clickable.getAttribute("href") || "";
      if (href.includes("wa.me") || href.includes("tel:")) return;

      const elementText = (clickable.innerText || clickable.getAttribute("aria-label") || clickable.getAttribute("title") || "").trim().slice(0, 50);
      const elementId = clickable.id || clickable.getAttribute("data-analytics") || "";

      // Если клик по кнопке/ссылке не обработан специально — шлем авто-событие ui_click
      if (elementText || elementId) {
        import("@/lib/tracking").then(({ trackEvent }) => {
          trackEvent("ui_click", {
            element_text: elementText,
            element_id: elementId,
            element_tag: clickable.tagName.toLowerCase(),
            page_path: window.location.pathname,
          });
        });
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true, passive: true });

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  return null;
}
