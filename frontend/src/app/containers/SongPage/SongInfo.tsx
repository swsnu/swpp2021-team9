import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

export interface Props {
  song?: Song;
  image?: string;
}

export default function SongInfo(props: Props) {
  const onClickLink = () => {
    if (props.song) {
      window.open(props.song.reference);
    }
  };
  return (
    <div data-testid="SongInfo" className="px-8 sm:px-0 self-start">
      {props.song ? (
        <div className="flex items-center">
          <div className="block h-28 w-28 bg-gray-400 rounded-full">
            {props.image && (
              <img
                className="h-full w-full object-cover rounded-full"
                src={props.image}
                alt="Loading Thumbnail..."
              />
            )}
          </div>
          <div className="ml-8">
            <div className="flex items-baseline">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {props.song.title}
              </h1>
              <h2 className="ml-3 text-lg font- text-gray-600 sm:text-xl sm:truncate">
                {props.song.singer}
              </h2>
            </div>
            <div className="flex mt-2">
              <button className="justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-400 hover:bg-gray-600">
                {props.song.category}
              </button>
              <button
                className="justify-center ml-2 py-1 px-3 border border-transparent shadow-sm rounded-lg text-white bg-red-400 hover:bg-red-600"
                onClick={onClickLink}
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading Song Info...</div>
      )}
    </div>
  );
}
