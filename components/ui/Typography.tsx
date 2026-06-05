"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "lead" | "caption";
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Typography({
  variant = "body",
  children,
  className,
  as: Component,
  ...props
}: TypographyProps) {
  const styles = {
    h1: "text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight",
    h2: "text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight",
    h3: "text-2xl md:text-3xl font-bold text-white tracking-tight",
    h4: "text-xl font-bold text-white tracking-tight",
    body: "text-slate-400 text-sm md:text-base leading-relaxed",
    lead: "text-slate-300 text-base md:text-lg lg:text-xl leading-relaxed",
    caption: "text-xs font-medium text-slate-500 uppercase tracking-wider",
  };

  const defaultTag = {
    h1: "h1" as const,
    h2: "h2" as const,
    h3: "h3" as const,
    h4: "h4" as const,
    body: "p" as const,
    lead: "p" as const,
    caption: "span" as const,
  };

  const Tag = Component || defaultTag[variant];

  return (
    <Tag className={cn(styles[variant], className)} {...props}>
      {children}
    </Tag>
  );
}
