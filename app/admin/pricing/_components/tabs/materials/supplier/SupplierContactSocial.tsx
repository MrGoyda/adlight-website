"use client";

import React from "react";
import { Globe, Instagram, ExternalLink } from "lucide-react";
import { pricingDict } from "@/dictionaries/pricing";

interface SupplierContactSocialProps {
  website?: string | null;
  instagram?: string | null;
}

export default function SupplierContactSocial({
  website,
  instagram,
}: SupplierContactSocialProps) {
  if (!website && !instagram) return null;

  const t = pricingDict.modals.supplierInfo;

  const getCleanWebsiteUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const getInstagramUrl = (handle: string) => {
    const clean = handle.trim().replace(/^@/, "");
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }
    return `https://instagram.com/${clean}`;
  };

  const cleanInstagramHandle = (handle: string) => {
    const clean = handle.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
    return clean.startsWith("@") ? clean : `@${clean}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {website && (
        <a
          href={getCleanWebsiteUrl(website)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-50 border border-blue-200/80 transition cursor-pointer flex items-center justify-between group"
        >
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5 mb-0.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              {t.websiteLabel}
            </span>
            <span className="text-xs font-black text-slate-900 group-hover:text-blue-700 truncate block">
              {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0 ml-1" />
        </a>
      )}

      {instagram && (
        <a
          href={getInstagramUrl(instagram)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-pink-50/60 hover:bg-pink-50 border border-pink-200/80 transition cursor-pointer flex items-center justify-between group"
        >
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-700 flex items-center gap-1.5 mb-0.5">
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              {t.instagramLabel}
            </span>
            <span className="text-xs font-black text-slate-900 group-hover:text-pink-700 truncate block">
              {cleanInstagramHandle(instagram)}
            </span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-pink-500 shrink-0 ml-1" />
        </a>
      )}
    </div>
  );
}
