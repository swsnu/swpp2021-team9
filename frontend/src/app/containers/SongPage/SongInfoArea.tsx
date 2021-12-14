import React, { useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { getThumbnail } from 'utils/imageTools';

export interface Props {
  song: Song;
  image?: string;
}

export default function SongInfoArea(props: Props) {
  const onClickLink = useCallback(() => {
    window.open(props.song.reference);
  }, [props.song.reference]);

  return (
    <div data-testid="SongInfo" className="px-8 sm:px-0 self-start">
      <div className="flex items-center">
        <div className="relative block h-24 w-24 bg-gray-400 rounded-full overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 h-32 w-32"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {props.image && (
              <img
                className="h-full w-full object-cover rounded-full"
                src={getThumbnail(props.song.reference)}
                alt="Loading Thumbnail..."
              />
            )}
          </div>
        </div>
        <div className="ml-6">
          <div className="flex mt-2">
            <div className="inline-block py-0.5 px-2 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-400">
              {props.song.category}
            </div>
            <button
              data-testid="button-youtube"
              className="justify-center ml-2 py-0.5 px-3 border border-transparent shadow-sm rounded-full text-white bg-red-400 hover:bg-red-600"
              onClick={onClickLink}
            >
              <FontAwesomeIcon icon={faPlay} />
            </button>
          </div>

          <div className="flex items-baseline">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">
              {props.song.title}
            </h1>
            <h2 className="ml-3 text-lg font-medium text-gray-600 sm:text-xl sm:truncate">
              {props.song.singer}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
