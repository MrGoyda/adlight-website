"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassLayerProps {
  isAnimating?: boolean;
  className?: string;
  intensity?: "light" | "heavy";
}

export default function GlassLayer({
  isAnimating = false,
  className,
  intensity = "light",
}: GlassLayerProps) {
  return (
    <motion.div
      style={{ isolation: "isolate" }}
      className={cn(
        "absolute inset-0 z-[-1] rounded-inherit pointer-events-none gpu-layer",
        intensity === "light" 
          ? "bg-slate-900/40 border border-slate-800/50" 
          : "bg-slate-950/70 border border-slate-800/80",
        isAnimating
          ? "backdrop-filter-none bg-slate-900/90"
          : "backdrop-blur-apple backdrop-saturate-apple apple-glass-heavy",
        className
      )}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    />
  );
}
