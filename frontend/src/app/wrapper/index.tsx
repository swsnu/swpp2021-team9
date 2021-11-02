import * as React from 'react';
import Header from './Header';
import PlayerBar from './PlayerBar';
import { useDispatch } from 'react-redux';

interface Props {
  children?: React.ReactChild | React.ReactChild[];
}

export default function Wrapper(props: Props) {
  return (
    <div data-testid="Wrapper">
      wrapper
      <Header />
      {props.children}
      <PlayerBar />
    </div>
  );
}
