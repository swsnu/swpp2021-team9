import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

import loadingGif from 'res/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons';

import { useInterval } from 'app/helper/Hooks';
import TrackPlayer from 'app/helper/TrackPlayer';

interface Props {
  track?: TrackInfo;
}

export default function SimplePlayer(props: Props) {
  const trackPlayer = useMemo(() => new TrackPlayer(), []);
  const [currLength, setCurrLength] = useState(0);
  const [length, setLength] = useState(0);
  const [status, setStatus] = useState('');
  const [track, setTrack] = useState<TrackInfo>();
  const progress = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.track) {
      trackPlayer.setTrack(props.track);
      setTrack(props.track);
    }
    trackPlayer.onStatusChange = newStatus => setStatus(newStatus);

    return () => {
      trackPlayer.pause();
    };
  }, [props.track, trackPlayer]);

  const onPlayClicked = useCallback(() => {
    if (trackPlayer.isPaused()) {
      trackPlayer.play();
    } else {
      trackPlayer.pause();
    }
  }, [trackPlayer]);

  const onLikeClicked = useCallback(() => {
    if (track) {
      const newTrack = { ...track, like: !track?.like };
      setTrack(newTrack);
    }
  }, [track]);

  const updateProgress = useCallback(() => {
    const duration = trackPlayer.getDuration();
    const currentTime = trackPlayer.getCurrentTime();
    setLength(Math.ceil(duration));
    setCurrLength(Math.ceil(currentTime));
    const currnetPercent = (currentTime / duration) * 100;
    bar.current!.style.width = currnetPercent + '%';
  }, [trackPlayer]);

  const onProgressClick = useCallback(
    (e: any) => {
      let offset = e.target.getBoundingClientRect().left;
      let newOffSet = e.clientX;
      let newWidth = newOffSet - offset;
      let secPerPx = length / (progress.current?.offsetWidth ?? 1);
      trackPlayer.setCurrentTime(secPerPx * newWidth);
      updateProgress();
    },
    [length, trackPlayer, updateProgress],
  );

  const formatMinute = useCallback((time: number) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${`0${sec}`.slice(-2)}`;
  }, []);

  useInterval(updateProgress, 1000);

  return (
    <div
      data-testid="SimplePlayer"
      className="h-16 pt-1 px-4 sm:px-8 w-full self-stretch flex items-center"
    >
      <div id="info" className="h-full py-2 flex items-center">
        <button
          className="h-full mx-1 px-2 text-xl outline-none"
          id="like-button"
          onClick={onLikeClicked}
        >
          {track?.like ? (
            <FontAwesomeIcon
              data-testid="likeIcon"
              icon={faHeart}
              className="text-red-500"
            />
          ) : (
            <FontAwesomeIcon
              data-testid="unLikeIcon"
              icon={faEmptyHeart}
              className="text-red-400"
            />
          )}
        </button>
        <button
          className="mx-1 w-8 outline-none text-xl"
          id="play-button"
          onClick={onPlayClicked}
        >
          {['loading', 'wait'].includes(status) ? (
            <img data-testid="loadingIcon" src={loadingGif} alt="Loading" />
          ) : status === 'play' ? (
            <FontAwesomeIcon data-testid="pauseIcon" icon={faPause} />
          ) : (
            <FontAwesomeIcon data-testid="playIcon" icon={faPlay} />
          )}
        </button>
      </div>
      <div
        ref={progress}
        className="w-full mx-2 flex justify-evenly items-center"
      >
        <div
          data-testid="progressBox"
          className="w-full h-2.5 rounded-full bg-gray-300 cursor-pointer"
          onClick={onProgressClick}
        >
          <div
            data-testid="progressFill"
            ref={bar}
            className="w-0 h-full rounded-full bg-indigo-500"
          ></div>
        </div>
      </div>
      <div
        id="timer"
        className="text-right whitespace-nowrap w-24 ml-1 text-gray-600 font-medium"
      >
        {`${formatMinute(currLength)} / ${formatMinute(length)}`}
      </div>
    </div>
  );
}
