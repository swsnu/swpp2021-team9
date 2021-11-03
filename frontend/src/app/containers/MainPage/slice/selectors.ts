import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './index';

const selectSlice = (state: RootState) => state.main || initialState; // state.??? 부분을 이름으로 바꾸기

export const selectMain = createSelector([selectSlice], state => state);
