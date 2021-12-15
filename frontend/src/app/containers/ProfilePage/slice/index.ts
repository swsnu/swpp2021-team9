import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import profilePageSaga from './saga';

/* --- STATE --- */
export interface ProfileState {
  profileResponse: AsyncStateType<User>;
  postProfileResponse: AsyncStateType<UserPostForm>;
} // state 형식 정의

export const initialState: ProfileState = {
  profileResponse: { loading: false },
  postProfileResponse: { loading: false },
};

const slice = createSlice({
  name: 'profile', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    loadingProfileResponse(state, action: PayloadAction<any>) {
      state.profileResponse = { loading: true };
      return state;
    },
    successProfileResponse(state, action: PayloadAction<User>) {
      state.profileResponse = { loading: false };
      state.profileResponse.data = action.payload;
      return state;
    },
    errorProfileResponse(state, action: PayloadAction<string>) {
      state.profileResponse = { loading: false };
      state.profileResponse.error = action.payload;
      return state;
    },

    loadingPostResponse(state, action: PayloadAction<any>) {
      state.postProfileResponse = { loading: true };
      return state;
    },
    successPostResponse(state, action: PayloadAction<UserPostForm>) {
      state.postProfileResponse = { loading: false };
      state.postProfileResponse.data = action.payload;
      return state;
    },
    errorPostResponse(state, action: PayloadAction<string>) {
      state.postProfileResponse = { loading: false };
      state.postProfileResponse.error = action.payload;
      return state;
    },
  },
});

export const { actions: profileActions, reducer: ProfileReducer } = slice;

export const useProfileSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: profilePageSaga,
  });
  return { actions: slice.actions, reducer: slice.reducer };
};
