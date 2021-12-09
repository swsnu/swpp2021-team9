import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
interface Props {}

export default function YoutubePlayer(props: Props) {
  const player = useRef<ReactPlayer>(null);

  return (
    <div data-testid="youtube-player">
      <ReactPlayer
        ref={player}
        className={'shadow border'}
        url={[
          'https://www.youtube.com/watch?v=SK6Sm2Ki9tI',
          'https://www.youtube.com/watch?v=FtaW6YMAafk',
          'https://www.youtube.com/watch?v=ww9hZfgC2d8',
        ]}
        controls={true}
      />
    </div>
  );
}
