type RateLimitRecord = {
  count: number;
  resetAt: number;
  blockedUntil?: number;
};

// In-memory хранилище попыток входа
const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5; // Максимум 5 неверных попыток
const WINDOW_MS = 15 * 60 * 1000; // Окно 15 минут
const BLOCK_MS = 15 * 60 * 1000; // Блокировка на 15 минут при превышении

/**
 * Проверка превышения лимита попыток входа для IP / ключа
 */
export function checkRateLimit(key: string): { success: boolean; error?: string; remainingMs?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record) {
    return { success: true };
  }

  // Если заблокирован
  if (record.blockedUntil && now < record.blockedUntil) {
    const remainingSec = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      success: false,
      error: `Слишком много неверных попыток входа. Доступ заблокирован на ${remainingSec} сек.`,
      remainingMs: record.blockedUntil - now,
    };
  }

  // Если окно истекло, сбрасываем счетчик
  if (now > record.resetAt) {
    rateLimitStore.delete(key);
    return { success: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_MS;
    rateLimitStore.set(key, record);
    return {
      success: false,
      error: "Слишком много неверных попыток входа. Аккаунт временно заблокирован на 15 минут.",
      remainingMs: BLOCK_MS,
    };
  }

  return { success: true };
}

/**
 * Фиксация неудачной попытки входа
 */
export function registerFailedAttempt(key: string) {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { count: 0, resetAt: now + WINDOW_MS };

  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_MS;
  }
  rateLimitStore.set(key, record);
}

/**
 * Сброс счетчика при успешном входе
 */
export function resetRateLimit(key: string) {
  rateLimitStore.delete(key);
}
