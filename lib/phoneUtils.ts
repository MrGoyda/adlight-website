/**
 * Извлекает 10 цифр абонентского номера (без кода страны +7/8)
 */
export function extractSubscriberDigits(rawPhone: string): string {
  if (!rawPhone) return "";
  
  const trimmed = rawPhone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  // Если строка начинается с "+7" или "+ 7"
  if (trimmed.startsWith("+7") || trimmed.startsWith("+ 7")) {
    return digits.slice(1, 11);
  }

  // Если 11 цифр и начинается с 8 или 7 (например 87011234567 или 77011234567)
  if (digits.length === 11 && (digits.startsWith("8") || digits.startsWith("7"))) {
    return digits.slice(1, 11);
  }

  // Если начинается с 8 (например 8701...)
  if (digits.startsWith("8")) {
    return digits.slice(1, 11);
  }

  // Если пользователь вставил 10 цифр (например 7071234567)
  if (digits.length === 10 && !trimmed.startsWith("+") && !trimmed.includes("(")) {
    return digits;
  }

  // Если строка содержит "(" или префикс +7, первая 7 была кодом страны
  if (digits.startsWith("7") && (trimmed.includes("+") || trimmed.includes("(") || trimmed.includes(")"))) {
    return digits.slice(1, 11);
  }

  // Если пользователь нажал просто "7" в пустом поле
  if (trimmed === "7") {
    return "";
  }

  return digits.slice(0, 10);
}

export function formatPhoneInput(rawPhone: string): string {
  if (!rawPhone) return "";

  const trimmed = rawPhone.trim();

  // Пустые или очищенные значения при стирании
  if (
    trimmed === "" ||
    trimmed === "+" ||
    trimmed === "+7" ||
    trimmed === "+7 " ||
    trimmed === "+7 ("
  ) {
    return "";
  }

  // Если номер международный (начинается с +, но не +7)
  if (trimmed.startsWith("+") && !trimmed.startsWith("+7")) {
    const digits = trimmed.replace(/\D/g, "");
    return digits ? `+${digits}` : "";
  }

  const allDigits = rawPhone.replace(/\D/g, "");
  if (!allDigits) return "";

  const subDigits = extractSubscriberDigits(rawPhone);

  // Если абонентских цифр еще нет
  if (!subDigits) {
    if (allDigits === "7" || allDigits === "8") {
      return "+7 (";
    }
    return "";
  }

  let result = `+7 (${subDigits.slice(0, 3)}`;

  if (subDigits.length > 3) {
    result += `) ${subDigits.slice(3, 6)}`;
  }
  if (subDigits.length > 6) {
    result += `-${subDigits.slice(6, 8)}`;
  }
  if (subDigits.length > 8) {
    result += `-${subDigits.slice(8, 10)}`;
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
