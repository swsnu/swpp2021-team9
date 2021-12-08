import { render, fireEvent } from '@testing-library/react';
import { configureAppStore } from 'store/configureStore';
import { Provider } from 'react-redux';
import { dummyCombinations } from 'api/dummy';
import TopCombination from './TopCombination';

const store = configureAppStore();

function setup() {
  const page = render(
    <Provider store={store}>
      <TopCombination combinations={dummyCombinations} />
    </Provider>,
  );
  const getButtons = page.queryAllByTestId('combinationGetButton');
  return { page, getButtons };
}

test('click get buttons', () => {
  const { getButtons } = setup();
  expect(getButtons.length).toBeGreaterThan(0);

  getButtons.forEach(button => {
    fireEvent.click(button); // TODO: actually check redux state
  });
});

test('render when no combinations', () => {
  const page = render(
    <Provider store={store}>
      <TopCombination combinations={[]} />
    </Provider>,
  );
  expect(page.getByText('There are no combinations yet.')).toBeTruthy();
});
