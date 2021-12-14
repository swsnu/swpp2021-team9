import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import ResultLine from '.';
import { dummySongs } from 'api/dummy';

test('should render', () => {
  render(
    <table>
      <tbody>
        <ResultLine song={dummySongs[0]} onLineClicked={() => {}} />
      </tbody>
    </table>,
  );
  expect(screen.getByTestId('ResultLine')).toBeTruthy();
});
