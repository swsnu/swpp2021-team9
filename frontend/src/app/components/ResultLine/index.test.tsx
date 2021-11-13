import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import ResultLine from '.';

test('should render', () => {
  render(
    <table>
      <tbody>
        <ResultLine
          title="Mock_Title"
          singer="Mock_Author"
          view={100}
          likes={1000}
          onLineClicked={() => {}}
          onPlayClicked={() => {}}
        />
      </tbody>
    </table>,
  );
  expect(screen.getByTestId('ResultLine')).toBeTruthy();
});
