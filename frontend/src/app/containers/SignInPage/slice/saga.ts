import { put, takeEvery } from 'redux-saga/effects';
import { signInActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';
import { wrapperActions } from 'app/wrapper/slice';

// Root saga
export default function* signInPageSaga(payload: any) {
  yield takeEvery(AT.LOAD_SIGNIN.REQUEST, getSignInResponse);
}

export function* getSignInResponse(
  action: ActionType<typeof actions.signin.request>,
) {
  yield put(signInActions.loadingSignInResponse('start load'));
  try {
    const signInResponse = yield api.signin(action.payload);
    yield put(signInActions.successSignInResponse(signInResponse.data));
    yield put(wrapperActions.setUser(signInResponse.data));
  } catch (e: any) {
    yield put(signInActions.errorSignInResponse(e));
  }
}
