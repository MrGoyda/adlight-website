"use client";

import React, { ReactNode } from "react";
import { getTrackedWhatsappUrl } from "@/lib/clickTracker";

interface WhatsAppButtonProps {
  children?: ReactNode;
  className?: string;
  phone?: string;
  customText?: string;
  onClick?: () => void;
}

export default function WhatsAppButton({
  children,
  className = "",
  phone = "77071356701",
  customText,
  onClick,
}: WhatsAppButtonProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();

    const trackedUrl = await getTrackedWhatsappUrl(phone, customText);
    window.open(trackedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={`https://wa.me/${phone.replace(/\D/g, "")}`}
      onClick={handleClick}
      className={className}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children || "WhatsApp"}
    </a>
  );
}
