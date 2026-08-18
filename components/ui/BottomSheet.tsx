"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
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
  showHandleBar = true,
  className = "",
  zIndex = "z-[9999]",
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Закрытие по Escape и блокировка скролла страницы
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerHaptic("light");
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 ${zIndex} flex flex-col justify-end items-center`}>
          {/* Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => {
              triggerHaptic("light");
              onClose();
            }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer z-10"
          />

          {/* Нативная шторка снизу вверх (60 FPS) */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 380,
              mass: 0.8,
            }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                triggerHaptic("light");
                onClose();
              }
            }}
            className={`relative w-full ${maxWidth} max-w-full bg-white rounded-t-[32px] shadow-2xl flex flex-col ${maxHeight} h-auto z-20 overflow-hidden overflow-x-hidden touch-pan-y [touch-action:pan-y] border-t border-slate-200/80 transform-gpu will-change-transform ${className}`}
          >
            {/* Ручка для свайпа вниз (iOS Handle Bar) */}
            {showHandleBar && (
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="pt-2.5 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing bg-white select-none touch-none w-full max-w-full"
              >
                <div className="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors pointer-events-none" />
              </div>
            )}

            {/* Контент шторки с независимым скроллом */}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
