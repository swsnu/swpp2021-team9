import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import signUpPageSaga from './saga';

/* --- STATE --- */
export interface SignUpState {
  name: string;
  signUpResponse: AsyncStateType<null>;
} // state 형식 정의

export const initialState: SignUpState = {
  name: 'signup',
  signUpResponse: { loading: false },
};

const slice = createSlice({
  name: 'signup', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    loadingSignUpResponse(state, action: PayloadAction<any>) {
      state.signUpResponse = { loading: true };
      return state;
    },
    successSignUpResponse(state, action: PayloadAction<null>) {
      //signup 은 post null
      state.signUpResponse = { loading: false };
      state.signUpResponse.data = action.payload;
      return state;
    },
    errorSignUpResponse(state, action: PayloadAction<string>) {
      state.signUpResponse = { loading: false };
      state.signUpResponse.error = action.payload;
      return state;
    },
    clearSignUpResponse(state, action: PayloadAction<undefined>) {
      state.signUpResponse = { loading: false };
      return state;
    },
  },
});

export const { actions: signUpActions, reducer: SignUpReducer } = slice;

export const useSignUpSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: signUpPageSaga,
  });
  return { actions: slice.actions, reducer: slice.reducer };
};
