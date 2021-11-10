import { useState, useCallback, useRef, useEffect } from 'react';

import { ReactComponent as PrevSvg } from 'res/prev-button.svg';
import { ReactComponent as NextSvg } from 'res/next-button.svg';
import { ReactComponent as PlaySvg } from 'res/play-button.svg';
import { ReactComponent as PauseSvg } from 'res/pause-button.svg';
import { ReactComponent as LikeOutlined } from 'res/thumb_up_black_outlined.svg';
import { ReactComponent as LikeFilled } from 'res/thumb_up_black_filled.svg';
import loadingGif from 'res/loading.gif';

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
    <div data-testid="PlayerBar" className="PlayerBar">
      <div className="info">
        <div className="text">
          {track
            ? `${track.song.title} - ${track.song.singer}`
            : 'Selete Music'}
        </div>
        <button className="svgButton" onClick={onLikeClicked}>
          {track?.like ? <LikeFilled /> : <LikeOutlined />}
        </button>
      </div>
      <div className="controller">
        <button className="svgButton" id="prev-button" onClick={onPrevClicked}>
          <PrevSvg className="svgButton" />
        </button>
        <button className="svgButton" id="play-button" onClick={onPlayClicked}>
          {status === 'loading' ? (
            <img style={{ width: '28px' }} src={loadingGif} alt="Loading" />
          ) : status === 'playing' ? (
            <PauseSvg />
          ) : (
            <PlaySvg />
          )}
        </button>
        <button className="svgButton" id="next-button" onClick={onNextClicked}>
          <NextSvg className="svgButton" />
        </button>
      </div>
      <div className="timer">
        {`${formatMinute(currLength)} / ${formatMinute(length)}`}
      </div>
      <div ref={progress} className="progress">
        <div className="progressCenter" onClick={e => onProgressClick(e)}>
          <div ref={bar} className="progressBar"></div>
        </div>
      </div>
    </div>
  );
}
