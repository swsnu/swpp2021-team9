import { put, takeEvery } from 'redux-saga/effects';
import { coverEditActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';

// Root saga
export default function* coverEditPageSaga(payload: any) {
  yield takeEvery(AT.LOAD_COVER.REQUEST, getCoverRequest);
  yield takeEvery(AT.EDIT_COVER.REQUEST, EditCoverRequest);
}

export function* getCoverRequest(
  action: ActionType<typeof actions.loadCover.request>,
) {
  yield put(coverEditActions.loadingCoverResponse('start load'));
  try {
    const coverResponse = yield api.getCoverInfo(action.payload);
    yield put(coverEditActions.successCoverResponse(coverResponse));
  } catch (e: any) {
    yield put(coverEditActions.errorCoverResponse(e));
  }
}

export function* EditCoverRequest(
  action: ActionType<typeof actions.editCover.request>,
) {
  yield put(coverEditActions.loadingEditResponse('start load'));
  try {
    const response = yield api.putCoverInfo(action.payload);
    yield put(coverEditActions.successEditResponse(response.data));
  } catch (e: any) {
    yield put(coverEditActions.errorEditResponse(e));
  }
}
