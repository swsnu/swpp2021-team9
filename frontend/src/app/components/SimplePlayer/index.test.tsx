import * as React from 'react';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import SimplePlayer from '.';
import { act } from 'react-dom/test-utils';
import * as Hooks from 'app/helper/Hooks';
import TrackPlayer from 'app/helper/TrackPlayer';
import { dummyCovers, dummySongs } from 'api/dummy';

jest.mock('app/helper/TrackPlayer');
let player = new TrackPlayer();

const dummyTrack: TrackInfo = {
  combinationId: 1,
  song: dummySongs[0],
  sources: [dummyCovers[0].audio, dummyCovers[1].audio],
  like: false,
};

beforeEach(() => {
  (TrackPlayer as jest.Mock).mockImplementation(() => {
    return player;
  });
});

test('should render', () => {
  const { container } = render(<SimplePlayer />);
  expect(screen.getByTestId('SimplePlayer')).toBeTruthy();

  const playButton = container.querySelector('#play-button');
  const likeButton = container.querySelector('#like-button');

  expect(playButton).toBeTruthy();
  expect(likeButton).toBeTruthy();
});

test('should handle control buttons', () => {
  const { container } = render(<SimplePlayer />);
  expect(screen.getByTestId('SimplePlayer')).toBeTruthy();

  const playButton = container.querySelector('#play-button');

  // Play
  (player.isPaused as jest.Mock).mockReturnValueOnce(true);
  fireEvent.click(playButton!);
  expect(player.play).toBeCalledTimes(1);
  expect(player.pause).toBeCalledTimes(0);

  // Pause
  (player.isPaused as jest.Mock).mockReturnValueOnce(false);
  fireEvent.click(playButton!);
  expect(player.play).toBeCalledTimes(1);
  expect(player.pause).toBeCalledTimes(1);

  //like when no tack just pass
  let likeButton = container.querySelector('#like-button');
  fireEvent.click(likeButton!);
});

test('should handle like button', () => {
  const { container, queryByTestId } = render(
    <SimplePlayer track={dummyTrack} />,
  );
  expect(screen.getByTestId('SimplePlayer')).toBeTruthy();

  let likeButton = container.querySelector('#like-button');
  let likeIcon = queryByTestId('likeIcon');
  let unlikeIcon = queryByTestId('unLikeIcon');

  expect(likeIcon).toBeNull();
  expect(unlikeIcon).toBeTruthy();

  fireEvent.click(likeButton!);

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
  const { queryByTestId } = render(<SimplePlayer track={dummyTrack} />);
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
});

test('should play button with status', () => {
  const { queryByTestId } = render(<SimplePlayer track={dummyTrack} />);
  expect(screen.getByTestId('SimplePlayer')).toBeTruthy();

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
    player.onStatusChange?.('pause');
  });

  const playIcon = queryByTestId('playIcon');
  expect(playIcon).toBeTruthy();
});
