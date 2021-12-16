import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import { render, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import CoverPage from '.';
import { dummyCovers } from 'api/dummy';
import * as urls from 'utils/urls';
import { api } from 'api/band';
import { WrapperState } from 'app/wrapper/slice';

window.alert = jest.fn();
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();
const spySelectWrapper = jest.spyOn(
  require('app/wrapper/slice/selectors'),
  'selectWrapper',
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));

jest.mock('./WavePlayer', () => {
  return {
    __esModule: true,
    default: () => <div />,
  };
});

const wrapperWithUser: WrapperState = {
  user: dummyCovers[1].user,
};

function setup() {
  const store = configureAppStore();
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path={urls.Cover(':id')} component={CoverPage} />
          <Redirect exact from="/" to={urls.Cover(1)} />
          <Route component={() => <div />} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return { page };
}

beforeEach(() => {
  jest.clearAllMocks();
  spySelectWrapper.mockReturnValue({ name: 'wrapper' });
  api.getCoverInfo = jest.fn(
    (_coverId: number) =>
      new Promise((res, rej) => {
        res(dummyCovers[1]);
      }),
  );
  api.logCover = jest.fn();
});

it('should handle buttons', async () => {
  const { page } = setup();
  const { getByTestId, findByTestId } = render(page);

  await findByTestId('songTitle');
  const songTitleButton = getByTestId('songTitle');
  const usernameButton = getByTestId('usename');

  expect(songTitleButton).toBeTruthy();
  expect(usernameButton).toBeTruthy();

  fireEvent.click(songTitleButton);
  expect(mockHistoryPush).lastCalledWith(urls.Song(dummyCovers[1].song.id));

  fireEvent.click(usernameButton);
  expect(mockHistoryPush).lastCalledWith(urls.Profile(dummyCovers[1].user.id));
});

it('should show error statement', async () => {
  const { page } = setup();
  (api.getCoverInfo as jest.Mock).mockRejectedValueOnce('MOCK_ERROR');
  const { getByTestId, findByTestId } = render(page);

  await findByTestId('errorStatement');

  const errorStatement = getByTestId('errorStatement');
  expect(errorStatement.textContent).toBe('error: MOCK_ERROR');
});

it('edit cover', async () => {
  spySelectWrapper.mockReturnValue(wrapperWithUser);
  const { page } = setup();
  const { getByTestId, findByTestId } = render(page);

  await findByTestId('songTitle');

  let editButton = getByTestId('edit_button');

  fireEvent.click(editButton);
  await waitFor(() => expect(mockHistoryPush).toBeCalledTimes(1));
  expect(mockHistoryPush).toHaveBeenLastCalledWith(
    urls.CoverEdit(dummyCovers[1].id),
  );
});

it('delete cover', async () => {
  spySelectWrapper.mockReturnValue(wrapperWithUser);
  api.deleteCover = jest.fn().mockResolvedValue({ status: 200 });
  const { page } = setup();
  const { getByTestId, findByTestId } = render(page);

  await findByTestId('songTitle');

  let deleteButton = getByTestId('delete_button');

  fireEvent.click(deleteButton);
  await waitFor(() => expect(window.alert).toBeCalledTimes(1));
  expect(window.alert).toHaveBeenLastCalledWith('Success to Delete');
  expect(mockHistoryReplace).toHaveBeenLastCalledWith(urls.Main());
});

it('error delete cover', async () => {
  spySelectWrapper.mockReturnValue(wrapperWithUser);
  api.deleteCover = jest.fn().mockRejectedValue('MOCK_ERROR');
  const { page } = setup();
  const { getByTestId, findByTestId } = render(page);

  await findByTestId('songTitle');

  let deleteButton = getByTestId('delete_button');

  fireEvent.click(deleteButton);
  await waitFor(() => expect(window.alert).toBeCalledTimes(1));
  expect(window.alert).toHaveBeenLastCalledWith('Failed to Delete MOCK_ERROR');
});
