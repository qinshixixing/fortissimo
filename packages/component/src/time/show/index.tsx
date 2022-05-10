import React from 'react';
import { getTimeFormat } from '@fortissimo/util';
import type { TimeShowConfig } from '../index';

export interface TimeShowProps extends TimeShowConfig {
  value?: moment.Moment;
}

function showTime(options: TimeShowProps): string {
  if (!options.value) return '';
  let format = options.format;
  if (!format) format = getTimeFormat(options.precision);
  return options.value.format(format);
}

export function Show(props: TimeShowProps) {
  return <>{!props.value && props.empty ? props.empty : showTime(props)}</>;
}
