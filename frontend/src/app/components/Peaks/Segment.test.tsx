import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Segment from './Segment';
describe('<Segment />', () => {
  let mockSetSelectedId,
    mockSetIsPlayClicked,
    mockSetIsDeleteClicked,
    mockHandleMergeList;
  let mockIsMergedClicked = false;
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetSelectedId = jest.fn();
    mockSetIsPlayClicked = jest.fn();
    mockSetIsDeleteClicked = jest.fn();
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
        setSelectedId={mockSetSelectedId}
        setIsPlaySegmentClicked={mockSetIsPlayClicked}
        setIsDeleteClicked={mockSetIsDeleteClicked}
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
        setSelectedId={mockSetSelectedId}
        setIsPlaySegmentClicked={mockSetIsPlayClicked}
        setIsDeleteClicked={mockSetIsDeleteClicked}
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
        setSelectedId={mockSetSelectedId}
        setIsPlaySegmentClicked={mockSetIsPlayClicked}
        setIsDeleteClicked={mockSetIsDeleteClicked}
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
        setSelectedId={mockSetSelectedId}
        setIsPlaySegmentClicked={mockSetIsPlayClicked}
        setIsDeleteClicked={mockSetIsDeleteClicked}
        handleMergeList={mockHandleMergeList}
      />,
    );
    const playButton = screen.getByTestId('PlayButton');
    const deleteButton = screen.getByTestId('DeleteButton');
    fireEvent.click(playButton);
    fireEvent.click(deleteButton);
    expect(mockSetSelectedId).toHaveBeenCalledTimes(2);
    expect(mockSetIsPlayClicked).toHaveBeenCalledTimes(1);
    expect(mockSetIsDeleteClicked).toHaveBeenCalledTimes(1);
  });
});
