"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "secondary" | "outline" | "ghost" | "glass";
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

  const baseStyles = "inline-flex items-center justify-center font-sans font-bold transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variants = {
    solid: "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-950/20 border border-orange-500/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600",
    outline: "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white border border-transparent",
    glass: "relative overflow-hidden bg-slate-900/40 border border-slate-700/50 text-slate-200 hover:text-white backdrop-blur-apple hover:border-slate-500/50",
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
      {!isLoading && leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-2 shrink-0">{rightIcon}</span>}
    </>
  );

  // Physics animation variables
  const clickAnimation = {
    whileTap: { scale: 0.98 },
    whileHover: { y: -2 },
    transition: { type: "spring" as const, stiffness: 400, damping: 20 },
  };

  if (href) {
    return (
      <motion.div {...clickAnimation} className="inline-block">
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
