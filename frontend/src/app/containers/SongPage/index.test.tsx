import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import SongPage from '.';
import { Song } from 'utils/urls';

const store = configureAppStore();

function setup() {
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={Song(':id')} component={SongPage} />
          <Redirect to={Song(0)} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return { page };
}

test('should render', () => {
  const { page } = setup();
  render(page);
  expect(screen.getByTestId('SongPage')).toBeTruthy();
});
