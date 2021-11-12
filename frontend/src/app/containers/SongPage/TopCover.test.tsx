import { render, fireEvent } from '@testing-library/react';
import { configureAppStore } from 'store/configureStore';
import { Provider } from 'react-redux';
import { dummyCovers } from './dummy';
import TopCover from './TopCover';

const store = configureAppStore();

function setup() {
  const page = render(
    <Provider store={store}>
      <TopCover covers={dummyCovers} />
    </Provider>,
  );
  const getButtons = page.queryAllByTestId('getButton');
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
      <TopCover covers={[]} />
    </Provider>,
  );
  expect(page.getByText('There are no covers yet.')).toBeTruthy();
});
