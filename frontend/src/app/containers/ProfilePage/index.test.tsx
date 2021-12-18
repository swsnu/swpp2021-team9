import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { configureAppStore } from 'store/configureStore';
import ProfilePage from '.';
import { dummyUser } from 'api/dummy';
import * as urls from 'utils/urls';
import { api } from 'api/band';
import { RootState } from '../../../utils/types';
import * as Hooks from './hook';
import { renderHook } from '@testing-library/react-hooks';
import { useCropImage } from './hook';
import { Crop } from 'react-image-crop';

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
  spySelectWrapper.mockReturnValue(state?.wrapper);
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

  const checkbass = screen.getByTestId('checkBass');
  fireEvent.click(checkbass);

  const chooseInstrument = screen.getByTestId('chooseInstrument');
  fireEvent.click(chooseInstrument);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('When click checkbox_guitar and click choose instrument button', () => {
  const { page } = setup(stubState);
  render(page);

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const checkguitar = screen.getByTestId('checkGuitar');
  fireEvent.click(checkguitar);

  const chooseInstrument = screen.getByTestId('chooseInstrument');
  fireEvent.click(chooseInstrument);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('When click checkbox_vocals and click choose instrument button', () => {
  const { page } = setup(stubState);
  render(page);

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const checkvocals = screen.getByTestId('checkVocals');
  fireEvent.click(checkvocals);

  const chooseInstrument = screen.getByTestId('chooseInstrument');
  fireEvent.click(chooseInstrument);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('When click checkbox_drum and click choose instrument button', () => {
  const { page } = setup(stubState);
  render(page);

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const checkdrum = screen.getByTestId('checkDrum');
  fireEvent.click(checkdrum);

  const chooseInstrument = screen.getByTestId('chooseInstrument');
  fireEvent.click(chooseInstrument);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('When click checkbox_keyboard and click choose instrument button', () => {
  const { page } = setup(stubState);
  render(page);

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const checkkeyboard = screen.getByTestId('checkKeyboard');
  fireEvent.click(checkkeyboard);

  const chooseInstrument = screen.getByTestId('chooseInstrument');
  fireEvent.click(chooseInstrument);
  expect(alertMock).toHaveBeenCalledTimes(1);
});

test('Uploading file works properly', async () => {
  const { page } = setup(stubState);
  const { getByTestId } = render(page);

  const uploadFile = getByTestId('uploadFile');
  fireEvent.change(uploadFile);
});

it('error on load cover', async () => {
  const { page } = setup(stubState);
  (api.getUserInfo as jest.Mock).mockRejectedValueOnce('ERROR');
  render(page);

  await waitFor(() => expect(mockHistoryReplace).toBeCalledTimes(1));
  expect(window.alert).toHaveBeenCalled();
  expect(mockHistoryReplace).toHaveBeenLastCalledWith(urls.Main());
});

it('test mock prompt', async () => {
  window.prompt = jest.fn().mockReturnValue('PROMPT RETURN');
  const { page } = setup(stubState);
  const { getByTestId } = render(page);
  const editnameButton = getByTestId('editnameButton');
  const editBioButton = getByTestId('editBioButton');

  fireEvent.click(editnameButton);
  fireEvent.click(editBioButton);
});

it('test image flow', async () => {
  const mockUseCropImage = {
    onSelectFile: jest.fn(),
    upImg: 'null',
    setUpImg: jest.fn(),
    croppedImg: 'null',
    setCroppedImg: jest.fn(),
    onLoad: jest.fn(),
    crop: null,
    setCrop: jest.fn(),
    completedCrop: null,
    onCompleteCrop: jest.fn(),
  };
  jest.spyOn(Hooks, 'useCropImage').mockImplementation(() => ({
    ...mockUseCropImage,
    previewCanvasRef: React.useRef(),
  }));
  const { page } = setup(stubState);
  const { queryByTestId, getByTestId } = render(page);

  expect(queryByTestId('reactCrop')).toBeTruthy();
  expect(queryByTestId('editprofileButton')).toBeTruthy();

  const editprofileButton = getByTestId('editprofileButton');
  fireEvent.click(editprofileButton);
  expect(mockUseCropImage.setUpImg).toHaveBeenLastCalledWith(null);
});

it('test cropimage', async () => {
  (Hooks.useCropImage as jest.Mock).mockRestore();
  const { result } = renderHook(() => useCropImage());

  result.current.onCompleteCrop({
    x: 0,
    y: 100,
    width: 10,
    height: 10,
  } as Crop);
});
