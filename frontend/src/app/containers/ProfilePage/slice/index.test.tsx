import {
  initialState,
  ProfileState,
  useProfileSlice,
  profileActions,
} from './index';

import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectSlice } from './selectors';
import profilePageSaga, { getProfileResponse } from './saga';
import { takeEvery } from '@redux-saga/core/effects';
import * as AT from 'api/actionTypes';
import * as ReactRedux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { api } from 'api/band';
import { dummyUser } from 'api/dummy';
import { runSaga } from 'redux-saga';

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
  const { result } = renderHook(() => useProfileSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);
});

it('return init when state is null', () => {
  const selector = selectSlice({});
  expect(selector).toBe(initialState);
});

it('should handle cover response state', () => {
  const stateInit: ProfileState = {
    ...initialState,
    profileResponse: { loading: false },
  };
  const stateLoading: ProfileState = {
    ...initialState,
    profileResponse: { loading: true },
  };
  const stateSuccess: ProfileState = {
    ...initialState,
    profileResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: ProfileState = {
    ...initialState,
    profileResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  const { result } = renderHook(() => useProfileSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);

  expect(
    result.current.reducer(
      stateInit,
      profileActions.loadingProfileResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      profileActions.successProfileResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      profileActions.errorProfileResponse('MOCK_ERROR' as any),
    ),
  ).toEqual(stateError);
});

/* TODO : payload : undefined returned 
  test('should loading profile Response', async () => {
    const dispatched: any[] = [];
    api.getUserInfo = jest.fn(
      (userId: number) =>
        new Promise((res, rej) => {
          res(dummyUser[userId]);
        }),
    );
    await runSaga(
        {
          dispatch: action => dispatched.push(action),
        },
        getProfileResponse,
        {
          type: AT.LOAD_PROFILE.REQUEST,
          payload: 1,
        },
      ).toPromise();
    
      expect(dispatched).toEqual([
        profileActions.loadingProfileResponse('start load'),
        profileActions.successProfileResponse(dummyUser[1]),
      ]);
    });
    */
test('should cover Response onError', async () => {
  const dispatched: any[] = [];
  api.getUserInfo = jest.fn(
    (userId: number) =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    getProfileResponse,
    {
      type: AT.LOAD_PROFILE.REQUEST,
      payload: 0,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    profileActions.loadingProfileResponse('start load'),
    profileActions.errorProfileResponse('REJECT' as any),
  ]);
});
