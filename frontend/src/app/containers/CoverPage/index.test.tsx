import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';

import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import CoverPage from '.';
import { CoverState } from './slice';
import { dummyCovers } from 'api/dummy';
import * as urls from 'utils/urls';
import { api } from 'api/band';

const store = configureAppStore();

// const mockLoadingState: CoverState = {
//   name: 'cover',
//   coverResponse: { loading: true },
// };

const mockSuccessState: CoverState = {
  name: 'cover',
  coverResponse: { loading: false, data: dummyCovers[0] },
};

const mockErrorState: CoverState = {
  name: 'cover',
  coverResponse: { loading: false, error: 'MOCK_ERROR' },
};

jest.mock('./WavePlayer', () => {
  return {
    __esModule: true,
    default: () => <div />,
  };
});

function setup(state: CoverState) {
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  useSelectorMock.mockReturnValue(state);
  const path = '/cover/1';
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={path} component={CoverPage} />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return { page };
}

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

afterEach(() => {
  jest.clearAllMocks();
  api.getCoverInfo = jest.fn(
    (coverId: number) =>
      new Promise((res, rej) => {
        res(dummyCovers[coverId]);
      }),
  );
});

test('should render', () => {
  const path = '/cover/1';
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={path} component={CoverPage} />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  render(page);
  expect(screen.getByTestId('CoverPage')).toBeTruthy();
});

test('should handle buttons', () => {
  const { page } = setup(mockSuccessState);
  const { getByTestId } = render(page);

  const songTitleButton = getByTestId('songTitle');
  const usernameButton = getByTestId('usename');

  expect(songTitleButton).toBeTruthy();
  expect(usernameButton).toBeTruthy();

  fireEvent.click(songTitleButton);
  expect(mockHistoryPush).lastCalledWith(urls.Song(0));

  fireEvent.click(usernameButton);
  expect(mockHistoryPush).lastCalledWith(urls.Profile(0));
});

test('should show error statement', () => {
  const { page } = setup(mockErrorState);
  const { getByTestId } = render(page);

  const errorStatement = getByTestId('errorStatement');

  expect(errorStatement.textContent).toBe('error: MOCK_ERROR');
});
