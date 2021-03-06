import React, { useCallback } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

import type { TimeConfig } from '../index';
import { useTimeConfig } from '../util';

export interface TimeRangeProps extends TimeConfig {
  value?: [moment.Moment, moment.Moment];
  onChange?: (data: [moment.Moment, moment.Moment]) => void;
}

export function Range(props: TimeRangeProps) {
  const { precision, options } = useTimeConfig(props);

  const valueChange = useCallback(
    (time: [moment.Moment | null, moment.Moment | null]) => {
      if (!time[0] || !time[1]) return;
      const data = time.map((item, index) => {
        if (!item) item = moment();
        if (index === 0) item.startOf(precision);
        else item.endOf(precision);
        if (props.ignorePrecision) item[props.ignorePrecision](0);
        if (props.disabledPast && item.valueOf() < moment().valueOf())
          item = moment();
        return item;
      });
      props.onChange && props.onChange(data as [moment.Moment, moment.Moment]);
    },
    [props, precision]
  );

  return (
    <DatePicker.RangePicker
      {...options}
      value={props.value}
      onChange={(data) => {
        if (!data) return;
        valueChange(data);
      }}
    />
  );
}
