import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';

export interface CombinationItem {
  id: number;
  instrument: Instrument;
  cover: Cover | null;
}

/* --- STATE --- */
export interface MakeCombinationState {
  song: Song | null;
  combination: CombinationItem[];
  current: number | null;
}

export const initialState: MakeCombinationState = {
  song: null,
  combination: [],
  current: null,
};

let nextItemID = 0;

const slice = createSlice({
  name: 'makeCombination', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    setSong(state, action: PayloadAction<Song>) {
      console.log(action.payload);
      if (state.song && state.song.id !== action.payload.id) {
        state.combination = [];
        state.current = null;
      }
      state.song = action.payload;
    },
    addItem(state, action: PayloadAction<Instrument>) {
      const newItem: CombinationItem = {
        id: nextItemID,
        instrument: action.payload,
        cover: null,
      };
      state.combination.push(newItem);
      state.current = nextItemID;
      nextItemID += 1;
    },
    setCurrent(state, action: PayloadAction<number>) {
      state.current = action.payload;
    },
    editCurrent(state, action: PayloadAction<Cover>) {
      const alreadyExist = state.combination.find(
        item =>
          item.cover &&
          item.cover.id === action.payload.id &&
          item.id !== state.current,
      );
      if (alreadyExist) return state;

      const targetItem = state.combination.find(
        item => item.id === state.current,
      );
      if (!targetItem) return state;

      targetItem.cover = action.payload;
      state.current = null;
    },
    deleteItem(state, action: PayloadAction<number>) {
      state.combination = state.combination.filter(
        item => item.id !== action.payload,
      );
      state.current = null;
    },
    getCovers(state, action: PayloadAction<(Cover | undefined)[]>) {
      nextItemID = 0;
      state.combination = [];
      state.current = null;
      action.payload.forEach(cover => {
        if (!cover) return;

        const newItem: CombinationItem = {
          id: nextItemID++,
          instrument: cover.instrument,
          cover: cover,
        };
        state.combination.push(newItem);
      });
    },
  },
});

export const {
  actions: makeCombinationActions,
  reducer: makeCombinationReducer,
} = slice;

export const useMakeCombinationSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions, reducer: slice.reducer };
};
