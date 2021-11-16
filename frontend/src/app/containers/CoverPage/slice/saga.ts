import { takeLatest, call, put, select, takeEvery } from 'redux-saga/effects';
import { coverActions } from '.';
import * as AT from 'api/actionTypes';

// Root saga
export default function* coverPageSaga(payload: any) {
  yield takeEvery(AT.LOAD_COVER.REQUEST, getCoverResponse, payload);
}

export const mockCoverResult = {
  id: 0,
  audio:
    'https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/4.mp3',
  title: 'COVER_TITLE',
  user: {
    id: 0,
    username: 'USERNAME',
    photo: 'USER_PHOTO',
  },
  category: 'COVER_CATEGORY',
  song: {
    id: 0,
    title: 'SONG_TITLE',
    singer: 'SONG_SINGER',
    category: 'SONG_CATEGORY',
    reference: 'SONG_REF',
    description: 'SONG_DESC',
  },
  description: 'COVER_DESCRIPTION',
  tags: ['TAG1', 'TAG2', 'TAG3'],
};

const mockApiCall = (payload: string) =>
  new Promise<CoverResponse>((res, rej) =>
    setInterval(
      () =>
        payload === 'SAGA_TEST_REJ' ? rej('REJECT') : res(mockCoverResult),
      1000,
    ),
  );

export function* getCoverResponse(payload: string) {
  yield put(coverActions.loadingCoverResponse('start load'));
  try {
    const coverResponse = yield mockApiCall(payload);
    yield put(coverActions.successCoverResponse(coverResponse));
  } catch (e: any) {
    yield put(coverActions.errorCoverResponse(e));
  }
}
