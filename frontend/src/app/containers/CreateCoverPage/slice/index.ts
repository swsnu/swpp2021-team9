import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';

type CoverInfo = {
  title: string;
  category: string;
  instrumentType: string;
  tags: string[];
  description: string;
};

export interface CreateCoverState {
  name: string;
  audioURL: string;
  info: {};
}

export const initialState: CreateCoverState = {
  name: 'createCover',
  audioURL: '',
  info: {},
};

const slice = createSlice({
  name: 'createCover',
  initialState: initialState,
  reducers: {
    setInfo(state, action: PayloadAction<CoverInfo>) {
      state.info = action.payload;
    },
    setAudioURL(state, action: PayloadAction<string>) {
      state.audioURL = action.payload;
    },
  },
});

export const { actions: createCoverActions } = slice;

export const useCreateCoverSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions, reducer: slice.reducer };
};
