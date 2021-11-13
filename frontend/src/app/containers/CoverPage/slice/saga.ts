import { takeLatest, call, put, select, takeEvery } from 'redux-saga/effects';
import { coverActions } from '.';
import * as AT from 'api/actionTypes';

// Root saga
export default function* coverPageSaga() {
  yield [yield takeEvery(AT.LOAD_COVER.REQUEST, getCoverResponse)];
}

function* getCoverResponse(action: any) {
  console.log('getCoverResponse', action);
  yield put(coverActions.loadingCoverResponse('start load'));
  try {
    const coverResponse = yield new Promise<CoverResponse>(res =>
      setInterval(
        () =>
          res({
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
          }),
        1000,
      ),
    );
    yield put(coverActions.successCoverResponse(coverResponse));
  } catch (e: any) {
    yield put(coverActions.errorCoverResponse(e));
  }
}
