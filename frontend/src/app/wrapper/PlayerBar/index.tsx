import * as React from 'react';
import { ReactComponent as PrevSvg } from 'res/prev-button.svg';
import { ReactComponent as NextSvg } from 'res/next-button.svg';
import { ReactComponent as PlaySvg } from 'res/play-button.svg';
import { ReactComponent as PauseSvg } from 'res/pause-button.svg';

interface Props {
  playInfo?: PlayInfo;
}

export default function PlayerBar(props: Props) {
  const song = props.playInfo ? props.playInfo.song : undefined;

  return (
    <div data-testid="PlayerBar" className="PlayerBar">
      <div className="info">
        {song ? `${song.title} - ${song.singer}` : 'Selete Music'}
      </div>
      <div className="controller">
        <button className="svgButton">
          <PrevSvg className="svgButton" />
        </button>
        <button className="svgButton">
          <PlaySvg className="svgButton" />
        </button>
        <button className="svgButton">
          <NextSvg className="svgButton" />
        </button>
      </div>
    </div>
  );
}
