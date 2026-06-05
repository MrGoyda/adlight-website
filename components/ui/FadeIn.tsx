"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number; // в миллисекундах
  duration?: number; // в миллисекундах
  className?: string;
  threshold?: number;
  as?: keyof React.JSX.IntrinsicElements;
  [key: string]: any; // Allow custom attributes like itemScope, itemType, etc.
}

export default function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 600,
  className = "",
  threshold = 0.05,
  as = "div",
  ...props
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Анимация срабатывает один раз
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      { threshold }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  // Выбираем стартовые классы трансформации в зависимости от направления
  const getDirectionClass = () => {
    switch (direction) {
      case "up":
        return "translate-y-6 opacity-0";
      case "down":
        return "-translate-y-6 opacity-0";
      case "left":
        return "translate-x-6 opacity-0";
      case "right":
        return "-translate-x-6 opacity-0";
      case "none":
      default:
        return "opacity-0";
    }
  };

  const Component = as as any;

  return (
    <Component
      ref={domRef}
      className={`transform-gpu transition-[transform,opacity] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity] ${
        isVisible ? "translate-y-0 translate-x-0 opacity-100" : getDirectionClass()
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
