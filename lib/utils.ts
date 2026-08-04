import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function enrichLeadWithAnalytics(baseData: Record<string, unknown>) {
  if (typeof window === "undefined") return baseData;

  return {
    ...baseData,
    utmSource: sessionStorage.getItem("utm_source") || null,
    utmMedium: sessionStorage.getItem("utm_medium") || null,
    utmCampaign: sessionStorage.getItem("utm_campaign") || null,
    utmContent: sessionStorage.getItem("utm_content") || null,
    utmTerm: sessionStorage.getItem("utm_term") || null,
    yandexClientId: sessionStorage.getItem("yandexClientId") || null,
    googleClientId: sessionStorage.getItem("googleClientId") || null,
    fbBrowserId: sessionStorage.getItem("fbBrowserId") || null,
  };
}