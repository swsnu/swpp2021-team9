import * as React from 'react';
import { useCallback } from 'react';
import Header from './Header';
import PlayerBar from './PlayerBar';
import { useSelector } from 'react-redux';

import './Wrapper.css';
import { selectWrapper } from './slice/selectors';
import { useWrapperSlice } from './slice';

interface Props {
  children?: React.ReactChild | React.ReactChild[];
}

export default function Wrapper(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { actions, reducer } = useWrapperSlice();
  const wrapperState = useSelector(selectWrapper);

  const user = wrapperState.user;
  const playInfo = wrapperState.currentPlaying;

  const onSearchClicked = useCallback((key: string) => {
    console.log('onSearchClicked', key);
  }, []);

  const onSignInClicked = useCallback(() => {
    console.log('onSignInClicked');
  }, []);

  const onSignUpClicked = useCallback(() => {
    console.log('onSignUpClicked');
  }, []);

  const onSignOutClicked = useCallback(() => {
    console.log('onSignOutClicked');
  }, []);

  const onProfileClicked = useCallback(() => {
    console.log('onProfileClicked');
  }, []);

  return (
    <div className="Wrapper" data-testid="Wrapper">
      <Header
        user={user}
        onSearchClicked={onSearchClicked}
        onSignInClicked={onSignInClicked}
        onSignUpClicked={onSignUpClicked}
        onSignOutClicked={onSignOutClicked}
        onProfileClicked={onProfileClicked}
      />
      <div className="Content">{props.children}</div>
      <PlayerBar playInfo={playInfo} />
    </div>
  );
}
