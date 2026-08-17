/**
 * Единый менеджер всплывающих уведомлений и подтверждений (Toasts & Alerts)
 * Работает в любом Client Component без проп-дриллинга.
 */

import { ToastType, ConfirmDialogOptions } from "@/components/ui/ToastProvider";

export const toast = {
  success: (message: string, title?: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("crm:toast", {
          detail: { type: "success" as ToastType, message, title },
        })
      );
    }
  },

  error: (message: string, title?: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("crm:toast", {
          detail: { type: "error" as ToastType, message, title },
        })
      );
    }
  },

  info: (message: string, title?: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("crm:toast", {
          detail: { type: "info" as ToastType, message, title },
        })
      );
    }
  },

  warning: (message: string, title?: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("crm:toast", {
          detail: { type: "warning" as ToastType, message, title },
        })
      );
    }
  },

  confirm: (options: ConfirmDialogOptions) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("crm:confirm", {
          detail: options,
        })
      );
    }
  },
};
