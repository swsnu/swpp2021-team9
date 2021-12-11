import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectSearchResult } from './slice/selectors';
import AlbumImage from '../../components/Album/AlbumImage.png';
import { CreateSong } from 'utils/urls';
import ResultLine from '../../components/ResultLine/index';
import * as urls from 'utils/urls';
import * as apiActions from 'api/actions';
import { useSearchResultSlice } from './slice';

export type Props = {};

export default function SearchResultPage(props: Props) {
  useSearchResultSlice();
  const searchResultState = useSelector(selectSearchResult);
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const key = query.get('key') ?? '';

  const songsResponse = searchResultState.songsResponse;

  useEffect(() => {
    dispatch(apiActions.loadSongsSearch.request(key));
  }, [dispatch, key]);

  useEffect(() => {
    if (!songsResponse.loading) {
      if (songsResponse.error) {
        window.alert('Error: could not fetch search results.');
      }
    }
  }, [songsResponse]);

  const onAddSongClicked = (e: React.FormEvent) => {
    e.preventDefault();
    history.push(CreateSong());
  };

  return (
    <div data-testid="SearchResultPage" className="flex justify-center">
      {songsResponse.data &&
        (songsResponse.data.length > 0 ? (
          <div className="flex flex-col w-screen sm:w-full sm:px-8 max-w-screen-lg">
            <h2 className="pl-5 sm:pl-0 text-left text-m font-bold text-gray-600 tracking-wider">
              SEARCH RESULT
            </h2>
            <div className="mt-4 shadow border-b border-gray-200 sm:rounded-lg">
              {songsResponse.data.map(song => (
                <ResultLine
                  key={song.id}
                  song={song}
                  onLineClicked={() => history.push(urls.Song(song.id))}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-16">
            <img
              className="rounded-full border border-gray-100 shadow-sm"
              src={AlbumImage}
              width="150"
              height="150"
              alt="Album"
            />
            <p className="my-2 text-lg font-semibold">No Results</p>
            <form onSubmit={onAddSongClicked}>
              <button
                type="submit"
                className="my-3 py-2 px-4 border-0 shadow-md rounded-md
                         text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create a song page!
              </button>
            </form>
          </div>
        ))}
    </div>
  );
}
