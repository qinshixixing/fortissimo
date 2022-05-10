import React, { useCallback, useMemo } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

import type { TimeConfig, TimeStrategy } from '../index';
import { useTimeConfig } from '../util';

export interface TimePointProps extends TimeConfig {
  strategy?: TimeStrategy;
  value?: moment.Moment;
  onChange?: (data: moment.Moment) => void;
}

export function Point(props: TimePointProps) {
  const { precision, options } = useTimeConfig(props);

  const strategy = useMemo<TimeStrategy>(
    () => props.strategy || 'none',
    [props.strategy]
  );

  const valueChange = useCallback(
    (time: moment.Moment) => {
      if (strategy === 'start') time.startOf(precision);
      else if (strategy === 'end') time.endOf(precision);
      if (props.ignorePrecision) time[props.ignorePrecision](0);
      if (props.disabledPast && time.valueOf() < moment().valueOf())
        time = moment();
      props.onChange && props.onChange(time);
    },
    [props, strategy, precision]
  );

  return (
    <DatePicker
      {...options}
      placeholder={'请选择时间'}
      value={props.value}
      onChange={(data) => {
        if (!data) return;
        valueChange(data);
      }}
    />
  );
}
