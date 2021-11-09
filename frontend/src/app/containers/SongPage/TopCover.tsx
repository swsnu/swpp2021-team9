import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSongSlice } from './slice';
import { Cover } from 'types/models';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faHeart } from '@fortawesome/free-solid-svg-icons';

export interface Props {
  covers: Cover[];
}

export default function TopCover(props: Props) {
  const dispatch = useDispatch();
  const { actions } = useSongSlice();

  const [state, setstate] = useState({});

  const styles = {
    th: 'px-3 py-2 text-center text-xs font-medium text-gray-500 tracking-wider',
  };

  const renderCovers = (covers: Cover[]) => {
    return covers.length > 0 ? (
      covers
        .sort((a, b) => {
          return -(a.views - b.views); // more views = higher rank
        })
        .map((cover, index) => (
          <tr key={cover.id} className="hover:bg-gray-100 cursor-pointer">
            <td
              className="px-3 py-2 font-bold whitespace-nowrap text-center"
              onClick={() => dispatch(actions.editCurrent(cover))}
            >
              {index + 1}
            </td>
            <td className="px-3 py-2 text-sm font-medium whitespace-nowrap text-center text-gray-600">
              {'User ' + cover.user}
            </td>
            <td className="flex px-3 font-medium whitespace-normal">
              <button className="my-2 px-2 font-medium rounded-lg hover:bg-gray-300">
                {cover.title}
              </button>
              <button
                className="self-stretch flex-grow"
                onClick={() => dispatch(actions.editCurrent(cover))}
              />
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap"
              onClick={() => dispatch(actions.editCurrent(cover))}
            >
              <ul className="flex flex-wrap gap-1">
                {cover.tags.map((tag, index) => (
                  <li
                    key={index}
                    className="px-1 text-xs font-medium rounded-full bg-gray-200 text-gray-600"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap text-center"
              onClick={() => dispatch(actions.editCurrent(cover))}
            >
              {cover.views}
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap text-center"
              onClick={() => dispatch(actions.editCurrent(cover))}
            >
              {cover.likes}
            </td>
            <td
              className="whitespace-nowrap text-sm text-center font-medium sr-only sm:not-sr-only sm:px-3 sm:py-2"
              onClick={() => dispatch(actions.editCurrent(cover))}
            >
              <div className="text-indigo-600 hover:text-indigo-900 font-bold">
                GET
              </div>
            </td>
          </tr>
        ))
    ) : (
      <tr>
        <td colSpan={5} className={styles.th}>
          There are no covers yet.
        </td>
      </tr>
    );
  };

  return (
    <div data-testid="TopCover" className="mt-4 flex flex-col">
      <div className="shadow border-b border-gray-200 sm:rounded-lg">
        <table className="w-full">
          <thead className="bg-indigo-50">
            <tr>
              <th scope="col" className={styles.th}>
                RANK
              </th>
              <th scope="col" className={styles.th}>
                AUTHOR
              </th>
              <th scope="col" className={styles.th}>
                TITLE
              </th>
              <th scope="col" className={styles.th}>
                <span>TAGS</span>
              </th>
              <th scope="col" className={styles.th}>
                <FontAwesomeIcon icon={faPlay} />
              </th>
              <th scope="col" className={styles.th}>
                <FontAwesomeIcon icon={faHeart} />
              </th>
              <th scope="col" className={'sr-only ' + styles.th}>
                <span>GET</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderCovers(props.covers)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
