import { useCallback, useEffect } from 'react';
import { parseJson } from '@fortissimo/util';

export function useStorageMessage(callback: (key: string, value: any) => void) {
  const listener = useCallback(
    (e: StorageEvent) => {
      if (e.newValue === null || e.key === null) return;
      callback(e.key, parseJson(e.newValue));
    },
    [callback]
  );
  useEffect(() => {
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [listener]);
}
