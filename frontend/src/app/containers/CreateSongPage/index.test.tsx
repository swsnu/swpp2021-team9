import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureAppStore } from 'store/configureStore';
import CreateSongPage from '.';

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
          <Route path={path} render={() => <CreateSongPage />} />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>,
  );
  const title = page.getByLabelText('Title') as HTMLInputElement;
  const singer = page.getByLabelText('Artist') as HTMLInputElement;
  const category = page.getByLabelText('Category') as HTMLSelectElement;
  const reference = page.getByLabelText('Reference Link') as HTMLInputElement;
  const description = page.getByLabelText(
    'Description (optional)',
  ) as HTMLTextAreaElement;
  const submit = page.getByText('Submit') as HTMLButtonElement;
  const options = page.getAllByTestId('option') as HTMLOptionElement[];

  return {
    page,
    title,
    singer,
    category,
    reference,
    description,
    submit,
    options,
  };
}

test('should render', () => {
  const { page } = setup();
  expect(page.getByTestId('CreateSongPage')).toBeTruthy();
});

test('should handle form correctly', () => {
  const set = setup();
  fireEvent.change(set.title, { target: { value: 'TEST_TITLE' } });
  expect(set.title.value).toBe('TEST_TITLE');

  fireEvent.change(set.singer, { target: { value: 'TEST_ARTIST' } });
  expect(set.singer.value).toBe('TEST_ARTIST');

  // fireEvent.select(set.category, { target: { value: '2' } }); // coverage에 반영 안 됨
  userEvent.selectOptions(set.category, '2');
  expect(set.category.value).toBe('2');

  fireEvent.change(set.reference, { target: { value: 'TEST_REFERENCE' } });
  expect(set.reference.value).toBe('TEST_REFERENCE');

  fireEvent.change(set.description, { target: { value: 'TEST_DESCRIPTION' } });
  expect(set.description.value).toBe('TEST_DESCRIPTION');

  fireEvent.click(set.submit);
  expect(mockHistoryPush).toBeCalledTimes(1);
});
