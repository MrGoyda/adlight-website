/**
 * Утилита надежного копирования в буфер обмена для любых браузеров и устройств.
 * Поддерживает fallback для незащищенных HTTP контекстов (например локальный IP в iOS Safari).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // 1. Попытка через стандартный Clipboard API (работает в HTTPS и localhost)
  if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("navigator.clipboard.writeText threw error, switching to fallback:", err);
    }
  }

  // 2. Fallback через document.execCommand('copy') для iOS Safari на HTTP IP
  if (typeof document !== "undefined") {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      
      // На iOS выделяем через range
      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.focus();
        textArea.select();
      }

      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    } catch (fallbackErr) {
      console.error("document.execCommand fallback failed:", fallbackErr);
    }
  }

  return false;
}
