---
name: apple-design-system
description: Главный индекс. Проектирование премиальных интерфейсов (Next.js 15, Tailwind) с соблюдением эстетики Apple.
---

# 🍏 Apple Design System & Animation Engine

## 🎯 Когда использовать
- Создание UI-компонентов для ERP/CRM и корпоративных веб-приложений.
- Проектирование лендингов и интерфейсов в стиле Apple Premium (High-End Minimalism).
- Для конкретных задач обращайтесь к специализированным подфайлам:
  - **Работа со стеклом и Blur:** см. `glassmorphism.md`
  - **Анимации и Framer Motion:** см. `animations.md`
  - **Доступность и Скелетоны:** см. `accessibility-loading.md`
  - **Защитный дизайн и iOS Safari:** см. `defensive-ux.md`

---

## 🎨 Визуальные стандарты (Apple Aesthetics)
1. **Glassmorphism:** Использование многослойного стекла. Строго через выделенный слой (см. `glassmorphism.md`).
2. **Геометрия (Squircle):** Использовать мягкие углы: `rounded-2xl` (для мелких карточек) или `rounded-3xl` (для крупных блоков).
3. **Типографика:** Шрифт Inter или SF Pro. Заголовки требуют плотного кернинга: `font-semibold` + `tracking-tight`.
4. **Тени:** Отказ от дефолтных `shadow-md` из Tailwind. Использовать кастомные глубокие тени с нулевым смещением: `shadow-[0_20px_50px_rgba(0,0,0,0.1)]`.

---

## 🛠 Глобальная настройка (Next.js 15 + Tailwind)

### globals.css
```css
/* Базовый фикс для мобилок: заставляем GPU обрабатывать слои */
.gpu-layer {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  perspective: 1000;
}

/* Оптимизация ОС "Уменьшение прозрачности" */
@media (prefers-reduced-transparency: reduce) {
  .apple-glass-heavy {
    backdrop-filter: none !important;
    background-color: theme('colors.slate.100') !important;
  }
  .dark .apple-glass-heavy {
    background-color: theme('colors.slate.900') !important;
  }
}
```

### tailwind.config.ts
```typescript
theme: {
  extend: {
    backdropBlur: { apple: '20px' },
    backdropSaturate: { apple: '180%' } // Сатурация скрывает артефакты сжатия под стеклом
  }
}
```
