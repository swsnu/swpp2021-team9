import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import AlbumImage from '../../components/Album/AlbumImage.png';
import { CreateSong } from 'utils/urls';
import ResultLine from '../../components/ResultLine/index';
import { dummyResultLines } from './dummy';
import { Song } from 'utils/urls';
import Player from 'app/helper/Player';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faHeart } from '@fortawesome/free-solid-svg-icons';

export type Props = {
  hasResult: boolean;
};

export default function SearchResultPage(props: Props) {
  const styles = {
    th: 'px-0 py-1 text-center text-xs font-small text-gray-500 tracking-wider',
  };

  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const key = query.get('key') ?? '';
  console.log(key);

  const [Form, setForm] = useState({});
  const history = useHistory();

  const onAddSongClicked = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(Form);
    history.push(CreateSong());
  };

  const player = useMemo(() => Player.getInstance(), []);
  //props.hasresult = (key==='strawberry moon')

  return props.hasResult ? (
    <div data-testid="SearchResultPage" className="flex justify-center">
      <div className="flex flex-col w-screen sm:w-full sm:px-8 max-w-screen-lg">
        <h2 className="pl-5 sm:pl-0 text-left text-m font-bold text-gray-600 tracking-wider">
          SEARCH RESULT
        </h2>
        <div className="mt-4 shadow border-b border-gray-200 sm:rounded-lg">
          <table className="px-0 table-fixed w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className={styles.th}>
                  TITLE
                </th>
                <th scope="col" className={styles.th}>
                  SINGER
                </th>
                <th scope="col" className={styles.th}>
                  <FontAwesomeIcon icon={faPlay} />
                </th>
                <th scope="col" className={styles.th}>
                  <FontAwesomeIcon icon={faHeart} />
                </th>
                <th scope="col" className={'sr-only ' + styles.th}>
                  PLAY
                </th>
              </tr>
            </thead>
            <tbody>
              {dummyResultLines.map(resultline => (
                <ResultLine
                  key={resultline.title}
                  title={resultline.title}
                  singer={resultline.singer}
                  view={resultline.view}
                  likes={resultline.likes}
                  onLineClicked={() => history.push(Song(0))}
                  onPlayClicked={() => {}}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <div data-testid="SearchResultPage">
      <div data-testid="Album" className="flex flex-col items-center w-full">
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <img
          className="rounded-full border border-gray-100 shadow-sm"
          src={AlbumImage}
          width="150"
          height="150"
          alt="Album"
        />
        <br></br>
        <div className="px-4 py-1 mx-auto space-y-1 overflow-hidden border-2 border-black-500 border-opacity-50 rounded-lg">
          <p className="text-lg font-semibold">No Result</p>
        </div>
        <form onSubmit={onAddSongClicked}>
          <div className="px-4 py-3 bg-gray-50 text-left sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Song Page?
            </button>
          </div>
        </form>
        <br></br>
      </div>
    </div>
  );
}
