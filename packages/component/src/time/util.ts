import { useMemo } from 'react';
import moment from 'moment';
import type { DatePickerProps, RangePickerProps } from 'antd/lib/date-picker';
import { getTimeFormat } from '@fortissimo/util';
import type {
  DatePrecision,
  ClockPrecision,
  TimePrecision
} from '@fortissimo/util';
import type { TimeConfig } from './index';

export const timePprecision: ClockPrecision[] = ['hour', 'minute', 'second'];

export function range(start: number, end: number) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

type Common<A, B> = Pick<
  A & B,
  Exclude<
    keyof (A & B),
    Exclude<keyof (A & B), keyof A> | Exclude<keyof (A & B), keyof B>
  >
>;

export function useTimeConfig(props: TimeConfig) {
  const precision = useMemo<TimePrecision>(
    () => props.precision || 'date',
    [props.precision]
  );

  const showTime = useMemo(
    () => timePprecision.includes(precision as ClockPrecision), // 消除报错
    [precision]
  );

  const options = useMemo<Common<DatePickerProps, RangePickerProps>>(
    () => ({
      className: props.className,
      format: props.format || getTimeFormat(props.precision),
      picker: showTime ? 'date' : (precision as DatePrecision),
      disabledDate: props.disabledPast
        ? (current) => current && current < moment().startOf('date')
        : undefined,
      disabledTime:
        props.disabledPast && showTime
          ? (current: any /* 忽略报错 */) => {
              const data: Record<string, any> = {};
              if (!current) return data;

              const now = moment();
              const select = moment(current);

              const hour = now.get('hour');
              const minute = now.get('minute');
              const second = now.get('second');

              const isCurMinute =
                now.startOf('minute').valueOf() ===
                select.startOf('minute').valueOf();
              const isCurHour =
                now.startOf('hour').valueOf() ===
                select.startOf('hour').valueOf();
              const isCurDate =
                now.startOf('date').valueOf() ===
                select.startOf('date').valueOf();

              data.disabledHours = () =>
                isCurDate ? range(0, 24).slice(0, hour) : [];
              if (precision === 'minute' || precision === 'second') {
                data.disabledMinutes = () =>
                  isCurHour ? range(0, 60).slice(0, minute) : [];
              }
              if (precision === 'second') {
                data.disabledSeconds = () =>
                  isCurMinute ? range(0, 60).slice(0, second) : [];
              }
              return data;
            }
          : undefined,
      showTime,
      showMinute: showTime && precision !== 'hour',
      showSecond: showTime && precision === 'second'
    }),
    [
      showTime,
      precision,
      props.disabledPast,
      props.className,
      props.format,
      props.precision
    ]
  );

  return { precision, showTime, options };
}
