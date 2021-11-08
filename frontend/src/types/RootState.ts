import { MainState } from 'app/containers/MainPage/slice';
import { SongState } from 'app/containers/SongPage/slice';
// import { ProfileState } from 'app/containers/ProfilePage/slice';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  main?: MainState;
  song?: SongState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
