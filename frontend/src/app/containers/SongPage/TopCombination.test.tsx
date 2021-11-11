import { render, fireEvent } from '@testing-library/react';
import { configureAppStore } from 'store/configureStore';
import { Provider } from 'react-redux';
import TopCombination from './TopCombination';

const store = configureAppStore();

function setup() {
  const page = render(
    <Provider store={store}>
      <TopCombination combinations={[]} covers={[]} />
    </Provider>,
  );
  const youtubeButton = page.getByTestId('button-youtube');
  return { page, youtubeButton };
}
