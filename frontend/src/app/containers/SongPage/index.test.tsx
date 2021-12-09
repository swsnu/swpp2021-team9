import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, MemoryRouter } from 'react-router-dom';

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
      <MemoryRouter>
        <Switch>
          <Route path={Song(':id')} component={SongPage} />
          <Redirect to={Song(1)} />
        </Switch>
      </MemoryRouter>
    </Provider>,
  );
  return { page };
}

beforeEach(() => {
  jest.clearAllMocks();
  api.getSongInfo = jest.fn(
    (_songId: number) =>
      new Promise((res, rej) => {
        res(dummySongs[1]);
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

  const page = (
    <Provider store={store}>
      <MemoryRouter>
        <Switch>
          <Route path={Song(':id')} component={SongPage} />
          <Redirect to={Song('10000')} />
        </Switch>
      </MemoryRouter>
    </Provider>
  );
  render(page);

  await waitFor(() => {
    expect(mockHistoryPush).toBeCalledWith(Main());
  });
});

test('record button test', () => {
  const { page } = setup();
  const recordButton = page.getByText('REC');
  fireEvent.click(recordButton);
  expect(mockHistoryPush).toBeCalledWith(CreateCover('record'));
});
