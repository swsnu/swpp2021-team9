import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import PlayerBar from '.';

test('should render', () => {
  render(<PlayerBar />);
  expect(screen.getByTestId('PlayerBar')).toBeTruthy();
});
