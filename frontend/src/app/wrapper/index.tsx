import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import Header from './Header';
import PlayerBar from './PlayerBar';
import { selectWrapper } from './slice/selectors';
import { useWrapperSlice } from './slice';

import * as url from 'utils/urls';
import mockPlaylist from 'app/helper/mockPlayList';
import Player from 'app/helper/Player';

interface Props {
  children?: React.ReactChild | React.ReactChild[];
}

export default function Wrapper(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const player = React.useMemo(() => Player.getInstance(), []);
  useWrapperSlice();
  const history = useHistory();
  const wrapperState = useSelector(selectWrapper);

  const user = wrapperState.user;

  useEffect(() => {
    const trackList: TrackInfo[] = [];
    mockPlaylist.forEach(v => {
      trackList.push({
        song: {
          title: v.name,
          singer: v.artist,
          category: 'category',
          reference: 'ref',
          description: 'des',
        },
        sources: [v.source],
        like: false,
      });
    });
    player.setTracks(trackList);
  }, [player]);

  const onLogoClicked = useCallback(() => {
    history.push(url.Main());
  }, [history]);

  const onSearchClicked = useCallback(
    (key: string) => {
      console.log(key);
      if (key === '') return;
      history.push({
        pathname: url.SearchResult(),
        search: `?key=${key}`,
      });
    },
    [history],
  );

  const onSignInClicked = useCallback(() => {
    history.push(url.SignIn());
  }, [history]);

  const onSignUpClicked = useCallback(() => {
    history.push(url.SignUp());
  }, [history]);

  const onSignOutClicked = useCallback(() => {
    console.log('onSignOutClicked');
  }, []);

  const onProfileClicked = useCallback(() => {
    history.push(url.Profile(`${user!.id}`));
  }, [history, user]);

  return (
    <div
      data-testid="Wrapper"
      className="min-w-full min-h-full flex flex-col justify-between"
    >
      <Header
        user={user}
        onSearchClicked={onSearchClicked}
        onSignInClicked={onSignInClicked}
        onSignUpClicked={onSignUpClicked}
        onSignOutClicked={onSignOutClicked}
        onProfileClicked={onProfileClicked}
        onLogoClicked={onLogoClicked}
      />
      <div className="relative self-stretch pt-4 pb-16">{props.children}</div>
      <PlayerBar />
    </div>
  );
}
