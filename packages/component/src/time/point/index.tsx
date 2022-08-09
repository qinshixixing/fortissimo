import React, { useCallback, useMemo } from 'react';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';

import type { TimeConfig, TimeStrategy } from '../index';
import { useTimeConfig } from '../util';

export interface TimePointProps extends TimeConfig {
  strategy?: TimeStrategy;
  value?: DatePickerProps['value'];
  onChange?: (data: DatePickerProps['value']) => void;
}

export function Point(props: TimePointProps) {
  const { precision, options } = useTimeConfig(props);

  const strategy = useMemo<TimeStrategy>(
    () => props.strategy || 'none',
    [props.strategy]
  );

  const valueChange = useCallback(
    (time: DatePickerProps['value']) => {
      if (!props.onChange) return;
      if (!time) {
        props.onChange(undefined);
        return;
      }
      if (strategy === 'start') time.startOf(precision);
      else if (strategy === 'end') time.endOf(precision);
      if (props.ignorePrecision) time[props.ignorePrecision](0);
      if (props.disabledPast && time.valueOf() < moment().valueOf())
        time = moment();
      props.onChange(time);
    },
    [props, strategy, precision]
  );

  return (
    <DatePicker
      {...options}
      placeholder={'请选择时间'}
      value={props.value}
      onChange={(data) => {
        valueChange(data);
      }}
    />
  );
}
