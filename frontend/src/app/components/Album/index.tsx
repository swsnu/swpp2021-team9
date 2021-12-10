import React from 'react';
import { getThumbnail } from 'utils/imageTools';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import './Album.css';

interface Props {
  combination: Combination;
  onClickTitle: () => void;
  onClickPlay: () => void;
  isPlaying: boolean;
}

export default function Album(props: Props) {
  return (
    <div
      data-testid="Album"
      className="flex flex-col items-center w-full
                 col-span-12 xs:col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-3 xl:col-span-2"
    >
      <button
        data-testid="Title"
        onClick={props.onClickTitle}
        className="w-full mb-4 text-gray-900 hover:text-indigo-600"
      >
        <h2 className="text-xl font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">
          {props.combination.song.title}
        </h2>
        <div className="text-md font-medium whitespace-nowrap overflow-hidden overflow-ellipsis">
          {props.combination.song.singer}
        </div>
      </button>

      <button data-testid="Play" onClick={props.onClickPlay}>
        <div className="relative block h-36 w-36 bg-gray-400 rounded-full shadow-md overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 h-48 w-48"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <img
              className={`h-full w-full object-cover rounded-full ${
                props.isPlaying ? 'rotate' : ''
              }`}
              src={getThumbnail(props.combination.song.reference)}
              alt="Loading Thumbnail..."
            />
          </div>
          <div
            className="absolute top-1/2 left-1/2"
            style={{ transform: 'translate(-30%, -50%)' }}
          >
            {!props.isPlaying && (
              <FontAwesomeIcon
                data-testid="playIcon"
                icon={faPlay}
                size="2x"
                color="white"
              />
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
