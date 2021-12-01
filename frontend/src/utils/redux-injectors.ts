import {
  useInjectReducer as useReducer,
  useInjectSaga as useSaga,
  SagaInjectionModes,
} from 'redux-injectors';
import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from './types/injector-typings';
import { useStore } from 'react-redux';
import { useEffect } from 'react';

/* Wrap redux-injectors with stricter types */

export function useInjectReducer<Key extends RootStateKeyType>(
  params: InjectReducerParams<Key>,
) {
  return useReducer(params);
}

export function useInjectSaga(params: InjectSagaParams) {
  const store: any = useStore();
  const newParams = { ...params };
  useEffect(() => {
    return function cleanUp() {
      if (
        params.mode &&
        params.mode === SagaInjectionModes.RESTART_ON_REMOUNT &&
        Reflect.has(store.injectedSagas, params.key)
      ) {
        store.injectedSagas[params.key].task.cancel();
        delete store.injectedSagas[params.key];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (params.mode && params.mode === SagaInjectionModes.RESTART_ON_REMOUNT) {
    newParams.mode = SagaInjectionModes.DAEMON;
  }
  return useSaga(newParams);
}
