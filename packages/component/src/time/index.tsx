import { TimePrecision } from '@fortissimo/util';

export interface TimeConfig {
  allowClear?: boolean;
  precision?: TimePrecision;
  disabledPast?: boolean;
  ignorePrecision?: TimePrecision;
  className?: string;
  format?: string;
  defaultCurrentTime?: boolean;
  isRange?: boolean;
}

export interface TimeShowConfig {
  precision?: TimePrecision;
  format?: string;
  empty?: React.ReactNode;
}

export type TimeData = moment.Moment | moment.Moment[];

export type TimeStrategy = 'none' | 'start' | 'end';

export { Point } from './point';
export type { TimePointProps } from './point';

export { Range } from './range';
export type { TimeRangeProps } from './range';

export { Show, showTime } from './show';
export type { TimeShowProps } from './show';

export { ShowRange } from './showRange';
export type { TimeShowRangeProps } from './showRange';
