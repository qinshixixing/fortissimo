import { useState, useEffect } from 'react';

export function useWatch<T>(
  fn: (value: T, oldValue: T) => void,
  value: T
): void {
  const [oldValue, setOldValue] = useState<T>(value);
  useEffect(() => {
    if (value === oldValue) return;
    setOldValue(value);
    return fn(value, oldValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, value]);
}
