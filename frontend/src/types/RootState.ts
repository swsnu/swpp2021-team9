import { MainState } from 'app/containers/MainPage/slice';
import { WrapperState } from 'app/wrapper/slice';
// import { ProfileState } from 'app/containers/ProfilePage/slice';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  main?: MainState;
  wrapper?: WrapperState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
