import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import Wrapper from '.';
import { WrapperState } from './slice';
import { api } from 'api/band';

jest.mock('app/helper/TrackPlayer');

const store = configureAppStore();
const mockHistoryPush = jest.fn().mockImplementation(() => {
  console.log('push');
});
const mockHistoryGo = jest.fn().mockImplementation(() => {
  console.log('go');
});
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush,
    go: mockHistoryGo,
  }),
}));

function setup() {
  const path = '/';
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={path} render={() => <Wrapper />} />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return { page };
}

describe('index', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render', () => {
    const { page } = setup();
    render(page);
    expect(screen.getByTestId('Wrapper')).toBeTruthy();
  });

  test('should render signout and profile buttons when logged in', () => {
    jest.spyOn(console, 'log').mockImplementation();
    const mockState: WrapperState = {
      user: {
        id: 0,
        username: 'USERNAME',
      },
    };
    api.signout = jest.fn();
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(mockState);
    const { page } = setup();
    const { container } = render(page);

    const signInButton = container.querySelector('#signin_button');
    const signUpButton = container.querySelector('#signup_button');
    const signOutButton = container.querySelector('#signout_button');
    const profileButton = container.querySelector('#profile_button');

    expect(screen.getByTestId('Wrapper')).toBeTruthy();
    expect(signInButton).toBeNull();
    expect(signUpButton).toBeNull();
    expect(signOutButton).toBeTruthy();
    expect(profileButton).toBeTruthy();

    fireEvent.click(signOutButton!);
    fireEvent.click(profileButton!);
  });

  test('should render signin and signup buttons when not logged in and logo', () => {
    jest.spyOn(console, 'log').mockImplementation();
    const mockState: WrapperState = {};
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(mockState);
    const { page } = setup();
    const { container } = render(page);

    const signInButton = container.querySelector('#signin_button');
    const signUpButton = container.querySelector('#signup_button');
    const signOutButton = container.querySelector('#signout_button');
    const profileButton = container.querySelector('#profile_button');
    const logoButton = container.querySelector('#logo_button');

    expect(screen.getByTestId('Wrapper')).toBeTruthy();
    expect(signInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
    expect(signOutButton).toBeNull();
    expect(profileButton).toBeNull();
    expect(logoButton).toBeTruthy();

    fireEvent.click(signInButton!);
    fireEvent.click(signUpButton!);
    fireEvent.click(logoButton!);
  });

  test('should get search key when click search button', () => {
    jest.spyOn(console, 'log').mockImplementation();
    const mockState: WrapperState = {};
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(mockState);
    const { page } = setup();
    const { getByTestId } = render(page);

    const mockSearchButton = getByTestId('submit');
    const mockSearchInput = getByTestId('searchTerm');

    fireEvent.change(mockSearchInput, { target: { value: 'SEARCH_KEY' } });
    fireEvent.click(mockSearchButton);

    fireEvent.change(mockSearchInput, { target: { value: '' } });
    fireEvent.click(mockSearchButton);
  });
});
