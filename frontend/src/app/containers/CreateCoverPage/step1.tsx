import React, {
  useState,
  useMemo,
  ChangeEventHandler,
  useEffect,
  useCallback,
} from 'react';
import YoutubePlayer from 'app/components/CreateCover/YoutubePlayer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faMicrophoneAlt,
  faCircle,
  faStopCircle,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import { Song, CreateCover } from 'utils/urls';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateCoverSlice } from './slice';
import { SegmentComponent, WaveformView } from 'app/components/Peaks';
import { Segment } from 'peaks.js';
import AudioEditor from 'app/helper/AudioEditor';
import MergedAudio from 'app/components/CreateCover/MergedAudio';
import { selectCreateCover } from './slice/selectors';
import { selectMakeCombinationSlice } from '../SongPage/slice/selectors';
interface MatchParams {
  id?: string;
}
export interface Props extends RouteComponentProps<MatchParams> {}

export default function CreateCoverRecord(props: Props) {
  const [useMergedAudio, setUseMergedAudio] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [mergeList, setMergeList] = useState<string[]>([]);
  const [isMergeClicked, setIsMergeClicked] = useState<boolean>(false);

  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [refUrl, setRefUrl] = useState<string>('');
  const songId = props.match.params.id;

  const editor = useMemo(() => AudioEditor.getInstance(), []);
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions: createCoverActions } = useCreateCoverSlice();
  const makeCombiState = useSelector(selectMakeCombinationSlice);
  const createCoverState = useSelector(selectCreateCover);
  const makeCombiStateSong = makeCombiState.song;

  useEffect(() => {
    if (makeCombiStateSong) {
      setRefUrl(makeCombiStateSong.reference);
    }
    if (createCoverState.audioURL) {
      setUploadedUrl(createCoverState.audioURL);
    }
  }, [createCoverState.audioURL, makeCombiStateSong]);

  useEffect(() => {
    return () => {
      setSegments([]);
      setMergeList([]);
    };
  }, [isUploading, isRecordingEnabled]);

  const onPlaySegment = useCallback(
    (id: string) => {
      if (id && id.length > 0) {
        const peaks = WaveformView.getPeaks();
        if (!peaks) {
          return window.alert('peaks가 없습니다.');
        }
        peaks.player.playSegment(peaks.segments.getSegment(id));
      }
    },
    [segments],
  );

  const onDeleteSegment = useCallback(async (id: string) => {
    if (id && id.length > 0) {
      const peaks = WaveformView.getPeaks();
      if (!peaks) {
        return window.alert('peaks가 없습니다.');
      }

      await peaks.segments.removeById(id);
      const segs = await peaks.segments.getSegments();

      setSegments([...segs]);
    }
  }, []);

  const getBlobFromRecorder = useCallback(
    async (blobUrl, blob) => {
      console.log('url: ', blobUrl);
      console.log('bolb: ', blob);
      let fileFromBlob = new File(
        [blob],
        new Date().toISOString() + '_recording.wav',
        {
          type: 'audio/wav',
        },
      );
      const bUrl: any = await editor.readAndDecode(fileFromBlob, true);
      console.log(bUrl);
      setRecordedUrl(bUrl);
    },
    [editor],
  );

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      onStop: getBlobFromRecorder,
      audio: true,
    });

  const handleMergeList = (id: string, isMerge: boolean) => {
    if (isMerge) {
      if (!mergeList.includes(id)) {
        setMergeList([...mergeList, id]);
      }
    } else {
      if (mergeList.includes(id)) {
        const _mergeList = mergeList.filter(mL => mL !== id);
        setMergeList(_mergeList);
      }
    }
  };

  const onRecordClicked = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsRecording(!isRecording);
  };

  const onCancelClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    history.push(Song(songId!));
  };

  const onNextClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (useMergedAudio) {
      dispatch(createCoverActions.setAudioURL(mergedUrl));
    } else if (uploadedUrl) {
      dispatch(createCoverActions.setAudioURL(uploadedUrl));
    } else {
      dispatch(createCoverActions.setAudioURL(recordedUrl));
    }
    history.push(CreateCover(songId, 'info'));
  };

  const onChangeUpload: ChangeEventHandler<HTMLInputElement> = async (
    e: any,
  ) => {
    let file = e.target.files[0];
    if (file.type === 'audio/wav') {
      const url = await editor.readAndDecode(file, true);
      setUploadedUrl(url);
    } else if (file.type === 'audio/mpeg') {
      const upload = URL.createObjectURL(file);
      setUploadedUrl(upload);
      editor.readAndDecode(file);
    }
  };

  const mergeSegments = async () => {
    setIsMergeClicked(true);
    setUseMergedAudio(false);
    let sortedTargetSegments;
    if (mergeList.length === 0) {
      return;
    }
    const targetSegments = mergeList.map(id => {
      return segments.filter(seg => seg.id === id)[0];
    });
    sortedTargetSegments = targetSegments.sort(
      (a, b) => Number(a.id?.split('.')[2]) - Number(b.id?.split('.')[2]),
    );
    const mp3Blob: any = await editor.mergeAudio(sortedTargetSegments);

    setMergeList([]);
    setMergedUrl(URL.createObjectURL(mp3Blob));
    setIsMergeClicked(false);
  };

  const renderSegments = () => {
    if (segments.length === 0) {
      return;
    }
    return (
      <React.Fragment>
        <table>
          <thead>
            <tr>
              <th>Merge</th>
              <th>ID</th>
              <th>Start time</th>
              <th>End time</th>
              <th>Label text</th>
              <th>Play</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderSegmentRows(segments)}</tbody>
        </table>
        <button
          data-testid="MergeBtn"
          className="my-3 px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
          type="button"
          onClick={e => mergeSegments()}
        >
          Merge
        </button>
      </React.Fragment>
    );
  };

  const renderSegmentRows = (segments: Segment[]) => {
    return segments.map(segment => (
      <SegmentComponent
        id={segment.id!}
        key={segment.id}
        startTime={segment.startTime}
        endTime={segment.endTime}
        labelText={segment.labelText}
        isMergeClicked={isMergeClicked}
        handleMergeList={handleMergeList}
        onPlaySegment={onPlaySegment}
        onDeleteSegment={onDeleteSegment}
      />
    ));
  };

  return (
    <div
      id="step-1"
      data-testid="CreateCoverRecordPage"
      className="flex flex-col items-center"
    >
      {/* 참조할 영상 또는 음원 파일 재생하는 부분 */}
      <YoutubePlayer url={refUrl} />

      {/* 취소, 업로드, 녹음, 다음 페이지 */}
      {isRecordingEnabled ? (
        <div className="flex flex-col justify-center items-center space-y-4">
          <h2 className="p-2">Recording Status: {status}</h2>
          <div className="space-x-3">
            <button
              data-testid="rec-btn"
              className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
              onClick={onRecordClicked}
            >
              {isRecording ? (
                <FontAwesomeIcon icon={faStopCircle} pulse color="red" />
              ) : (
                <FontAwesomeIcon icon={faCircle} color="red" />
              )}
            </button>
          </div>
        </div>
      ) : null}
      <div className="container flex-col justify-center items-center">
        {isRecordingEnabled ? (
          mediaBlobUrl ? (
            <WaveformView
              // selectedSegmentId={selectedSegmentId}
              audioUrl={mediaBlobUrl}
              audioContentType={'audio/mpeg'}
              setSegments={setSegments}
            />
          ) : null
        ) : null}
      </div>
      {isUploading ? (
        <div>
          <label htmlFor="upload-file">.wav, .mp3 업로드</label>
          <input
            data-testid="upload-input"
            id="upload-file"
            type="file"
            accept="audio/wav, audio/mpeg"
            onChange={onChangeUpload}
          />
        </div>
      ) : null}
      <div className="container flex-col justify-center items-center">
        {isUploading ? (
          uploadedUrl ? (
            <WaveformView
              // selectedSegmentId={selectedSegmentId}
              audioUrl={uploadedUrl}
              audioContentType={'audio/mpeg'}
              setSegments={setSegments}
            />
          ) : null
        ) : null}
      </div>
      {renderSegments()}
      {mergedUrl && (isUploading || isRecordingEnabled) ? (
        <div className="justify-center items-center">
          <MergedAudio audioUrl={mergedUrl} />
          <button
            data-testid="UseMerged"
            onClick={() => {
              setUseMergedAudio(prev => !prev);
            }}
            className="my-3 mx-3 px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
          >
            Use MergedAudio
          </button>
          {useMergedAudio ? (
            <FontAwesomeIcon icon={faCheck} color="green" />
          ) : null}
        </div>
      ) : null}
      <div
        data-testid="CreateCoverButtons"
        className="py-6 flex flex-row w-full lg:space-x-96 md:space-x-48 sm:space-x-20 justify-center	"
      >
        <button
          data-testid="cancel-btn"
          type="button"
          onClick={onCancelClicked}
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-red-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
        >
          Cancel
        </button>

        <div className="flex flex-row lg:space-x-40 md:space-x-20 sm:space-x-10">
          <button
            data-testid="upload-btn"
            onClick={() => setIsUploading(!isUploading)}
            className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
          >
            <FontAwesomeIcon
              className="justify-center items-center p-1 font-large rounded-md"
              icon={faUpload}
              spin={isUploading}
              size={'3x'}
            />
          </button>
          <button
            data-testid="rec-enable-btn"
            className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300 "
            onClick={() => setIsRecordingEnabled(!isRecordingEnabled)}
          >
            <FontAwesomeIcon
              className="justify-center items-center font-large rounded-md"
              icon={faMicrophoneAlt}
              size={'3x'}
              spin={isRecordingEnabled}
            />
          </button>
        </div>
        <button
          data-testid="NextBtn"
          type="button"
          onClick={e => onNextClicked(e)}
          disabled={!(mergedUrl || recordedUrl || uploadedUrl)}
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
