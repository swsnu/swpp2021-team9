import { put, takeEvery } from 'redux-saga/effects';
import { createCoverActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';
// Root saga
export default function* createCoverPageSaga() {
  yield takeEvery(AT.CREATE_COVER.REQUEST, createCoverRequest);
  yield takeEvery(AT.LOAD_INSTRUMENTS.REQUEST, getInstrumentsRequest);
}

export function* createCoverRequest(
  action: ActionType<typeof actions.createCover.request>,
) {
  yield put(createCoverActions.loadingCreateResponse('start load'));
  try {
    const response = yield api.postCover(action.payload);
    yield put(createCoverActions.successCreateResponse(response.data));
  } catch (e: any) {
    yield put(createCoverActions.errorCreateResponse(e));
  }
}

export function* getInstrumentsRequest(
  action: ActionType<typeof actions.loadInstruments.request>,
) {
  yield put(createCoverActions.loadingInstrumentsResponse('start load'));
  try {
    const response = yield api.getInstruments();
    yield put(createCoverActions.successInstrumentsResponse(response));
  } catch (e: any) {
    yield put(createCoverActions.errorInstrumentsResponse(e));
  }
}
