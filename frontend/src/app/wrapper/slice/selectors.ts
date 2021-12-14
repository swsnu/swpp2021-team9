import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'utils/types';
import { initialState } from './index';

export const selectSlice = (state: RootState) => state.wrapper || initialState; // state.??? 부분을 이름으로 바꾸기

export const selectWrapper = createSelector([selectSlice], state => state);

export const selectUser = createSelector([selectWrapper], state => state.user);
