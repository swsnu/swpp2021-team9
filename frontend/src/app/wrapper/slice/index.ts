import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';

/* --- STATE --- */
export interface WrapperState {
  name: string;
  user?: UserInfo;
  currentPlaying?: PlayInfo;
} // state 형식 정의

export const initialState: WrapperState = {
  name: 'wrapper',
  user: undefined,
  currentPlaying: undefined,
};

const slice = createSlice({
  name: 'wrapper', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {
      return state;
    },
  },
});

export const { actions: WrapperActions } = slice;

export const useWrapperSlice = () => {
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
