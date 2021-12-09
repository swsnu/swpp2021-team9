import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { SagaInjectionModes } from 'redux-injectors';
import { useEffect } from 'react';
import coverCreatePageSaga from './saga';
type CoverInfo = {
  title: string;
  category: string;
  instrumentType: string;
  tags: string[];
  description: string;
};

export interface CreateCoverState {
  name: string;
  audioURL: string | null;
  info: {};
  createResponse: AsyncStateType<Cover>;
}

export const initialState: CreateCoverState = {
  name: 'createCover',
  audioURL: null,
  info: {},
  createResponse: { loading: false },
};

const slice = createSlice({
  name: 'createCover',
  initialState: initialState,
  reducers: {
    cleanUp(_state, _action: PayloadAction<undefined>) {
      return initialState;
    },
    setInfo(state, action: PayloadAction<CoverInfo>) {
      state.info = action.payload;
    },
    setAudioURL(state, action: PayloadAction<string | null>) {
      state.audioURL = action.payload;
    },
    loadingCreateResponse: (state, _action: PayloadAction<any>) => {
      state.createResponse = { loading: true };
      return state;
    },
    successCreateResponse(state, action: PayloadAction<Cover>) {
      state.createResponse = { loading: false };
      state.createResponse.data = action.payload;
      return state;
    },
    errorCreateResponse(state, action: PayloadAction<AxiosError>) {
      state.createResponse = { loading: false };
      state.createResponse.error = action.payload;
      return state;
    },
  },
});

export const { actions: createCoverActions } = slice;

export const useCreateCoverSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: coverCreatePageSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  return { actions: slice.actions, reducer: slice.reducer };
};
