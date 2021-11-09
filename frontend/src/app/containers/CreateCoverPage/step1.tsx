import React, { useState } from 'react';
import CustomPlayer from './CustomPlayer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faMicrophoneAlt } from '@fortawesome/free-solid-svg-icons';
export type Props = {};

export default function CreateCoverRecordPage(props: Props) {
  const [isYoutubeLink, setIsYoutubeLink] = useState(true);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  return (
    <div
      data-testid="CreateCoverRecordPage"
      className="flex flex-col items-center"
    >
      {/* 참조할 영상 또는 음원 파일 재생하는 부분 */}
      {isYoutubeLink ? <CustomPlayer /> : null}

      {/* 취소, 업로드, 녹음, 다음 페이지 */}

      <div
        data-testid="CreateCoverButtons"
        className="py-6 flex flex-row w-full space-x-96 justify-center	"
      >
        <button
          type="button"
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-red-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
        >
          Cancel
        </button>

        <div className="flex flex-row space-x-40">
          <button className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300 ">
            <FontAwesomeIcon
              className="justify-center items-center p-1 font-large rounded-md"
              icon={faUpload}
              spin={isUploading}
              size={'3x'}
            />
          </button>
          <button className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300 ">
            <FontAwesomeIcon
              className="justify-center items-center font-large rounded-md "
              icon={faMicrophoneAlt}
              size={'3x'}
            />
          </button>
        </div>
        <button
          type="button"
          disabled={!isUploaded}
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
