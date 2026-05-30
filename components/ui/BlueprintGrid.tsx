import { cn } from "@/lib/utils";

interface BlueprintGridProps {
  className?: string;
  showGradients?: boolean;
}

export default function BlueprintGrid({
  className,
  showGradients = true,
}: BlueprintGridProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none select-none overflow-hidden", className)}>
      {showGradients && (
        <>
          {/* Приглушенные Apple-градиенты */}
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/[0.06] blur-[160px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/[0.04] blur-[160px] rounded-full" />
        </>
      )}

      {/* Полупрозрачная чертежная сетка (Blueprint grid с основными рамками 100px и миллиметровыми делениями 20px) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.12) 1px, transparent 1px),
            linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
        }}
      />
    </div>
  );
}
