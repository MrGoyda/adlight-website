"use client";

import React, { forwardRef } from "react";
import { Phone, X } from "lucide-react";
import { formatPhoneInput } from "@/lib/phoneUtils";
import { triggerHaptic } from "@/lib/haptics";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  showIcon?: boolean;
  clearable?: boolean;
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
      clearable = true,
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
      if (!rawVal) {
        onChange("");
        return;
      }
      const formatted = formatPhoneInput(rawVal);
      onChange(formatted);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        const input = e.currentTarget;
        const { selectionStart, selectionEnd } = input;

        // Если выделен весь текст или длина номера минимальна — сразу очищаем в ноль
        if (
          (selectionStart === 0 && selectionEnd === input.value.length) ||
          input.value.length <= 4
        ) {
          e.preventDefault();
          onChange("");
        }
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      if (pasted) {
        const formatted = formatPhoneInput(pasted);
        onChange(formatted);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerHaptic("light");
      onChange("");
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
          autoComplete="off"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={`w-full bg-white border rounded-xl text-slate-900 font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none text-base sm:text-xs shadow-2xs transition font-mono ${
            showIcon ? "pl-8" : "pl-3"
          } ${clearable && value ? "pr-8" : "pr-3"} py-2.5 ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 text-rose-950 bg-rose-50/20"
              : "border-slate-200"
          } ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""} ${className}`}
        />

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
            title="Очистить номер"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
