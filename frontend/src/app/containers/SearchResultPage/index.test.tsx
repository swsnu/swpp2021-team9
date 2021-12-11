import React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import SearchResultPage from '.';
import { api } from 'api/band';
import { dummySongs } from 'api/dummy';

const store = configureAppStore();

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  api.getSongBySearch = jest.fn(
    (_key: string) =>
      new Promise((res, rej) => {
        res(dummySongs);
      }),
  );
});

function setup() {
  const path = '/search?key=A';
  const page = render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={'/search'} component={SearchResultPage} />
          <Redirect exact from="/" to={path} />
          <Route component={() => <div>WHAT</div>} />
        </Switch>
      </BrowserRouter>
    </Provider>,
  );
  return { page };
}

test('should render', async () => {
  const { page } = setup();
  expect(page.getByTestId('SearchResultPage')).toBeTruthy();
});

test('should handle empty page', async () => {
  api.getSongBySearch = jest.fn(
    (_key: string) =>
      new Promise((res, rej) => {
        res([]);
      }),
  );
  const { page } = setup();
  await waitFor(() => {
    expect(page.getByText(/Create/i)).toBeTruthy();
  });
  const addSongButton = page.getByText(/Create/) as HTMLButtonElement;
  fireEvent.click(addSongButton);
  expect(mockHistoryPush).toBeTruthy();
});

test('should handle title button correctly', async () => {
  const { page } = setup();
  await waitFor(() => {
    expect(page.getByText(/SEARCH/i)).toBeTruthy();
  });
  const resultLine = page.getAllByTestId('ResultLine')[0] as HTMLDataElement;
  fireEvent.click(resultLine);
  expect(mockHistoryPush).toBeTruthy();
});
