import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './index';

const selectSlice = (state: RootState) => (state && state.song) || initialState;

export const selectCombination = createSelector(
  [selectSlice],
  state => state.combination,
);

export const selectCurrent = createSelector(
  [selectSlice],
  state => state.current,
);
