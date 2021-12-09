import { initialState, SongState, useSongSlice, songActions } from './index';

import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectSong } from './selectors';
import { renderHook } from '@testing-library/react-hooks';
import * as ReactRedux from 'react-redux';

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
  const { result } = renderHook(() => useSongSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);
});

test('return init when state is null', () => {
  expect(selectSong({})).toBe(initialState);
});

it('should handle song response state', () => {
  const stateInit: SongState = {
    ...initialState,
    songResponse: { loading: false },
  };
  const stateLoading: SongState = {
    ...initialState,
    songResponse: { loading: true },
  };
  const stateSuccess: SongState = {
    ...initialState,
    songResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: SongState = {
    ...initialState,
    songResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  const { result } = renderHook(() => useSongSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);

  expect(
    result.current.reducer(stateInit, songActions.loadingSongResponse('')),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      songActions.successSongResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      songActions.errorSongResponse('MOCK_ERROR' as any),
    ),
  ).toEqual(stateError);
});

it('should handle combinations response state', () => {
  const stateInit: SongState = {
    ...initialState,
    combinationsResponse: { loading: false },
  };
  const stateLoading: SongState = {
    ...initialState,
    combinationsResponse: { loading: true },
  };
  const stateSuccess: SongState = {
    ...initialState,
    combinationsResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: SongState = {
    ...initialState,
    combinationsResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  const { result } = renderHook(() => useSongSlice());

  expect(
    result.current.reducer(
      stateInit,
      songActions.loadingCombinationsResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      songActions.successCombinationsResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      songActions.errorCombinationsResponse('MOCK_ERROR' as any),
    ),
  ).toEqual(stateError);
});

it('should handle covers response state', () => {
  const stateInit: SongState = {
    ...initialState,
    coversResponse: { loading: false },
  };
  const stateLoading: SongState = {
    ...initialState,
    coversResponse: { loading: true },
  };
  const stateSuccess: SongState = {
    ...initialState,
    coversResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: SongState = {
    ...initialState,
    coversResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  const { result } = renderHook(() => useSongSlice());

  expect(
    result.current.reducer(stateInit, songActions.loadingCoversResponse('')),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      songActions.successCoversResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      songActions.errorCoversResponse('MOCK_ERROR' as any),
    ),
  ).toEqual(stateError);
});

it('should handle instruments response state', () => {
  const stateInit: SongState = {
    ...initialState,
    instrumentsResponse: { loading: false },
  };
  const stateLoading: SongState = {
    ...initialState,
    instrumentsResponse: { loading: true },
  };
  const stateSuccess: SongState = {
    ...initialState,
    instrumentsResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: SongState = {
    ...initialState,
    instrumentsResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  const { result } = renderHook(() => useSongSlice());

  expect(
    result.current.reducer(
      stateInit,
      songActions.loadingInstrumentsResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      songActions.successInstrumentsResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      songActions.errorInstrumentsResponse('MOCK_ERROR' as any),
    ),
  ).toEqual(stateError);
});
