import React, { Component, useState } from 'react';
import { useHistory } from 'react-router';
import { useMainSlice } from './slice';
import { useDispatch } from 'react-redux';
import Album from '../../components/Album/index';
import { dummyAlbums } from './dummy';

export type Props = {};
export default function MainPage(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useMainSlice();

  return (
    <div
      data-testid="MainPage"
      className="flex flex-row items-center overflow-hidden"
    >
      <Album
        id={dummyAlbums[0].id}
        title={dummyAlbums[0].title}
        singer={dummyAlbums[0].singer}
        thumbnail={dummyAlbums[0].thumbnail}
      />
      <Album
        id={dummyAlbums[1].id}
        title={dummyAlbums[1].title}
        singer={dummyAlbums[1].singer}
        thumbnail={dummyAlbums[1].thumbnail}
      />
      <Album
        id={dummyAlbums[2].id}
        title={dummyAlbums[2].title}
        singer={dummyAlbums[2].singer}
        thumbnail={dummyAlbums[2].thumbnail}
      />
      <Album
        id={dummyAlbums[3].id}
        title={dummyAlbums[3].title}
        singer={dummyAlbums[3].singer}
        thumbnail={dummyAlbums[3].thumbnail}
      />
      <Album
        id={dummyAlbums[4].id}
        title={dummyAlbums[4].title}
        singer={dummyAlbums[4].singer}
        thumbnail={dummyAlbums[4].thumbnail}
      />
      <Album
        id={dummyAlbums[5].id}
        title={dummyAlbums[5].title}
        singer={dummyAlbums[5].singer}
        thumbnail={dummyAlbums[5].thumbnail}
      />

      <div className="flex">
        <p></p>
      </div>
    </div>
  );
}
