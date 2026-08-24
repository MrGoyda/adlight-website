"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { triggerHaptic } from "@/lib/haptics";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  height?: string;
  showHandleBar?: boolean;
  className?: string;
  zIndex?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-2xl",
  maxHeight = "max-h-[90dvh]",
  height = "h-auto",
  showHandleBar = true,
  className = "",
  zIndex = "z-[9999]",
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const startYRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const currentOffsetRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Управление жизненным циклом и гарантированным двухфазным рендерингом для CSS-переходов
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setDragOffset(0);
      setIsDragging(false);
      // Задержка в 25мс гарантирует, что браузер сначала отрисует начальное состояние (translateY(100%)),
      // а затем плавно анимирует его к translateY(0)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 25);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setDragOffset(0);
        setIsDragging(false);
      }, 320); // 320ms соответствует длительности CSS-анимации
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Закрытие по Escape и блокировка скролла страницы под шторкой
  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerHaptic("light");
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [shouldRender, onClose]);

  // Обработчики нативного легковесного свайпа вниз (Touch Gestures)
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    startTimeRef.current = Date.now();
    currentOffsetRef.current = 0;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging) return;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const diffY = clientY - startYRef.current;

      // Реагируем только на движение вниз
      if (diffY > 0) {
        currentOffsetRef.current = diffY;
        setDragOffset(diffY);
      } else {
        // Небольшое сопротивление при попытке тянуть вверх
        const rubberBand = diffY * 0.2;
        currentOffsetRef.current = rubberBand;
        setDragOffset(rubberBand);
      }
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const elapsed = Date.now() - startTimeRef.current;
    const offset = currentOffsetRef.current;
    const velocity = elapsed > 0 ? offset / elapsed : 0;

    // Если свайпнули больше 80px или с высокой скоростью (velocity > 0.4) — закрываем
    if (offset > 80 || velocity > 0.4) {
      triggerHaptic("light");
      onClose();
    } else {
      // Иначе возвращаем шторку на место плавной анимацией
      setDragOffset(0);
    }
  }, [isDragging, onClose]);

  if (!mounted || !shouldRender) return null;

  // Динамический transform с учетом жеста перетаскивания
  const sheetTransform = !isVisible
    ? "translate3d(0, 100%, 0)"
    : dragOffset !== 0
    ? `translate3d(0, ${Math.max(dragOffset, -20)}px, 0)`
    : "translate3d(0, 0, 0)";

  return createPortal(
    <div
      className={`fixed inset-0 ${zIndex} flex flex-col justify-end items-center pointer-events-auto`}
      style={{ isolation: "isolate" }}
    >
      {/* ── Затемнение фона (Backdrop) на чистом CSS ── */}
      <div
        onClick={() => {
          triggerHaptic("light");
          onClose();
        }}
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer z-10 transition-opacity duration-300 ease-out will-change-opacity ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ── Шторка на чистом CSS (Apple UIKit cubic-bezier) ── */}
      <div
        style={{
          transform: sheetTransform,
          transition: isDragging
            ? "none"
            : "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
        className={`relative w-full ${maxWidth} max-w-full bg-white rounded-t-[32px] shadow-2xl flex flex-col ${maxHeight} ${height} z-20 overflow-hidden overflow-x-hidden border-t border-slate-200/80 ${className}`}
      >
        {/* Ручка для свайпа вниз (iOS Handle Bar) с поддержкой Touch/Mouse Drag */}
        {showHandleBar && (
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            className="pt-2.5 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing bg-white select-none touch-none w-full max-w-full"
          >
            <div className="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors pointer-events-none" />
          </div>
        )}

        {/* Контент шторки с независимым скроллом */}
        {children}
      </div>
    </div>,
    document.body
  );
}
