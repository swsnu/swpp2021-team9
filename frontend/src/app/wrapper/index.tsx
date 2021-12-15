import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import Header from './Header';
import PlayerBar from './PlayerBar';
import { selectWrapper } from './slice/selectors';
import { useWrapperSlice, wrapperActions } from './slice';
import * as apiActions from 'api/actions';
import * as url from 'utils/urls';
import Player from 'app/helper/Player';

interface Props {
  children?: React.ReactChild | React.ReactChild[];
}

export default function Wrapper(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useWrapperSlice();
  const history = useHistory();
  const dispatch = useDispatch();
  const wrapperState = useSelector(selectWrapper);

  const user = wrapperState.user;
  const currentTrack = wrapperState.currentTrack;

  const player = React.useMemo(() => Player.getInstance(), []);

  useEffect(() => {
    player.pause();
  }, [player]);

  const onLogoClicked = useCallback(() => {
    history.push(url.Main());
  }, [history]);

  const onSearchClicked = useCallback(
    (key: string) => {
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

  const setTrack = useCallback(
    (track: TrackInfo) => {
      dispatch(wrapperActions.setCurrentPlaying(track));
    },
    [dispatch],
  );

  const onLikeClicked = useCallback(
    (track: TrackInfo) => {
      if (track.id) {
        console.log('track', track.id);
        dispatch(
          apiActions.editCombinationLike.request({
            combinationId: track.id,
            isLiked: !track.like,
          }),
        );
      }

      const newTrack = { ...track, like: !track.like };
      setTrack(newTrack);
    },
    [dispatch, setTrack],
  );

  return (
    <div data-testid="Wrapper" className="relative w-full h-full">
      <Header
        user={user}
        onSearchClicked={onSearchClicked}
        onSignInClicked={onSignInClicked}
        onSignUpClicked={onSignUpClicked}
        onSignOutClicked={onSignOutClicked}
        onProfileClicked={onProfileClicked}
        onLogoClicked={onLogoClicked}
      />
      <div className="relative pt-16 pb-16 h-full overflow-y-auto">
        {props.children}
      </div>
      <PlayerBar
        track={currentTrack}
        setTrack={setTrack}
        onLikeClicked={onLikeClicked}
      />
    </div>
  );
}
