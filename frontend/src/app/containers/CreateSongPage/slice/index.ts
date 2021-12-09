import { AxiosError } from 'axios';
import { SagaInjectionModes } from 'redux-injectors';
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import createSongPageSaga from './saga';

export interface CreateSongState {
  songResponse: AsyncStateType<Song>;
}

export const initialState: CreateSongState = {
  songResponse: { loading: false },
};

const slice = createSlice({
  name: 'createSong',
  initialState,
  reducers: {
    loadingSongResponse(state, action: PayloadAction<any>) {
      state.songResponse = { loading: true };
      return state;
    },
    successSongResponse(state, action: PayloadAction<Song>) {
      state.songResponse = { loading: false };
      state.songResponse.data = action.payload;
      return state;
    },
    errorSongResponse(state, action: PayloadAction<AxiosError>) {
      state.songResponse = { loading: false };
      state.songResponse.error = action.payload;
      return state;
    },
  },
});

export const { actions: createSongActions } = slice;

export const useCreateSongSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: createSongPageSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  return { actions: slice.actions, reducer: slice.reducer };
};
