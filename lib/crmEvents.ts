/**
 * Единый реестр глобальных событий CRM.
 * Устраняет хардкод магических строк и гарантирует строгую типизацию.
 */

export const CRM_EVENTS = {
  OPEN_CREATE_LEAD: "crm:open-create-lead",
  OPEN_ESTIMATE: "crm:open-estimate",
  OPEN_CREATE_CLIENT: "crm:open-create-client",
  OPEN_BATCH_IMPORT: "crm:open-batch-import",
  OPEN_EXPORT_AUDIENCE: "crm:open-export-audience",
} as const;

export type CrmEventType = (typeof CRM_EVENTS)[keyof typeof CRM_EVENTS];

/**
 * Безопасная отправка глобального события CRM
 */
export function dispatchCrmEvent(event: CrmEventType, detail?: any) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(event, { detail }));
  }
}
