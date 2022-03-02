import { useEffect } from 'react';

export function useMount(fn: () => void): void {
  useEffect(() => {
    return fn();
    // eslint-disable-next-line
  }, [])
}
