import * as React from 'react';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
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
import { SignUpState } from './slice';

const store = configureAppStore();

const mockSuccessState: SignUpState = {
  name: 'signin',
  signUpResponse: { loading: false },
};

const mockLoadingState: SignUpState = {
  name: 'signin',
  signUpResponse: { loading: true },
};

const mockErrorState: SignUpState = {
  name: 'signin',
  signUpResponse: { loading: false, error: 'MOCK_ERROR' },
};

function setup(state: SignUpState) {
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  useSelectorMock.mockReturnValue(state);

  const path = '/searchresult';
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={path} render={() => <SignUpPage />} />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return { page };
}

test('should render', () => {
  const { page } = setup(mockSuccessState);
  render(page);
  expect(screen.getByTestId('SignUpPage')).toBeTruthy();
});

test('should alert when there is no email', () => {
  function setup(state: SignUpState) {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(state);

    const path = '/searchresult';
    const page = (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path={path} render={() => <SignUpPage />} />
            <Redirect to={path} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
    return { page };
  }

  const { page } = setup(mockSuccessState);
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
  function setup(state: SignUpState) {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(state);

    const path = '/searchresult';
    const page = (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path={path} render={() => <SignUpPage />} />
            <Redirect to={path} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
    return { page };
  }

  const { page } = setup(mockSuccessState);
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

  function setup(state: SignUpState) {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(state);

    const path = '/searchresult';
    const page = (
      <Router history={history}>
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route path={path} render={() => <SignUpPage />} />
              <Redirect to={path} />
            </Switch>
          </BrowserRouter>
        </Provider>
      </Router>
    );
    return { page };
  }

  const { page } = setup(mockSuccessState);
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

test('should alert [still loading] when signupstate is still loading', () => {
  const history = createMemoryHistory();

  function setup(state: SignUpState) {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(state);

    const path = '/searchresult';
    const page = (
      <Router history={history}>
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route path={path} render={() => <SignUpPage />} />
              <Redirect to={path} />
            </Switch>
          </BrowserRouter>
        </Provider>
      </Router>
    );
    return { page };
  }

  const { page } = setup(mockLoadingState);
  render(page);
  const button = screen.getByTestId('SignupButton');

  const inputemail = screen.getByTestId('input-email');
  const inputpassword = screen.getByTestId('input-password');
  const mockHistoryPush = jest.fn();

  userEvent.type(inputemail, 'swpp2021@naver.com');
  userEvent.type(inputpassword, 'swpp2021');

  fireEvent.click(button);
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('should alert [SignUp Failed] when signupstate has error', () => {
  const history = createMemoryHistory();

  function setup(state: SignUpState) {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(state);

    const path = '/searchresult';
    const page = (
      <Router history={history}>
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route path={path} render={() => <SignUpPage />} />
              <Redirect to={path} />
            </Switch>
          </BrowserRouter>
        </Provider>
      </Router>
    );
    return { page };
  }

  const { page } = setup(mockErrorState);
  render(page);
  const button = screen.getByTestId('SignupButton');

  const inputemail = screen.getByTestId('input-email');
  const inputpassword = screen.getByTestId('input-password');
  const mockHistoryPush = jest.fn();

  userEvent.type(inputemail, 'swpp2021@naver.com');
  userEvent.type(inputpassword, 'swpp2021');

  fireEvent.click(button);
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  expect(alertMock).toHaveBeenCalled();
});
