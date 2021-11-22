import * as React from 'react';
import { Provider } from 'react-redux';
import {
  Router,
  Switch,
  Route,
  Redirect,
  BrowserRouter,
} from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { configureAppStore } from 'store/configureStore';
import SignUpPage from '.';

const store = configureAppStore();

function setup() {
  const path = '/searchresult';
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route
            path={path}
            render={() => (
              <SignUpPage email="swpp2021@snu.ac.kr" password="swpp2021" />
            )}
          />
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
  expect(screen.getByTestId('SignUpPage')).toBeTruthy();
});

test('should alert when there is no email', () => {
  function setup() {
    const path = '/searchresult';
    const page = (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route
              path={path}
              render={() => <SignUpPage email="" password="" />}
            />
            <Redirect to={path} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
    return { page };
  }

  const { page } = setup();
  render(page);

  const button = screen.getByText('Sign Up');
  const inputemail = screen.getByTestId('input-email');
  const inputpassword = screen.getByTestId('input-password');
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  userEvent.type(inputemail, '');
  userEvent.type(inputpassword, 'swpp2021');

  fireEvent.click(button);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('should alert when there is no password', () => {
  function setup() {
    const path = '/searchresult';
    const page = (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route
              path={path}
              render={() => (
                <SignUpPage email="swpp2021@naver.com" password="swpp2021" />
              )}
            />
            <Redirect to={path} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
    return { page };
  }

  const { page } = setup();
  render(page);

  const button = screen.getByTestId('SignupButton');
  const inputemail = screen.getByTestId('input-email');
  const inputpassword = screen.getByTestId('input-password');

  userEvent.type(inputemail, 'swpp2021@naver.com');
  userEvent.type(inputpassword, '');

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  fireEvent.click(button);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('should move to Main Page properly', () => {
  const history = createMemoryHistory();

  function setup() {
    const path = '/searchresult';
    const page = (
      <Router history={history}>
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route
                path={path}
                render={() => <SignUpPage email="" password="" />}
              />
              <Redirect to={path} />
            </Switch>
          </BrowserRouter>
        </Provider>
      </Router>
    );
    return { page };
  }

  const { page } = setup();
  render(page);
  const button = screen.getByTestId('SignupButton');

  const inputemail = screen.getByTestId('input-email');
  const inputpassword = screen.getByTestId('input-password');
  const mockHistoryPush = jest.fn();

  userEvent.type(inputemail, 'swpp2021@naver.com');
  userEvent.type(inputpassword, 'swpp2021');

  fireEvent.click(button);
  expect(mockHistoryPush).toBeTruthy();
});
