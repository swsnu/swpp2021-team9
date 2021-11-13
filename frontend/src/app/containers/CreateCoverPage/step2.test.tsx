import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import CreateCoverInfoPage from './step2';
import * as infoPage from './step2';

const store = configureAppStore();

function setup() {
  const path = '/';
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={path} render={() => <CreateCoverInfoPage />} />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return page;
}
describe('CreateCoverInfoPage', () => {
  let page;
  beforeEach(() => {
    page = setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    render(page);
    expect(screen.getByTestId('CreateCoverInfoPage')).toBeTruthy();
    expect(screen.getAllByRole('option').length).toBe(4);
  });

  it('should title input change properly', () => {
    render(page);
    const titleInput = screen.getByTestId('title');
    fireEvent.change(titleInput, { target: { value: '신호등' } });
  });

  it('should categories select work properly', () => {
    render(page);
    userEvent.selectOptions(
      // Find the select element, like a real user would.
      // screen.getByTestId('select'),
      screen.getByRole('combobox'),
      // Find and select the Ireland option, like a real user would.
      screen.getByRole('option', { name: 'Rock' }),
    );
    expect(
      (screen.getByRole('option', { name: 'Rock' }) as HTMLOptionElement)
        .selected,
    ).toBe(true);
  });

  it('should tag input works properly', () => {
    const { getByTestId } = render(page);
    const tagInput = getByTestId('tag-input');
    fireEvent.change(tagInput, { target: { value: 'R&B' } });
    fireEvent.keyPress(tagInput, { key: 'Enter', code: 'Enter', charCode: 13 });
  });

  it('should instrument input works properly', () => {
    const { getByTestId } = render(page);
    const instInput = getByTestId('instrument');
    fireEvent.change(instInput, { target: { value: 'guitar' } });
  });

  it('should description input works properly', () => {
    const { getByTestId } = render(page);
    const descriptionInput = getByTestId('description');
    fireEvent.change(descriptionInput, {
      target: { value: 'teet description' },
    });
  });

  it('should submit works', () => {
    const { getByTestId } = render(page);

    const titleInput = getByTestId('title');
    fireEvent.change(titleInput, { target: { value: '신호등' } });

    const tagInput = getByTestId('tag-input');
    fireEvent.change(tagInput, { target: { value: 'R&B' } });
    fireEvent.keyPress(tagInput, { key: 'Enter', keyCode: 13 });

    const instInput = getByTestId('instrument');
    fireEvent.change(instInput, { target: { value: 'guitar' } });

    const submitBtn = getByTestId('submit-btn');
    fireEvent.click(submitBtn);
  });
});
