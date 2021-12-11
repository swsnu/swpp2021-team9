import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { configureAppStore } from 'store/configureStore';
import userEvent from '@testing-library/user-event';
import ProfilePage from '.';
import { dummyUser } from 'api/dummy';
import * as urls from 'utils/urls';
import { api } from 'api/band';
import { RootState } from 'types';

const store = configureAppStore();

window.alert = jest.fn();

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

const stubState = {
  wrapper: {
    name: 'wrapper',
    user: dummyUser[0],
  },
};

api.getUserInfo = jest.fn();
api.postUserInfo = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));

const spySelectWrapper = jest.spyOn(
  require('app/wrapper/slice/selectors'),
  'selectWrapper',
);

beforeEach(() => {
  jest.clearAllMocks();
  (api.getUserInfo as jest.Mock).mockImplementation(
    (userId: number) =>
      new Promise((res, rej) => {
        res(dummyUser[userId]);
      }),
  );
  (api.postUserInfo as jest.Mock).mockImplementation(
    (form: UserPostForm) =>
      new Promise((res, rej) => {
        res({
          data: {
            ...dummyUser[form.id],
            ...form,
          },
        });
      }),
  );
});

function setup(state: RootState) {
  spySelectWrapper.mockReturnValue(state.wrapper);
  const store = configureAppStore();
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path={urls.Profile(':id')} component={ProfilePage} />
          <Redirect exact from="/" to={urls.Profile(1)} />
          <Route component={() => <div />} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return { page };
}

it('should render', () => {
  const { page } = setup(stubState);
  render(page);
  expect(screen.getByTestId('ProfilePage')).toBeTruthy();
});

test('When click checkbox_bass and click choose instrument button', () => {
  const { page } = setup(stubState);
  render(page);

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const checkbass = screen.getByTestId('checkbass');
  fireEvent.click(checkbass);

  const chooseInstrument = screen.getByTestId('chooseInstrument');
  fireEvent.click(chooseInstrument);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

/*
test('When click checkbox_guitar and click choose instrument button', () => {
  const { page } = setup();
  render(page);

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const checkguitar = screen.getByTestId('checkguitar');
  fireEvent.click(checkguitar);
 
  const chooseInstrument = screen.getByTestId('chooseInstrument');
  fireEvent.click(chooseInstrument);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('When click checkbox_vocals and click choose instrument button', () => {
  const { page } = setup();
  render(page);

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const checkvocals = screen.getByTestId('checkvocals');
  fireEvent.click(checkvocals);
 
  const chooseInstrument = screen.getByTestId('chooseInstrument');
  fireEvent.click(chooseInstrument);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('When click checkbox_drum and click choose instrument button', () => {
  const { page } = setup();
  render(page);

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const checkdrum = screen.getByTestId('checkdrum');
  fireEvent.click(checkdrum);
 
  const chooseInstrument = screen.getByTestId('chooseInstrument');
  fireEvent.click(chooseInstrument);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('When click checkbox_keyboard and click choose instrument button', () => {
  const { page } = setup();
  render(page);

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const checkkeyboard = screen.getByTestId('checkkeyboard');
  fireEvent.click(checkkeyboard);
 
  const chooseInstrument = screen.getByTestId('chooseInstrument');
  fireEvent.click(chooseInstrument);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('Uploading file works properly', ()=>{
  const {page} = setup();
  render(page);
  
  let file;
  file = new File(['(⌐□_□)'], 'swpp2021.png', { type: 'image/png' });

  const uploadFile = screen.getByTestId('uploadFile');
  fireEvent.change(uploadFile);
})

*/
