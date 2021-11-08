import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';

import { Main } from 'utils/urls';
import { Song, Combination, Cover } from 'types/models';

import SongInfo from './SongInfo';
import TopCombination from './TopCombination';
import MakeCombination from './MakeCombinationArea';

import { dummySongs, dummyCombinations, dummyCovers } from './dummy';

interface MatchParams {
  id?: string;
}
export interface Props extends RouteComponentProps<MatchParams> {}

export default function SongPage(props: Props) {
  const history = useHistory();

  useEffect(() => {
    // 존재하지 않는 노래면 리다이렉트
    if (!props.match.params.id || props.match.params.id !== '0') {
      window.alert('Song page does not exist.');
      history.push(Main());
    }
  }, [history, props.match.params.id]);

  return (
    <div data-testid="SongPage" className="flex justify-center">
      <div className="flex flex-col w-screen sm:w-full sm:px-8 max-w-screen-lg">
        <SongInfo
          song={dummySongs[0]}
          image={'https://img.youtube.com/vi/SK6Sm2Ki9tI/hqdefault.jpg'}
        />
        <TopCombination combinations={dummyCombinations} covers={dummyCovers} />
        <MakeCombination />
      </div>
    </div>
  );
}
