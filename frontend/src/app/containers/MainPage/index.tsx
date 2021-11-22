import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Album from '../../components/Album/index';
import { dummyAlbums } from './dummy';
import Player from 'app/helper/Player';
import { Song } from 'utils/urls';

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
      {dummyAlbums.map(album => (
        <Album
          key={album.id}
          id={album.id}
          title={album.title}
          singer={album.singer}
          thumbnail={album.thumbnail}
          onClickTitle={() => history.push(Song(album.id))}
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
