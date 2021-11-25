import { CreateCoverState } from 'app/containers/CreateCoverPage/slice';
import { UserState } from 'app/containers/SignInPage/slice';
import { SongState } from 'app/containers/SongPage/slice';
import { WrapperState } from 'app/wrapper/slice';
// import { ProfileState } from 'app/containers/ProfilePage/slice';
// import { CreateCover } from '../utils/urls';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  createCover?: CreateCoverState;
  song?: SongState;
  wrapper?: WrapperState;
  user?: UserState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
