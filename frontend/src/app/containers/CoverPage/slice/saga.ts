import { put, takeEvery } from 'redux-saga/effects';
import { coverActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';
import { AxiosResponse } from 'axios';

// Root saga
export default function* coverPageSaga() {
  yield takeEvery(AT.LOAD_COVER.REQUEST, getCoverRequest);
  yield takeEvery(AT.DELETE_COVER.REQUEST, deleteCoverRequest);
}

export function* getCoverRequest(
  action: ActionType<typeof actions.loadCover.request>,
) {
  yield put(coverActions.loadingCoverResponse('start load'));
  try {
    const response: Cover = yield api.getCoverInfo(action.payload);
    yield put(coverActions.successCoverResponse(response));
  } catch (e: any) {
    yield put(coverActions.errorCoverResponse(e));
  }
}

export function* deleteCoverRequest(
  action: ActionType<typeof actions.loadCover.request>,
) {
  yield put(coverActions.loadingDeleteResponse('start load'));
  try {
    const response: AxiosResponse = yield api.deleteCover(action.payload);
    yield put(coverActions.successDeleteResponse(response.status));
  } catch (e: any) {
    yield put(coverActions.errorDeleteResponse(e));
  }
}
