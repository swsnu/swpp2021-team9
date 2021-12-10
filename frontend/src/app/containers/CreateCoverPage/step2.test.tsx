import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import CreateCoverInfoPage from './step2';
import * as url from 'utils/urls';
import { api } from 'api/band';
import { dummyCovers, dummyInstruments } from 'api/dummy';
const store = configureAppStore();

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();
api.postCover = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));

function setup() {
  const path = '/';
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path={url.CreateCover(':id', 'info')}
            component={CreateCoverInfoPage}
          />
          <Redirect exact from={path} to={url.CreateCover(1, 'info')} />
          <Route component={() => <div />} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return page;
}

// const spySelectCreateCover = jest.spyOn(
//   require('app/containers/CreateCoverPage/slice/selectors'),
//   'selectCreateCover',
// );

describe('CreateCoverInfoPage', () => {
  let page;
  beforeEach(() => {
    jest.clearAllMocks();
    (api.postCover as jest.Mock).mockImplementation(
      (form: CoverForm) =>
        new Promise((resolve, reject) => {
          resolve({ data: { ...dummyCovers[1] } });
        }),
    );
    // spySelectCreateCover.mockReturnValue({
    //   name: 'createCover',
    //   audioUrl: 'AUDIO',
    //   instrumentsResponse: { loading: false, data: ['a', 'b', 'c'] },
    // });
    api.getInstruments = jest.fn(
      () =>
        new Promise((res, rej) => {
          res(dummyInstruments);
        }),
    );
    page = setup();
  });

  it('should render', () => {
    render(page);
    expect(screen.getByTestId('CreateCoverInfoPage')).toBeTruthy();
  });

  it('should title input change properly', () => {
    render(page);
    const titleInput = screen.getByTestId('title');
    fireEvent.change(titleInput, { target: { value: '신호등' } });
  });

  it('onPrevClicked work properly', async () => {
    const { getByTestId } = render(page);
    const prevBtn = getByTestId('prev-btn');
    fireEvent.click(prevBtn);
    await waitFor(() => {
      expect(mockHistoryReplace).toBeCalledTimes(1);
    });
  });
  // it('should instrument select work properly', () => {
  //   render(page);
  //   userEvent.selectOptions(
  //     // Find the select element, like a real user would.
  //     // screen.getByTestId('select'),
  //     screen.getByRole('combobox'),
  //     // Find and select the Ireland option, like a real user would.
  //     screen.getByRole('option', { name: 'r' }),
  //   );
  //   expect(
  //     (screen.getByRole('option', { name: 'Rock' }) as HTMLOptionElement)
  //       .selected,
  //   ).toBe(true);
  // });

  it('should tag input works properly', () => {
    const { getByTestId } = render(page);
    const tagInput = getByTestId('tag-input');
    fireEvent.change(tagInput, { target: { value: 'R&B' } });
    fireEvent.keyPress(tagInput, { key: 'Enter', code: 'Enter', charCode: 13 });
  });

  it('should category input works properly', () => {
    const { getByTestId } = render(page);
    const categoryInput = getByTestId('category');
    fireEvent.change(categoryInput, { target: { value: 'Pop' } });
  });

  it('should description input works properly', () => {
    const { getByTestId } = render(page);
    const descriptionInput = getByTestId('description');
    fireEvent.change(descriptionInput, {
      target: { value: 'teet description' },
    });
  });

  it('should submit works when user confirm', async () => {
    window.confirm = jest.fn(() => true); // always click 'yes'

    const spySelectCreateCover = jest.spyOn(
      require('app/containers/CreateCoverPage/slice/selectors'),
      'selectCreateCover',
    );

    spySelectCreateCover.mockReturnValue({
      name: 'createCover',
      audioURL: 'AUDIO',
      instrumentsResponse: {
        loading: false,
        data: [
          { id: 1, name: 'TEST_1' },
          { id: 2, name: 'TEST_2' },
          { id: 3, name: 'TEST_3' },
        ],
      },
      createResponse: { loading: false, data: { id: 1 } },
    });
    const { getByTestId } = render(page);

    const titleInput = getByTestId('title');
    fireEvent.change(titleInput, { target: { value: '신호등' } });

    const tagInput = getByTestId('tag-input');
    fireEvent.change(tagInput, { target: { value: 'R&B' } });
    fireEvent.keyPress(tagInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    userEvent.selectOptions(
      // Find the select element, like a real user would.
      // screen.getByTestId('select'),
      screen.getByRole('combobox'),
      // Find and select the Ireland option, like a real user would.
      screen.getByRole('option', { name: 'TEST_1' }),
    );
    expect(
      (screen.getByRole('option', { name: 'TEST_1' }) as HTMLOptionElement)
        .selected,
    ).toBe(true);

    const submitBtn = getByTestId('submit-btn');
    fireEvent.click(submitBtn);

    expect(window.confirm).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalled();
    });
  });

  it('should submit works when user does not confirm', () => {
    window.confirm = jest.fn(() => false); // always click 'yes'

    const spySelectCreateCover = jest.spyOn(
      require('app/containers/CreateCoverPage/slice/selectors'),
      'selectCreateCover',
    );

    spySelectCreateCover.mockReturnValue({
      name: 'createCover',
      audioURL: 'AUDIO',
      instrumentsResponse: {
        loading: false,
        data: [
          { id: 1, name: 'TEST_1' },
          { id: 2, name: 'TEST_2' },
          { id: 3, name: 'TEST_3' },
        ],
      },
      createResponse: { loading: false },
    });

    const { getByTestId } = render(page);

    const titleInput = getByTestId('title');
    fireEvent.change(titleInput, { target: { value: '신호등' } });

    const tagInput = getByTestId('tag-input');
    fireEvent.change(tagInput, { target: { value: 'R&B' } });

    // for 100% branch coverage
    fireEvent.keyPress(tagInput, { key: 'a', code: 'KeyA', charCode: 65 });

    fireEvent.keyPress(tagInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    const submitBtn = getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    expect(window.confirm).toHaveBeenCalledTimes(1);
  });

  it('cant send post request when createResponse is loading', () => {
    window.confirm = jest.fn(() => false); // always click 'yes'

    const spySelectCreateCover = jest.spyOn(
      require('app/containers/CreateCoverPage/slice/selectors'),
      'selectCreateCover',
    );

    spySelectCreateCover.mockReturnValue({
      name: 'createCover',
      audioURL: 'AUDIO',
      instrumentsResponse: {
        loading: false,
        data: [
          { id: 1, name: 'TEST_1' },
          { id: 2, name: 'TEST_2' },
          { id: 3, name: 'TEST_3' },
        ],
      },
      createResponse: { loading: true },
    });

    const { getByTestId } = render(page);

    const titleInput = getByTestId('title');
    fireEvent.change(titleInput, { target: { value: '신호등' } });

    const tagInput = getByTestId('tag-input');
    fireEvent.change(tagInput, { target: { value: 'R&B' } });

    // for 100% branch coverage
    fireEvent.keyPress(tagInput, { key: 'a', code: 'KeyA', charCode: 65 });

    fireEvent.keyPress(tagInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    const submitBtn = getByTestId('submit-btn');
    fireEvent.click(submitBtn);
    expect(mockHistoryPush).toHaveBeenCalledTimes(0);
  });
});
