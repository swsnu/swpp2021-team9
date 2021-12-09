import { MainState } from 'app/containers/MainPage/slice';
import { CreateCoverState } from 'app/containers/CreateCoverPage/slice';
import { CreateSongState } from 'app/containers/CreateSongPage/slice';
import { SongState } from 'app/containers/SongPage/slice';
import { MakeCombinationState } from 'app/containers/SongPage/slice/makeCombination';
import { WrapperState } from 'app/wrapper/slice';
import { CoverState } from 'app/containers/CoverPage/slice';
import { CoverEditState } from 'app/containers/CoverEditPage/slice';
// import { ProfileState } from 'app/containers/ProfilePage/slice';
// import { CreateCover } from '../utils/urls';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  main?: MainState;
  createCover?: CreateCoverState;
  createSong?: CreateSongState;
  song?: SongState;
  makeCombination?: MakeCombinationState;
  wrapper?: WrapperState;
  cover?: CoverState;
  coverEdit?: CoverEditState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
