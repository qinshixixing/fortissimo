export type DatePrecision = 'year' | 'quarter' | 'month' | 'week' | 'date';

export type ClockPrecision = 'hour' | 'minute' | 'second' | 'millisecond';

export type TimePrecision = DatePrecision | ClockPrecision;

export function getTimeFormat(precision?: TimePrecision): string {
  switch (precision) {
    case 'year':
      return 'YYYY';
    case 'quarter':
      return 'YYYY-Q';
    case 'month':
      return 'YYYY-MM';
    case 'week':
      return 'YYYY-ww';
    case 'date':
      return 'YYYY-MM-DD';
    case 'hour':
      return 'YYYY-MM-DD HH';
    case 'minute':
      return 'YYYY-MM-DD HH:mm';
    case 'millisecond':
      return 'YYYY-MM-DD HH:mm:ss.SSS';
    case 'second':
    default:
      return 'YYYY-MM-DD HH:mm:ss';
  }
}
