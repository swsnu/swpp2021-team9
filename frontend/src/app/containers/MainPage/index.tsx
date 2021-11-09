import React, { Component, useState } from 'react';
import { useHistory } from 'react-router';
import { useMainSlice } from './slice';
import { useDispatch } from 'react-redux';
import Album from '../../components/Album/index';

export type Props = {};
export default function MainPage(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useMainSlice();

  //return <div data-testid="MainPage">Main</div>;
  return (
    <div data-testid="MainPage" className="flex flex-col items-center">
      <Album title="Album1" singer="Singer1" />
      <Album title="Album2" singer="Singer2" />
      <Album title="Album3" singer="Singer3" />
      <Album title="Album4" singer="Singer4" />
    </div>
  );
}
