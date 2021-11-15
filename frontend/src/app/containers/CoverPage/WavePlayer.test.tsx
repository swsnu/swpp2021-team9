import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import WavePlayer from './WavePlayer';
import { act } from 'react-dom/test-utils';

let mockContent = {
  on: jest.fn((state: string, callback: Function) => {}),
  play: jest.fn(() => {}),
  load: jest.fn((url: string) => {}),
  destroy: jest.fn(() => {}),
  setVolume: jest.fn((volume: number) => {}),
  playPause: jest.fn(() => {}),
};
jest.mock('wavesurfer.js', () => {
  const originalModule = jest.requireActual('wavesurfer.js');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      create: (_options: any) => {
        return mockContent;
      },
    },
  };
});

describe('<WavePlayer />', () => {
  test('should render', () => {
    const { container } = render(<WavePlayer url="URL" />);
    expect(container.querySelector('#waveform')).toBeTruthy();
  });

  test('should buttons', () => {
    const { container, queryByTestId } = render(<WavePlayer url="URL" />);
    expect(container.querySelector('#waveform')).toBeTruthy();

    const playButton = queryByTestId('playButton');
    expect(playButton).toBeTruthy();
    fireEvent.click(playButton!);
    fireEvent.click(playButton!);

    expect(mockContent.playPause).toBeCalledTimes(2);
  });

  test('should controll volume', () => {
    const { container } = render(<WavePlayer url="URL" />);
    expect(container.querySelector('#waveform')).toBeTruthy();

    const volumeController = container.querySelector('#volume');
    expect(volumeController).toBeTruthy();

    fireEvent.change(volumeController!, { target: { value: 0.4 } });
    expect(mockContent.setVolume).lastCalledWith(0.4);

    fireEvent.change(volumeController!, { target: { value: 0 } });
    expect(mockContent.setVolume).lastCalledWith(0.01);
  });
});
