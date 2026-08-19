"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";
import { triggerHaptic } from "@/lib/haptics";

interface MobileMenuLettersProps {
  onLinkClick: () => void;
}

export default function MobileMenuLetters({ onLinkClick }: MobileMenuLettersProps) {
  const [isLettersOpen, setIsLettersOpen] = useState(false);

  const toggleLetters = () => {
    triggerHaptic("light");
    setIsLettersOpen((prev) => !prev);
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden">
      <button
        type="button"
        onClick={toggleLetters}
        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 transition duration-200 text-left cursor-pointer"
      >
        <span className="font-extrabold text-sm text-slate-800">Технологии объемных букв</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
            isLettersOpen ? "rotate-180 text-orange-600" : ""
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isLettersOpen
            ? "max-h-[600px] opacity-100 border-t border-slate-200"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-2.5 bg-white grid gap-1">
          <Link
            href="/services/volume-letters"
            className="flex items-center justify-between p-2.5 rounded-lg text-xs font-black text-orange-600 bg-orange-50/60 hover:text-orange-700 hover:bg-orange-50 transition duration-200"
            onClick={onLinkClick}
          >
            <span>Все виды объемных букв</span>
            <ChevronRight className="w-3.5 h-3.5 text-orange-500" />
          </Link>
          {VOLUME_LETTERS_CATALOG.map((tech) => (
            <Link
              key={tech.id}
              href={`/services/volume-letters/${tech.slug}`}
              className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-orange-600 hover:bg-slate-50 transition duration-200"
              onClick={onLinkClick}
            >
              <span>{tech.title}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
