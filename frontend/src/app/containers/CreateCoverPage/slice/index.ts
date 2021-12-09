import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import createCoverPageSaga from './saga';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export interface CreateCoverState {
  name: string;
  audioURL: string | null;
  instrumentsResponse: AsyncStateType<Instrument[]>;
  createResponse: AsyncStateType<Cover>;
}

export const initialState: CreateCoverState = {
  name: 'createCover',
  audioURL: null,
  instrumentsResponse: { loading: false },
  createResponse: { loading: false },
};

const slice = createSlice({
  name: 'createCover',
  initialState: initialState,
  reducers: {
    cleanUp(state, _action: PayloadAction<undefined>) {
      const returnState = { ...initialState, audioURL: state.audioURL };
      return returnState;
    },

    setAudioURL(state, action: PayloadAction<string | null>) {
      state.audioURL = action.payload;
    },

    loadingCreateResponse(state, _action: PayloadAction<any>) {
      state.createResponse = { loading: true };
    },
    successCreateResponse(state, action: PayloadAction<Cover>) {
      state.createResponse = { loading: false };
      state.createResponse.data = action.payload;
    },
    errorCreateResponse(state, action: PayloadAction<string>) {
      state.createResponse = { loading: false };
      state.createResponse.error = action.payload;
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

export const { actions: createCoverActions } = slice;

export const useCreateCoverSlice = () => {
  const dispatch = useDispatch();
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: createCoverPageSaga,
    // mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  useEffect(() => {
    return () => {
      dispatch(slice.actions.cleanUp());
    };
  }, [dispatch]);
  return { actions: slice.actions, reducer: slice.reducer };
};
