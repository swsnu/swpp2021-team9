import * as React from 'react';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import PlayerBar from '.';

test('should render', () => {
  const { container } = render(<PlayerBar />);
  expect(screen.getByTestId('PlayerBar')).toBeTruthy();

  const playButton = container.querySelector('#play-button');
  const nextButton = container.querySelector('#next-button');
  const prevButton = container.querySelector('#prev-button');

  expect(playButton).toBeTruthy();
  expect(nextButton).toBeTruthy();
  expect(prevButton).toBeTruthy();
});

test('should handle play button', () => {
  jest.mock('app/helper/Player', () => {
    return {
      paused: false,
    };
  });
  const { container } = render(<PlayerBar />);

  const playButton = container.querySelector('#play-button');
  const nextButton = container.querySelector('#next-button');
  const prevButton = container.querySelector('#prev-button');

  fireEvent.click(playButton!);

  // expect(player.paused).toBe(false);
});
