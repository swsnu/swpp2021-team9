import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { useCoverSlice } from './slice';
import * as apiActions from 'api/actions';
import { selectCover } from './slice/selectors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones } from '@fortawesome/free-solid-svg-icons';
import ReactPlayer from 'react-player';
import { Waveform } from '../CreateCoverPage';

interface MatchParams {
  id?: string;
}
export interface Props extends RouteComponentProps<MatchParams> {}

export default function CoverPage(props: Props) {
  const { actions } = useCoverSlice();
  const coverState = useSelector(selectCover);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('start cover');
    dispatch(apiActions.loadCover.request('start load cover'));
  }, [dispatch]);

  const onClickLink = useCallback(() => {
    console.log('useCallback');
  }, []);

  const coverResponse = coverState.coverResponse;
  const cover = coverResponse.data;

  return (
    <div data-testid="CoverPage" className="flex justify-center">
      {cover ? (
        <div className="flex flex-col w-screen sm:w-full sm:px-8 max-w-screen-lg">
          <div data-testid="info" className="px-8 sm:px-0 self-start">
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
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    {cover.title}
                  </h1>
                  <h2 className="ml-3 text-lg font- text-gray-600 sm:text-xl sm:truncate">
                    {cover.user.username}
                  </h2>
                </div>
                <div className="flex mt-2">
                  <button className="justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-400 hover:bg-gray-600">
                    {cover.category}
                  </button>
                  <button
                    className="justify-center ml-2 py-1 px-3 border border-transparent shadow-sm rounded-lg text-white bg-red-400 hover:bg-red-600"
                    onClick={onClickLink}
                  >
                    <FontAwesomeIcon icon={faHeadphones} />
                  </button>
                </div>
              </div>
              <div id="song-info" className="ml-8">
                <div className="flex items-baseline">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    {cover.song.title}
                  </h1>
                  <h2 className="ml-3 text-lg font- text-gray-600 sm:text-xl sm:truncate">
                    {cover.song.singer}
                  </h2>
                </div>
                <div className="flex mt-2">
                  <button className="justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-400 hover:bg-gray-600">
                    {cover.song.category}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div id="player" className="sm:w-full sm:px-8 py-4 max-w-screen-lg">
            <Waveform url={cover?.audio} />
          </div>
          <div className="border border-gray-200" />
          <div
            id="description"
            className="sm:w-full sm:px-8 py-4 max-w-screen-lg"
          >
            <div className="text-2xl font-weight: 600 mb-2">description</div>
            <div className="text-sm">{cover.description}</div>
          </div>

          <div className="border border-gray-200" />
          <div id="tags" className="sm:w-full sm:px-8 py-4 max-w-screen-lg">
            <div className="text-2xl font-weight: 600 mb-2">Tags</div>
            <div className="text-sm">{cover.tags.join(' | ')}</div>
          </div>
        </div>
      ) : coverResponse.loading ? (
        <div>Loading Song Info...</div>
      ) : (
        <div>{`error: ${coverResponse.error}`} </div>
      )}
    </div>
  );
}
