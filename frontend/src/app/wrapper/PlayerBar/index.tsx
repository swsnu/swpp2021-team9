import * as React from 'react';
import { useState, useCallback, useRef } from 'react';

import { ReactComponent as PrevSvg } from 'res/prev-button.svg';
import { ReactComponent as NextSvg } from 'res/next-button.svg';
import { ReactComponent as PlaySvg } from 'res/play-button.svg';
import { ReactComponent as PauseSvg } from 'res/pause-button.svg';
import Player from 'app/helper/Player';
import { useInterval } from 'app/helper/Hooks';

interface Props {
  playInfo?: PlayInfo;
}

export default function PlayerBar(props: Props) {
  const song = props.playInfo ? props.playInfo.song : undefined;
  const player = Player.getInstance();
  const [paused, setPaused] = useState(player.isPaused());
  const [currLength, setCurrLength] = useState(0);
  const [length, setLength] = useState(0);
  const progress = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  const onPlayClicked = useCallback(() => {
    console.log('onPlayClicked');
    if (player.isPaused()) {
      player.play();
    } else {
      player.pause();
    }
    setPaused(player.isPaused());
  }, [player]);

  const onPrevClicked = useCallback(() => {
    console.log('onPrevClicked');
  }, []);

  const onNextClicked = useCallback(() => {
    console.log('onNextClicked');
  }, []);

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
    }
    setPaused(player.isPaused());
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

  useInterval(updateProgress, 1000);

  return (
    <div data-testid="PlayerBar" className="PlayerBar">
      <div className="info">
        {song ? `${song.title} - ${song.singer}` : 'Selete Music'}
      </div>
      <div className="controller">
        <button className="svgButton" id="prev-button" onClick={onPrevClicked}>
          <PrevSvg className="svgButton" />
        </button>
        <button className="svgButton" id="play-button" onClick={onPlayClicked}>
          {paused ? <PlaySvg /> : <PauseSvg />}
        </button>
        <button className="svgButton" id="next-button" onClick={onNextClicked}>
          <NextSvg className="svgButton" />
        </button>
      </div>
      <div>{currLength}</div>
      <div ref={progress} className="progress">
        <div className="progressCenter" onClick={e => onProgressClick(e)}>
          <div ref={bar} className="progressBar"></div>
        </div>
      </div>
    </div>
  );
}
