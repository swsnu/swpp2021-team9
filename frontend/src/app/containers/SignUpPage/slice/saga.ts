import { put, takeEvery } from 'redux-saga/effects';
import { signUpActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';
import { wrapperActions } from 'app/wrapper/slice';

// Root saga
export default function* signUpPageSaga(payload: any) {
  yield takeEvery(AT.LOAD_SIGNUP.REQUEST, getSignUpResponse);
}

export function* getSignUpResponse(
  action: ActionType<typeof actions.signup.request>,
) {
  yield put(signUpActions.loadingSignUpResponse('start load'));
  try {
    const signUpResponse = yield api.signup(action.payload);
    yield put(signUpActions.successSignUpResponse(signUpResponse));
    yield put(wrapperActions.setUser(signUpResponse));
  } catch (e: any) {
    yield put(signUpActions.errorSignUpResponse(e));
  }
}
