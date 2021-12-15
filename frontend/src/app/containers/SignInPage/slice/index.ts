import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import signInPageSaga from './saga';

/* --- STATE --- */
export interface SignInState {
  name: string;
  signInResponse: AsyncStateType<UserInfo>;
} // state 형식 정의

export const initialState: SignInState = {
  name: 'signin',
  signInResponse: { loading: false },
};

const slice = createSlice({
  name: 'signin', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    loadingSignInResponse(state, action: PayloadAction<any>) {
      state.signInResponse = { loading: true };
      return state;
    },
    successSignInResponse(state, action: PayloadAction<UserInfo>) {
      state.signInResponse = { loading: false };
      state.signInResponse.data = action.payload;
      return state;
    },
    errorSignInResponse(state, action: PayloadAction<string>) {
      state.signInResponse = { loading: false };
      state.signInResponse.error = action.payload;
      return state;
    },
    clearSignInResponse(state, action: PayloadAction<undefined>) {
      state.signInResponse = { loading: false };
      return state;
    },
  },
});

export const { actions: signInActions, reducer: SignInReducer } = slice;

export const useSignInSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: signInPageSaga,
  });
  return { actions: slice.actions, reducer: slice.reducer };
};
