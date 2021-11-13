import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Album from '.';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import AlbumImage from '../Album/AlbumImage.png';

test('should render', () => {
  //const set = setup();
  render(
    <Album
      id={0}
      thumbnail={AlbumImage}
      title="Album1"
      singer="Singer1"
      onClickTitle={() => {}}
      onClickPlay={() => {}}
    />,
  );
  expect(screen.getAllByTestId('Album')).toBeTruthy();
});
