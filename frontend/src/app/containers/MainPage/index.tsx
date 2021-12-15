import React, { useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Album from '../../components/Album/index';
import Player from 'app/helper/Player';
import * as urls from 'utils/urls';
import * as apiActions from 'api/actions';
import { selectMain } from './slice/selectors';
import { useMainSlice } from './slice';
import { useWrapperSlice } from 'app/wrapper/slice';
import { selectWrapper } from 'app/wrapper/slice/selectors';

export type Props = {};

export default function MainPage(props: Props) {
  useMainSlice();
  useWrapperSlice();
  const history = useHistory();
  const dispatch = useDispatch();
  const mainState = useSelector(selectMain);
  useSelector(selectWrapper);

  const player = useMemo(() => Player.getInstance(), []);

  // loading
  const combinationsResponse = mainState.combinationsResponse;

  useEffect(() => {
    dispatch(apiActions.loadCombinationsMain.request());
  }, [dispatch]);

  useEffect(() => {
    if (!combinationsResponse.loading) {
      if (combinationsResponse.error) {
        window.alert('Error: could not fetch bands.');
      } else if (combinationsResponse.data && player) {
        // setting tracks
        const trackInfos = combinationsResponse.data.map(combination => {
          const sources = combination.covers.map(cover => cover.audio);
          const trackInfo: TrackInfo = {
            id: combination.id,
            song: combination.song,
            sources,
            like: false,
          };
          return trackInfo;
        });
        player.setTracks(trackInfos);
      }
    }
  }, [combinationsResponse, player]);

  const onClickPlay = useCallback(
    (index: number) => {
      if (player.getIndex !== index) player.setIndex(index);
    },
    [player],
  );

  const getIsPlaying = useCallback(
    (index: number) => {
      return player.getIndex === index;
    },
    [player.getIndex],
  );

  return (
    <div
      data-testid="MainPage"
      className="items-center overflow-hidden grid grid-cols-12 pt-8"
    >
      {combinationsResponse.data && combinationsResponse.data.length > 0 ? (
        combinationsResponse.data.map((combination, index) => (
          <Album
            key={combination.id}
            combination={combination}
            onClickTitle={() => history.push(urls.Song(combination.song.id))}
            onClickPlay={() => onClickPlay(index)}
            isPlaying={getIsPlaying(index)}
          />
        ))
      ) : (
        <div className="w-full col-span-12 text-center">Loading...</div>
      )}

      <div className="flex">
        <p></p>
      </div>
    </div>
  );
}
