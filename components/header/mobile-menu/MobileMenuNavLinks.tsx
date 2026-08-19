"use client";

import React from "react";
import Link from "next/link";
import { COMMON_NAV_LINKS } from "@/dictionaries/common";

interface MobileMenuNavLinksProps {
  onLinkClick: () => void;
}

export default function MobileMenuNavLinks({ onLinkClick }: MobileMenuNavLinksProps) {
  const mainLinks = COMMON_NAV_LINKS.filter((link) => link.href !== "/calculator");

  return (
    <div className="space-y-2.5">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
        Основные страницы
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {mainLinks.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="flex items-center justify-center text-sm font-extrabold text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-orange-500/20 hover:bg-slate-100/50 hover:text-orange-600 transition duration-200 text-center active:scale-[0.97]"
            onClick={onLinkClick}
          >
            {page.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
