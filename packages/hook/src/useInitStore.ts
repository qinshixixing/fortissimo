import { useCallback, useReducer } from 'react';
import type { Dispatch } from 'react';

export type StoreData<T> = {
  state: T;
  commit: {
    [propName: string]: (state: T, data?: any) => Partial<T>;
  };
  dispatch: {
    [propName: string]: (
      state: T,
      commit: Dispatch<{ type: string; [propName: string]: any }>,
      data?: any
    ) => Promise<any>;
  };
};

export type Store<T> = {
  state: T;
  commit: Dispatch<{ type: string; [propName: string]: any }>;
  dispatch: (data: any) => Promise<void>;
};

export function useInitStore<T>(storeData: StoreData<T>): Store<T> {
  const [stateData, commitAction] = useReducer(
    (state: T, data: { [propName: string]: any }) => {
      if (typeof storeData.commit[data.type] === 'function') {
        const commitData = { ...data };
        Reflect.deleteProperty(commitData, 'type');
        const updateState = storeData.commit[data.type](state, commitData);
        return {
          ...state,
          ...updateState
        };
      } else {
        throw new Error('commit type is wrong!');
      }
    },
    storeData.state
  );
  const dispatchAction = useCallback(
    async (data: any) => {
      if (typeof storeData.dispatch[data.type] === 'function') {
        const dispatchData = { ...data };
        Reflect.deleteProperty(dispatchData, 'type');
        return await storeData.dispatch[data.type](
          stateData,
          commitAction,
          dispatchData
        );
      } else {
        throw new Error('action type is wrong!');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stateData, commitAction]
  );
  return {
    state: stateData,
    commit: commitAction,
    dispatch: dispatchAction
  };
}
