import { PayloadAction } from '@reduxjs/toolkit';
import { SagaInjectionModes } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import mainPageSaga from './saga';

/* --- STATE --- */
export interface MainState {
  combinationsResponse: AsyncStateType<Combination[]>;
}

export const initialState: MainState = {
  combinationsResponse: { loading: false },
};

const slice = createSlice({
  name: 'main',
  initialState,
  reducers: {
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
  },
});

export const { actions: mainActions } = slice;

export const useMainSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: mainPageSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  return { actions: slice.actions, reducer: slice.reducer };
};
