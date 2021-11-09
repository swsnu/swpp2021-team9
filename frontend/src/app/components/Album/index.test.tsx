import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Album from '.';

test('should render', () => {
  render(<Album title="Album1" singer="Singer1" />);
  expect(screen.getByTestId('Album')).toBeTruthy();
});
