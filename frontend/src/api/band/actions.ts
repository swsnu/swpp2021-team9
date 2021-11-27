import * as AT from 'api/actionTypes';
import { asyncAction } from 'api/utils';

export const loadCover = asyncAction<number, Cover, string>(AT.LOAD_COVER);
export const signin = asyncAction<SignInForm, UserInfo, string>(AT.LOAD_SIGNIN);
export const signup = asyncAction<SignUpForm, null, string>(AT.LOAD_SIGNUP);
