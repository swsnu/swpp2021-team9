import { put, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { createSongActions } from '.';

export default function* createSongPageSaga(payload: any) {
  yield takeEvery(AT.CREATE_SONG.REQUEST, postSongRequest);
}

export function* postSongRequest(
  action: ActionType<typeof actions.createSong.request>,
) {
  yield put(createSongActions.loadingSongResponse('start load'));
  try {
    const response = yield api.postSong(action.payload);
    yield put(createSongActions.successSongResponse(response.data));
  } catch (e: any) {
    yield put(createSongActions.errorSongResponse(e));
  }
}
