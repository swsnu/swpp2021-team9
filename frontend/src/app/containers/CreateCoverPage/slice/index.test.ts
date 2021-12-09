import { initialState, useCreateCoverSlice, createCoverActions } from './index';
import {
  InjectReducerParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
// import { selectSlice } from './selectors';

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
  expect(useCreateCoverSlice().reducer(undefined, { type: '' })).toEqual(
    initialState,
  );
});

// test('should setInfo reducer work', () => {
//   expect(
//     useCreateCoverSlice().reducer(
//       undefined,
//       createCoverActions.setInfo({
//         title: '신호등',
//         category: '0',
//         tags: ['R&B'],
//         instrumentType: 'guitar',
//         description: 'hi',
//       }),
//     ),
//   ).toEqual({
//     audioURL: null,
//     info: {
//       title: '신호등',
//       category: '0',
//       tags: ['R&B'],
//       instrumentType: 'guitar',
//       description: 'hi',
//     },
//   });
// });

test('should setAudioUrl reducer work', () => {
  expect(
    useCreateCoverSlice().reducer(
      undefined,
      createCoverActions.setAudioURL('url'),
    ),
  ).toEqual({ audioURL: 'url', info: {} });
});

// test('return init when state is null', () => {
//   const selector = selectSlice({});
//   expect(selector).toEqual(initialState);
// });

// test('state is not null', () => {
//   const selector = selectSlice({ createCover: { audioURL: 'hh', info: {} } });
//   expect(selector).toEqual({ audioURL: 'hh', info: {} });
// });
