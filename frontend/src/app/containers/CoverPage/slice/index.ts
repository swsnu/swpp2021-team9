import { PayloadAction } from '@reduxjs/toolkit';
import { SagaInjectionModes, useInjectSaga } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import coverPageSaga from './saga';

/* --- STATE --- */
export interface CoverState {
  name: string;
  coverResponse: AsyncStateType<CoverResponse>;
} // state 형식 정의

export const initialState: CoverState = {
  name: 'cover',
  coverResponse: { loading: false },
};

const slice = createSlice({
  name: 'cover', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    loadingCoverResponse(state, action: PayloadAction<any>) {
      console.log('loadingCoverResponse', action, state.coverResponse);
      state.coverResponse.loading = true;
      return state;
    },
    successCoverResponse(state, action: PayloadAction<any>) {
      console.log('successCoverResponse', action, state.coverResponse);
      state.coverResponse.loading = false;
      return state;
    },
    errorCoverResponse(state, action: PayloadAction<any>) {
      console.log('errorCoverResponse', action, state.coverResponse);
      state.coverResponse.loading = false;
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
