import {
  initialState,
  CoverEditState,
  useCoverEditSlice,
  coverEditActions,
} from './index';

import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectSlice } from './selectors';
import { dummyCovers } from 'api/dummy';
import * as AT from 'api/actionTypes';
import { runSaga } from 'redux-saga';
import { api } from 'api/band';
import { renderHook } from '@testing-library/react-hooks';
import * as ReactRedux from 'react-redux';
import { getCoverRequest } from './saga';

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

it('should return initial state', () => {
  const { result } = renderHook(() => useCoverEditSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);
});

it('return init when state is null', () => {
  const selector = selectSlice({});
  expect(selector).toBe(initialState);
});

it('should handle cover response state', () => {
  const stateInit: CoverEditState = {
    ...initialState,
    coverResponse: { loading: false },
  };
  const stateLoading: CoverEditState = {
    ...initialState,
    coverResponse: { loading: true },
  };
  const stateSuccess: CoverEditState = {
    ...initialState,
    coverResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: CoverEditState = {
    ...initialState,
    coverResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  const { result } = renderHook(() => useCoverEditSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);

  expect(
    result.current.reducer(
      stateInit,
      coverEditActions.loadingCoverResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      coverEditActions.successCoverResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      coverEditActions.errorCoverResponse('MOCK_ERROR' as any),
    ),
  ).toEqual(stateError);
});

// test('should take sagas', () => {
//   const genObject = coverEditPageSaga('PAYLOAD');

//   expect(genObject.next().value).toEqual(
//     takeEvery(AT.LOAD_COVER.REQUEST, getCoverRequest),
//   );
//   expect(genObject.next().value).toEqual(
//     takeEvery(AT.DELETE_COVER.REQUEST, EditCoverRequest),
//   );
//   expect(genObject.next().done).toBeTruthy();
// });

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
    getCoverRequest,
    {
      type: AT.LOAD_COVER.REQUEST,
      payload: 0,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    coverEditActions.loadingCoverResponse('start load'),
    coverEditActions.successCoverResponse(dummyCovers[0]),
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
    getCoverRequest,
    {
      type: AT.LOAD_COVER.REQUEST,
      payload: 0,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    coverEditActions.loadingCoverResponse('start load'),
    coverEditActions.errorCoverResponse('REJECT' as any),
  ]);
});
