import { useState, useCallback, useRef, useEffect } from 'react';

import { ReactComponent as PrevSvg } from 'res/prev-button.svg';
import { ReactComponent as NextSvg } from 'res/next-button.svg';
import { ReactComponent as PlaySvg } from 'res/play-button.svg';
import { ReactComponent as PauseSvg } from 'res/pause-button.svg';
import { ReactComponent as LikeOutlined } from 'res/thumb_up_black_outlined.svg';
import { ReactComponent as LikeFilled } from 'res/thumb_up_black_filled.svg';
import loadingGif from 'res/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons';

import Player from 'app/helper/Player';
import { useInterval } from 'app/helper/Hooks';
import mockPlaylist from 'app/helper/mockPlayList';

interface Props {}

export default function PlayerBar(props: Props) {
  const [player] = useState(Player.getInstance());
  const [currLength, setCurrLength] = useState(0);
  const [length, setLength] = useState(0);
  const [status, setStatus] = useState('');
  const [track, setTrack] = useState<TrackInfo>();
  const progress = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    player.onStatusChange = newStatus => setStatus(newStatus);
    player.onTrackChanged = newTrack => setTrack(newTrack);

    const trackList: TrackInfo[] = [];
    mockPlaylist.forEach(v => {
      trackList.push({
        song: {
          title: v.name,
          singer: v.artist,
          category: 'category',
          reference: 'ref',
          description: 'des',
        },
        sources: [v.source],
        like: false,
      });
    });
    player.setTracks(trackList);
  }, [player]);

  const onPlayClicked = useCallback(() => {
    console.log('onPlayClicked');
    if (player.isPaused()) {
      player.play();
    } else {
      player.pause();
    }
  }, [player]);

  const onPrevClicked = useCallback(() => {
    console.log('onPrevClicked');
    player.playPrev();
  }, [player]);

  const onNextClicked = useCallback(() => {
    console.log('onNextClicked');
    player.playNext();
  }, [player]);

  const onLikeClicked = useCallback(() => {
    console.log('onLikeClicked');
    if (track) {
      const newTrack = { ...track, like: !track?.like };
      setTrack(newTrack);
    }
  }, [track]);

  const updateProgress = useCallback(() => {
    const duration = player.getDuration();
    const currentTime = player.getCurrentTime();
    setLength(Math.ceil(duration));
    setCurrLength(Math.ceil(currentTime));
    const currnetPercent = (currentTime / duration) * 100;
    if (bar.current != null) {
      bar.current.style.width = currnetPercent + '%';
    }
    if (currentTime === duration) {
      console.log('Finish Play this song');
      player.playNext();
    }
  }, [player]);

  const onProgressClick = useCallback(
    (e: any) => {
      let offset = e.target.getBoundingClientRect().left;
      let newOffSet = e.clientX;
      let newWidth = newOffSet - offset;
      let secPerPx = length / (progress.current?.offsetWidth ?? 1);
      player.setCurrentTime(secPerPx * newWidth);
      updateProgress();
    },
    [length, player, updateProgress],
  );

  const formatMinute = useCallback((time: number) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${`0${sec}`.slice(-2)}`;
  }, []);

  useInterval(updateProgress, 1000);

  return (
    <div
      data-testid="PlayerBar"
      className="fixed bottom-0 left-0 h-16 pt-1 px-4 sm:px-8 w-full self-stretch flex items-center justify-between bg-gray-100"
    >
      <div className="h-full py-2 flex flex-none items-center">
        <div className="px-2 py-1 font-semibold border-2 border-black rounded-full">
          {track
            ? `${track.song.title} - ${track.song.singer}`
            : 'Select Music'}
        </div>
        <button
          className="h-full mx-2 px-2 text-xl outline-none"
          onClick={onLikeClicked}
        >
          {track?.like ? (
            <FontAwesomeIcon icon={faHeart} className="text-red-500" />
          ) : (
            <FontAwesomeIcon icon={faEmptyHeart} className="text-red-400" />
          )}
        </button>
      </div>
      <div className="flex h-full py-2 justify-center items-stretch text-xl">
        <button
          className="mx-1 sm:mx-3 px-2 outline-none"
          id="prev-button"
          onClick={onPrevClicked}
        >
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button
          className="mx-1 sm:mx-3 px-2 outline-none"
          id="play-button"
          onClick={onPlayClicked}
        >
          {status === 'loading' ? (
            <img style={{ width: '28px' }} src={loadingGif} alt="Loading" />
          ) : status === 'playing' ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </button>
        <button
          className="mx-1 sm:mx-3 px-2 outline-none"
          id="next-button"
          onClick={onNextClicked}
        >
          <FontAwesomeIcon icon={faStepForward} />
        </button>
      </div>
      <div className="flex-none text-right text-gray-600 font-medium">
        {`${formatMinute(currLength)} / ${formatMinute(length)}`}
      </div>
      <div
        ref={progress}
        className="absolute left-0 top-0 w-full flex justify-evenly items-center"
      >
        <div
          className="w-full h-1.5 bg-gray-300 hover:h-2.5 cursor-pointer"
          onClick={e => onProgressClick(e)}
        >
          <div ref={bar} className="w-0 h-full bg-indigo-500"></div>
        </div>
      </div>
    </div>
  );
}
