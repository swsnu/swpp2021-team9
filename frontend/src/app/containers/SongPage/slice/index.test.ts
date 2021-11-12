import { initialState, useSongSlice } from './index';

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

// test('should add', () => {
//   const stateInit: SongState = { name: '', albums: [] };
//   const stateChanged: SongState = { name: '', albums: ['TEST'] };

//   expect(
//     useSongSlice().reducer(stateInit, songActions.addAlbum('TEST')),
//   ).toEqual(stateChanged);
// });
