import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Header from '.';

test('should render', () => {
  render(<Header />);
  expect(screen.getByTestId('Header')).toBeTruthy();
});
