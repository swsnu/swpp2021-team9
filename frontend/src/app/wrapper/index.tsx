import * as React from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import './Wrapper.css';
import Header from './Header';
import PlayerBar from './PlayerBar';
import { selectWrapper } from './slice/selectors';
import { useWrapperSlice } from './slice';

import * as url from 'utils/urls';

interface Props {
  children?: React.ReactChild | React.ReactChild[];
}

export default function Wrapper(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { actions, reducer } = useWrapperSlice();
  const history = useHistory();
  const wrapperState = useSelector(selectWrapper);

  const user = wrapperState.user;

  const onLogoClicked = useCallback(() => {
    history.push(url.Main());
  }, [history]);

  const onSearchClicked = useCallback(
    (key: string) => {
      history.push({
        pathname: url.SearchResult(),
        search: `?key=${key}`,
      });
      console.log('onSearchClicked', key);
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
    <div className="Wrapper" data-testid="Wrapper">
      <Header
        user={user}
        onSearchClicked={onSearchClicked}
        onSignInClicked={onSignInClicked}
        onSignUpClicked={onSignUpClicked}
        onSignOutClicked={onSignOutClicked}
        onProfileClicked={onProfileClicked}
        onLogoClicked={onLogoClicked}
      />
      <div className="Content">{props.children}</div>
      <PlayerBar />
    </div>
  );
}
