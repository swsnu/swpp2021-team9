import { put, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { mainActions } from '.';

// Root saga
export default function* mainPageSaga() {
  yield takeEvery(
    AT.LOAD_COMBINATIONS_MAIN.REQUEST,
    getCombinationsMainRequest,
  );
}

export function* getCombinationsMainRequest(
  action: ActionType<typeof actions.loadCombinationsMain.request>,
) {
  yield put(mainActions.loadingCombinationsResponse('start load'));
  try {
    const response = yield api.getCombinationsMain();
    yield put(mainActions.successCombinationsResponse(response));
  } catch (e: any) {
    yield put(mainActions.errorCombinationsResponse(e));
  }
}
