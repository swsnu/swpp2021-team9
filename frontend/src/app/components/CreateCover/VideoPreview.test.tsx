import * as React from 'react';

import { render, screen } from '@testing-library/react';
import VideoPreview from './VideoPreview';

describe('<VideoPreview />', () => {
  let mockMediaStream;
  beforeEach(async () => {
    const mockGetUserMedia = jest.fn(async () => {
      return new Promise<void>(resolve => {
        resolve();
      });
    });

    Object.defineProperty(global.navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: mockGetUserMedia,
      },
    });
    let constraints = { audio: true, video: { width: 1280, height: 720 } };

    mockMediaStream = navigator.mediaDevices.getUserMedia(constraints);
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render properly when stream is null', () => {
    render(<VideoPreview className="" stream={null} />);
    // when you find non-existing element, use queryByTestId
    const videoPreview = screen.queryByTestId('video-preview');
    expect(videoPreview).toBeFalsy();
  });

  it('should render properly when stream is not null', () => {
    render(<VideoPreview className="" stream={mockMediaStream} />);
    const videoPreview = screen.getByTestId('video-preview');
    expect(videoPreview).toBeTruthy();
  });
});
