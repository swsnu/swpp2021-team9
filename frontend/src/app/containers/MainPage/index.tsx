import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Album from '../../components/Album/index';
import { dummySongs } from 'api/dummy';
import Player from 'app/helper/Player';
import { Song } from 'utils/urls';
import { getThumbnail } from 'utils/imageTools';

export type Props = {};

export default function MainPage(props: Props) {
  const history = useHistory();
  const player = useMemo(() => Player.getInstance(), []);

  const songexample: SongInfo = {
    title: '',
    singer: '',
    category: '',
    reference: '',
    description: '',
  };

  const trackexample: TrackInfo = {
    song: songexample,
    sources: ['hello', 'world'],
    like: false,
  };

  return (
    <div
      data-testid="MainPage"
      className="items-center overflow-hidden grid grid-cols-12"
    >
      {dummySongs.map(song => (
        <Album
          key={song.id}
          id={song.id}
          title={song.title}
          singer={song.singer}
          thumbnail={getThumbnail(song.reference)}
          onClickTitle={() => history.push(Song(song.id))}
          onClickPlay={() => {}}
          // TODO
        />
      ))}

      <div className="flex">
        <p></p>
      </div>
    </div>
  );
}
