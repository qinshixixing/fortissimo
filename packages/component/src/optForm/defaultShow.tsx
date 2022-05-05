import React, { useMemo } from 'react';

export function DefaultShow<V = any>(props: { value?: V }) {
  const text = useMemo(() => {
    if (typeof props.value === 'number') return String(props.value);
    return props.value ? String(props.value) : '';
  }, [props.value]);

  return <>{text}</>;
}
