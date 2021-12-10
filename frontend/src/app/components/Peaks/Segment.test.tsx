import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Segment from './Segment';
describe('<Segment />', () => {
  let mockOnClickPlay, mockOnClickDelete, mockHandleMergeList;
  let mockIsMergedClicked = false;
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnClickPlay = jest.fn();
    mockOnClickDelete = jest.fn();
    mockHandleMergeList = jest.fn();
  });
  it('should render', () => {
    render(
      <Segment
        id={'1'}
        startTime={1}
        endTime={2}
        labelText={'test'}
        isMergeClicked={mockIsMergedClicked}
        onClickPlaySegment={mockOnClickPlay}
        onClickDelete={mockOnClickDelete}
        handleMergeList={mockHandleMergeList}
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
        onClickPlaySegment={mockOnClickPlay}
        onClickDelete={mockOnClickDelete}
        handleMergeList={mockHandleMergeList}
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
        onClickPlaySegment={mockOnClickPlay}
        onClickDelete={mockOnClickDelete}
        handleMergeList={mockHandleMergeList}
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
        onClickPlaySegment={mockOnClickPlay}
        onClickDelete={mockOnClickDelete}
        handleMergeList={mockHandleMergeList}
      />,
    );
    const playButton = screen.getByTestId('PlayButton');
    const deleteButton = screen.getByTestId('DeleteButton');
    fireEvent.click(playButton);
    fireEvent.click(deleteButton);
    expect(mockOnClickPlay).toHaveBeenCalledTimes(1);
    expect(mockOnClickDelete).toHaveBeenCalledTimes(1);
  });
});
