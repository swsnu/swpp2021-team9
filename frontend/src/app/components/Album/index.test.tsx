import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Album from '.';

import AlbumImage from '../Album/AlbumImage.png';
import { dummyCombinations } from 'api/dummy';

test('should render', () => {
  //const set = setup();
  render(
    <Album
      combination={dummyCombinations[0]}
      isPlaying={false}
      onClickTitle={() => {}}
      onClickPlay={() => {}}
    />,
  );
  expect(screen.getAllByTestId('Album')).toBeTruthy();
});
