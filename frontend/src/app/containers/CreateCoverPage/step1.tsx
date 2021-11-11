import React, { useState, useRef, useEffect } from 'react';
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
import Waveform from 'app/containers/CreateCoverPage/Waveform';
import { useHistory } from 'react-router-dom';
import { Song, CreateCover } from 'utils/urls';
import { useDispatch } from 'react-redux';
import { useCreateCoverSlice } from './slice';
export interface Props {}

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }
  return <video ref={videoRef} width={500} height={500} autoPlay controls />;
};

export default function CreateCoverRecordPage(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useCreateCoverSlice();
  const [isVideo, setIsVideo] = useState(false);
  const [isYoutubeLink, setIsYoutubeLink] = useState(true);
  // const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
    previewAudioStream,
  } = useReactMediaRecorder({ video: isVideo });

  const handleVideoStatus = () => {
    setIsVideo(!isVideo);
  };

  const onRecordClicked = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsRecording(!isRecording);
    console.log(mediaBlobUrl);
  };

  const onCancelClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // 임시 구현
    // TODO
    // song id를 route params로 받아와서 사용해야할 듯.
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

  return (
    <div
      data-testid="CreateCoverRecordPage"
      className="flex flex-col items-center"
    >
      {/* 참조할 영상 또는 음원 파일 재생하는 부분 */}
      {isYoutubeLink ? <YoutubePlayer /> : null}

      {/* 취소, 업로드, 녹음, 다음 페이지 */}
      {isRecordingEnabled ? (
        <div className="flex flex-col justify-center items-center space-y-4">
          <h2 className="p-2">Recording Status: {status}</h2>
          <div className="space-x-3">
            <button
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
          {isVideo ? (
            <video
              id={'video'}
              src={mediaBlobUrl ? mediaBlobUrl : undefined}
              controls
              autoPlay
            />
          ) : mediaBlobUrl ? (
            <Waveform url={mediaBlobUrl} />
          ) : null}
          {isRecording && isVideo ? (
            <VideoPreview stream={previewStream} />
          ) : null}
        </div>
      ) : null}
      {isUploading ? <input type="file" id="upload" /> : null}
      <div
        data-testid="CreateCoverButtons"
        className="py-6 flex flex-row w-full lg:space-x-96 md:space-x-48 sm:space-x-20 justify-center	"
      >
        <button
          type="button"
          onClick={onCancelClicked}
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-red-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
        >
          Cancel
        </button>

        <div className="flex flex-row lg:space-x-40 md:space-x-20 sm:space-x-10">
          <button
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
            className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300 "
            onClick={() => setIsRecordingEnabled(!isRecordingEnabled)}
          >
            <FontAwesomeIcon
              className="justify-center items-center font-large rounded-md "
              icon={faMicrophoneAlt}
              size={'3x'}
              spin={isRecordingEnabled}
            />
          </button>
        </div>
        <button
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
