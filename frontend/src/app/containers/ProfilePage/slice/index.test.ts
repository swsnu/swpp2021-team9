import {
  initialState,
  useProfileSlice,
  profileActions,
  ProfileState,
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
import { selectProfile } from './selectors';
import { getProfileResponse, postProfileResponse } from './saga';

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
  const { result } = renderHook(() => useProfileSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);
});

test('return init when state is null', () => {
  expect(selectProfile({})).toBe(initialState);
});

test('should handle profile response state', () => {
  const stateInit: ProfileState = {
    profileResponse: { loading: false },
    postProfileResponse: { loading: false },
  };
  const stateLoading: ProfileState = {
    profileResponse: { loading: true },
    postProfileResponse: { loading: false },
  };
  const stateSuccess: ProfileState = {
    profileResponse: { loading: false, data: 'MOCK' as any },
    postProfileResponse: { loading: false },
  };
  const stateError: ProfileState = {
    profileResponse: { loading: false, error: 'MOCK_ERROR' },
    postProfileResponse: { loading: false },
  };

  const { result } = renderHook(() => useProfileSlice());

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
      profileActions.errorProfileResponse('MOCK_ERROR'),
    ),
  ).toEqual(stateError);
});

test('should handle postProfile response state', () => {
  const stateInit: ProfileState = {
    profileResponse: { loading: false },
    postProfileResponse: { loading: false },
  };
  const stateLoading: ProfileState = {
    profileResponse: { loading: false },
    postProfileResponse: { loading: true },
  };
  const stateSuccess: ProfileState = {
    profileResponse: { loading: false },
    postProfileResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: ProfileState = {
    profileResponse: { loading: false },
    postProfileResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  const { result } = renderHook(() => useProfileSlice());

  expect(
    result.current.reducer(stateInit, profileActions.loadingPostResponse('')),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      profileActions.successPostResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      profileActions.errorPostResponse('MOCK_ERROR'),
    ),
  ).toEqual(stateError);
});

test('should handle profile Response onError', async () => {
  const dispatched: any[] = [];
  api.getUserInfo = jest.fn(
    (_userId: number) =>
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
      payload: 1,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    profileActions.loadingProfileResponse('start load'),
    profileActions.errorProfileResponse('REJECT' as any),
  ]);
});

test('should handle postProfile Response onError', async () => {
  const dispatched: any[] = [];
  api.postUserInfo = jest.fn(
    (_user: UserPostForm) =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );

  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    postProfileResponse,
    {
      type: AT.POST_PROFILE.REQUEST,
      payload: {
        id: 1,
      },
    },
  ).toPromise();

  expect(dispatched).toEqual([
    profileActions.loadingPostResponse('start load'),
    profileActions.errorPostResponse('REJECT' as any),
  ]);
});
