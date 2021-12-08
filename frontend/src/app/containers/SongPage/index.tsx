import React, { useEffect } from 'react';
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

import SongInfo from './SongInfo';
import TopCombination from './TopCombination';
import CombinationArea from './CombinationArea';
import TopCover from './TopCover';

import {
  dummySong,
  dummyCombinations,
  dummyCovers,
  dummyInstruments,
} from 'api/dummy';

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

  // loading song
  const songResponse = songState.songResponse;

  useEffect(() => {
    dispatch(apiActions.loadSong.request(Number(props.match.params.id)));
  }, [dispatch, props.match]);

  useEffect(() => {
    if (!songResponse.loading) {
      if (songResponse.error) {
        window.alert('Song page does not exist.');
        history.push(urls.Main());
      }
    }
  }, [songResponse, history]);

  const renderTopCover = () => {
    if (current === null) return null;

    const currentItem = combination.find(item => item.id === current);
    return (
      currentItem && (
        <TopCover
          covers={dummyCovers.filter(
            cover => cover.instrument.id === currentItem.instrument.id,
          )}
        />
      )
    );
  };

  return (
    <div data-testid="SongPage" className="flex justify-center">
      <div className="flex flex-col w-screen sm:w-full sm:px-8 max-w-screen-lg">
        <SongInfo
          song={songResponse.data ?? dummySong}
          image={getThumbnail(
            songResponse.data
              ? songResponse.data.reference
              : dummySong.reference,
          )}
        />
        <TopCombination combinations={dummyCombinations} covers={dummyCovers} />
        <CombinationArea instruments={dummyInstruments} covers={dummyCovers} />
        {renderTopCover()}
      </div>
    </div>
  );
}
