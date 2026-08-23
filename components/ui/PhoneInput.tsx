"use client";

import React, { forwardRef } from "react";
import { Phone } from "lucide-react";
import { formatPhoneInput } from "@/lib/phoneUtils";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  showIcon?: boolean;
  error?: string | boolean;
  wrapperClassName?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      placeholder = "+7 (___) ___-__-__",
      showIcon = true,
      error,
      className = "",
      wrapperClassName = "",
      disabled = false,
      required = false,
      autoFocus = false,
      id,
      name,
      ...rest
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawVal = e.target.value;
      const formatted = formatPhoneInput(rawVal);
      onChange(formatted);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      if (pasted) {
        const formatted = formatPhoneInput(pasted);
        onChange(formatted);
      }
    };

    return (
      <div className={`relative w-full ${wrapperClassName}`}>
        {showIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Phone className="w-3.5 h-3.5" />
          </div>
        )}

        <input
          {...rest}
          ref={ref}
          id={id}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={`w-full bg-white border rounded-xl text-slate-900 font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none text-base sm:text-xs shadow-2xs transition font-mono ${
            showIcon ? "pl-8 pr-3" : "px-3"
          } py-2.5 ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 text-rose-950 bg-rose-50/20"
              : "border-slate-200"
          } ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""} ${className}`}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
