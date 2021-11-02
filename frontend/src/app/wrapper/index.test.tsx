import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Wrapper from '.';

test('should render', () => {
  render(<Wrapper />);
  expect(screen.getByTestId('Wrapper')).toBeTruthy();
});
