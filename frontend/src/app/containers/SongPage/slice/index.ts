import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';

import { Cover } from 'types/models';

/* --- STATE --- */
export interface SongState {
  combination: Cover[];
} // state 형식 정의

export const initialState: SongState = {
  combination: [],
};

const slice = createSlice({
  name: 'song', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    addCover(state, action: PayloadAction<Cover>) {
      state.combination.push(action.payload);
      return state;
    },
  },
});

export const { actions: songActions } = slice;

export const useSongSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions, reducer: slice.reducer };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useExampleSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
