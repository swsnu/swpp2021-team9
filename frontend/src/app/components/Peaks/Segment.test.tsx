import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Segment from './Segment';
describe('<Segment />', () => {
  let mockHandleMergeList, mockOnPlayeSegment, mockOnDeleteSegment;
  let mockIsMergedClicked = false;
  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleMergeList = jest.fn();
    mockOnPlayeSegment = jest.fn();
    mockOnDeleteSegment = jest.fn();
  });
  it('should render', () => {
    render(
      <Segment
        id={'1'}
        startTime={1}
        endTime={2}
        labelText={'test'}
        isMergeClicked={mockIsMergedClicked}
        handleMergeList={mockHandleMergeList}
        onPlaySegment={mockOnPlayeSegment}
        onDeleteSegment={mockOnDeleteSegment}
      />,
    );
    expect(screen.getByTestId('Segment')).toBeTruthy();
  });
  it('checkbox work', () => {
    const { rerender } = render(
      <Segment
        id={'1'}
        startTime={1}
        endTime={2}
        labelText={'test'}
        isMergeClicked={mockIsMergedClicked}
        handleMergeList={mockHandleMergeList}
        onPlaySegment={mockOnPlayeSegment}
        onDeleteSegment={mockOnDeleteSegment}
      />,
    );
    const checkBox = screen.getByTestId('MergeCheckBox');
    fireEvent.click(checkBox);
    mockIsMergedClicked = true;
    expect(mockHandleMergeList).toHaveBeenCalledTimes(1);
    rerender(
      <Segment
        id={'1'}
        startTime={1}
        endTime={2}
        labelText={'test'}
        isMergeClicked={mockIsMergedClicked}
        handleMergeList={mockHandleMergeList}
        onPlaySegment={mockOnPlayeSegment}
        onDeleteSegment={mockOnDeleteSegment}
      />,
    );
  });

  it('Play Segement Click', () => {
    render(
      <Segment
        id={'1'}
        startTime={1}
        endTime={2}
        labelText={'test'}
        isMergeClicked={mockIsMergedClicked}
        handleMergeList={mockHandleMergeList}
        onPlaySegment={mockOnPlayeSegment}
        onDeleteSegment={mockOnDeleteSegment}
      />,
    );
    const playButton = screen.getByTestId('PlayButton');
    const deleteButton = screen.getByTestId('DeleteButton');
    fireEvent.click(playButton);
    fireEvent.click(deleteButton);
    expect(mockOnPlayeSegment).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteSegment).toHaveBeenCalledTimes(1);
  });
});
