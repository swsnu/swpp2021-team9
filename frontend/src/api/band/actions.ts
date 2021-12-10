import * as AT from 'api/actionTypes';
import { asyncAction } from 'api/utils';
import { AxiosError } from 'axios';

// user actions
export const signin = asyncAction<SignInForm, UserInfo, string>(AT.LOAD_SIGNIN);
export const signup = asyncAction<SignUpForm, null, string>(AT.LOAD_SIGNUP);
export const loadProfile = asyncAction<number, User, string>(AT.LOAD_PROFILE);
export const postProfile = asyncAction<UserPostForm, User, string>(
  AT.POST_PROFILE,
);

// instrument actions
export const loadInstruments = asyncAction<undefined, Instrument[], AxiosError>(
  AT.LOAD_INSTRUMENTS,
);

// cover actions
export const loadCoversSong = asyncAction<number, Cover[], AxiosError>(
  AT.LOAD_COVERS_SONG,
);
export const loadCoversSongInst = asyncAction<
  { songId: number; instrumentId: number },
  Cover[],
  AxiosError
>(AT.LOAD_COVERS_SONG_INST);
export const loadCover = asyncAction<number, Cover, AxiosError>(AT.LOAD_COVER);
export const editCover = asyncAction<CoverFormPut, Cover, AxiosError>(
  AT.EDIT_COVER,
);
export const deleteCover = asyncAction<number, number, AxiosError>(
  AT.DELETE_COVER,
);

// combination actions
export const loadCombinations = asyncAction<number, Combination[], AxiosError>(
  AT.LOAD_COMBINATIONS,
);

// song actions
export const createSong = asyncAction<SongForm, Song, AxiosError>(
  AT.CREATE_SONG,
);
export const loadSong = asyncAction<number, Song, AxiosError>(AT.LOAD_SONG);
