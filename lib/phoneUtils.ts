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

  // Очищаем все нецифровые символы
  const digits = rawPhone.replace(/\D/g, "");
  if (!digits) return "";

  // Если введена всего одна цифра в пустое поле
  if (digits.length === 1) {
    if (digits === "7" || digits === "8") {
      return "+7 (";
    }
    return `+7 (${digits}`;
  }

  let localDigits = "";

  // Если 11 цифр и начинается с 7 или 8 — первая цифра это код страны (+7)
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    localDigits = digits.slice(1);
  } else if (digits.length === 10) {
    // 10 цифр — готовый номер оператора (например 7071234567)
    localDigits = digits;
  } else if (digits.startsWith("7") || digits.startsWith("8")) {
    // Пользователь вводит номер с префиксом +7 или 8
    localDigits = digits.slice(1);
  } else {
    // Пользователь вводит цифры без префикса
    localDigits = digits;
  }

  localDigits = localDigits.slice(0, 10);

  if (!localDigits) {
    return "+7 (";
  }

  let result = `+7 (${localDigits.slice(0, 3)}`;

  if (localDigits.length > 3) {
    result += `) ${localDigits.slice(3, 6)}`;
  }
  if (localDigits.length > 6) {
    result += `-${localDigits.slice(6, 8)}`;
  }
  if (localDigits.length > 8) {
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
