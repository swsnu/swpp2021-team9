import React from 'react';
import { useHistory } from 'react-router';
import { useMainSlice } from './slice';
import { useDispatch } from 'react-redux';

export type Props = {};
export default function MainPage(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useMainSlice();

  return <div data-testid="MainPage">Main</div>;
}
