import {
  initialState,
  MakeCombinationState,
  useMakeCombinationSlice,
  makeCombinationActions,
} from './makeCombination';
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
  expect(useMakeCombinationSlice().reducer(undefined, { type: '' })).toEqual(
    initialState,
  );
});

test('editCurrent', () => {
  const stateInit: MakeCombinationState = {
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
    combination: [
      { id: 0, instrument: dummyCovers[0].instrument, cover: dummyCovers[0] },
    ],
    current: null,
  };
  const stateChanged: MakeCombinationState = {
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
