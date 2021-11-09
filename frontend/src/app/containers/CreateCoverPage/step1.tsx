import React, { useState } from 'react';
import CustomPlayer from './CustomPlayer';
export type Props = {};

export default function CreateCoverRecordPage(props: Props) {
  const [isUploaded, setIsUploaded] = useState(false);
  return (
    <div
      data-testid="CreateCoverRecordPage"
      className="flex flex-col items-center"
    >
      <CustomPlayer />

      <div data-testid="CreateCoverButtons" className="flex flex-row space-x-4">
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-red-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
        >
          Cancel
        </button>

        <button id="upload-button" type="button">
          upload
        </button>
        <button id="recording-button" type="button">
          record
        </button>

        <button
          type="button"
          disabled={!isUploaded}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
