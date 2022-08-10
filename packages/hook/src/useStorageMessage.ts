import { useCallback, useEffect } from 'react';
import { parseJson, setStorageMsgKey } from '@fortissimo/util';
import type { StorageMsgData } from '@fortissimo/util';

export function useStorageMessage(
  callback: (name: string, data: any, key: string) => void,
  key?: string
) {
  const listener = useCallback(
    (e: StorageEvent) => {
      if (e.newValue === null || e.key === null) return;
      const msgKey = key || setStorageMsgKey();
      if (e.key !== msgKey) return;
      const value: StorageMsgData = parseJson(e.newValue);
      callback(value.name, value.data, e.key);
    },
    [callback, key]
  );
  useEffect(() => {
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [listener]);
}
