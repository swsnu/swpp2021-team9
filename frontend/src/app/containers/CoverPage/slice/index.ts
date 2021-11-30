import { PayloadAction } from '@reduxjs/toolkit';
import { SagaInjectionModes } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import coverPageSaga from './saga';

/* --- STATE --- */
export interface CoverState {
  name: string;
  coverResponse: AsyncStateType<Cover>;
  deleteResponse: AsyncStateType<number>;
} // state 형식 정의

export const initialState: CoverState = {
  name: 'cover',
  coverResponse: { loading: false },
  deleteResponse: { loading: false },
};

const slice = createSlice({
  name: 'cover', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    loadingCoverResponse(state, _action: PayloadAction<any>) {
      state.coverResponse = { loading: true };
      return state;
    },
    successCoverResponse(state, action: PayloadAction<Cover>) {
      state.coverResponse = { loading: false };
      state.coverResponse.data = action.payload;
      return state;
    },
    errorCoverResponse(state, action: PayloadAction<string>) {
      state.coverResponse = { loading: false };
      state.coverResponse.error = action.payload;
      return state;
    },

    loadingDeleteResponse(state, _action: PayloadAction<any>) {
      state.deleteResponse = { loading: true };
      return state;
    },
    successDeleteResponse(state, action: PayloadAction<number>) {
      state.deleteResponse = { loading: false };
      state.deleteResponse.data = action.payload;
      return state;
    },
    errorDeleteResponse(state, action: PayloadAction<string>) {
      state.deleteResponse = { loading: false };
      state.deleteResponse.error = action.payload;
      return state;
    },
  },
});

export const { actions: coverActions } = slice;

export const useCoverSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: coverPageSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
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
