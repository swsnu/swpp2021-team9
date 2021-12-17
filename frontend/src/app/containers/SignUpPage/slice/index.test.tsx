import {
  initialState,
  SignUpState,
  useSignUpSlice,
  signUpActions,
} from './index';

import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectSlice } from './selectors';
import signUpPageSaga, { getSignUpResponse } from './saga';
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
  expect(useSignUpSlice().reducer(undefined, { type: '' })).toEqual(
    initialState,
  );
});

test('return init when state is null', () => {
  const selector = selectSlice({});
  expect(selector).toBe(initialState);
});

test('should handle sigin response state', () => {
  const stateInit: SignUpState = {
    name: '',
    signUpResponse: { loading: false },
  };
  const stateLoading: SignUpState = {
    name: '',
    signUpResponse: { loading: true },
  };
  const stateSuccess: SignUpState = {
    name: '',
    signUpResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: SignUpState = {
    name: '',
    signUpResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  expect(
    useSignUpSlice().reducer(
      stateInit,
      signUpActions.loadingSignUpResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    useSignUpSlice().reducer(
      stateLoading,
      signUpActions.successSignUpResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    useSignUpSlice().reducer(
      stateLoading,
      signUpActions.errorSignUpResponse('MOCK_ERROR'),
    ),
  ).toEqual(stateError);
});

test('should take sagas', () => {
  const genObject = signUpPageSaga('PAYLOAD');

  expect(genObject.next().value).toEqual(
    takeEvery(AT.LOAD_SIGNUP.REQUEST, getSignUpResponse),
  );
  expect(genObject.next().done).toBeTruthy();
});

test('should loading signup Response', async () => {
  const dispatched: any[] = [];
  api.signup = jest.fn(
    (form: SignUpForm) =>
      new Promise((res, rej) => {
        res('swpp2021' as any);
      }),
  );

  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    getSignUpResponse,
    {
      type: AT.LOAD_SIGNUP.REQUEST,
      payload: 'swpp2021' as any,
    },
  ).toPromise();

  expect(dispatched).toBeTruthy();
});

test('should signin Response onError', async () => {
  const dispatched: any[] = [];

  api.signup = jest.fn(
    (form: SignInForm) =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    getSignUpResponse,
    {
      type: AT.LOAD_SIGNUP.REQUEST,
      payload: 'swpp2021' as any,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    signUpActions.loadingSignUpResponse('start load'),
    signUpActions.errorSignUpResponse('REJECT' as any),
  ]);
});
