import { asyncActionCreator } from 'api/utils';

export const LOAD_COVERS_SONG = asyncActionCreator('LOAD_COVERS_SONG');
export const LOAD_COVERS_SONG_INST = asyncActionCreator(
  'LOAD_COVERS_SONG_INST',
);
export const LOAD_COVER = asyncActionCreator('LOAD_COVER');
export const EDIT_COVER = asyncActionCreator('EDIT_COVER');
export const DELETE_COVER = asyncActionCreator('DELETE_COVER');

export const CREATE_SONG = asyncActionCreator('CREATE_SONG');
export const LOAD_SONG = asyncActionCreator('LOAD_SONG');
