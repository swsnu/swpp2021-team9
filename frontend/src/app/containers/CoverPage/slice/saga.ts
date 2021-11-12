import { takeLatest, call, put, select, takeEvery } from 'redux-saga/effects';
import { coverActions } from '.';
import * as AT from 'api/actionTypes';

// Root saga
export default function* coverPageSaga() {
  yield [yield takeEvery(AT.LOAD_COVER.REQUEST, getCoverResponse)];
}

type Response = string;

function* getCoverResponse(action: any) {
  console.log('getCoverResponse', action);
  yield put(coverActions.loadingCoverResponse('start load'));
  try {
    const coverResponse: Response = yield new Promise(res =>
      setInterval(() => res('hihi'), 5000),
    );
    yield put(coverActions.successCoverResponse(coverResponse));
  } catch (e) {
    yield put(coverActions.errorCoverResponse(e));
  }
}
