import { put, takeEvery } from 'redux-saga/effects';
import { coverActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';

// Root saga
export default function* coverPageSaga(payload: any) {
  yield takeEvery(AT.LOAD_COVER.REQUEST, getCoverResponse);
}

export function* getCoverResponse(
  action: ActionType<typeof actions.loadCover.request>,
) {
  yield put(coverActions.loadingCoverResponse('start load'));
  try {
    const coverResponse = yield api.getCoverInfo(action.payload);
    yield put(coverActions.successCoverResponse(coverResponse));
  } catch (e: any) {
    yield put(coverActions.errorCoverResponse(e));
  }
}
