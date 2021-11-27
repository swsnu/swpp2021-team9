import React, { useState, useMemo, ChangeEventHandler, useEffect } from 'react';
import YoutubePlayer from 'app/components/CreateCover/YoutubePlayer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faMicrophoneAlt,
  faVideoSlash,
  faVideo,
  faCircle,
  faStopCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useHistory } from 'react-router-dom';
import { Song, CreateCover } from 'utils/urls';
import { useDispatch } from 'react-redux';
import { useCreateCoverSlice } from './slice';
import VideoPreview from 'app/components/CreateCover/VideoPreview';
import { SegmentComponent, WaveformView } from 'app/components/Peaks';
import { Segment } from 'peaks.js';
import AudioEditor from 'app/helper/AudioEditor';
import MergedAudio from 'app/components/CreateCover/MergedAudio';
export interface Props {}

export default function CreateCoverRecord(props: Props) {
  const editor = useMemo(() => AudioEditor.getInstance(), []);
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useCreateCoverSlice();
  const [selectedSegmentId, setSelectedSegmentId] = useState<
    string | undefined
  >('');
  const [file, setFile] = useState<any>(null);
  const [mergedFile, setMergedFile] = useState<File[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string>('');
  const [mergeList, setMergeList] = useState<string[]>([]);
  const [isMergeClicked, setIsMergeClicked] = useState<boolean>(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState<boolean>(false);
  const [isPlaySegmentClicked, setIsPlaySegmentClicked] =
    useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isVideo, setIsVideo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
    useReactMediaRecorder({ video: isVideo });

  const handleMergeList = (id: string | undefined, isMerge: boolean) => {
    if (!id) {
      return;
    }
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

  const handleVideoStatus = () => {
    setIsVideo(!isVideo);
  };

  useEffect(() => {
    return () => {
      setSegments([]);
      setMergeList([]);
    };
  }, [isUploading, isRecordingEnabled]);

  useMemo(() => {
    if (
      isPlaySegmentClicked &&
      selectedSegmentId &&
      selectedSegmentId.length > 0
    ) {
      const Segs: Segment[] = segments.filter((seg: Segment) => {
        if (seg.id === selectedSegmentId) return seg;
      });
      const seg: Segment = Segs[0];
      const peaks = WaveformView.getPeaks();
      console.log(seg);
      peaks.player.playSegment(seg);
      setIsPlaySegmentClicked(false);
    }
  }, [isPlaySegmentClicked]);

  useMemo(() => {
    if (isDeleteClicked && selectedSegmentId && selectedSegmentId?.length > 0) {
      const peaks = WaveformView.getPeaks();
      peaks.segments.removeById(selectedSegmentId);
      const segs = peaks.segments.getSegments();
      console.log('afterdelete', segs);
      setSegments(segs);
      setIsDeleteClicked(false);
    }
  }, [isDeleteClicked]);

  useMemo(async () => {
    if (!mediaBlobUrl) {
      return;
    }
    let blob = await fetch(mediaBlobUrl).then(r => r.blob());
    console.log('[REC BLOB URL]', blob);

    let fileBlob = new File(
      [blob],
      new Date().toISOString() + '_recording.mpeg',
      { type: 'audio/mpeg' },
    );
    console.log(fileBlob);
    setFile(fileBlob);
    editor.readAndDecode(fileBlob);
  }, [mediaBlobUrl]);

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
    history.push(Song(0));
  };

  const onNextClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    dispatch(actions.setAudioURL(mediaBlobUrl));
    history.push(CreateCover('info'));
  };

  const onChangeUpload: ChangeEventHandler<HTMLInputElement> = (e: any) => {
    if (!e.target.files[0]) {
      return;
    }
    let file = e.target.files[0];
    const upload = URL.createObjectURL(file);
    setUploadUrl(upload);
    console.log(upload);
    editor.readAndDecode(file);
    setFile(file);
  };

  const mergeSegments = async () => {
    const targetSegments = mergeList.map(id => {
      return segments.filter(seg => seg.id === id)[0];
    });
    targetSegments.sort(
      (a, b) => Number(a.id?.split('.')[2]) - Number(b.id?.split('.')[2]),
    );
    const mp3File: any = await editor.mergeAudio(targetSegments);
    setMergedFile(mp3File);
    setMergedUrl(URL.createObjectURL(mp3File));
    setMergeList([]);
    setIsMergeClicked(prev => !prev);
  };

  const renderSegments = () => {
    const _segments = [...segments];

    if (!_segments) {
      return null;
    }

    if (_segments.length === 0) {
      return null;
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
            </tr>
          </thead>
          <tbody>{renderSegmentRows(_segments)}</tbody>
        </table>
        <button type="button" onClick={e => mergeSegments()}>
          Merge
        </button>
      </React.Fragment>
    );
  };

  const renderSegmentRows = (segments: Segment[]) => {
    return segments.map(segment => (
      <React.Fragment key={segment.id}>
        <SegmentComponent
          id={segment.id}
          key={segment.id}
          startTime={segment.startTime}
          endTime={segment.endTime}
          labelText={segment.labelText}
          isMergeClicked={isMergeClicked}
          setSelectedId={setSelectedSegmentId}
          setIsPlaySegmentClicked={setIsPlaySegmentClicked}
          setIsDeleteClicked={setIsDeleteClicked}
          handleMergeList={handleMergeList}
        />
      </React.Fragment>
    ));
  };

  return (
    <div
      data-testid="CreateCoverRecordPage"
      className="flex flex-col items-center"
    >
      {/* 참조할 영상 또는 음원 파일 재생하는 부분 */}
      <YoutubePlayer url="https://www.youtube.com/watch?v=SK6Sm2Ki9tI" />

      {/* 취소, 업로드, 녹음, 다음 페이지 */}
      {isRecordingEnabled ? (
        <div className="flex flex-col justify-center items-center space-y-4">
          <h2 className="p-2">Recording Status: {status}</h2>
          <div className="space-x-3">
            <button
              data-testid="handle-video"
              className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
              onClick={handleVideoStatus}
            >
              {isVideo ? (
                <FontAwesomeIcon icon={faVideo} />
              ) : (
                <FontAwesomeIcon icon={faVideoSlash} />
              )}
            </button>
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
          isVideo ? (
            <div className="flex justify-center">
              <video
                id={'video'}
                src={mediaBlobUrl ? mediaBlobUrl : undefined}
                controls
                autoPlay
              />
            </div>
          ) : mediaBlobUrl ? (
            <WaveformView
              selectedSegmentId={selectedSegmentId}
              audioUrl={mediaBlobUrl}
              audioContentType={'audio/mpeg'}
              setSegments={setSegments}
            />
          ) : null
        ) : null}
        {isRecording && isVideo ? (
          <VideoPreview
            className="flex justify-center"
            stream={previewStream}
          />
        ) : null}
      </div>
      {isUploading ? (
        <input
          id="upload-file"
          type="file"
          accept="audio/*"
          onChange={onChangeUpload}
        />
      ) : null}
      <div className="container flex-col justify-center items-center">
        {isUploading ? (
          uploadUrl ? (
            <WaveformView
              selectedSegmentId={selectedSegmentId}
              audioUrl={uploadUrl}
              audioContentType={'audio/mpeg'}
              setSegments={setSegments}
            />
          ) : null
        ) : null}
      </div>
      {renderSegments()}
      {mergedUrl ? (
        <MergedAudio audioFile={mergedFile} audioUrl={mergedUrl} />
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
          data-testid="next-btn"
          type="button"
          onClick={e => onNextClicked(e)}
          disabled={!mediaBlobUrl}
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
