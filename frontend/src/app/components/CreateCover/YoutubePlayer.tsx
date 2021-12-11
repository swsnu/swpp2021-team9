import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
interface Props {
  url: string;
}

export default function YoutubePlayer(props: Props) {
  const player = useRef<ReactPlayer>(null);

  return (
    <div data-testid="youtube-player">
      <ReactPlayer
        ref={player}
        className={'shadow border'}
        url={props.url}
        controls={true}
      />
    </div>
  );
}
