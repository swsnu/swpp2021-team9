import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Segment from './Segment';
describe('<Segment />', () => {
  it('should render', () => {
    render(
      <Segment
        id={'1'}
        startTime={1}
        endTime={2}
        labelText={'test'}
        setSelectedId={jest.fn()}
        setIsPlaySegmentClicked={jest.fn()}
      />,
    );
    expect(screen.getByTestId('Segment')).toBeTruthy();
  });
});
