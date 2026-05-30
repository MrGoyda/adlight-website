"use client";

// A global set to track active scroll locks by unique keys/IDs.
// Using a Set prevents duplicate lock registrations and handles race conditions 
// when multiple overlays open or close concurrently.
const activeLocks = new Set<string>();

export function lockScroll(key: string) {
  if (typeof window === "undefined") return;
  
  activeLocks.add(key);
  document.body.style.overflow = "hidden";
}

export function unlockScroll(key: string) {
  if (typeof window === "undefined") return;
  
  activeLocks.delete(key);
  if (activeLocks.size === 0) {
    document.body.style.overflow = "";
  }
}
