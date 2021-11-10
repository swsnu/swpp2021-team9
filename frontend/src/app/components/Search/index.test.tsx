import * as React from 'react';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import Search from '.';

test('should render', () => {
  render(<Search />);
  expect(screen.getByTestId('Search')).toBeTruthy();
});

test('should render', () => {
  const mockSearch = jest.fn();
  const { queryByTestId } = render(<Search onSearchClicked={mockSearch} />);
  const inputBox = queryByTestId('searchTerm');
  const searchButton = queryByTestId('submit');

  expect(searchButton).toBeTruthy();
  expect(inputBox).toBeTruthy();

  fireEvent.change(inputBox!, { target: { value: 'SEARCH_KEY' } });
  fireEvent.click(searchButton!);
  expect(mockSearch).lastCalledWith('SEARCH_KEY');
});
