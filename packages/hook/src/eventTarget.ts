import { useEffect, useRef } from 'react';

const eventTarget = new EventTarget();

export function useEventTarget(isNew?: boolean): EventTarget {
  const ref = useRef(isNew ? new EventTarget() : eventTarget);
  return ref.current;
}

export function useEventListener(
  name: string,
  callback: EventListener,
  customTarget?: EventTarget
) {
  const target = customTarget || eventTarget;
  useEffect(() => {
    target.addEventListener(name, callback);
    return () => {
      target.removeEventListener(name, callback);
    };
  }, [name, callback, target]);
}
