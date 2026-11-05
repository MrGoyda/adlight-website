"use client";

import React from "react";
import { EstimateItemType } from "@prisma/client";
import {
  Truck,
  Construction,
  Wrench,
  Hammer,
  Package,
  Tag,
  SlidersHorizontal,
} from "lucide-react";

interface RateCategoryIconProps {
  type: EstimateItemType | string;
  className?: string;
}

export function renderRateCategoryIcon(
  type: EstimateItemType | string,
  className = "w-4 h-4"
): React.ReactNode {
  switch (type) {
    case "LOGISTICS":
      return <Truck className={className} />;
    case "EQUIPMENT":
      return <Construction className={className} />;
    case "ASSEMBLY":
      return <Wrench className={className} />;
    case "INSTALLATION":
      return <Hammer className={className} />;
    case "MATERIAL_STOCK":
      return <Package className={className} />;
    case "MATERIAL_SUPPLIER":
      return <Tag className={className} />;
    case "CUSTOM":
    default:
      return <SlidersHorizontal className={className} />;
  }
}

export default function RateCategoryIcon({ type, className }: RateCategoryIconProps) {
  return <>{renderRateCategoryIcon(type, className)}</>;
}
