import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SagaInjectionModes } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import coverEditPageSaga from './saga';

/* --- STATE --- */
export interface CoverEditState {
  name: string;
  coverResponse: AsyncStateType<Cover>;
  editResponse: AsyncStateType<Cover>;
} // state 형식 정의

export const initialState: CoverEditState = {
  name: 'cover',
  coverResponse: { loading: false },
  editResponse: { loading: false },
};

const slice = createSlice({
  name: 'coverEdit', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    cleanUp(_state, _action: PayloadAction<undefined>) {
      return initialState;
    },
    loadingCoverResponse(state, action: PayloadAction<any>) {
      state.coverResponse = { loading: true };
      return state;
    },
    successCoverResponse(state, action: PayloadAction<Cover>) {
      state.coverResponse = { loading: false };
      state.coverResponse.data = action.payload;
      return state;
    },
    errorCoverResponse(state, action: PayloadAction<AxiosError>) {
      state.coverResponse = { loading: false };
      state.coverResponse.error = action.payload;
      return state;
    },

    loadingEditResponse(state, action: PayloadAction<any>) {
      state.editResponse = { loading: true };
      return state;
    },
    successEditResponse(state, action: PayloadAction<Cover>) {
      state.editResponse = { loading: false };
      state.editResponse.data = action.payload;
      return state;
    },
    errorEditResponse(state, action: PayloadAction<AxiosError>) {
      state.editResponse = { loading: false };
      state.editResponse.error = action.payload;
      return state;
    },
  },
});

export const { actions: coverEditActions } = slice;

export const useCoverEditSlice = () => {
  const dispatch = useDispatch();
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: coverEditPageSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  useEffect(() => {
    return () => {
      dispatch(slice.actions.cleanUp());
    };
  }, [dispatch]);
  return { actions: slice.actions, reducer: slice.reducer };
};
