"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CrmBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function CrmBreadcrumbs({ items }: CrmBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-3 select-none flex-wrap">
      <Link 
        href="/admin/leads" 
        className="flex items-center gap-1 text-slate-400 hover:text-orange-500 transition"
      >
        <Home className="w-3.5 h-3.5" />
        <span>CRM</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            {item.href && !isLast ? (
              <Link 
                href={item.href} 
                className="hover:text-orange-600 transition truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`truncate max-w-[240px] ${isLast ? "font-bold text-slate-900" : ""}`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
