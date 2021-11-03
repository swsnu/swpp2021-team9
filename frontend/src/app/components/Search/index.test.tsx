import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Search from '.';

test('should render', () => {
  render(<Search />);
  expect(screen.getByTestId('Search')).toBeTruthy();
});
