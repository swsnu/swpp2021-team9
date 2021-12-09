import { asyncActionCreator } from 'api/utils';

// instrument actionTypes
export const LOAD_INSTRUMENTS = asyncActionCreator('LOAD_INSTRUMENTS');

// cover actionTypes
export const LOAD_COVERS_SONG = asyncActionCreator('LOAD_COVERS_SONG');
export const LOAD_COVERS_SONG_INST = asyncActionCreator(
  'LOAD_COVERS_SONG_INST',
);
export const LOAD_COVER = asyncActionCreator('LOAD_COVER');
export const LOAD_SIGNIN = asyncActionCreator('LOAD_SIGNIN');
export const LOAD_SIGNUP = asyncActionCreator('LOAD_SIGNUP');
export const EDIT_COVER = asyncActionCreator('EDIT_COVER');
export const DELETE_COVER = asyncActionCreator('DELETE_COVER');

// combination actionTypes
export const LOAD_COMBINATIONS = asyncActionCreator('LOAD_COMBINATIONS');

// song actionTypes
export const CREATE_SONG = asyncActionCreator('CREATE_SONG');
export const LOAD_SONG = asyncActionCreator('LOAD_SONG');
