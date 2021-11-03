import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import SimplePlayer from '.';

test('should render', () => {
  render(<SimplePlayer />);
  expect(screen.getByTestId('SimplePlayer')).toBeTruthy();
});
