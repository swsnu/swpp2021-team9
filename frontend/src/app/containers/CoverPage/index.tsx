import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useCoverSlice } from './slice';
import * as apiActions from 'api/actions';
import { selectCover } from './slice/selectors';
import WavePlayer from './WavePlayer';
import * as urls from 'utils/urls';
import { getThumbnail } from 'utils/imageTools';
import { selectWrapper } from 'app/wrapper/slice/selectors';

interface MatchParams {
  id: string;
}
export interface Props extends RouteComponentProps<MatchParams> {}

export default function CoverPage(props: Props) {
  useCoverSlice();
  const wrapperState = useSelector(selectWrapper);
  const coverState = useSelector(selectCover);
  const dispatch = useDispatch();
  const history = useHistory();

  const deleteState = coverState.deleteResponse;

  useEffect(() => {
    dispatch(apiActions.loadCover.request(Number(props.match.params.id)));
  }, [dispatch, props.match]);

  useEffect(() => {
    if (!deleteState.loading) {
      if (deleteState.error) {
        alert(`Failed to Delete ${deleteState.error}`);
      } else if (deleteState.data) {
        alert(`Success to Delete`);
        history.replace(urls.Main());
      }
    }
  }, [deleteState, history]);

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

  const onEditClicked = useCallback(() => {
    history.push(urls.CoverEdit(props.match.params.id));
  }, [history, props.match.params.id]);

  const onDeleteClicked = useCallback(() => {
    dispatch(apiActions.deleteCover.request(Number(props.match.params.id)));
  }, [dispatch, props.match.params.id]);

  const coverResponse = coverState.coverResponse;
  const cover = coverResponse.data;
  const author = cover?.user;
  const editable =
    author && wrapperState.user ? author.id === wrapperState.user.id : false;

  return (
    <div data-testid="CoverPage" className="flex justify-center">
      {cover ? (
        <div className="flex flex-col w-screen sm:w-full sm:px-8 max-w-screen-lg">
          <div
            data-testid="info"
            className="px-8 sm:px-0 self-start my-16 w-full flex items-center"
          >
            <div className="flex-shrink-0 h-28 w-28 bg-gray-400 rounded-full">
              {cover.song.reference && (
                <img
                  className="h-full w-full object-cover rounded-full text-center"
                  src={getThumbnail(cover.song.reference)}
                  alt="Loading Thumbnail..."
                />
              )}
            </div>
            <div
              id="cover-info"
              className="flex flex-col items-baseline ml-8 w-1/2"
            >
              <h1
                data-testid="coverTitle"
                className="text-2xl font-bold leading-7 text-gray-900 h-8 sm:text-3xl sm:truncate"
              >
                {cover.title}
              </h1>
              <button
                data-testid="usename"
                className="text-lg font- text-gray-600 h-7 sm:text-xl sm:truncate"
                onClick={onUsernameClicked}
              >
                {cover.user.username}
              </button>
              <div
                data-testid="coverCategory"
                className="justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-400"
              >
                {cover.category}
              </div>
            </div>
            <div
              id="song-info"
              className="flex flex-col items-baseline ml-8 w-1/2"
            >
              <button
                data-testid="songTitle"
                className="text-2xl font-bold leading-7 text-gray-900 h-8 sm:text-3xl sm:truncate"
                onClick={onSingTitleClicked}
              >
                {cover.song.title}
              </button>
              <h2
                data-testid="songSinger"
                className="text-lg font- text-gray-600 h-7 sm:text-xl sm:truncate"
              >
                {cover.song.singer}
              </h2>
              <div
                data-testid="songCategory"
                className="justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-400"
              >
                {cover.song.category}
              </div>
            </div>
            <div className="flex flex-col w-20">
              {editable && (
                <div>
                  <button
                    data-testid="edit_button"
                    className="small-button my-1 w-full"
                    onClick={onEditClicked}
                  >
                    edit
                  </button>
                  <button
                    data-testid="delete_button"
                    className="small-button my-1 w-full"
                    disabled={deleteState.loading}
                    onClick={onDeleteClicked}
                  >
                    delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            id="player"
            className="sm:w-full sm:px-8 my-8 py-4 max-w-screen-lg"
          >
            {cover.audio && <WavePlayer url={cover.audio} />}
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
