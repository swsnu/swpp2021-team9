import { put, takeEvery } from 'redux-saga/effects';
import { signInActions } from '.';
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
  yield put(signInActions.loadingCoverResponse('start load'));
  try {
    const coverResponse = yield api.getCoverInfo(action.payload);
    yield put(signInActions.successCoverResponse(coverResponse));
  } catch (e: any) {
    yield put(signInActions.errorCoverResponse(e));
  }
}
