import {
  initialState,
  useWrapperSlice,
  wrapperActions,
  WrapperState,
} from './index';

import {
  InjectReducerParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectSlice } from './selectors';
import { dummyTrackInfos } from 'api/dummy';

jest.mock('utils/redux-injectors', () => {
  const originalModule = jest.requireActual('utils/redux-injectors');

  return {
    __esModule: true,
    ...originalModule,
    useInjectReducer: jest.fn(
      (params: InjectReducerParams<RootStateKeyType>) => {},
    ),
  };
});

test('should return initial state', () => {
  expect(useWrapperSlice().reducer(undefined, { type: '' })).toEqual(
    initialState,
  );
});

test('return init when state is null', () => {
  const selector = selectSlice({});
  expect(selector).toBe(initialState);
});

test('setUser', () => {
  const dummyUserInfo: UserInfo = {
    id: 1,
    username: 'dummy',
  };

  const stateInit: WrapperState = {};
  const stateChanged: WrapperState = {
    user: dummyUserInfo,
  };

  expect(
    useWrapperSlice().reducer(stateInit, wrapperActions.setUser(dummyUserInfo)),
  ).toEqual(stateChanged);
});

test('setCurrentPlaying', () => {
  const stateInit: WrapperState = {};
  const stateChanged: WrapperState = {
    currentTrack: dummyTrackInfos[0],
  };

  expect(
    useWrapperSlice().reducer(
      stateInit,
      wrapperActions.setCurrentPlaying(dummyTrackInfos[0]),
    ),
  ).toEqual(stateChanged);
});
