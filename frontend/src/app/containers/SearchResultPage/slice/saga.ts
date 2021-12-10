import { put, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { searchResultActions } from '.';

// Root saga
export default function* searchResultPageSaga() {
  yield takeEvery(AT.LOAD_SONGS_SEARCH.REQUEST, getSongsSearchRequest);
}

export function* getSongsSearchRequest(
  action: ActionType<typeof actions.loadSongsSearch.request>,
) {
  yield put(searchResultActions.loadingSongsResponse('start load'));
  try {
    const response = yield api.getSongBySearch(action.payload);
    yield put(searchResultActions.successSongsResponse(response));
  } catch (e: any) {
    yield put(searchResultActions.errorSongsResponse(e));
  }
}
