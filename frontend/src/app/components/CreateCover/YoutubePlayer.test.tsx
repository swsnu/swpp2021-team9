import { render, screen } from '@testing-library/react';
import YoutubePlayer from './YoutubePlayer';

describe('<YoutubePlayer />', () => {
  it('should render youtube player', () => {
    render(<YoutubePlayer />);
    const player = screen.getByTestId('youtube-player');
    expect(player).toBeTruthy();
  });
});
