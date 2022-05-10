import React from 'react';
import { Divider } from 'antd';

export interface EditorShowConfig {
  height?: string | number;
  scroll?: boolean;
}

export interface EditorShowProps extends EditorShowConfig {
  value?: string;
}

export function Show(props: EditorShowProps) {
  return (
    <>
      <Divider />
      <div dangerouslySetInnerHTML={{ __html: props.value || '' }} />
    </>
  );
}
