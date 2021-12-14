import { getThumbnail } from 'utils/imageTools';

interface Props {
  song: Song;
  onLineClicked: () => void;
}

export default function ResultLine(props: Props) {
  return (
    <article
      data-testid="ResultLine"
      className="hover:bg-gray-100 cursor-pointer flex items-center"
      onClick={props.onLineClicked}
    >
      <div className="relative block h-24 w-24 m-4 bg-gray-400 rounded-full shadow-md overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 h-32 w-32"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <img
            className="h-full w-full object-cover rounded-full"
            src={getThumbnail(props.song.reference)}
            alt="Loading Thumbnail..."
          />
        </div>
      </div>

      <div className="ml-2">
        <div className="inline-block py-0.5 px-2 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-400">
          {props.song.category}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">
          {props.song.title}
        </h1>
        <h2 className="text-lg font-medium text-gray-600 sm:text-xl sm:truncate">
          {props.song.singer}
        </h2>
      </div>
    </article>
  );
}
