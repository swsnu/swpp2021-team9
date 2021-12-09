import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => (state && state.main) || initialState;

export const selectMain = createSelector([selectSlice], state => state);
