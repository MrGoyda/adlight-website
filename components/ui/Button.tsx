"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "secondary" | "outline" | "ghost" | "glass" | "lightOutline" | "lightGlass";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: "button" | "submit" | "reset";
  title?: string;
}

export default function Button({
  children,
  className,
  variant = "solid",
  size = "md",
  href,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled = false,
  onClick,
  type = "button",
  title,
  ...props
}: ButtonProps) {
  const isBtnDisabled = disabled || isLoading;

  const baseStyles = "relative overflow-hidden group inline-flex items-center justify-center font-sans transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variants = {
    solid: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-extrabold shadow-lg shadow-orange-950/15 border border-orange-500/20 transition-colors duration-300",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 hover:border-slate-600",
    outline: "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white font-bold border border-slate-700 hover:border-slate-500",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white font-bold border border-transparent",
    glass: "bg-slate-900/40 border border-slate-700/50 text-slate-200 hover:text-white font-bold backdrop-blur-apple hover:border-slate-500/50",
    lightOutline: "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium border border-slate-200 hover:border-slate-300 shadow-sm shadow-slate-100/40",
    lightGlass: "bg-slate-100/70 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 font-medium border border-slate-200/80 hover:border-slate-300/80 backdrop-blur-md shadow-sm",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
    xl: "px-8 py-5 text-lg rounded-2xl",
  };

  const componentStyles = cn(baseStyles, variants[variant], sizes[size], className);

  const innerContent = (
    <>
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
      {!isLoading && leftIcon && <span className="mr-2 shrink-0 relative z-10">{leftIcon}</span>}
      <span className="relative z-10">{children}</span>
      {!isLoading && rightIcon && <span className="ml-2 shrink-0 relative z-10">{rightIcon}</span>}
      
      {/* Эффект Блика (Shimmer) */}
      <span className="absolute inset-y-0 -left-[100%] w-[50%] bg-gradient-to-r from-transparent via-white/[0.22] to-transparent -skew-x-[25deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out pointer-events-none" />
    </>
  );

  // Physics animation variables (Эластичная пружинная анимация Apple)
  const clickAnimation = {
    whileTap: { scale: 0.95 },
    whileHover: { y: -3, scale: 1.03 },
    transition: { type: "spring" as const, stiffness: 500, damping: 14, mass: 0.8 },
  };

  if (href) {
    const isFullWidth = className?.includes("w-full");
    return (
      <motion.div {...clickAnimation} className={cn(isFullWidth ? "w-full block" : "inline-block")}>
        <Link 
          href={href} 
          className={componentStyles} 
          onClick={onClick as any}
          title={title}
        >
          {innerContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...clickAnimation}
      type={type}
      className={componentStyles}
      disabled={isBtnDisabled}
      onClick={onClick}
      title={title}
      {...(props as any)}
    >
      {innerContent}
    </motion.button>
  );
}
