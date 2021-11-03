import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import ProfilePage, { Props } from '.';

const store = configureAppStore();

function setup() {
  const path = '/profile';
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={path} render={() => <ProfilePage />} />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return { page };
}

test('should render', () => {
  const { page } = setup();
  render(page);
  expect(screen.getByTestId('ProfilePage')).toBeTruthy();
});
