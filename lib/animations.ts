/**
 * Настройки анимаций для Framer Motion (по стандартам Apple Design System)
 */

export const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 500,
  damping: 14,
  mass: 0.8
};

export const SMOOTH_TRANSITION = {
  type: "tween",
  ease: [0.16, 1, 0.3, 1], // easeOutExpo
  duration: 0.6
};

export const FADE_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: SMOOTH_TRANSITION
  }
};

export const MODAL_BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

export const MODAL_CONTENT_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: SPRING_TRANSITION 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10, 
    transition: { duration: 0.15 } 
  }
};
