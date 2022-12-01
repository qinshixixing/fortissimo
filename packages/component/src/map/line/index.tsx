import React, { useMemo, useState } from 'react';
import { Amap, Marker, InfoWindow, Polyline } from '@amap/amap-react';
import type { MapConfig, MapValue } from '../index';

export interface MapLineProps extends MapConfig {
  value?: Partial<MapValue>[];
  showArrow?: boolean;
  strokeColor?: string;
  strokeWeight?: number;
  showPoint?: boolean;
}

export function Line(props: MapLineProps) {
  const path = useMemo(() => {
    if (!props.value) return [];
    const data: [number, number][] = [];
    props.value.forEach((item) => {
      if (item.coordinate) data.push(item.coordinate);
      else if (item.longitude && item.latitude)
        data.push([item.longitude, item.latitude]);
    });
    return data;
  }, [props.value]);

  const first = useMemo(() => {
    if (!path.length) return undefined;
    return path[0];
  }, [path]);

  const last = useMemo(() => {
    if (path.length < 2) return undefined;
    return path[path.length - 1];
  }, [path]);

  const [active, setActive] = useState<[number, number] | undefined>();

  return (
    <div
      className={'ft-map'}
      style={{
        width: props.width,
        height: props.height
      }}
    >
      <Amap zoom={props.zoom || 15} center={first}>
        {props.headerTip && (
          <div className={'ft-map-header'}>{props.headerTip}</div>
        )}
        {props.showPoint && first && (
          <Marker
            position={first}
            icon={props.icon}
            label={
              props.showText
                ? {
                    content: '起点',
                    direction: 'bottom'
                  }
                : undefined
            }
            onClick={() => {
              if (props.showTip) setActive(first);
            }}
          />
        )}
        {props.showPoint && last && (
          <Marker
            position={last}
            icon={props.icon}
            label={
              props.showText
                ? {
                    content: '终点',
                    direction: 'bottom'
                  }
                : undefined
            }
            onClick={() => {
              if (props.showTip) setActive(last);
            }}
          />
        )}
        <Polyline
          path={path}
          showDir={props.showArrow}
          strokeColor={props.strokeColor || '#409EFF'}
          strokeWeight={props.strokeWeight || 6}
        />
        {props.showTip && active && (
          <InfoWindow
            position={active}
            visible={Boolean(active)}
            onClose={() => {
              setActive(undefined);
            }}
            content={active.join(',')}
          />
        )}
      </Amap>
    </div>
  );
}
