import React, {
  useMemo,
  useImperativeHandle,
  forwardRef,
  useRef,
  useState
} from 'react';
import { Amap, Circle as AmapCircle, InfoWindow } from '@amap/amap-react';
import type { MapConfig, MapValue } from '../index';

export interface MapCircleValue {
  center: Partial<MapValue>;
  radius: number;
}

export interface MapCircleProps extends MapConfig {
  value?: MapCircleValue;
}

export const Circle = forwardRef((props: MapCircleProps, ref) => {
  const map = useRef<AMap.Map>();

  const center = useMemo(() => {
    if (!props.value) return undefined;
    const data = props.value.center;
    if (data.coordinate) return data.coordinate;
    else if (data.longitude && data.latitude)
      return [data.longitude, data.latitude];
    return undefined;
  }, [props.value]);

  const radius = useMemo(() => {
    if (!props.value) return 0;
    return props.value.radius;
  }, [props.value]);

  const [active, setActive] = useState(false);

  useImperativeHandle(ref, () => ({
    getMap: () => map.current
  }));

  return (
    <div
      className={'ft-map'}
      style={{
        width: props.width,
        height: props.height
      }}
    >
      <Amap ref={map} zoom={props.zoom || 15} center={center}>
        {props.headerTip && (
          <div className={'ft-map-header'}>{props.headerTip}</div>
        )}
        {center && (
          <AmapCircle
            center={center}
            radius={radius}
            onClick={() => {
              if (!props.showTip) return;
              setActive(true);
            }}
          />
        )}
        {props.showTip && center && active && (
          <InfoWindow
            position={center}
            visible={active}
            onClose={() => {
              setActive(false);
            }}
            content={`中心点：${center.join(',')}；半径：${radius}`}
          />
        )}
      </Amap>
    </div>
  );
});
