import { initialState, useMainSlice, mainActions, MainState } from './index';
import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';

import * as ReactRedux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import * as AT from 'api/actionTypes';
import { runSaga } from 'redux-saga';
import { api } from 'api/band';
import { selectMain } from './selectors';
import { getCombinationsMainRequest } from './saga';

jest.mock('utils/redux-injectors', () => {
  const originalModule = jest.requireActual('utils/redux-injectors');
  return {
    __esModule: true,
    ...originalModule,
    useInjectSaga: jest.fn((params: InjectSagaParams) => {}),
    useInjectReducer: jest.fn(
      (params: InjectReducerParams<RootStateKeyType>) => {},
    ),
  };
});

jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => jest.fn());

test('should return initial state', () => {
  const { result } = renderHook(() => useMainSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);
});

test('return init when state is null', () => {
  expect(selectMain({})).toBe(initialState);
});

test('should handle combinations response state', () => {
  const stateInit: MainState = {
    combinationsResponse: { loading: false },
  };
  const stateLoading: MainState = {
    combinationsResponse: { loading: true },
  };
  const stateSuccess: MainState = {
    combinationsResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: MainState = {
    combinationsResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  const { result } = renderHook(() => useMainSlice());

  expect(
    result.current.reducer(
      stateInit,
      mainActions.loadingCombinationsResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      mainActions.successCombinationsResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      mainActions.errorCombinationsResponse('MOCK_ERROR'),
    ),
  ).toEqual(stateError);
});

test('should handle combinations Response onError', async () => {
  const dispatched: any[] = [];
  api.getCombinationsMain = jest.fn(
    () =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );

  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    getCombinationsMainRequest,
    {
      type: AT.LOAD_COMBINATIONS_MAIN.REQUEST,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    mainActions.loadingCombinationsResponse('start load'),
    mainActions.errorCombinationsResponse('REJECT' as any),
  ]);
});
