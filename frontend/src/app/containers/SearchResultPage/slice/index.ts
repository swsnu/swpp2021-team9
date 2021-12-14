import { PayloadAction } from '@reduxjs/toolkit';
import { SagaInjectionModes } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import searchResultPageSaga from './saga';

/* --- STATE --- */
export interface SearchResultState {
  songsResponse: AsyncStateType<Song[]>;
}

export const initialState: SearchResultState = {
  songsResponse: { loading: false },
};

const slice = createSlice({
  name: 'searchResult',
  initialState,
  reducers: {
    loadingSongsResponse(state, _action: PayloadAction<any>) {
      state.songsResponse = { loading: true };
    },
    successSongsResponse(state, action: PayloadAction<Song[]>) {
      state.songsResponse = { loading: false };
      state.songsResponse.data = action.payload;
    },
    errorSongsResponse(state, action: PayloadAction<string>) {
      state.songsResponse = { loading: false };
      state.songsResponse.error = action.payload;
    },
  },
});

export const { actions: searchResultActions } = slice;

export const useSearchResultSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: searchResultPageSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  return { actions: slice.actions, reducer: slice.reducer };
};
