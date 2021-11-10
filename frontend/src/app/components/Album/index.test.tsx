import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Album from '.';
import AlbumImage from '../Album/AlbumImage.png';

test('should render', () => {
  render(
    <Album id={0} thumbnail={AlbumImage} title="Album1" singer="Singer1" />,
  );
  expect(screen.getByTestId('Album')).toBeTruthy();
});
