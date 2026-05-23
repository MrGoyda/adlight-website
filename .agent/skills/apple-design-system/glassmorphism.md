---
name: glassmorphism-architecture
description: Правила работы с эффектом Blur и матовым стеклом без падения производительности.
---

# 💎 Архитектура Glassmorphism

**Строгий запрет:** Запрещено использовать `backdrop-blur` напрямую в `className` для анимируемых или интерактивных контейнеров (это вызывает катастрофическое падение FPS на мобильных устройствах).

## 4 Правила реализации Стекла:
1. **Изоляция:** Стекло всегда должно лежать в отдельном `absolute` слое (`<GlassLayer />`) позади контента (`z-index: -1`).
2. **Адаптивность в движении:** Для компонентов, меняющих размер, передавать проп `isAnimating=true` в `GlassLayer` для отключения размытия.
3. **Скролл-оптимизация:** В хедерах отключать размытие при быстром скроллинге.
4. **Доступность:** Деградировать до solid цветов, если в ОС включено уменьшение прозрачности (см. `globals.css`).

## Эталонный компонент `<GlassLayer />`
```tsx
'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassLayerProps {
  isAnimating?: boolean;
  className?: string;
  intensity?: 'light' | 'heavy';
}

export const GlassLayer = ({ isAnimating = false, className, intensity = 'light' }: GlassLayerProps) => {
  return (
    <motion.div
      style={{ isolation: 'isolate' }} 
      className={cn(
        "absolute inset-0 z-[-1] rounded-inherit pointer-events-none gpu-layer",
        "bg-white/60 dark:bg-black/40", 
        isAnimating 
          ? "backdrop-filter-none bg-white/95 dark:bg-black/90" 
          : "backdrop-blur-apple backdrop-saturate-apple apple-glass-heavy",
        className
      )}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    />
  )
}
```
