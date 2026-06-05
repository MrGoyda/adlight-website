"use client";

interface BreakdownItem {
  label: string;
  value: string;
}

interface PriceBreakdownProps {
  items: BreakdownItem[];
}

export default function PriceBreakdown({ items }: PriceBreakdownProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
      {items.map((item, i) => (
        <div key={i} className="flex justify-between items-start gap-2 text-sm">
          <span className="text-slate-500 truncate">{item.label}</span>
          <span className="shrink-0 text-right">
            <span className="text-slate-700 font-medium tabular-nums">~ {item.value}</span>
            <span className="block text-[10px] text-slate-400 font-normal">ориентировочно</span>
          </span>
        </div>
      ))}
    </div>
  );
}
