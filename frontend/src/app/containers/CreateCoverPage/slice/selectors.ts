import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './index';

export const selectSlice = (state: RootState) =>
  state.createCover || initialState;

export const selectCreateCover = createSelector([selectSlice], state => state);
