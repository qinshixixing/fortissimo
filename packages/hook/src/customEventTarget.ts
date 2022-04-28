import { useEffect, useRef } from 'react';
import { CustomEventTarget } from '@fortissimo/util';
import type { CustomEventCallback } from '@fortissimo/util';

const eventTarget = new CustomEventTarget();

export function useCustomEventTarget(isNew?: boolean): CustomEventTarget {
  const ref = useRef(isNew ? new CustomEventTarget() : eventTarget);
  return ref.current;
}

export function useCustomEventListener(
  name: string,
  callback: CustomEventCallback,
  customTarget?: CustomEventTarget
) {
  const target = customTarget || eventTarget;
  useEffect(() => {
    target.addListener(name, callback);
    return () => {
      target.removeListener(name, callback);
    };
  }, [name, callback, target]);
}
