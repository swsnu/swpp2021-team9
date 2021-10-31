import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './index';

const selectSlice = (state: RootState) => state.playerBar || initialState;

export const selectCover = createSelector([selectSlice], state => state);
