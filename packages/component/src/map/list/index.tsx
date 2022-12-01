import React, { useMemo, useState } from 'react';
import { Amap, Marker, InfoWindow } from '@amap/amap-react';
import type { MapPointConfig, MapValue } from '../index';

export interface MapListProps extends MapPointConfig {
  value?: Partial<MapValue>[];
}

export function List(props: MapListProps) {
  const [activePosition, setActivePosition] = useState<
    Partial<MapValue> | undefined
  >(props.value ? props.value[0] : undefined);
  const activeCoordinate = useMemo<number[] | undefined>(() => {
    if (!activePosition) return undefined;
    if (activePosition.coordinate) return activePosition.coordinate;
    if (activePosition.longitude && activePosition.latitude)
      return [activePosition.longitude, activePosition.latitude];
    return undefined;
  }, [activePosition]);

  return (
    <div
      className={'ft-map'}
      style={{
        width: props.width,
        height: props.height
      }}
    >
      <Amap zoom={props.zoom || 15} center={activeCoordinate}>
        {props.headerTip && (
          <div className={'ft-map-header'}>{props.headerTip}</div>
        )}
        {(props.value || []).map((item, index) => {
          let coordinate: [number, number] | undefined;
          if (item.coordinate) coordinate = item.coordinate;
          else if (item.longitude && item.latitude)
            coordinate = [item.longitude, item.latitude];

          return (
            <>
              {coordinate && (
                <Marker
                  key={index}
                  position={coordinate}
                  icon={props.icon}
                  label={
                    props.showText && item.text
                      ? { content: item.text, direction: 'bottom' }
                      : undefined
                  }
                  onClick={() => {
                    if (props.showTip) {
                      setActivePosition(item);
                    }
                  }}
                >
                  {props.render ? props.render(item) : props.children}
                </Marker>
              )}
            </>
          );
        })}
        {props.showTip && activeCoordinate && (
          <InfoWindow
            visible={Boolean(activePosition)}
            position={activeCoordinate}
            offset={[0, -30]}
            closeWhenClickMap
            onClose={() => {
              setActivePosition(undefined);
            }}
            content={activePosition?.tip}
            isCustom={Boolean(props.tipRender)}
          >
            {props.tipRender ? props.tipRender(activePosition) : ''}
          </InfoWindow>
        )}
      </Amap>
    </div>
  );
}
