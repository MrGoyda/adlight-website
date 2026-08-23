/**
 * Умная маска для полей ввода: форматирует на лету в `+7 (7XX) XXX-XX-XX`
 * Поддерживает вставку номеров любого формата (8701..., +7701..., 701..., +7 701...)
 * и международные номера (+996..., +998..., +1...).
 */
export function formatPhoneInput(rawPhone: string): string {
  if (!rawPhone) return "";

  const trimmed = rawPhone.trim();

  // Если номер международный (начинается с плюса, но не +7)
  if (trimmed.startsWith("+") && !trimmed.startsWith("+7")) {
    const digits = trimmed.replace(/\D/g, "");
    return `+${digits}`;
  }

  // Очищаем все нецифровые символы
  const digits = rawPhone.replace(/\D/g, "");
  if (!digits) return "";

  // Если первая цифра 8 или 7 — отсекаем ее как код страны (+7)
  let localDigits = digits;
  if (localDigits.startsWith("8") || localDigits.startsWith("7")) {
    localDigits = localDigits.slice(1);
  }

  // Ограничиваем 10 цифрами абонентского номера
  localDigits = localDigits.slice(0, 10);

  let result = "+7";

  if (localDigits.length > 0) {
    result += ` (${localDigits.slice(0, 3)}`;
  }
  if (localDigits.length >= 3) {
    result += `) ${localDigits.slice(3, 6)}`;
  }
  if (localDigits.length >= 6) {
    result += `-${localDigits.slice(6, 8)}`;
  }
  if (localDigits.length >= 8) {
    result += `-${localDigits.slice(8, 10)}`;
  }

  return result;
}

/**
 * Проверяет валидность введенного номера телефона
 */
export function isValidPhone(rawPhone: string): boolean {
  if (!rawPhone) return false;
  const digits = rawPhone.replace(/\D/g, "");
  // Казахстан/СНГ: 11 цифр (начинается с 7 или 8)
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return true;
  }
  // Международные номера от 10 до 15 цифр
  if (rawPhone.startsWith("+") && digits.length >= 10 && digits.length <= 15) {
    return true;
  }
  return false;
}

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
  if (!rawPhone) return "";
  return formatPhoneInput(rawPhone);
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
