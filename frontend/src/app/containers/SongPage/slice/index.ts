import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';

interface CombinationItem {
  id: number;
  instrument: Instrument;
  cover: Cover | null;
}

/* --- STATE --- */
export interface SongState {
  id: number | null;
  combination: CombinationItem[];
  current: number | null;
} // state 형식 정의

export const initialState: SongState = {
  id: null,
  combination: [],
  current: null,
};

let nextItemID = 0;

const slice = createSlice({
  name: 'song', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
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
    addCovers(state, action: PayloadAction<(Cover | undefined)[]>) {
      action.payload.forEach(cover => {
        if (!cover) return;
        const alreadyExist = state.combination.find(
          item => item.cover && item.cover.id === cover.id,
        );
        if (alreadyExist) return;

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

export const { actions: songActions } = slice;

export const useSongSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions, reducer: slice.reducer };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useExampleSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
