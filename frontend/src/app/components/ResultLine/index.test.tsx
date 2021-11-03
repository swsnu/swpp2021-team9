import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import ResultLine from '.';

test('should render', () => {
  render(<ResultLine />);
  expect(screen.getByTestId('ResultLine')).toBeTruthy();
});
