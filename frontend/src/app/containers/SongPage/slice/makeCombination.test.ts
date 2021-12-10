import {
  initialState,
  MakeCombinationState,
  useMakeCombinationSlice,
  makeCombinationActions,
} from './makeCombination';
import { dummyCovers, dummySongs } from 'api/dummy';

import {
  InjectReducerParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectMakeCombinationSlice } from './selectors';

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

// Selector Test
test('should return initial state', () => {
  expect(useMakeCombinationSlice().reducer(undefined, { type: '' })).toEqual(
    initialState,
  );
});

test('return init when state is null', () => {
  expect(selectMakeCombinationSlice({})).toBe(initialState);
});

test('editCurrent', () => {
  const stateInit: MakeCombinationState = {
    song: dummySongs[0],
    combination: [
      { id: 0, instrument: dummyCovers[0].instrument, cover: dummyCovers[0] },
      { id: 1, instrument: dummyCovers[1].instrument, cover: dummyCovers[1] },
    ],
    current: 1,
  };

  expect(
    useMakeCombinationSlice().reducer(
      stateInit,
      makeCombinationActions.editCurrent(dummyCovers[0]),
    ),
  ).toEqual(stateInit);
});

test('getCovers', () => {
  const stateInit: MakeCombinationState = {
    song: dummySongs[0],
    combination: [
      { id: 0, instrument: dummyCovers[0].instrument, cover: dummyCovers[0] },
    ],
    current: null,
  };
  const stateChanged: MakeCombinationState = {
    song: dummySongs[0],
    combination: [
      { id: 0, instrument: dummyCovers[1].instrument, cover: dummyCovers[1] },
    ],
    current: null,
  };

  expect(
    useMakeCombinationSlice().reducer(
      stateInit,
      makeCombinationActions.getCovers([undefined, dummyCovers[1]]),
    ),
  ).toEqual(stateChanged);
});

test('setSongId', () => {
  const stateInit: MakeCombinationState = {
    song: dummySongs[0],
    combination: [
      { id: 0, instrument: dummyCovers[0].instrument, cover: dummyCovers[0] },
    ],
    current: 0,
  };
  const stateChanged: MakeCombinationState = {
    song: dummySongs[1],
    combination: [],
    current: null,
  };

  expect(
    useMakeCombinationSlice().reducer(
      stateInit,
      makeCombinationActions.setSong(dummySongs[1]),
    ),
  ).toEqual(stateChanged);
});
