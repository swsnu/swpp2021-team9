import { unstable_createMuiStrictModeTheme } from '@material-ui/core';
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';

interface UserItem {
  email: string;
  password: string;
}

/* --- STATE --- */
export interface UserState {
  users: UserItem[];
  current: UserItem | null;
} // state 형식 정의

export const initialState: UserState = {
  users: [],
  current: null,
};

const slice = createSlice({
  name: 'user', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    signin(state, action: PayloadAction<any>) {
      const newUser: UserItem = {
        email: action.payload.email,
        password: action.payload.password,
      };
      state.current = newUser;
    },
  },
});

export const { actions: userActions, reducer: userReducer } = slice;

export const useUserSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions, reducer: slice.reducer };
};
