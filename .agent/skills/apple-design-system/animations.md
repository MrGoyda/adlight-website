---
name: framer-motion-physics
description: Продвинутые анимации, защита от мерцаний, Stagger и Shared Layout.
---

# ⚡ Стандарты Анимации (Performance First)

## 1. Гибридная стратегия (Hybrid Strategy)
- **CSS / Tailwind**: Используется для всех scroll-reveal анимаций. Элементы, которые появляются при прокрутке, должны анимироваться через CSS transitions. Это гарантирует отсутствие блокировок основного потока (Main Thread) и плавность 120fps.
- **Framer Motion**: Используется ТОЛЬКО для:
  - **Модальных окон и Drawer** (где нужен `AnimatePresence`).
  - **Выпадающих меню и Popovers**.
  - **Drag-and-Drop** и сложных жестов.
  - **Сложной оркестрации** (последовательное появление многих элементов со сложной логикой).

## 2. CSS Scroll Reveal (High Performance)
Для появления при скролле использовать базовые классы и `IntersectionObserver`:
- **Начальное состояние**: `opacity-0 translate-y-4 will-change-transform`.
- **Активное состояние**: `.is-visible` добавляет `opacity-100 translate-y-0`.
- **Тайминги**: Использовать `duration-700` и `cubic-bezier(0.16, 1, 0.3, 1)` (Apple Ease).

## 3. Золотые правила Framer Motion
- **Тип анимации:** Строго `type: "spring"`.
- **Константы пружины:** `stiffness: 100, damping: 20, mass: 0.5`.
- **Интерактивность:** 
  - `whileTap={{ scale: 0.98 }}` — физическое нажатие.
  - `whileHover={{ y: -4 }}` — премиальный подъем.

## 4. Защита от багов (Flicker Prevention)
При рендеринге массивов (списки, гриды) использовать каскадное появление.
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 } // Задержка между карточками
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
}
```

## 4. Бесшовные переходы (Shared Layout)
Для эффекта "раскрывающейся карточки" (App Store Effect):
1. У миниатюры и модалки должен быть одинаковый `layoutId={item.id}`.
2. Весь родительский контекст обернуть в `<LayoutGroup>`.
3. Текст внутри анимировать через `opacity`, а не `layout` (защита от искажений шрифта).
