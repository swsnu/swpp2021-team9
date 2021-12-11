import {
  initialState,
  useSearchResultSlice,
  searchResultActions,
  SearchResultState,
} from './index';
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
import { selectSearchResult } from './selectors';
import { getSongsSearchRequest } from './saga';

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
  const { result } = renderHook(() => useSearchResultSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);
});

test('return init when state is null', () => {
  expect(selectSearchResult({})).toBe(initialState);
});

test('should handle songs response state', () => {
  const stateInit: SearchResultState = {
    songsResponse: { loading: false },
  };
  const stateLoading: SearchResultState = {
    songsResponse: { loading: true },
  };
  const stateSuccess: SearchResultState = {
    songsResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: SearchResultState = {
    songsResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  const { result } = renderHook(() => useSearchResultSlice());

  expect(
    result.current.reducer(
      stateInit,
      searchResultActions.loadingSongsResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      searchResultActions.successSongsResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      searchResultActions.errorSongsResponse('MOCK_ERROR'),
    ),
  ).toEqual(stateError);
});

test('should handle songs Response onError', async () => {
  const dispatched: any[] = [];
  api.getSongBySearch = jest.fn(
    (_key: string) =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );

  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    getSongsSearchRequest,
    {
      type: AT.LOAD_SONGS_SEARCH.REQUEST,
      payload: '',
    },
  ).toPromise();

  expect(dispatched).toEqual([
    searchResultActions.loadingSongsResponse('start load'),
    searchResultActions.errorSongsResponse('REJECT' as any),
  ]);
});
