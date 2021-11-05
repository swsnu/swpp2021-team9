import * as React from 'react';
import Header from './Header';
import PlayerBar from './PlayerBar';
import { useDispatch, useSelector } from 'react-redux';

import './Wrapper.css';
import { selectWrapper } from './slice/selectors';
import { useWrapperSlice } from './slice';

interface Props {
  children?: React.ReactChild | React.ReactChild[];
}

export default function Wrapper(props: Props) {
  const { actions, reducer } = useWrapperSlice();
  const wrapperState = useSelector(selectWrapper);

  const user = wrapperState.user;
  const playInfo = wrapperState.currentPlaying;

  return (
    <div className="Wrapper" data-testid="Wrapper">
      <Header user={user} />
      <div className="Content">{props.children}</div>
      <PlayerBar playInfo={playInfo} />
    </div>
  );
}
