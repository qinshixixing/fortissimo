import React from 'react';

export interface EditorShowConfig {
  height?: string | number;
  scroll?: boolean;
}

export interface EditorShowProps extends EditorShowConfig {
  value?: string;
}

export function Show(props: EditorShowProps) {
  return (
    <div
      style={
        props.scroll
          ? {
              height: props.height || '300px',
              overflow: 'auto'
            }
          : undefined
      }
      dangerouslySetInnerHTML={{ __html: props.value || '' }}
    />
  );
}
