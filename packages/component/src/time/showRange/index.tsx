import React from 'react';

import { Show } from '../index';
import type { TimeShowConfig } from '../index';

export interface TimeShowRangeProps extends TimeShowConfig {
  value?: [moment.Moment, moment.Moment];
}

export function ShowRange(props: TimeShowRangeProps) {
  return (
    <>
      <Show {...props} value={props.value && props.value[0]} /> -{' '}
      <Show {...props} value={props.value && props.value[1]} />
    </>
  );
}
