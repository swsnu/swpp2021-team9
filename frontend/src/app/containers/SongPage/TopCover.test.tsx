import { render, fireEvent } from '@testing-library/react';
import { configureAppStore } from 'store/configureStore';
import { Provider } from 'react-redux';
import { dummyCovers, dummyInstruments } from 'api/dummy';
import TopCover from './TopCover';

const store = configureAppStore();

function setup() {
  const page = render(
    <Provider store={store}>
      <TopCover covers={dummyCovers} instrument={dummyInstruments[0]} />
    </Provider>,
  );
  const getButtons = page.queryAllByTestId('CoverGetButton');
  return { page, getButtons };
}

test('click get buttons', () => {
  const { getButtons } = setup();
  expect(getButtons.length).toBeGreaterThan(0);

  getButtons.forEach(button => {
    fireEvent.click(button); // TODO: actually check redux state
  });
});

test('render when no covers', () => {
  const page = render(
    <Provider store={store}>
      <TopCover covers={[]} instrument={dummyInstruments[0]} />
    </Provider>,
  );
  expect(page.getByText('There are no covers yet.')).toBeTruthy();
});
