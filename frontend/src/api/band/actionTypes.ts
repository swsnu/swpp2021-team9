import { asyncActionCreator } from 'api/utils';

// instrument actionTypes
export const LOAD_INSTRUMENTS = asyncActionCreator('LOAD_INSTRUMENTS');

// cover actionTypes
export const LOAD_COVERS_SONG = asyncActionCreator('LOAD_COVERS_SONG');
export const LOAD_COVERS_SONG_INST = asyncActionCreator(
  'LOAD_COVERS_SONG_INST',
);
export const LOAD_COVER = asyncActionCreator('LOAD_COVER');
export const EDIT_COVER = asyncActionCreator('EDIT_COVER');
export const DELETE_COVER = asyncActionCreator('DELETE_COVER');
export const CREATE_COVER = asyncActionCreator('CREATE_COVER');

// combination actionTypes
export const LOAD_COMBINATIONS = asyncActionCreator('LOAD_COMBINATIONS');
export const LOAD_COMBINATIONS_MAIN = asyncActionCreator(
  'LOAD_COMBINATIONS_MAIN',
);
export const LOAD_COMBINATION_LIKE = asyncActionCreator(
  'LOAD_COMBINATION_LIKE',
);
export const EDIT_COMBINATION_LIKE = asyncActionCreator(
  'EDIT_COMBINATION_LIKE',
);

// song actionTypes
export const CREATE_SONG = asyncActionCreator('CREATE_SONG');
export const LOAD_SONG = asyncActionCreator('LOAD_SONG');
export const LOAD_SONGS_SEARCH = asyncActionCreator('LOAD_SONGS_SEARCH');
