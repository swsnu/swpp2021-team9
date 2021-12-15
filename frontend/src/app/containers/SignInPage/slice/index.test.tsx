import {
  initialState,
  SignInState,
  useSignInSlice,
  signInActions,
} from './index';

import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectSlice } from './selectors';
import signInPageSaga, { getSignInResponse } from './saga';
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
  expect(useSignInSlice().reducer(undefined, { type: '' })).toEqual(
    initialState,
  );
});

test('return init when state is null', () => {
  const selector = selectSlice({});
  expect(selector).toBe(initialState);
});

test('should handle sigin response state', () => {
  const stateInit: SignInState = {
    name: '',
    signInResponse: { loading: false },
  };
  const stateLoading: SignInState = {
    name: '',
    signInResponse: { loading: true },
  };
  const stateSuccess: SignInState = {
    name: '',
    signInResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: SignInState = {
    name: '',
    signInResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  expect(
    useSignInSlice().reducer(
      stateInit,
      signInActions.loadingSignInResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    useSignInSlice().reducer(
      stateLoading,
      signInActions.successSignInResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    useSignInSlice().reducer(
      stateLoading,
      signInActions.errorSignInResponse('MOCK_ERROR'),
    ),
  ).toEqual(stateError);
});

test('should take sagas', () => {
  const genObject = signInPageSaga('PAYLOAD');

  expect(genObject.next().value).toEqual(
    takeEvery(AT.LOAD_SIGNIN.REQUEST, getSignInResponse),
  );
  expect(genObject.next().done).toBeTruthy();
});

test('should loading signin Response', async () => {
  const signinform_dummy: SignInForm = {
    email: 'swpp2021@naver.com',
    password: 'swpp2021',
  };
  const userinfo_dummy: UserInfo = {
    username: '',
    id: 0,
  };
  const dispatched: any[] = [];
  api.signin = jest.fn(
    (form: SignInForm) =>
      new Promise((res, rej) => {
        res('swpp2021' as any);
      }),
  );

  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    getSignInResponse,
    {
      type: AT.LOAD_SIGNIN.REQUEST,
      payload: 'swpp2021' as any,
    },
  ).toPromise();

  expect(dispatched).toBeTruthy();
});

test('should signin Response onError', async () => {
  const signinform_dummy: SignInForm = {
    email: 'swpp2021@naver.com',
    password: 'swpp2021',
  };
  const userinfo_dummy: UserInfo = {
    username: '',
    id: 0,
  };

  const dispatched: any[] = [];

  api.signin = jest.fn(
    (form: SignInForm) =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    getSignInResponse,
    {
      type: AT.LOAD_SIGNIN.REQUEST,
      payload: 'swpp2021' as any,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    signInActions.loadingSignInResponse('start load'),
    signInActions.errorSignInResponse('REJECT' as any),
  ]);
});
