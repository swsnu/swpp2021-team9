import React, { useEffect, useCallback, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSong,
  selectCombination,
  selectCurrent,
} from './slice/selectors';
import { useSongSlice } from './slice';
import * as apiActions from 'api/actions';
import * as urls from 'utils/urls';
import { getThumbnail } from 'utils/imageTools';

import Player from 'app/helper/Player';
import SongInfo from './SongInfo';
import TopCombination from './TopCombination';
import CombinationArea from './CombinationArea';
import TopCover from './TopCover';

interface MatchParams {
  id?: string;
}
export interface Props extends RouteComponentProps<MatchParams> {}

export default function SongPage(props: Props) {
  useSongSlice();
  const history = useHistory();
  const dispatch = useDispatch();
  const songState = useSelector(selectSong);
  const combination = useSelector(selectCombination);
  const current = useSelector(selectCurrent);

  // loading
  const songResponse = songState.songResponse;
  const combinationsResponse = songState.combinationsResponse;
  const coversResponse = songState.coversResponse;
  const instrumentsResponse = songState.instrumentsResponse;

  useEffect(() => {
    dispatch(apiActions.loadSong.request(Number(props.match.params.id)));
    dispatch(
      apiActions.loadCombinations.request(Number(props.match.params.id)),
    );
    dispatch(apiActions.loadCoversSong.request(Number(props.match.params.id)));
    dispatch(apiActions.loadInstruments.request());
  }, [dispatch, props.match]);

  useEffect(() => {
    if (!songResponse.loading) {
      if (songResponse.error) {
        window.alert('Song page does not exist.');
        history.push(urls.Main());
      }
    }
  }, [songResponse, history]);

  const renderTopCover = useCallback(() => {
    if (current === null) return null;

    const currentItem = combination.find(item => item.id === current);
    return (
      currentItem &&
      coversResponse.data && (
        <TopCover
          covers={coversResponse.data.filter(
            cover =>
              cover.instrument &&
              cover.instrument.id === currentItem.instrument.id,
          )}
        />
      )
    );
  }, [current, combination, coversResponse.data]);

  // playing
  const player = useMemo(() => Player.getInstance(), []);

  const onClickPlay = useCallback(() => {
    if (!songResponse.data) return;
    const currentSongInfo: SongInfo = songResponse.data;

    let sources: string[] = combination
      .filter(item => item.cover)
      .map(item => (item.cover ? item.cover.audio : ''));

    console.log(sources);

    const currentTrackInfo: TrackInfo = {
      song: currentSongInfo,
      sources,
      like: false,
    };
    player.setTracks([currentTrackInfo]);
  }, [combination, player, songResponse.data]);

  return (
    <div data-testid="SongPage" className="flex justify-center">
      <div className="flex flex-col w-screen sm:w-full sm:px-8 max-w-screen-lg">
        {songResponse.data && (
          <SongInfo
            song={songResponse.data}
            image={getThumbnail(songResponse.data.reference)}
          />
        )}

        {combinationsResponse.data && (
          <TopCombination combinations={combinationsResponse.data} />
        )}

        {instrumentsResponse.data && coversResponse.data && (
          <CombinationArea
            instruments={instrumentsResponse.data}
            covers={coversResponse.data}
            onClickPlay={onClickPlay}
          />
        )}
        {renderTopCover()}
      </div>
    </div>
  );
}
