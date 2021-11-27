import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { WaveformView } from '.';
import Peaks from 'peaks.js';
import {
  AudioBuffer,
  AudioContext,
  registrar,
} from 'standardized-audio-context-mock';

let mockContent = {
  logger: jest.fn(),
  peaks: 'TEST_PEAK',
};

jest.mock('peaks.js', () => {
  const originalModule = jest.requireActual('peaks.js');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      init: (_options: any) => {
        return mockContent;
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
    window.AudioContext = jest.fn();
    jest.clearAllMocks();
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
    const { rerender } = render(getWaveformView(segmentId, mockSetSegments));
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
    console.log(screen);
  });
});
