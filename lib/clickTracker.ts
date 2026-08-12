"use client";

import { trackClientConversion } from "@/lib/clientAnalytics";

interface ClickTrackerOptions {
  type: "whatsapp" | "phone";
  source?: string;
}

export async function handleTrackedClick(options: ClickTrackerOptions): Promise<{ code: string }> {
  if (typeof window === "undefined") return { code: "AD-0000" };

  const getStorage = (key: string): string | null => {
    try {
      return sessionStorage.getItem(key) || localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
    return 'Desktop';
  };

  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    if (ua.includes('Edge') || ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Other';
  };

  const getOS = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac OS')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('like Mac')) return 'iOS';
    return 'Other';
  };

  const getTimeOnSite = () => {
    try {
      let sessionStart = sessionStorage.getItem('session_start_time');
      if (!sessionStart) {
        sessionStart = Date.now().toString();
        sessionStorage.setItem('session_start_time', sessionStart);
      }
      return Math.floor((Date.now() - parseInt(sessionStart, 10)) / 1000);
    } catch {
      return 0;
    }
  };

  const getLandingPage = () => {
    try {
      let lp = sessionStorage.getItem('landing_page');
      if (!lp) {
        lp = window.location.href;
        sessionStorage.setItem('landing_page', lp);
      }
      return lp;
    } catch {
      return window.location.href;
    }
  };

  // Читаем маркетинг метки и ID из хранилища
  const payload = {
    type: options.type,
    pageUrl: window.location.href,
    gclid: getStorage("gclid"),
    yclid: getStorage("yclid"),
    fbclid: getStorage("fbclid"),
    utmSource: getStorage("utm_source"),
    utmMedium: getStorage("utm_medium"),
    utmCampaign: getStorage("utm_campaign"),
    utmContent: getStorage("utm_content"),
    utmTerm: getStorage("utm_term"),
    yandexClientId: getStorage("yandexClientId"),
    googleClientId: getStorage("googleClientId"),
    fbBrowserId: getStorage("fbBrowserId"),
    deviceType: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    referrerUrl: document.referrer || null,
    timeOnSiteSeconds: getTimeOnSite(),
    landingPage: getLandingPage()
  };

  // Параллельно слаем конверсию в системы рекламы
  trackClientConversion(options.type === "whatsapp" ? "click_whatsapp" : "click_phone", {
    form_name: options.source ? `${options.source} ${options.type}` : `${options.type === "whatsapp" ? "WhatsApp" : "Phone"} Link`,
    page_location: window.location.href,
  });

  try {
    const res = await fetch("/api/clicks/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    const data = await res.json();
    return { code: data.code || "AD-1000" };
  } catch (err) {
    console.error("Failed to register click:", err);
    return { code: `AD-${Math.floor(1000 + Math.random() * 9000)}` };
  }
}

/**
 * Генерирует прямую готовую ссылку на WhatsApp с вшитым реферальным кодом клика
 */
export async function getTrackedWhatsappUrl(
  basePhone: string = "77071356701",
  customText?: string,
  source?: string
): Promise<string> {
  const { code } = await handleTrackedClick({ type: "whatsapp", source });
  const cleanPhone = basePhone.replace(/\D/g, "");
  
  const text = customText 
    ? `${customText} [Код: ${code}]`
    : `Здравствуйте! Хочу заказать вывеску / узнать стоимость. [Код: ${code}]`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
