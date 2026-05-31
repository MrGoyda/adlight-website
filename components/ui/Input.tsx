"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
  icon?: React.ReactNode;
  error?: string;
  variant?: "light" | "dark";
}

export default function Input({
  label,
  hideLabel = true,
  icon,
  error,
  variant = "dark",
  className,
  id,
  required,
  disabled,
  ...props
}: InputProps) {
  const fallbackId = React.useId();
  const uniqueId = id || fallbackId;
  const isLight = variant === "light";

  return (
    <div className="w-full space-y-2 text-left">
      <label 
        htmlFor={uniqueId} 
        className={cn(
          "block text-sm font-medium mb-1",
          isLight ? "text-slate-600" : "text-slate-400",
          hideLabel && "sr-only"
        )}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative w-full rounded-xl">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 shrink-0 pointer-events-none z-20 flex items-center justify-center">
            {icon}
          </div>
        )}

        <input
          id={uniqueId}
          required={required}
          disabled={disabled}
          className={cn(
            "w-full border rounded-xl py-4 transition-all outline-none focus:ring-2",
            isLight 
              ? "bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-orange-500/20" 
              : "bg-slate-900 text-white placeholder:text-slate-600 focus:ring-orange-500/50",
            icon ? "pl-12 pr-4" : "px-5",
            error 
              ? "border-red-500 focus:border-red-500" 
              : isLight
                ? "border-slate-200 focus:border-orange-500 focus:bg-white"
                : "border-slate-800 focus:border-orange-500 focus:bg-slate-900/80",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

