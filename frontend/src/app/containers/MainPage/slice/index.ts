import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';

/* --- STATE --- */
export interface MainState {
  name: string;
  albums: string[];
} // state 형식 정의

export const initialState: MainState = {
  name: 'main',
  albums: [''],
};

const slice = createSlice({
  name: 'main', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {
      return state;
    },
    addAlbum(state, action: PayloadAction<string>) {
      state.albums.push(action.payload);
      return state;
    },
  },
});

export const { actions: mainActions } = slice;

export const useMainSlice = () => {
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
