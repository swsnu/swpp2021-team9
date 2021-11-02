import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Album from '.';

test('should render', () => {
  render(<Album />);
  expect(screen.getByTestId('Album')).toBeTruthy();
});
