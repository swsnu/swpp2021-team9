import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import Player from 'app/helper/Player';
import { render } from '@testing-library/react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import MainPage from '.';
import { api } from 'api/band';
import { dummyCombinations } from 'api/dummy';

const store = configureAppStore();
let player = Player.getInstance();

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function setup() {
  const path = '/';
  const page = render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={path} render={() => <MainPage />} />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>,
  );
  return { page };
}

beforeAll(() => {
  player.play = jest.fn();
  player.pause = jest.fn();
  player.playPrev = jest.fn();
  player.playNext = jest.fn();
  player.setCurrentTime = jest.fn();
  player.isPaused = jest.fn().mockReturnValue(true);
  player.setIndex = jest.fn();
  player.addTrack = jest.fn();
  player.getTrack = jest.fn();
});

beforeEach(() => {
  jest.resetAllMocks();
  api.getCombinationsMain = jest.fn().mockResolvedValue(dummyCombinations);
});

test('should render', () => {
  const { page } = setup();
  expect(page.getByTestId('MainPage')).toBeTruthy();
});

test('should handle clicking play button correctly', async () => {
  let track = 1;
  (player.addTrack as jest.Mock).mockImplementation(t => {
    track = t;
  });

  const { page } = setup();
  await waitFor(() => {});
  const clickplay = page.getAllByTestId('Play')[1] as HTMLElement;

  fireEvent.click(clickplay);
  expect(player.addTrack).toBeCalledTimes(1);

  (player.getTrack as jest.Mock).mockReturnValueOnce(track);
  fireEvent.click(clickplay);
  expect(player.addTrack).toBeCalledTimes(1);
});

test('should handle clicking title button correctly', async () => {
  const { page } = setup();
  await waitFor(() => {});
  const clicktitle = page.getAllByTestId('Title')[0] as HTMLElement;
  fireEvent.click(clicktitle);
  expect(mockHistoryPush).toHaveBeenCalled();
});

test('should handle error', async () => {
  api.getCombinationsMain = jest.fn().mockRejectedValue('REJECT');
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  setup();
  await waitFor(() => expect(window.alert).toBeCalledTimes(1));
});
