import React, { useCallback } from 'react';
import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';

import type { TimeConfig } from '../index';
import { useTimeConfig } from '../util';

export interface TimeRangeProps extends TimeConfig {
  value?: RangePickerProps['value'];
  onChange?: (data: RangePickerProps['value']) => void;
  ranges?: RangePickerProps['ranges'];
}

export function Range(props: TimeRangeProps) {
  const { precision, options } = useTimeConfig(props);

  const valueChange = useCallback(
    (time: RangePickerProps['value']) => {
      if (!props.onChange) return;
      if (!time) {
        props.onChange(undefined);
        return;
      }
      const data = time.map((item, index) => {
        if (!item) return item;
        if (!item) item = moment();
        if (index === 0) item.startOf(precision);
        else item.endOf(precision);
        if (props.ignorePrecision) item[props.ignorePrecision](0);
        if (props.disabledPast && item.valueOf() < moment().valueOf())
          item = moment();
        return item;
      });
      props.onChange(data as [moment.Moment, moment.Moment]);
    },
    [props, precision]
  );

  return (
    <DatePicker.RangePicker
      {...options}
      ranges={props.ranges}
      value={props.value}
      onChange={(data) => {
        valueChange(data);
      }}
    />
  );
}
