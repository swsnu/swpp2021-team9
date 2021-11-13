import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Album from '.';

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
