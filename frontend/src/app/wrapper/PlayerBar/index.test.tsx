import * as React from 'react';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import PlayerBar from '.';
import Player from 'app/helper/Player';
import { act } from 'react-dom/test-utils';
import * as Hooks from 'app/helper/Hooks';
import { dummyTrackInfos } from 'api/dummy';

jest.mock('app/helper/TrackPlayer');
let player = Player.getInstance();

const mockSetTrack = jest.fn().mockImplementation((track: TrackInfo) => {});

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
  const { container } = render(
    <PlayerBar setTrack={(track: TrackInfo) => {}} />,
  );
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
  const { container } = render(<PlayerBar setTrack={mockSetTrack} />);
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
  const { container } = render(
    <PlayerBar track={dummyTrackInfos[0]} setTrack={mockSetTrack} />,
  );
  expect(screen.getByTestId('PlayerBar')).toBeTruthy();

  let likeButton = container.querySelector('#like-button');
  fireEvent.click(likeButton!);
  expect(mockSetTrack).toBeCalledWith({ ...dummyTrackInfos[0], like: true });

  act(() => {
    player.onTrackChanged?.({ ...dummyTrackInfos[0], sources: ['CHANGE'] });
  });
  expect(mockSetTrack).toBeCalledWith({
    ...dummyTrackInfos[0],
    sources: ['CHANGE'],
  });
});

test('should handle like button when no track', () => {
  const { container } = render(<PlayerBar setTrack={mockSetTrack} />);
  expect(screen.getByTestId('PlayerBar')).toBeTruthy();

  let likeButton = container.querySelector('#like-button');
  fireEvent.click(likeButton!);
  expect(mockSetTrack).toBeCalledTimes(0);
});

test('should handle unliked state', () => {
  const { queryByTestId } = render(
    <PlayerBar
      track={{ ...dummyTrackInfos[0], like: false }}
      setTrack={mockSetTrack}
    />,
  );
  let likeIcon = queryByTestId('likeIcon');
  let unlikeIcon = queryByTestId('unLikeIcon');
  expect(likeIcon).toBeNull();
  expect(unlikeIcon).toBeTruthy();
});

test('should handle liked state', () => {
  const { queryByTestId } = render(
    <PlayerBar
      track={{ ...dummyTrackInfos[0], like: true }}
      setTrack={mockSetTrack}
    />,
  );
  let likeIcon = queryByTestId('likeIcon');
  let unlikeIcon = queryByTestId('unLikeIcon');
  expect(likeIcon).toBeTruthy();
  expect(unlikeIcon).toBeNull();
});

test('display 0:00 when length === 0', () => {
  let updateProgress: Function;
  jest.spyOn(Hooks, 'useInterval').mockImplementation((callback, delay) => {
    updateProgress = callback;
  });
  (player.getDuration as jest.Mock).mockReturnValue(0);

  const { queryByTestId } = render(
    <PlayerBar track={dummyTrackInfos[0]} setTrack={mockSetTrack} />,
  );
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 200,
  });

  act(() => {
    player.onStatusChange?.('play');
  });
  act(() => updateProgress());

  let fill = queryByTestId('progressFill');
  expect(fill?.style.width).toBe('0%');
});

test('should interval', () => {
  let updateProgress: Function;
  jest.spyOn(Hooks, 'useInterval').mockImplementation((callback, delay) => {
    updateProgress = callback;
  });

  const duration = 200;
  const currentTime = 130;

  // show progress
  (player.getDuration as jest.Mock).mockReturnValue(duration);
  (player.getCurrentTime as jest.Mock).mockReturnValue(currentTime);

  const { queryByTestId } = render(
    <PlayerBar track={dummyTrackInfos[0]} setTrack={mockSetTrack} />,
  );
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 200,
  });

  act(() => {
    player.onStatusChange?.('play');
  });

  act(() => updateProgress());

  let fill = queryByTestId('progressFill');
  let box = queryByTestId('progressBox');
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
  const { queryByTestId } = render(
    <PlayerBar setTrack={(track: TrackInfo) => {}} />,
  );
  expect(screen.getByTestId('PlayerBar')).toBeTruthy();

  // loading
  act(() => {
    player.onStatusChange?.('loading');
  });

  const loadingIcon = queryByTestId('loadingIcon');
  expect(loadingIcon).toBeTruthy();

  // playing
  act(() => {
    player.onStatusChange?.('play');
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
