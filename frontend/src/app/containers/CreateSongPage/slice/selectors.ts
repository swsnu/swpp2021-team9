import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './index';

export const selectSlice = (state: RootState) =>
  state.createSong || initialState;

export const selectCreateSong = createSelector([selectSlice], state => state);
