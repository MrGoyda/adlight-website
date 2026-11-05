import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Идиоматичный хук проверки гидратации на клиенте без каскадного setState в useEffect
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
