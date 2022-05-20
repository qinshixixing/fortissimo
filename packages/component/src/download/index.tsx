import React from 'react';
import { downloadBlob } from '@fortissimo/util';

export interface DownloadProps {
  value?: string;
  name?: string;
}

export function Download(props: DownloadProps) {
  return (
    <a
      download={props.name || props.value}
      onClick={async (e) => {
        e.preventDefault();
        if (!props.value) return;
        await downloadBlob({
          url: props.value,
          filename: props.name || props.value
        });
      }}
    >
      {props.name || props.value || ''}
    </a>
  );
}
