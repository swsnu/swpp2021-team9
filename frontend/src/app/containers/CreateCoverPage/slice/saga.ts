import { put, takeEvery } from 'redux-saga/effects';
import { createCoverActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';
import { AxiosResponse } from 'axios';

// Root saga
export default function* coverCreatePageSaga() {
  yield takeEvery(AT.CREATE_COVER.REQUEST, createCoverRequest);
}

export function* createCoverRequest(
  action: ActionType<typeof actions.createCover.request>,
) {
  yield put(createCoverActions.loadingCreateResponse('start load'));
  try {
    const response: Cover = yield api.postCover(action.payload);
    yield put(createCoverActions.successCreateResponse(response));
  } catch (e: any) {
    yield put(createCoverActions.errorCreateResponse(e));
  }
}
