import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import * as ReactMediaRecorder from 'react-media-recorder';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import CreateCoverRecordPage from './step1';

const store = configureAppStore();

jest.mock('../../components/CreateCover/YoutubePlayer', () => () => (
  <div>YoutubePlayer</div>
));

jest.mock('../../components/Peaks/WaveformView', () => () => (
  <div>WavefromView</div>
));

function setup() {
  const path = '/';
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={path} render={() => <CreateCoverRecordPage />} />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return page;
}

describe('<CreateCoverRecordPage>', () => {
  let mockUseReactMedia, page;
  beforeEach(() => {
    page = setup();
    mockUseReactMedia = jest
      .spyOn(ReactMediaRecorder, 'useReactMediaRecorder')
      .mockImplementation(
        ({
          audio,
          video,
          onStop,
          blobPropertyBag,
          screen,
          mediaRecorderOptions,
          askPermissionOnMount,
        }) => {
          return {
            status: 'idle',
            error: '',
            mediaBlobUrl: 'asdsad',
            isAudioMuted: false,
            previewStream: null,
            previewAudioStream: null,
            clearBlobUrl: jest.fn(),
            muteAudio: jest.fn(),
            unMuteAudio: jest.fn(),
            startRecording: jest.fn(),
            pauseRecording: jest.fn(),
            stopRecording: jest.fn(),
            resumeRecording: jest.fn(),
          };
        },
      );
  });
  it('should render', () => {
    render(page);
    expect(screen.getByTestId('CreateCoverRecordPage')).toBeTruthy();
  });

  it('should handleVideoStatus button work', () => {
    render(page);
    const recEnableBtn = screen.getByTestId('rec-enable-btn');
    fireEvent.click(recEnableBtn);
    const handleVidBtn = screen.getByTestId('handle-video');
    fireEvent.click(handleVidBtn);
  });

  it('should Record button work properly', () => {
    render(page);
    const recEnableBtn = screen.getByTestId('rec-enable-btn');
    fireEvent.click(recEnableBtn);
    const recBtn = screen.getByTestId('rec-btn');
    // start rec
    fireEvent.click(recBtn);
    // stop rec
    fireEvent.click(recBtn);
  });

  it('should Cancel button work properly ', () => {
    render(page);
    const cancleBtn = screen.getByTestId('cancel-btn');
    fireEvent.click(cancleBtn);
  });

  it('should next button work', () => {
    render(page);
    const recEnableBtn = screen.getByTestId('rec-enable-btn');
    fireEvent.click(recEnableBtn);
    const recBtn = screen.getByTestId('rec-btn');
    // start rec
    fireEvent.click(recBtn);
    // stop rec
    fireEvent.click(recBtn);

    const nextBtn = screen.getByTestId('next-btn');
    fireEvent.click(nextBtn);
  });

  it('should upload btn work', () => {
    render(page);
    const uploadBtn = screen.getByTestId('upload-btn');
    fireEvent.click(uploadBtn);
  });

  it('when mediaBlobUrl is null', () => {
    mockUseReactMedia = jest
      .spyOn(ReactMediaRecorder, 'useReactMediaRecorder')
      .mockImplementation(
        ({
          audio,
          video,
          onStop,
          blobPropertyBag,
          screen,
          mediaRecorderOptions,
          askPermissionOnMount,
        }) => {
          return {
            status: 'idle',
            error: '',
            mediaBlobUrl: null,
            isAudioMuted: false,
            previewStream: null,
            previewAudioStream: null,
            clearBlobUrl: jest.fn(),
            muteAudio: jest.fn(),
            unMuteAudio: jest.fn(),
            startRecording: jest.fn(),
            pauseRecording: jest.fn(),
            stopRecording: jest.fn(),
            resumeRecording: jest.fn(),
          };
        },
      );
    render(page);
    const recEnableBtn = screen.getByTestId('rec-enable-btn');
    fireEvent.click(recEnableBtn);
    const handleVidBtn = screen.getByTestId('handle-video');
    fireEvent.click(handleVidBtn);
    const recBtn = screen.getByTestId('rec-btn');
    // start rec
    fireEvent.click(recBtn);
    // stop rec
    fireEvent.click(recBtn);
  });
});
