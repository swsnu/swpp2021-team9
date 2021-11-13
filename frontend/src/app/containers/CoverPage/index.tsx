import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useCoverSlice } from './slice';
import * as apiActions from 'api/actions';
import { selectCover } from './slice/selectors';
import WavePlayer from './WavePlayer';
import * as urls from 'utils/urls';

interface MatchParams {
  id?: string;
}
export interface Props extends RouteComponentProps<MatchParams> {}

export default function CoverPage(props: Props) {
  useCoverSlice();
  const coverState = useSelector(selectCover);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(apiActions.loadCover.request('start load cover'));
  }, [dispatch]);

  const onSingTitleClicked = useCallback(() => {
    const coverResponse = coverState.coverResponse;
    const cover = coverResponse.data;
    history.push(urls.Song(cover!.song.id));
  }, [coverState.coverResponse, history]);

  const onUsernameClicked = useCallback(() => {
    const coverResponse = coverState.coverResponse;
    const cover = coverResponse.data;
    history.push(urls.Profile(cover!.user.id));
  }, [coverState.coverResponse, history]);

  const coverResponse = coverState.coverResponse;
  const cover = coverResponse.data;

  return (
    <div data-testid="CoverPage" className="flex justify-center">
      {cover ? (
        <div className="flex flex-col w-screen sm:w-full sm:px-8 max-w-screen-lg">
          <div data-testid="info" className="px-8 sm:px-0 self-start my-16">
            <div className="flex items-center">
              <div className="block h-28 w-28 bg-gray-400 rounded-full">
                {cover.song.reference && (
                  <img
                    className="h-full w-full object-cover rounded-full text-center"
                    src={cover.song.reference}
                    alt="Loading Thumbnail..."
                  />
                )}
              </div>
              <div id="cover-info" className="ml-8">
                <div className="flex items-baseline">
                  <h1
                    data-testid="coverTitle"
                    className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate"
                  >
                    {cover.title}
                  </h1>
                  <button
                    data-testid="usename"
                    className="ml-3 text-lg font- text-gray-600 sm:text-xl sm:truncate"
                    onClick={onUsernameClicked}
                  >
                    {cover.user.username}
                  </button>
                </div>
                <div className="flex mt-2">
                  <div
                    data-testid="coverCategory"
                    className="justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-400"
                  >
                    {cover.category}
                  </div>
                </div>
              </div>
              <div id="song-info" className="ml-8">
                <div className="flex items-baseline">
                  <button
                    data-testid="songTitle"
                    className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate"
                    onClick={onSingTitleClicked}
                  >
                    {cover.song.title}
                  </button>
                  <h2
                    data-testid="songSinger"
                    className="ml-3 text-lg font- text-gray-600 sm:text-xl sm:truncate"
                  >
                    {cover.song.singer}
                  </h2>
                </div>
                <div className="flex mt-2">
                  <div
                    data-testid="songCategory"
                    className="justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-400"
                  >
                    {cover.song.category}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="player"
            className="sm:w-full sm:px-8 my-8 py-4 max-w-screen-lg"
          >
            <WavePlayer url={cover?.audio} />
          </div>
          <div className="border border-gray-100 mt-8" />
          <div
            id="description"
            className="sm:w-full sm:px-8 py-4 max-w-screen-lg"
          >
            <div className="text-2xl text-gray-700 font-weight: 600 mb-2">
              description
            </div>
            <div className="text-sm">{cover.description}</div>
          </div>

          <div className="border border-gray-100 mt-8" />
          <div id="tags" className="sm:w-full sm:px-8 py-4 max-w-screen-lg">
            <div className="text-2xl text-gray-700 font-weight: 600 mb-2">
              Tags
            </div>
            <div className="text-sm">{cover.tags.join(' | ')}</div>
          </div>
        </div>
      ) : coverResponse.loading ? (
        <div>Loading Song Info...</div>
      ) : (
        <div data-testid="errorStatement">{`error: ${coverResponse.error}`}</div>
      )}
    </div>
  );
}
