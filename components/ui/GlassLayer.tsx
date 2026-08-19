"use client";

import { cn } from "@/lib/utils";

interface GlassLayerProps {
  isAnimating?: boolean;
  className?: string;
  intensity?: "light" | "heavy";
}

export default function GlassLayer({
  isAnimating = false,
  className,
  intensity = "light"
}: GlassLayerProps) {
  return (
    <div
      style={{ isolation: "isolate" }}
      className={cn(
        "absolute inset-0 z-[-1] rounded-inherit pointer-events-none gpu-layer transition-opacity duration-200",
        "bg-white/60 dark:bg-black/40",
        isAnimating
          ? "backdrop-filter-none bg-white/95 dark:bg-black/90"
          : "backdrop-blur-apple backdrop-saturate-apple apple-glass-heavy",
        className
      )}
    />
  );
}

