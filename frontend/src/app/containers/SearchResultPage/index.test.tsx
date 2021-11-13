import React, { useState, useMemo } from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { useLocation } from 'react-router';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import SearchResultPage from '.';

const store = configureAppStore();

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function setup() {
  jest.clearAllMocks();

  const path = '/searchresult';
  const page = render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route
            path={path}
            render={() => <SearchResultPage hasResult={false} />}
          />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>,
  );

  const addSongButton = page.getByText(
    'Create New Song Page?',
  ) as HTMLButtonElement;

  return {
    page,
    addSongButton,
  };
}

function setup2() {
  jest.clearAllMocks();

  const path = '/searchresult';
  const page = render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route
            path={path}
            render={() => <SearchResultPage hasResult={true} />}
          />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>,
  );
  const title = page.getAllByTestId('Title')[0] as HTMLDataElement;
  const play = page.getAllByTestId('Play')[0] as HTMLButtonElement;

  return {
    page,
    title,
    play,
  };
}
test('should render', () => {
  const { page } = setup();
  expect(page.getByTestId('SearchResultPage')).toBeTruthy();
});

test('should handle add song button correctly', () => {
  const set = setup();
  fireEvent.click(set.addSongButton);
  expect(mockHistoryPush).toBeTruthy();
});

test('should handle title button correctly', () => {
  const set2 = setup2();
  fireEvent.click(set2.title);
  expect(mockHistoryPush).toBeTruthy();
});

test('should handle play button correctly', () => {
  const set2 = setup2();
  fireEvent.click(set2.play);
  expect(mockHistoryPush).toBeTruthy();
});
