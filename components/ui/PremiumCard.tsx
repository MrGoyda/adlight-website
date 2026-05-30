"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
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
  const baseStyles = "relative rounded-3xl border text-slate-900 transition-colors duration-500 overflow-hidden";

  const variants = {
    default: "bg-white border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)]",
    glass: "bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-[0_15px_50px_rgba(0,0,0,0.04)]",
    plain: "bg-slate-50/50 border-slate-200/50 shadow-sm",
  };

  const hoverEffects = {
    lift: "hover:border-orange-500/20 hover:shadow-[0_20px_50px_rgba(15,23,42,0.06)]",
    glow: "hover:border-orange-500/30 hover:shadow-[0_30px_60px_rgba(249,115,22,0.05)]",
    none: "",
  };

  // Motion physics configuration
  const cardMotion = interactive
    ? {
        whileHover: hoverEffect === "lift" ? { y: -5, scale: 1.01 } : {},
        whileTap: { scale: 0.995 },
        transition: { type: "spring" as const, stiffness: 400, damping: 20 },
      }
    : {};

  return (
    <motion.div
      {...cardMotion}
      className={cn(
        baseStyles,
        variants[variant],
        hoverEffects[hoverEffect],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
