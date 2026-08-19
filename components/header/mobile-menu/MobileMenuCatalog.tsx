"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import { triggerHaptic } from "@/lib/haptics";

interface MobileMenuCatalogProps {
  onLinkClick: () => void;
}

export default function MobileMenuCatalog({ onLinkClick }: MobileMenuCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    triggerHaptic("light");
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="space-y-2.5">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
        Каталог конструкций
      </h4>
      <div className="space-y-2">
        {CATALOG_SERVICES.map((group) => {
          const isActive = activeCategory === group.id;
          return (
            <div
              key={group.id}
              className="border border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleCategory(group.id)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 transition duration-200 text-left cursor-pointer"
              >
                <span className="font-extrabold text-sm text-slate-800">{group.category}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    isActive ? "rotate-180 text-orange-600" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isActive
                    ? "max-h-[500px] opacity-100 border-t border-slate-200"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-2.5 bg-white grid gap-1">
                  {group.items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.link}
                      className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-orange-600 hover:bg-slate-50 transition duration-200"
                      onClick={onLinkClick}
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
