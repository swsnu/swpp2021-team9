import { render, fireEvent } from '@testing-library/react';
import { configureAppStore } from 'store/configureStore';
import { Provider } from 'react-redux';
import { dummyCovers, dummyInstruments } from 'api/dummy';
import TopCover from './TopCover';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const store = configureAppStore();

function setup() {
  const page = render(
    <Provider store={store}>
      <TopCover covers={dummyCovers} instrument={dummyInstruments[0]} />
    </Provider>,
  );
  const getButtons = page.queryAllByTestId('CoverGetButton');
  const coverButtons = page.queryAllByTestId('ToCoverButton');
  return { page, getButtons, coverButtons };
}

test('click get buttons', () => {
  const { getButtons } = setup();
  expect(getButtons.length).toBeGreaterThan(0);

  getButtons.forEach(button => {
    fireEvent.click(button); // TODO: actually check redux state
  });
});

test('click cover buttons', () => {
  const { coverButtons } = setup();
  expect(coverButtons.length).toBeGreaterThan(0);

  coverButtons.forEach(button => {
    fireEvent.click(button);
  });

  expect(mockHistoryPush).toHaveBeenCalled();
});

test('render when no covers', () => {
  const page = render(
    <Provider store={store}>
      <TopCover covers={[]} instrument={dummyInstruments[0]} />
    </Provider>,
  );
  expect(page.getByText(/covers don't exist/)).toBeTruthy();
});
