import React, { useMemo } from 'react';
import moment from 'moment';

export interface LayoutFooterProps {
  copyrightStart: number;
  copyrightEnd: number;
  corpName: string;
}

export function Footer(props: LayoutFooterProps) {
  const end = useMemo(
    () => props.copyrightEnd || moment().year(),
    [props.copyrightEnd]
  );

  const start = useMemo(
    () => props.copyrightStart || end,
    [props.copyrightStart, end]
  );

  return (
    <footer className={'ft-layout-footer'}>
      Copyright © {start}-{end} {props.corpName || ''}. All right reserved.
    </footer>
  );
}
