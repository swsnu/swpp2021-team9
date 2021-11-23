import { initialState, SongState, useSongSlice, songActions } from './index';
import { dummyCovers } from 'api/dummy';

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
  expect(useSongSlice().reducer(undefined, { type: '' })).toEqual(initialState);
});

test('editCurrent', () => {
  const stateInit: SongState = {
    id: null,
    combination: [
      { id: 0, instrument: dummyCovers[0].instrument, cover: dummyCovers[0] },
      { id: 1, instrument: dummyCovers[1].instrument, cover: dummyCovers[1] },
    ],
    current: 1,
  };

  expect(
    useSongSlice().reducer(stateInit, songActions.editCurrent(dummyCovers[0])),
  ).toEqual(stateInit);
});

test('getCovers', () => {
  const stateInit: SongState = {
    id: null,
    combination: [
      { id: 0, instrument: dummyCovers[0].instrument, cover: dummyCovers[0] },
    ],
    current: null,
  };
  const stateChanged: SongState = {
    id: null,
    combination: [
      { id: 0, instrument: dummyCovers[1].instrument, cover: dummyCovers[1] },
    ],
    current: null,
  };

  expect(
    useSongSlice().reducer(
      stateInit,
      songActions.getCovers([undefined, dummyCovers[1]]),
    ),
  ).toEqual(stateChanged);
});
