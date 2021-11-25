import { initialState, CoverState, useCoverSlice, coverActions } from './index';

import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectSlice } from './selectors';
import coverPageSaga, { getCoverResponse } from './saga';
import { dummyCovers } from 'api/dummy';
import { takeEvery } from '@redux-saga/core/effects';
import * as AT from 'api/actionTypes';
import { runSaga } from 'redux-saga';
import { api } from 'api/band';

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

test('should return initial state', () => {
  expect(useCoverSlice().reducer(undefined, { type: '' })).toEqual(
    initialState,
  );
});

test('return init when state is null', () => {
  const selector = selectSlice({});
  expect(selector).toBe(initialState);
});

test('should handle cover response state', () => {
  const stateInit: CoverState = {
    name: '',
    coverResponse: { loading: false },
  };
  const stateLoading: CoverState = {
    name: '',
    coverResponse: { loading: true },
  };
  const stateSuccess: CoverState = {
    name: '',
    coverResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: CoverState = {
    name: '',
    coverResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  expect(
    useCoverSlice().reducer(stateInit, coverActions.loadingCoverResponse('')),
  ).toEqual(stateLoading);

  expect(
    useCoverSlice().reducer(
      stateLoading,
      coverActions.successCoverResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    useCoverSlice().reducer(
      stateLoading,
      coverActions.errorCoverResponse('MOCK_ERROR'),
    ),
  ).toEqual(stateError);
});

test('should take sagas', () => {
  const genObject = coverPageSaga('PAYLOAD');

  expect(genObject.next().value).toEqual(
    takeEvery(AT.LOAD_COVER.REQUEST, getCoverResponse),
  );
  expect(genObject.next().done).toBeTruthy();
});

test('should loading cover Response', async () => {
  const dispatched: any[] = [];
  api.getCoverInfo = jest.fn(
    (coverId: number) =>
      new Promise((res, rej) => {
        res(dummyCovers[coverId]);
      }),
  );

  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    getCoverResponse,
    {
      type: AT.LOAD_COVER.REQUEST,
      payload: 0,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    coverActions.loadingCoverResponse('start load'),
    coverActions.successCoverResponse(dummyCovers[0]),
  ]);
});

test('should cover Response onError', async () => {
  const dispatched: any[] = [];
  api.getCoverInfo = jest.fn(
    (coverId: number) =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    getCoverResponse,
    {
      type: AT.LOAD_COVER.REQUEST,
      payload: 0,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    coverActions.loadingCoverResponse('start load'),
    coverActions.errorCoverResponse('REJECT'),
  ]);
});
