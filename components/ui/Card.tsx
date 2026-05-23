"use client";

import React from "react";
import { cn } from "@/lib/utils";
import GlassLayer from "./GlassLayer";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  rounded?: "xl" | "2xl" | "3xl";
  onClick?: () => void;
  intensity?: "light" | "heavy";
}

export default function Card({
  children,
  className,
  glass = false,
  hover = false,
  rounded = "3xl",
  onClick,
  intensity = "light",
}: CardProps) {
  const isClickable = !!onClick;

  const roundedClasses = {
    xl: "rounded-xl",
    "2xl": "rounded-[2rem]",
    "3xl": "rounded-[2.5rem]",
  };

  const cardStyles = cn(
    "relative overflow-hidden transition-all duration-500",
    roundedClasses[rounded],
    !glass && "bg-slate-900/60 border border-slate-800",
    hover && "hover:-translate-y-1.5 hover:shadow-2xl hover:border-slate-700/50",
    isClickable && "cursor-pointer active:scale-[0.99]",
    className
  );

  return (
    <div className={cardStyles} onClick={onClick}>
      {glass && <GlassLayer intensity={intensity} />}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
