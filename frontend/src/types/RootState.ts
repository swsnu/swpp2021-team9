import { MainState } from 'app/containers/MainPage/slice';
import { CreateCoverState } from 'app/containers/CreateCoverPage/slice';
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
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
