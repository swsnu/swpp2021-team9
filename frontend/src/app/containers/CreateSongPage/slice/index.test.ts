import {
  initialState,
  CreateSongState,
  useCreateSongSlice,
  createSongActions,
} from './index';

import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';

import { selectCreateSong } from './selectors';
import { dummySongs } from 'api/dummy';
import * as AT from 'api/actionTypes';
import { runSaga } from 'redux-saga';
import { api } from 'api/band';
import { renderHook } from '@testing-library/react-hooks';
import { postSongRequest } from './saga';

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

it('should return initial state', () => {
  const { result } = renderHook(() => useCreateSongSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);
});

it('return init when state is null', () => {
  const selector = selectCreateSong({});
  expect(selector).toBe(initialState);
});

it('should handle song response state', () => {
  const stateInit: CreateSongState = {
    ...initialState,
    songResponse: { loading: false },
  };
  const stateLoading: CreateSongState = {
    ...initialState,
    songResponse: { loading: true },
  };
  const stateSuccess: CreateSongState = {
    ...initialState,
    songResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: CreateSongState = {
    ...initialState,
    songResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  const { result } = renderHook(() => useCreateSongSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);

  expect(
    result.current.reducer(
      stateInit,
      createSongActions.loadingSongResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      createSongActions.successSongResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      createSongActions.errorSongResponse('MOCK_ERROR' as any),
    ),
  ).toEqual(stateError);
});

test('should song Response onError', async () => {
  const dispatched: any[] = [];
  api.postSong = jest.fn(
    (_songForm: SongForm) =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    postSongRequest,
    {
      type: AT.LOAD_COVER.REQUEST,
      payload: dummySongs[0],
    },
  ).toPromise();

  expect(dispatched).toEqual([
    createSongActions.loadingSongResponse('start load'),
    createSongActions.errorSongResponse('REJECT' as any),
  ]);
});
