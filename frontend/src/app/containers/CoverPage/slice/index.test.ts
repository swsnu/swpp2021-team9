import { initialState, CoverState, useCoverSlice, coverActions } from './index';

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
  expect(useCoverSlice().reducer(undefined, { type: '' })).toEqual(
    initialState,
  );
});
