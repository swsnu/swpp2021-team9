import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { SagaInjectionModes } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import songPageSaga from './saga';

/* --- STATE --- */
export interface SongState {
  songResponse: AsyncStateType<Song>;
  combinationsResponse: AsyncStateType<Combination[]>;
  coversResponse: AsyncStateType<Cover[]>;
  instrumentsResponse: AsyncStateType<Instrument[]>;
} // state 형식 정의

export const initialState: SongState = {
  songResponse: { loading: false },
  combinationsResponse: { loading: false },
  coversResponse: { loading: false },
  instrumentsResponse: { loading: false },
};

const slice = createSlice({
  name: 'song', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    cleanUp(_state, _action: PayloadAction<undefined>) {
      return initialState;
    },
    loadingSongResponse(state, _action: PayloadAction<any>) {
      state.songResponse = { loading: true };
    },
    successSongResponse(state, action: PayloadAction<Song>) {
      state.songResponse = { loading: false };
      state.songResponse.data = action.payload;
    },
    errorSongResponse(state, action: PayloadAction<string>) {
      state.songResponse = { loading: false };
      state.songResponse.error = action.payload;
    },

    loadingCombinationsResponse(state, _action: PayloadAction<any>) {
      state.combinationsResponse = { loading: true };
    },
    successCombinationsResponse(state, action: PayloadAction<Combination[]>) {
      state.combinationsResponse = { loading: false };
      state.combinationsResponse.data = action.payload;
    },
    errorCombinationsResponse(state, action: PayloadAction<string>) {
      state.combinationsResponse = { loading: false };
      state.combinationsResponse.error = action.payload;
    },

    loadingCoversResponse(state, _action: PayloadAction<any>) {
      state.coversResponse = { loading: true };
    },
    successCoversResponse(state, action: PayloadAction<Cover[]>) {
      state.coversResponse = { loading: false };
      state.coversResponse.data = action.payload;
    },
    errorCoversResponse(state, action: PayloadAction<string>) {
      state.coversResponse = { loading: false };
      state.coversResponse.error = action.payload;
    },

    loadingInstrumentsResponse(state, _action: PayloadAction<any>) {
      state.instrumentsResponse = { loading: true };
    },
    successInstrumentsResponse(state, action: PayloadAction<Instrument[]>) {
      state.instrumentsResponse = { loading: false };
      state.instrumentsResponse.data = action.payload;
    },
    errorInstrumentsResponse(state, action: PayloadAction<string>) {
      state.instrumentsResponse = { loading: false };
      state.instrumentsResponse.error = action.payload;
    },
  },
});

export const { actions: songActions } = slice;

export const useSongSlice = () => {
  const dispatch = useDispatch();
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: songPageSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  useEffect(() => {
    return () => {
      dispatch(slice.actions.cleanUp());
    };
  }, [dispatch]);
  return { actions: slice.actions, reducer: slice.reducer };
};
