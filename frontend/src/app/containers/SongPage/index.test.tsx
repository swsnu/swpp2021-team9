import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, MemoryRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import SongPage from '.';
import { Song, Main, CreateCover } from 'utils/urls';

const store = configureAppStore();

const mockHistoryPush = jest.fn().mockImplementation(string => {});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function setup() {
  jest.clearAllMocks();

  const page = render(
    <Provider store={store}>
      <MemoryRouter>
        <Switch>
          <Route path={Song(':id')} component={SongPage} />
          <Redirect to={Song(0)} />
        </Switch>
      </MemoryRouter>
    </Provider>,
  );
  return { page };
}

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
          <Redirect to={Song('wrongURL')} />
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
