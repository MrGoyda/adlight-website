"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number;
  maxHeight?: number;
}

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ value, minHeight = 64, maxHeight = 400, className = "", onChange, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    const resize = () => {
      const el = internalRef.current;
      if (!el) return;
      el.style.height = "auto";
      const scrollHeight = el.scrollHeight;
      const targetHeight = Math.min(maxHeight, Math.max(minHeight, scrollHeight));
      el.style.height = `${targetHeight}px`;
      el.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
    };

    useEffect(() => {
      resize();
    }, [value]);

    return (
      <textarea
        ref={internalRef}
        value={value}
        onChange={(e) => {
          onChange?.(e);
          resize();
        }}
        className={`resize-none transition-all duration-150 ${className}`}
        {...props}
      />
    );
  }
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";

export default AutoResizeTextarea;
