import React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, MemoryRouter } from 'react-router-dom';
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
      <MemoryRouter initialEntries={[path]}>
        <Switch>
          <Route path={'/search'} component={SearchResultPage} />
        </Switch>
      </MemoryRouter>
    </Provider>,
  );
  return { page };
}

test('should render', async () => {
  const { page } = setup();
  expect(page.getByTestId('SearchResultPage')).toBeTruthy();
});

test('should render without key', async () => {
  const path = '/search';
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Switch>
          <Route path={'/search'} component={SearchResultPage} />
        </Switch>
      </MemoryRouter>
    </Provider>,
  );
  await waitFor(() => {
    expect(api.getSongBySearch).toHaveBeenCalledWith('');
  });
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

test('should handle error', async () => {
  api.getSongBySearch = jest.fn(
    (_key: string) =>
      new Promise((res, rej) => {
        rej('REJECT');
      }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  setup();
  await waitFor(() => expect(window.alert).toBeCalledTimes(1));
});
