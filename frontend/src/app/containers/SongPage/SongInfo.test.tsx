import { render, fireEvent } from '@testing-library/react';
import SongInfo from './SongInfo';

const dummySong: Song = {
  id: 0,
  title: '신호등',
  singer: '이무진',
  category: 'POP',
  reference: 'https://www.youtube.com/watch?v=SK6Sm2Ki9tI',
  description: '붉은색 푸른색 그 사이 3초 그 짧은 시간~',
};

function setup() {
  const page = render(<SongInfo song={dummySong} />);
  const youtubeButton = page.getByTestId('button-youtube');
  return { page, youtubeButton };
}

test('should open youtube link', () => {
  jest.spyOn(window, 'open').mockImplementation((url?: string | URL) => {
    return null;
  });
  const { youtubeButton } = setup();
  fireEvent.click(youtubeButton);
  expect(window.open).toBeCalledWith(dummySong.reference);
});
