import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCombination, selectCurrent } from './slice/selectors';

import { Main } from 'utils/urls';
import { getThumbnail } from 'utils/imageTools';

import SongInfo from './SongInfo';
import TopCombination from './TopCombination';
import CombinationArea from './CombinationArea';
import TopCover from './TopCover';

import {
  dummySongs,
  dummyCombinations,
  dummyCovers,
  dummyInstruments,
} from 'api/dummy';

interface MatchParams {
  id?: string;
}
export interface Props extends RouteComponentProps<MatchParams> {}

export default function SongPage(props: Props) {
  const history = useHistory();
  const combination = useSelector(selectCombination);
  const current = useSelector(selectCurrent);

  useEffect(() => {
    // 존재하지 않는 노래면 리다이렉트
    if (!props.match.params.id || props.match.params.id !== '0') {
      window.alert('Song page does not exist.');
      history.push(Main());
    }
  }, [history, props.match.params.id]);

  const renderTopCover = () => {
    if (current === null) return null;

    const item = combination.find(item => item.id === current);
    return (
      item && (
        <TopCover
          covers={dummyCovers.filter(
            cover => cover.instrument.id === item.instrument.id,
          )}
        />
      )
    );
  };

  return (
    <div data-testid="SongPage" className="flex justify-center">
      <div className="flex flex-col w-screen sm:w-full sm:px-8 max-w-screen-lg">
        <SongInfo
          song={dummySongs[0]}
          image={getThumbnail(dummySongs[0].reference)}
        />
        <TopCombination combinations={dummyCombinations} covers={dummyCovers} />
        <CombinationArea instruments={dummyInstruments} covers={dummyCovers} />
        {renderTopCover()}
      </div>
    </div>
  );
}
