import { Provider } from 'react-redux';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import CoverEditPage from '.';
import { dummyCovers } from 'api/dummy';
import * as urls from 'utils/urls';
import { api } from 'api/band';
import { RootState } from 'utils/types';

window.alert = jest.fn();

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

const stubState = {
  wrapper: {
    name: 'wrapper',
    user: dummyCovers[1].user,
  },
};

api.getCoverInfo = jest.fn();
api.putCoverInfo = jest.fn();

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

// const spySelectCoverEdit = jest.spyOn(
//   require('./slice/selectors'),
//   'selectCoverEdit',
// );

beforeEach(() => {
  jest.clearAllMocks();
  // spySelectCoverEdit.mockRestore();
  (api.getCoverInfo as jest.Mock).mockImplementation(
    (coverId: number) =>
      new Promise((res, rej) => {
        res(dummyCovers[coverId]);
      }),
  );
  (api.putCoverInfo as jest.Mock).mockImplementation(
    (form: CoverFormPut) =>
      new Promise((res, rej) => {
        res({
          data: {
            ...dummyCovers[form.id],
            ...form,
          },
        });
      }),
  );
});

function setup(state: RootState) {
  // jest.spyOn(hook, 'useCoverEdit').mockImplementation(() => mockHooks);
  // const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  // useSelectorMock.mockImplementation(selector => selector(state));
  spySelectWrapper.mockReturnValue(state.wrapper);
  const store = configureAppStore();
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path={urls.CoverEdit(':id')} component={CoverEditPage} />
          <Redirect exact from="/" to={urls.CoverEdit(1)} />
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
  expect(screen.getByTestId('CoverEditPage')).toBeTruthy();
});

it('Edit possible', async () => {
  const { page } = setup(stubState);

  const { getByTestId, queryByText } = render(page);

  let inputTitle = getByTestId('input_title') as HTMLInputElement;
  let inputTag = getByTestId('input_tags') as HTMLInputElement;
  let inputDescription = getByTestId(
    'textarea_description',
  ) as HTMLTextAreaElement;
  let submitButton = getByTestId('submit-btn');

  expect(inputTitle).toBeTruthy();
  expect(inputTag).toBeTruthy();
  expect(inputDescription).toBeTruthy();

  await waitFor(() => expect(submitButton).toBeEnabled());

  // input new title, tags, and description.
  fireEvent.change(inputTitle, { target: { value: 'NEW_TITLE' } });
  fireEvent.change(inputTag, { target: { value: 'NEW_TARGET' } });
  fireEvent.change(inputDescription, { target: { value: 'NEW_DES' } });

  expect(inputTitle.value).toBe('NEW_TITLE');
  expect(inputTag.value).toBe('NEW_TARGET');
  expect(inputDescription.value).toBe('NEW_DES');

  fireEvent.keyPress(inputTag, { key: 'Enter', code: 13, charCode: 13 });
  fireEvent.click(inputTag);
  inputTag = getByTestId('input_tags') as HTMLInputElement;
  expect(inputTag.value).toBe('');

  // tag button
  let newTag = queryByText('#NEW_TARGET');
  expect(newTag).toBeTruthy();

  fireEvent.click(newTag!);
  newTag = queryByText('#NEW_TARGET');
  expect(newTag).toBeFalsy();

  fireEvent.click(submitButton);

  await waitFor(() => expect(mockHistoryReplace).toBeCalledTimes(1));
  expect(mockHistoryReplace).toHaveBeenLastCalledWith(urls.Cover(1));
});

it('no user', () => {
  const { page } = setup({
    ...stubState,
    wrapper: { name: 'wrapper' },
  });
  render(page);

  expect(window.alert).toHaveBeenLastCalledWith(
    'You have to login for edit cover',
  );
  expect(mockHistoryReplace).toHaveBeenLastCalledWith(urls.Main());
  expect(mockHistoryReplace).toBeCalledTimes(1);
});

it('error on load cover', async () => {
  const { page } = setup(stubState);
  (api.getCoverInfo as jest.Mock).mockRejectedValueOnce('ERROR');
  render(page);

  await waitFor(() => expect(mockHistoryReplace).toBeCalledTimes(1));
  expect(window.alert).toHaveBeenLastCalledWith('Failed to load original data');
  expect(mockHistoryReplace).toHaveBeenLastCalledWith(urls.Main());
});

it('not the author', async () => {
  const { page } = setup({
    ...stubState,
    wrapper: {
      ...stubState.wrapper,
      user: {
        ...stubState.wrapper.user,
        id: 0,
      },
    },
  });
  render(page);

  await waitFor(() => expect(mockHistoryReplace).toBeCalledTimes(1));
  expect(window.alert).toHaveBeenLastCalledWith('You cannot edit this cover');
  expect(mockHistoryReplace).toHaveBeenLastCalledWith(urls.Main());
});

it('error on edit cover', async () => {
  const { page } = setup(stubState);
  (api.putCoverInfo as jest.Mock).mockRejectedValueOnce('ERROR');
  const { getByTestId } = render(page);

  let submitButton = getByTestId('submit-btn');
  await waitFor(() => expect(submitButton).toBeEnabled());

  fireEvent.click(submitButton);

  await waitFor(() => expect(window.alert).toBeCalledTimes(1));
  expect(window.alert).toHaveBeenLastCalledWith('Failed to saveERROR');
});

it('no description (legacy)', () => {
  (api.getCoverInfo as jest.Mock).mockResolvedValueOnce({
    ...dummyCovers[1],
    description: undefined,
  });
  const { page } = setup(stubState);
  const { getByTestId } = render(page);
  let inputDescription = getByTestId(
    'textarea_description',
  ) as HTMLTextAreaElement;

  expect(inputDescription.value).toBe('');
});

it('enter existed tags', async () => {
  (api.getCoverInfo as jest.Mock).mockResolvedValueOnce({
    ...dummyCovers[1],
    tags: ['TAG1', 'TAG2'],
  });
  const { page } = setup(stubState);
  const { getByTestId, queryAllByText } = render(page);

  let submitButton = getByTestId('submit-btn');
  await waitFor(() => expect(submitButton).toBeEnabled());

  let inputTag = getByTestId('input_tags') as HTMLInputElement;
  expect(queryAllByText('#TAG1').length).toBe(1);

  fireEvent.change(inputTag, { target: { value: 'TAG1' } });

  fireEvent.keyPress(inputTag, { key: 'BackSpace', code: 13, charCode: 13 });
  expect(inputTag.value).toBe('TAG1');

  fireEvent.keyPress(inputTag, { key: 'Enter', code: 13, charCode: 13 });
  expect(inputTag.value).toBe('');
  expect(queryAllByText('#TAG1').length).toBe(1);

  fireEvent.change(inputTag, { target: { value: 'TAG3' } });
  expect(inputTag.value).toBe('TAG3');

  fireEvent.keyPress(inputTag, { key: 'Enter', code: 13, charCode: 13 });
  expect(inputTag.value).toBe('');
  expect(queryAllByText('#TAG3').length).toBe(1);
});
