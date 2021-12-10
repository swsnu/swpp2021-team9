import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import * as ReactMediaRecorder from 'react-media-recorder';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import CreateCoverRecordPage from './step1';
import * as url from 'utils/urls';
import AudioEditor from 'app/helper/AudioEditor';
import userEvent from '@testing-library/user-event';
import { Segment } from 'peaks.js';
import { WaveformView } from 'app/components/Peaks';
const store = configureAppStore();

jest.mock('../../components/CreateCover/YoutubePlayer', () => () => (
  <div>YoutubePlayer</div>
));
const spySelectMakeCombi = jest.spyOn(
  require('app/containers/SongPage/slice/selectors'),
  'selectMakeCombinationSlice',
);

const stubSegments: Segment[] = [
  {
    id: 'peaks.segment.0',
    startTime: 1,
    endTime: 6,
    labelText: `TEST_LABEL_0`,
    update: jest.fn(),
  },
  {
    id: 'peaks.segment.1',
    startTime: 1,
    endTime: 6,
    labelText: `TEST_LABEL_1`,
    update: jest.fn(),
  },
  {
    id: 'peaks.segment.2',
    startTime: 1,
    endTime: 6,
    labelText: `TEST_LABEL_2`,
    update: jest.fn(),
  },
];

let events = {};
let mockContent = {
  on: jest.fn((event, callback) => {
    events[event] = callback;
    return callback('test');
  }),
  destroy: jest.fn(() => {}),
  setSource: jest.fn((options, cb) => {
    // return cb(null, 'Peaks');
    return cb(null, mockContent);
  }),
  player: { getCurrentTime: jest.fn(), playSegment: jest.fn() },
  segments: {
    _segmentIdCounter: 2,
    _segments: stubSegments,
    add: jest.fn((startTime, endTime, labelText, editable) => {}),
    getSegments: () => stubSegments,
    removeById: jest.fn(),
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
        const err = null;
        return callback(err, mockContent);
      },
    },
  };
});

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));

let editor = AudioEditor.getInstance();

function setup() {
  const path = '/';
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path={url.CreateCover(':id', 'record')}
            component={CreateCoverRecordPage}
          />
          <Redirect exact from={path} to={url.CreateCover(1, 'record')} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return page;
}

describe('<CreateCoverRecord>', () => {
  let mockUseReactMedia, page;
  beforeEach(() => {
    page = setup();
    window.AudioContext = jest.fn();
    window.alert = jest.fn();
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
          if (onStop) onStop('BLOB_URL', new Blob());
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
    spySelectMakeCombi.mockImplementation(() => {
      return {
        song: {
          id: 1,
          title: 'Outta Time',
          singer: '브라이슨 틸러',
          category: 'Hip-Hop',
          reference: 'https://www.youtube.com/watch?v=FtaW6YMAafk',
          description: 'Good Music',
        },
      };
    });
    editor.readAndDecode = jest
      .fn()
      .mockImplementation((audioFile, isReturn = false) => {
        if (isReturn) {
          return 'BlobURL';
        }
      });
    editor.mergeAudio = jest.fn().mockImplementation(() => {
      return new File([new ArrayBuffer(123)], 'audio.mp3', {
        type: 'audio/mpeg',
      });
    });
    URL.createObjectURL = jest.fn().mockReturnValue('URL');
  });
  it('should render', () => {
    render(page);

    expect(screen.getByTestId('CreateCoverRecordPage')).toBeTruthy();
  });

  it('should Record button work properly', async () => {
    render(page);
    const recEnableBtn = screen.getByTestId('rec-enable-btn');
    fireEvent.click(recEnableBtn);
    const recBtn = screen.getByTestId('rec-btn');
    // start rec
    fireEvent.click(recBtn);
    // stop rec
    await waitFor(() => {
      fireEvent.click(recBtn);
    });
  });

  it('should Cancel button work properly ', async () => {
    render(page);
    const cancleBtn = screen.getByTestId('cancel-btn');
    fireEvent.click(cancleBtn);
    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledTimes(1);
    });
  });

  it('should next button work', async () => {
    const { getByTestId } = render(page);
    const recEnableBtn = getByTestId('rec-enable-btn');
    fireEvent.click(recEnableBtn);
    const recBtn = getByTestId('rec-btn');
    // start rec
    fireEvent.click(recBtn);
    // stop rec
    await waitFor(() => {
      fireEvent.click(recBtn);
    });

    const nextBtn = screen.getByTestId('NextBtn');
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledTimes(1);
    });
  });

  it('when mediaBlobUrl is null', async () => {
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
    const recBtn = screen.getByTestId('rec-btn');
    // start rec
    fireEvent.click(recBtn);
    // stop rec
    await waitFor(() => {
      fireEvent.click(recBtn);
    });
  });

  it('should upload feature work', async () => {
    const file = new File([new ArrayBuffer(123)], 'audio.mp3', {
      type: 'audio/mpeg',
    });
    const fileWav = new File([new ArrayBuffer(123)], 'audio.wav', {
      type: 'audio/wav',
    });
    const { getByTestId } = render(page);
    const uploadBtn = screen.getByTestId('upload-btn');
    fireEvent.click(uploadBtn);
    const uploadInput = getByTestId('upload-input');
    await waitFor(() => userEvent.upload(uploadInput, file));
    await waitFor(() => userEvent.upload(uploadInput, fileWav));

    const nextBtn = screen.getByTestId('NextBtn');

    await waitFor(() => fireEvent.click(nextBtn));

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledTimes(1);
    });
  });

  it('make Segment Test', async () => {
    const { getByTestId, getAllByTestId } = render(page);
    const recEnableBtn = getByTestId('rec-enable-btn');
    fireEvent.click(recEnableBtn);
    const recBtn = getByTestId('rec-btn');
    // start rec
    fireEvent.click(recBtn);
    // stop rec
    await waitFor(() => {
      fireEvent.click(recBtn);
    });

    const addSegment = getByTestId('AddSegment');
    fireEvent.click(addSegment);
    fireEvent.click(addSegment);
    fireEvent.click(addSegment);

    const mergeCheckBoxes = getAllByTestId('MergeCheckBox');
    const playBtns = getAllByTestId('PlayButton');
    const delBtns = getAllByTestId('DeleteButton');
    const mergeBtn = getByTestId('MergeBtn');

    fireEvent.click(playBtns[0]);
    jest.spyOn(WaveformView, 'getPeaks').mockReturnValueOnce(null);
    fireEvent.click(playBtns[0]);

    fireEvent.click(mergeBtn);

    fireEvent.click(mergeCheckBoxes[2]);
    fireEvent.click(mergeCheckBoxes[1]);
    fireEvent.click(mergeCheckBoxes[0]);

    fireEvent.click(mergeCheckBoxes[2]);
    fireEvent.click(mergeCheckBoxes[1]);

    await waitFor(() => {
      fireEvent.click(mergeBtn);
    });

    fireEvent.click(mergeCheckBoxes[0]);
    fireEvent.click(mergeCheckBoxes[1]);
    fireEvent.click(mergeCheckBoxes[2]);

    fireEvent.click(mergeCheckBoxes[2]);
    fireEvent.click(mergeCheckBoxes[1]);

    fireEvent.click(delBtns[2]);
    jest.spyOn(WaveformView, 'getPeaks').mockReturnValueOnce(null);
    fireEvent.click(delBtns[1]);

    const useMergedBtn = getByTestId('UseMerged');
    const nextBtn = getByTestId('NextBtn');
    await waitFor(() => {
      fireEvent.click(useMergedBtn);
    });
    await waitFor(() => {
      fireEvent.click(nextBtn);
    });

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledTimes(1);
    });
  });
  it('makeCombiState is undefined', () => {
    spySelectMakeCombi.mockResolvedValueOnce({});
    render(page);
  });
});
