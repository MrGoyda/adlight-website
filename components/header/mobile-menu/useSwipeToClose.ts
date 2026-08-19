"use client";

import { useCallback, useRef } from "react";
import { triggerHaptic } from "@/lib/haptics";

const SWIPE_CLOSE_THRESHOLD = 80; // px правее — закрыть
const SWIPE_CLOSE_VELOCITY = 0.4; // px/ms — быстрый свайп

export function useSwipeToClose(onClose: () => void) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isDragging = useRef(false);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchStartTime.current = Date.now();
    isDragging.current = false;
    isHorizontalSwipe.current = null;
    if (drawerRef.current) {
      drawerRef.current.style.transition = "none";
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = Math.abs(t.clientY - touchStartY.current);

    if (isHorizontalSwipe.current === null) {
      if (Math.abs(dx) > 8 || dy > 8) {
        isHorizontalSwipe.current = Math.abs(dx) > dy;
      }
      return;
    }

    if (!isHorizontalSwipe.current) return;

    if (dx <= 0) {
      if (drawerRef.current) drawerRef.current.style.transform = "";
      return;
    }

    isDragging.current = true;
    e.preventDefault();
    if (drawerRef.current) {
      drawerRef.current.style.transform = `translateX(${dx}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) {
      if (drawerRef.current) {
        drawerRef.current.style.transition = "";
        drawerRef.current.style.transform = "";
      }
      return;
    }

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dt = Date.now() - touchStartTime.current;
    const velocity = dx / dt;

    if (drawerRef.current) {
      drawerRef.current.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    }

    if (dx > SWIPE_CLOSE_THRESHOLD || velocity > SWIPE_CLOSE_VELOCITY) {
      triggerHaptic("medium");
      if (drawerRef.current) {
        drawerRef.current.style.transform = "translateX(100%)";
      }
      setTimeout(() => {
        if (drawerRef.current) {
          drawerRef.current.style.transform = "";
          drawerRef.current.style.transition = "";
        }
        onClose();
      }, 300);
    } else {
      if (drawerRef.current) {
        drawerRef.current.style.transform = "";
        drawerRef.current.style.transition = "";
      }
    }

    isDragging.current = false;
  }, [onClose]);

  return {
    drawerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
