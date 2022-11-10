import React, { HTMLAttributes, useMemo } from 'react';

export interface EditorShowConfig
  extends Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  height?: string | number;
  scroll?: boolean;
}

export interface EditorShowProps extends EditorShowConfig {
  value?: string;
}

export function Show(props: EditorShowProps) {
  const scrollStyle = useMemo(
    () =>
      props.scroll
        ? {
            height: props.height || '300px',
            overflow: 'auto'
          }
        : undefined,
    [props.height, props.scroll]
  );

  return (
    <div
      {...props}
      style={{
        ...props.style,
        ...scrollStyle
      }}
      dangerouslySetInnerHTML={{ __html: props.value || '' }}
    />
  );
}
