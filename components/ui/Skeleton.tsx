import { cn } from "@/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-300/80 rounded-2xl",
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:animate-[shimmer_1.5s_infinite] after:bg-gradient-to-r",
        "after:from-transparent after:via-white/40 after:to-transparent",
        className
      )}
    />
  );
}
