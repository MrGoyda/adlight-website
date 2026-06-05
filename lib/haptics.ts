/**
 * lib/haptics.ts
 * Тактильный отклик для мобильных устройств.
 * Скилл: ui-ux-architect — Web Haptics
 */
export const triggerHaptic = (type: 'light' | 'success') => {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    const patterns: Record<string, number[]> = {
      light: [10],
      success: [10, 50, 10],
    };
    navigator.vibrate(patterns[type]);
  }
};
