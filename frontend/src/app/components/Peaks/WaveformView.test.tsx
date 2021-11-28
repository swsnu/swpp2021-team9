import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { WaveformView } from '.';
import Peaks from 'peaks.js';
import { shallow, mount } from 'enzyme';

import { createSegmentMarker, createSegmentLabel } from '.';
let events = {};
let mockContent = {
  on: jest.fn((event, callback) => {
    events[event] = callback;
    return callback('test');
  }),
  destroy: jest.fn(() => {}),
  setSource: jest.fn((options, cb) => {
    cb(null, 'Peaks');
  }),
  player: { getCurrentTime: jest.fn() },
  segments: {
    _segmentIdCounter: 2,
    add: jest.fn((startTime, endTime, labelText, editable) => {}),
    getSegments: jest.fn(() => {
      'TEST_SEGMENT';
    }),
  },
  zoom: { zoomIn: jest.fn(() => {}), zoomOut: jest.fn(() => {}) },
};

jest.mock('peaks.js', () => {
  const originalModule = jest.requireActual('peaks.js');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      init: (_options: any, callback) => {
        // return new Promise((resolve, reject) => {
        //   resolve(mockContent);
        // });
        const err = null;
        return callback(err, mockContent);
      },
    },
  };
});

const getWaveformView = (
  id,
  setSeg,
  url = 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3',
) => {
  return (
    <WaveformView
      selectedSegmentId={id}
      audioUrl={url}
      audioContentType={'audio/mpeg'}
      setSegments={setSeg}
    />
  );
};

describe('<WaveformView />', () => {
  let mockSetSegments;
  let segmentId = 'peaks.segment.0';
  beforeEach(() => {
    jest.clearAllMocks();
    window.AudioContext = jest.fn();
    mockSetSegments = jest.fn();
  });

  it('should render', () => {
    WaveformView.getPeaks();
    render(getWaveformView(segmentId, mockSetSegments));
    expect(screen.getByTestId('WaveformView')).toBeTruthy();
  });

  it('componentDidUpdate return when url does not changed', () => {
    const { rerender } = render(getWaveformView(segmentId, mockSetSegments));
    rerender(getWaveformView('peaks.segment.1', mockSetSegments));
  });

  it('componentDidUpdate test when url is changed', () => {
    const { rerender, unmount } = render(
      getWaveformView(segmentId, mockSetSegments),
    );
    rerender(
      getWaveformView(
        'peaks.segment.1',
        mockSetSegments,
        'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_2MG.mp3',
      ),
    );

    WaveformView.getPeaks();
    rerender(
      getWaveformView(
        'peaks.segment.3',
        mockSetSegments,
        'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3',
      ),
    );
    unmount();
  });

  it('should zoom in, zoom out, add segment method work', function () {
    render(getWaveformView(segmentId, mockSetSegments));
    const zoomIn = screen.getByTestId('ZoomIn');
    fireEvent.click(zoomIn);
    const zoomOut = screen.getByTestId('ZoomOut');
    fireEvent.click(zoomOut);
    const addSegment = screen.getByTestId('AddSegment');
    fireEvent.click(addSegment);
  });
});
