import { render, fireEvent } from '@testing-library/react';
import { configureAppStore } from 'store/configureStore';
import { Provider } from 'react-redux';
import { dummyCombinations, dummyCovers } from './dummy';
import TopCombination from './TopCombination';

const store = configureAppStore();

function setup() {
  const page = render(
    <Provider store={store}>
      <TopCombination combinations={dummyCombinations} covers={dummyCovers} />
    </Provider>,
  );
  const coverButton = page.getByText(dummyCovers[0].title);
  const getButton = page.getByText(dummyCombinations[0].views);
  return { page, coverButton, getButton };
}

test('', () => {
  const { page, coverButton, getButton } = setup();
  fireEvent.click(getButton);
});
