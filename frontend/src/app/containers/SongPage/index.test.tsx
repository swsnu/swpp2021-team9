import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import SongPage from '.';
import { Song, Main, CreateCover } from 'utils/urls';
import { api } from 'api/band';
import {
  dummySongs,
  dummyCombinations,
  dummyCovers,
  dummyInstruments,
} from 'api/dummy';

const store = configureAppStore();

const mockHistoryPush = jest.fn().mockImplementation(string => {});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function setup() {
  const page = render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path={Song(':id')} component={SongPage} />
          <Redirect exact from="/" to={Song(1)} />
          <Route component={() => <div />} />
        </Switch>
      </BrowserRouter>
    </Provider>,
  );
  return { page };
}

beforeEach(() => {
  jest.clearAllMocks();
  api.getSongInfo = jest.fn(
    (_songId: number) =>
      new Promise((res, rej) => {
        res(dummySongs[0]);
      }),
  );
  api.getCombinationsBySong = jest.fn(
    (_songId: number) =>
      new Promise((res, rej) => {
        res(dummyCombinations);
      }),
  );
  api.getCoversBySongId = jest.fn(
    (_songId: number) =>
      new Promise((res, rej) => {
        res(dummyCovers);
      }),
  );
  api.getInstruments = jest.fn(
    () =>
      new Promise((res, rej) => {
        res(dummyInstruments);
      }),
  );
});

test('should render', () => {
  const { page } = setup();
  expect(page.getByTestId('SongPage')).toBeTruthy();
});

test('should alert if page does not exist', async () => {
  jest.spyOn(window, 'alert').mockImplementation((message?: string) => {
    return null;
  });
  api.getSongInfo = jest.fn(
    (_songId: number) =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );
  setup();
  await waitFor(() => {
    expect(mockHistoryPush).toBeCalledWith(Main());
  });
});

test('record button test', async () => {
  const { page } = setup();
  await waitFor(() => {
    expect(page.getByText(/REC/)).toBeTruthy();
  });
  const recordButton = page.getByText(/REC/);
  fireEvent.click(recordButton);
});
