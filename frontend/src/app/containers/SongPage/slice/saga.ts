import { put, takeEvery } from 'redux-saga/effects';
import { songActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';

// Root saga
export default function* songPageSaga() {
  yield takeEvery(AT.LOAD_SONG.REQUEST, getSongRequest);
  yield takeEvery(AT.LOAD_COMBINATIONS.REQUEST, getCombinationsRequest);
  yield takeEvery(AT.LOAD_COVERS_SONG.REQUEST, getCoversRequest);
  yield takeEvery(AT.LOAD_INSTRUMENTS.REQUEST, getInstrumentsRequest);
}

export function* getSongRequest(
  action: ActionType<typeof actions.loadSong.request>,
) {
  yield put(songActions.loadingSongResponse('start load'));
  try {
    const response = yield api.getSongInfo(action.payload);
    yield put(songActions.successSongResponse(response));
  } catch (e: any) {
    yield put(songActions.errorSongResponse(e));
  }
}

export function* getCombinationsRequest(
  action: ActionType<typeof actions.loadCombinations.request>,
) {
  yield put(songActions.loadingCombinationsResponse('start load'));
  try {
    const response = yield api.getCombinationsBySong(action.payload);
    yield put(songActions.successCombinationsResponse(response));
  } catch (e: any) {
    yield put(songActions.errorCombinationsResponse(e));
  }
}

export function* getCoversRequest(
  action: ActionType<typeof actions.loadCoversSong.request>,
) {
  yield put(songActions.loadingCoversResponse('start load'));
  try {
    const response = yield api.getCoversBySongId(action.payload);
    yield put(songActions.successCoversResponse(response));
  } catch (e: any) {
    yield put(songActions.errorCoversResponse(e));
  }
}

export function* getInstrumentsRequest(
  action: ActionType<typeof actions.loadInstruments.request>,
) {
  yield put(songActions.loadingInstrumentsResponse('start load'));
  try {
    const response = yield api.getInstruments();
    yield put(songActions.successInstrumentsResponse(response));
  } catch (e: any) {
    yield put(songActions.errorInstrumentsResponse(e));
  }
}
