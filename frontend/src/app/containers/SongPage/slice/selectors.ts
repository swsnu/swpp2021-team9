import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'utils/types';
import { initialState as initialMakeCombination } from './makeCombination';
import { initialState as initialSong } from '.';

const selectMakeCombinationSlice = (state: RootState) =>
  (state && state.makeCombination) || initialMakeCombination;

export const selectCombination = createSelector(
  [selectMakeCombinationSlice],
  state => state.combination,
);

export const selectCurrent = createSelector(
  [selectMakeCombinationSlice],
  state => state.current,
);

const selectSongSlice = (state: RootState) =>
  (state && state.song) || initialSong;

export const selectSong = createSelector([selectSongSlice], state => state);
