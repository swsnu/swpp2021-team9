import {
  initialState,
  useCreateCoverSlice,
  createCoverActions,
  CreateCoverState,
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
import { selectCreateCover } from './selectors';
import createCoverPageSaga, {
  createCoverRequest,
  getInstrumentsRequest,
} from './saga';
import { takeEvery } from '@redux-saga/core/effects';

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
  const { result } = renderHook(() => useCreateCoverSlice());
  expect(result.current.reducer(undefined, { type: '' })).toEqual(initialState);
});

test('return init when state is null', () => {
  expect(selectCreateCover({})).toBe(initialState);
});

test('should setAudioUrl reducer work', () => {
  const { result } = renderHook(() => useCreateCoverSlice());

  expect(
    result.current.reducer(undefined, createCoverActions.setAudioURL('url')),
  ).toEqual({ ...initialState, audioURL: 'url' });
});

test('should handle createCover response state', () => {
  const stateInit: CreateCoverState = {
    name: '',
    audioURL: '',
    createResponse: { loading: false },
    instrumentsResponse: { loading: false },
  };
  const stateLoading: CreateCoverState = {
    name: '',
    audioURL: '',
    createResponse: { loading: true },
    instrumentsResponse: { loading: false },
  };
  const stateSuccess: CreateCoverState = {
    name: '',
    audioURL: '',
    createResponse: { loading: false, data: 'MOCK' as any },
    instrumentsResponse: { loading: false },
  };
  const stateError: CreateCoverState = {
    name: '',
    audioURL: '',
    createResponse: { loading: false, error: 'MOCK_ERROR' },
    instrumentsResponse: { loading: false },
  };

  const { result } = renderHook(() => useCreateCoverSlice());

  expect(
    result.current.reducer(
      stateInit,
      createCoverActions.loadingCreateResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      createCoverActions.successCreateResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      createCoverActions.errorCreateResponse('MOCK_ERROR'),
    ),
  ).toEqual(stateError);
});

test('should handle loadInstruments response state', () => {
  const stateInit: CreateCoverState = {
    name: '',
    audioURL: '',
    createResponse: { loading: false },
    instrumentsResponse: { loading: false },
  };
  const stateLoading: CreateCoverState = {
    name: '',
    audioURL: '',
    createResponse: { loading: false },
    instrumentsResponse: { loading: true },
  };
  const stateSuccess: CreateCoverState = {
    name: '',
    audioURL: '',
    instrumentsResponse: { loading: false, data: 'MOCK' as any },
    createResponse: { loading: false },
  };
  const stateError: CreateCoverState = {
    name: '',
    audioURL: '',
    instrumentsResponse: { loading: false, error: 'MOCK_ERROR' },
    createResponse: { loading: false },
  };

  const { result } = renderHook(() => useCreateCoverSlice());

  expect(
    result.current.reducer(
      stateInit,
      createCoverActions.loadingInstrumentsResponse(''),
    ),
  ).toEqual(stateLoading);

  expect(
    result.current.reducer(
      stateLoading,
      createCoverActions.successInstrumentsResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    result.current.reducer(
      stateLoading,
      createCoverActions.errorInstrumentsResponse('MOCK_ERROR'),
    ),
  ).toEqual(stateError);
});

test('should handle song Response onError', async () => {
  const dispatched: any[] = [];
  api.postCover = jest.fn(
    (_coverForm: CoverForm) =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );
  const stubCoverForm: CoverForm = {
    audio: 'AUDIO',
    songId: 1,
    title: 'TEST_TITLE',
    category: 'TEST_CATEGORY',
    description: 'TEST_DESCRIPTION',
    tags: ['TEST_TAG_1', 'TEST_TAG_2'],
    combinationId: 123,
    instrumentId: 1,
  };

  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    createCoverRequest,
    {
      type: AT.LOAD_SONG.REQUEST,
      payload: stubCoverForm,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    createCoverActions.loadingCreateResponse('start load'),
    createCoverActions.errorCreateResponse('REJECT' as any),
  ]);
});

test('should handle instruments Response onError', async () => {
  const dispatched: any[] = [];
  api.getInstruments = jest.fn(
    () =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    getInstrumentsRequest,
    {
      type: AT.LOAD_INSTRUMENTS.REQUEST,
    },
  ).toPromise();

  expect(dispatched).toEqual([
    createCoverActions.loadingInstrumentsResponse('start load'),
    createCoverActions.errorInstrumentsResponse('REJECT' as any),
  ]);
});

test('should take sagas', () => {
  const genObject = createCoverPageSaga();

  expect(genObject.next().value).toEqual(
    takeEvery(AT.CREATE_COVER.REQUEST, createCoverRequest),
  );
  expect(genObject.next().value).toEqual(
    takeEvery(AT.LOAD_INSTRUMENTS.REQUEST, getInstrumentsRequest),
  );
  expect(genObject.next().done).toBeTruthy();
});
