import React from 'react';
import '../Album/Album.css';

interface Props {
  id: number;
  title: string;
  singer: string;
  thumbnail: string | undefined;
  onClickTitle: () => void;
  onClickPlay: () => void;
}

export default function Album(props: Props) {
  return (
    <div
      data-testid="Album"
      className="flex flex-col items-center w-full col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-3 xl:col-span-2"
    >
      <button
        data-testid="Title"
        onClick={props.onClickTitle}
        className="w-full text-gray-900 font-semibold"
      >
        <h2 className="text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
          {props.title}
        </h2>
        <div className="text-md whitespace-nowrap overflow-hidden overflow-ellipsis">
          {props.singer}
        </div>
      </button>

      <br></br>
      <img
        className="rounded-full border border-gray-100 shadow-sm"
        src={props.thumbnail}
        width="150"
        height="150"
        alt="Album"
      />
      <br></br>
      <div className="px-4 pt-3 text-left sm:px-6">
        <button
          data-testid="Play"
          type="submit"
          onClick={props.onClickPlay}
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Play
        </button>
      </div>
      <br></br>
      <br></br>
    </div>
  );
}
