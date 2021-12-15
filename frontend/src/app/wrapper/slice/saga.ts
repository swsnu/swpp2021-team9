import { takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
// import { wrapperActions } from '.';

// Root saga
export default function* wrapperSaga() {
  yield takeEvery(AT.EDIT_COMBINATION_LIKE.REQUEST, putCombinationLikeRequest);
}

export function* putCombinationLikeRequest(
  action: ActionType<typeof actions.editCombinationLike.request>,
) {
  console.log('LOADING');
  try {
    const response = yield api.putCombinationLike(action.payload);
    console.log(response.data);
  } catch (e: any) {}
}
