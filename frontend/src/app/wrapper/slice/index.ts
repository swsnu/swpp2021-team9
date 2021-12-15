import { PayloadAction } from '@reduxjs/toolkit';
import { SagaInjectionModes } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import wrapperSaga from './saga';

/* --- STATE --- */
export interface WrapperState {
  user?: UserInfo;
  currentTrack?: TrackInfo;
} // state 형식 정의

export const initialState: WrapperState = {
  user: undefined,
  currentTrack: undefined,
};

const slice = createSlice({
  name: 'wrapper', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInfo>) {
      state.user = action.payload;
    },
    setCurrentPlaying(state, action: PayloadAction<TrackInfo>) {
      state.currentTrack = action.payload;
    },
    signOut(state, action: PayloadAction<undefined>) {
      state.user = undefined;
    },
  },
});

export const { actions: wrapperActions, reducer } = slice;

export const useWrapperSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: wrapperSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  return { actions: slice.actions, reducer: slice.reducer };
};
