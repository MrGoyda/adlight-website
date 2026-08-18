/**
 * Универсальные утилиты нормализации и форматирования телефонных номеров (Казахстан / СНГ)
 * Принцип DRY: единый источник истины для парсинга, валидации и экспорта аудиторий.
 */

/**
 * Очищает номер до канонического вида `+77XXXXXXXXX`
 */
export function normalizePhone(rawPhone: string): string {
  if (!rawPhone) return "";
  
  // Убираем все нецифровые символы
  const digits = rawPhone.replace(/\D/g, "");
  
  if (!digits) return rawPhone.trim();

  // Если начинается с 8 (например 87011234567) и длина 11 -> переводим в 7
  if (digits.length === 11 && digits.startsWith("8")) {
    return `+7${digits.slice(1)}`;
  }
  
  // Если начинается с 7 (например 77011234567) и длина 11 -> добавляем +
  if (digits.length === 11 && digits.startsWith("7")) {
    return `+${digits}`;
  }

  // Если 10 цифр (например 7011234567) -> добавляем +7
  if (digits.length === 10) {
    return `+7${digits}`;
  }

  // В остальных случаях сохраняем с плюсом
  return rawPhone.startsWith("+") ? rawPhone.trim() : `+${digits}`;
}

/**
 * Красивое отображение номера в UI: `+7 (701) 123-45-67`
 */
export function formatPhoneDisplay(rawPhone: string): string {
  const norm = normalizePhone(rawPhone);
  const digits = norm.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("7")) {
    const code = digits.slice(1, 4);
    const p1 = digits.slice(4, 7);
    const p2 = digits.slice(7, 9);
    const p3 = digits.slice(9, 11);
    return `+7 (${code}) ${p1}-${p2}-${p3}`;
  }

  return rawPhone;
}

/**
 * Экспорт для Facebook / Instagram Ads Custom Audiences (формат E.164 без плюса: 77011234567)
 */
export function formatPhoneForMeta(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `7${digits}`;
  }
  return digits;
}

/**
 * Экспорт для Яндекс Аудиторий и Google Customer Match (формат E.164 с плюсом: +77011234567)
 */
export function formatPhoneForE164(rawPhone: string): string {
  return normalizePhone(rawPhone);
}

/**
 * Очищает телефон от скобок, пробелов и дефисов для кликабельной ссылки tel:...
 */
export function getCleanPhone(rawPhone: string): string {
  if (!rawPhone) return "";
  return rawPhone.replace(/[^0-9+]/g, "");
}

/**
 * Генерирует прямую ссылку на диалог WhatsApp
 */
export function getWhatsAppUrl(rawPhone: string, messageText?: string): string {
  if (!rawPhone) return "";
  const digits = rawPhone.replace(/\D/g, "");
  const normalizedDigits = digits.length === 11 && digits.startsWith("8") ? `7${digits.slice(1)}` : digits;
  const textParam = messageText ? `?text=${encodeURIComponent(messageText)}` : "";
  return `https://wa.me/${normalizedDigits}${textParam}`;
}
