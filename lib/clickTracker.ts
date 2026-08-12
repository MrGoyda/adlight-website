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
