import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import MergedAudio from './MergedAudio';

test('should render', () => {
  render(<MergedAudio audioUrl="test-url" />);
  expect(screen.getByTestId('MergedAudio')).toBeTruthy();
});
