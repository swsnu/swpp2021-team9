import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Album from '../../components/Album/index';
import Player from 'app/helper/Player';
import * as urls from 'utils/urls';
import * as apiActions from 'api/actions';
import { getThumbnail } from 'utils/imageTools';
import { selectMain } from './slice/selectors';

export type Props = {};

export default function MainPage(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const mainState = useSelector(selectMain);

  const player = useMemo(() => Player.getInstance(), []);

  // loading
  const combinationsResponse = mainState.combinationsResponse;

  useEffect(() => {
    dispatch(apiActions.loadCombinationsMain.request());
  }, [dispatch]);

  useEffect(() => {
    if (!combinationsResponse.loading) {
      if (combinationsResponse.error) {
        window.alert('Error: could not get songs');
      } else if (combinationsResponse.data) {
        console.log(combinationsResponse.data);
      }
    }
  }, [combinationsResponse]);

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
      {combinationsResponse.data &&
        combinationsResponse.data.map(combination => (
          <Album
            key={combination.id}
            id={combination.song.id}
            title={combination.song.title}
            singer={combination.song.singer}
            thumbnail={getThumbnail(combination.song.reference)}
            onClickTitle={() => history.push(urls.Song(combination.song.id))}
            onClickPlay={() => {}}
            //player.addTrack(trackexample)
            //player.setIndex(album.id)
            //} // TODO: play the corresponding song
          />
        ))}

      <div className="flex">
        <p></p>
      </div>
    </div>
  );
}
