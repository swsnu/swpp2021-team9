import { initialState, useWrapperSlice } from './index';

import {
  InjectReducerParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectSlice } from './selectors';

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
