import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import { render, fireEvent } from '@testing-library/react';
import { configureAppStore } from 'store/configureStore';
import MainPage from '.';

const store = configureAppStore();

//let player = Player.getInstance();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function setup() {
  jest.clearAllMocks();

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

  const clickplay = page.getAllByTestId('Play')[0] as HTMLElement;
  const clicktitle = page.getAllByTestId('Title')[0] as HTMLElement;

  return {
    page,
    clicktitle,
    clickplay,
  };
}

test('should render', () => {
  const { page } = setup();
  expect(page.getByTestId('MainPage')).toBeTruthy();
});

test('should handle clicking play button correctly', () => {
  const set = setup();
  fireEvent.click(set.clickplay);
  expect(mockHistoryPush).toBeTruthy();
});

test('should handle clicking title button correctly', () => {
  const set = setup();
  fireEvent.click(set.clicktitle);
  expect(mockHistoryPush).toBeTruthy();
});
