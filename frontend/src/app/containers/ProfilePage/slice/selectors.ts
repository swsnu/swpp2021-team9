import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../../../utils/types';
import { initialState } from './index';

export const selectSlice = (state: RootState) => state.profile || initialState; // state.??? 부분을 이름으로 바꾸기

export const selectProfile = createSelector([selectSlice], state => state);
