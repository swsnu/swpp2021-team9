import * as React from 'react';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import PlayerBar from '.';
import Player from 'app/helper/Player';
import { act } from 'react-dom/test-utils';
import * as Hooks from 'app/helper/Hooks';

jest.mock('app/helper/TrackPlayer');
let player = Player.getInstance();

beforeEach(() => {
  jest.clearAllMocks();
  player.play = jest.fn();
  player.pause = jest.fn();
  player.playPrev = jest.fn();
  player.playNext = jest.fn();
  player.setCurrentTime = jest.fn();
  player.isPaused = jest.fn().mockReturnValue(true);
});

test('should render', () => {
  const { container } = render(<PlayerBar />);
  expect(screen.getByTestId('PlayerBar')).toBeTruthy();

  const playButton = container.querySelector('#play-button');
  const nextButton = container.querySelector('#next-button');
  const prevButton = container.querySelector('#prev-button');
  const likeButton = container.querySelector('#like-button');

  expect(playButton).toBeTruthy();
  expect(nextButton).toBeTruthy();
  expect(prevButton).toBeTruthy();
  expect(likeButton).toBeTruthy();
});

test('should handle control buttons', () => {
  const { container } = render(<PlayerBar />);
  expect(screen.getByTestId('PlayerBar')).toBeTruthy();

  const playButton = container.querySelector('#play-button');
  const nextButton = container.querySelector('#next-button');
  const prevButton = container.querySelector('#prev-button');

  // Play
  fireEvent.click(playButton!);
  expect(player.play).toBeCalledTimes(1);
  expect(player.pause).toBeCalledTimes(0);

  // Pause
  (player.isPaused as jest.Mock).mockReturnValue(false);
  fireEvent.click(playButton!);
  expect(player.play).toBeCalledTimes(1);
  expect(player.pause).toBeCalledTimes(1);

  // Next
  fireEvent.click(nextButton!);
  expect(player.playNext).toBeCalledTimes(1);

  // Prev
  fireEvent.click(prevButton!);
  expect(player.playPrev).toBeCalledTimes(1);
});

test('should handle like button', () => {
  const { container, queryByTestId } = render(<PlayerBar />);
  expect(screen.getByTestId('PlayerBar')).toBeTruthy();

  let likeButton = container.querySelector('#like-button');
  let likeIcon = queryByTestId('likeIcon');
  let unlikeIcon = queryByTestId('unLikeIcon');

  fireEvent.click(likeButton!);
  expect(likeIcon).toBeNull();
  expect(unlikeIcon).toBeTruthy();

  act(() => {
    player.onTrackChanged?.({
      song: {
        title: 'SONG_TITLE',
        singer: 'SONG_SINGER',
        category: 'SONG_CATEGORY',
        reference: 'SONG_REFERENCE',
        description: 'SONG_DESCRIPTION',
      },
      sources: ['url1'],
      like: true,
    });
  });

  likeIcon = queryByTestId('likeIcon');
  unlikeIcon = queryByTestId('unLikeIcon');
  expect(likeIcon).toBeTruthy();
  expect(unlikeIcon).toBeNull();

  fireEvent.click(likeButton!);
  likeIcon = queryByTestId('likeIcon');
  unlikeIcon = queryByTestId('unLikeIcon');
  expect(likeIcon).toBeNull();
  expect(unlikeIcon).toBeTruthy();
});

test('should interval', () => {
  let updateProgress: Function;
  jest.spyOn(Hooks, 'useInterval').mockImplementation((callback, delay) => {
    updateProgress = callback;
  });
  const { queryByTestId } = render(<PlayerBar />);
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 200,
  });

  let fill = queryByTestId('progressFill');
  let box = queryByTestId('progressBox');

  const duration = 200;
  const currentTime = 130;

  // show progress
  (player.getDuration as jest.Mock).mockReturnValue(duration);
  (player.getCurrentTime as jest.Mock).mockReturnValue(currentTime);

  act(() => updateProgress());
  expect(fill?.style.width).toBe((currentTime / duration) * 100 + '%');

  const target = {
    getBoundingClientRect: () => ({
      left: 50,
    }),
  };

  // click progress center
  fireEvent.click(box!, {
    clientX: 100,
  });
  fireEvent(
    box!,
    new MouseEvent('click', {
      clientX: target.getBoundingClientRect().left,
    }),
  );

  // when offsetWidth is null
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: null,
  });
  fireEvent.click(box!, {
    clientX: 100,
  });
  fireEvent(
    box!,
    new MouseEvent('click', {
      clientX: target.getBoundingClientRect().left,
    }),
  );

  expect(player.setCurrentTime).lastCalledWith(20000);

  // finish playing
  (player.getDuration as jest.Mock).mockReturnValue(duration);
  (player.getCurrentTime as jest.Mock).mockReturnValue(duration);
  act(() => updateProgress());

  expect(player.playNext).toBeCalledTimes(1);
});

test('should play button with status', () => {
  const { queryByTestId } = render(<PlayerBar />);
  expect(screen.getByTestId('PlayerBar')).toBeTruthy();

  // loading
  act(() => {
    player.onStatusChange?.('loading');
  });

  const loadingIcon = queryByTestId('loadingIcon');
  expect(loadingIcon).toBeTruthy();

  // playing
  act(() => {
    player.onStatusChange?.('playing');
  });

  const pauseIcon = queryByTestId('pauseIcon');
  expect(pauseIcon).toBeTruthy();

  // paused
  act(() => {
    player.onStatusChange?.('paused');
  });

  const playIcon = queryByTestId('playIcon');
  expect(playIcon).toBeTruthy();
});
