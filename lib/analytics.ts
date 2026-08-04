import crypto from "crypto";

// Хеширование персональных данных по алгоритму SHA-256 согласно требованиям Meta (Facebook)
function hashValue(val: string): string {
  return crypto.createHash("sha256").update(val.trim().toLowerCase()).digest("hex");
}

interface MetaEventData {
  name: string;
  phone: string;
  revenue: number;
  fbBrowserId?: string | null;
  leadId: string;
}

export async function sendMetaConversionEvent({
  name,
  phone,
  revenue,
  fbBrowserId,
  leadId,
}: MetaEventData) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("Meta Pixel ID or Access Token is missing. CAPI event skipped.");
    return;
  }

  // Чистим телефон перед хешированием (оставляем только цифры, например 77071234567)
  const cleanPhone = phone.replace(/\D/g, "");
  
  const eventData = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: leadId, // Предотвращает дублирование события с пикселем браузера
        user_data: {
          ph: [hashValue(cleanPhone)],
          fn: [hashValue(name)],
          fbp: fbBrowserId || undefined,
        },
        custom_data: {
          value: revenue,
          currency: "KZT",
        },
        action_source: "website",
      },
    ],
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(eventData),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Meta CAPI Error Response:", data);
    } else {
      console.log("Meta CAPI Event sent successfully:", data);
    }
  } catch (error) {
    console.error("Failed to send Meta CAPI event:", error);
  }
}

// Заготовка отправки офлайн-конверсий в Яндекс.Метрику
// Для работы требуется Client ID Яндекса, который мы сохраняем в БД при отправке
export async function sendYandexConversionEvent(yandexClientId: string, revenue: number) {
  const counterId = "105671980"; // Счетчик ADLight
  const oauthToken = process.env.YANDEX_METRICA_TOKEN; // Должен быть получен владельцем

  if (!oauthToken) {
    console.warn("Yandex Metrica OAuth token is not configured. Yandex Offline Conversion skipped.");
    return;
  }

  const payload = {
    conversions: [
      {
        client_id: yandexClientId,
        target: "purchase", // Цель: покупка/оплата
        date_time: Math.floor(Date.now() / 1000),
        price: revenue,
        currency: "RUB", // Яндекс конвертирует по курсу, или использовать KZT, если поддерживается
      },
    ],
  };

  try {
    const res = await fetch(`https://api-metrika.yandex.net/management/v1/counter/${counterId}/offline_conversions/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `OAuth ${oauthToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Yandex Metrica Offline Conversion Error:", data);
    } else {
      console.log("Yandex Metrica Offline Conversion sent successfully:", data);
    }
  } catch (error) {
    console.error("Failed to send Yandex Conversion event:", error);
  }
}
