import { put, takeEvery } from 'redux-saga/effects';
import { songActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';

// Root saga
export default function* songPageSaga() {
  yield takeEvery(AT.LOAD_SONG.REQUEST, getSongRequest);
}

export function* getSongRequest(
  action: ActionType<typeof actions.loadSong.request>,
) {
  yield put(songActions.loadingSongResponse('start load'));
  try {
    const response: Song = yield api.getSongInfo(action.payload);
    yield put(songActions.successSongResponse(response));
  } catch (e: any) {
    yield put(songActions.errorSongResponse(e));
  }
}
