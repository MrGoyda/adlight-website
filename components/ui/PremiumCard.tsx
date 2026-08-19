"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "plain";
  hoverEffect?: "lift" | "glow" | "none";
  interactive?: boolean;
}

export default function PremiumCard({
  children,
  className,
  variant = "default",
  hoverEffect = "lift",
  interactive = true,
  ...props
}: PremiumCardProps) {
  const baseStyles = "relative rounded-3xl border text-slate-900 transition-all duration-300 overflow-hidden";

  const variants = {
    default: "bg-white border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)]",
    glass: "bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-[0_15px_50px_rgba(0,0,0,0.04)]",
    plain: "bg-slate-50/50 border-slate-200/50 shadow-sm",
  };

  const hoverEffects = {
    lift: interactive ? "hover:border-orange-500/20 hover:shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:scale-[1.005] active:scale-[0.995]" : "",
    glow: interactive ? "hover:border-orange-500/30 hover:shadow-[0_30px_60px_rgba(249,115,22,0.05)] hover:-translate-y-1 active:scale-[0.995]" : "",
    none: "",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        hoverEffects[hoverEffect],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

