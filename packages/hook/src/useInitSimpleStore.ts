import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export type SimpleStore<T> = T & { dispatch: Dispatch<SetStateAction<T>> };

export function useInitSimpleStore<T>(storeData: T): SimpleStore<T> {
  const [state, setState] = useState(storeData);
  return {
    ...state,
    dispatch: (param) => {
      if (typeof param !== 'function')
        param = {
          ...state,
          ...param
        };
      return setState(param);
    }
  };
}
