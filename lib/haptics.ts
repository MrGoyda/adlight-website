/**
 * lib/haptics.ts
 * Тактильный отклик для мобильных устройств.
 * Скилл: ui-ux-architect — Web Haptics
 */
export type HapticType = 'light' | 'medium' | 'success' | 'error' | 'warning';

export const triggerHaptic = (type: HapticType = 'light') => {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    const patterns: Record<HapticType, number[]> = {
      light: [10],
      medium: [25],
      success: [10, 50, 10],
      error: [40, 40, 40],
      warning: [20, 30, 20],
    };
    navigator.vibrate(patterns[type] || [10]);
  }
};
