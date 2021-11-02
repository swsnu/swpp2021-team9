import { initialState, MainState, useMainSlice, mainActions } from './index';

import { useInjectReducer } from 'utils/redux-injectors';

import {
  InjectReducerParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';

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
  expect(useMainSlice().reducer(undefined, { type: '' })).toEqual(initialState);
});

test('should add', () => {
  const stateInit: MainState = { name: '', albums: [] };
  const stateChanged: MainState = { name: '', albums: ['TEST'] };

  expect(
    useMainSlice().reducer(stateInit, mainActions.addAlbum('TEST')),
  ).toEqual(stateChanged);
});
