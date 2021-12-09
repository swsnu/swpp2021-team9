import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMakeCombinationSlice } from './slice/makeCombination';
import * as urls from 'utils/urls';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faHeart } from '@fortawesome/free-solid-svg-icons';

export interface Props {
  covers: Cover[];
  instrument: Instrument;
}

export default function TopCover(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useMakeCombinationSlice();

  const styles = {
    th: 'px-3 py-2 text-center text-xs font-medium text-gray-500 tracking-wider',
  };

  const renderCovers = (covers: Cover[]) => {
    const onClickRow = (cover: Cover) => {
      dispatch(actions.editCurrent(cover));
    };

    return covers.length > 0 ? (
      [...covers]
        .sort((a, b) => {
          return b.views - a.views; // more views = higher rank
        })
        .map((cover, coverId) => (
          <tr key={cover.id} className="hover:bg-gray-100 cursor-pointer">
            <td
              className="px-3 py-2 font-bold whitespace-nowrap text-center"
              data-testid="CoverGetButton"
              onClick={() => onClickRow(cover)}
            >
              {coverId + 1}
            </td>
            <td
              className="px-3 py-2 text-sm font-medium whitespace-nowrap text-center text-gray-600"
              data-testid="CoverGetButton"
              onClick={() => onClickRow(cover)}
            >
              {cover.user.username}
            </td>
            <td className="flex font-medium whitespace-normal">
              <button
                className="my-2 px-2 font-medium rounded-lg hover:bg-gray-300"
                data-testid="ToCoverButton"
                onClick={() => history.push(urls.Cover(cover.id))}
              >
                {cover.title}
              </button>
              <button
                className="self-stretch flex-grow"
                data-testid="CoverGetButton"
                onClick={() => onClickRow(cover)}
              />
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap"
              data-testid="CoverGetButton"
              onClick={() => onClickRow(cover)}
            >
              <ul className="flex flex-wrap gap-1">
                {cover.tags.map((tag, tagId) => (
                  <li
                    key={tagId}
                    className="px-1 text-xs font-medium rounded-full bg-gray-200 text-gray-600"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap text-center"
              data-testid="CoverGetButton"
              onClick={() => onClickRow(cover)}
            >
              {cover.views}
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap text-center"
              data-testid="CoverGetButton"
              onClick={() => onClickRow(cover)}
            >
              {cover.likes}
            </td>
            <td
              className="whitespace-nowrap text-sm text-center font-medium sr-only sm:not-sr-only sm:px-3 sm:py-2"
              data-testid="CoverGetButton"
              onClick={() => onClickRow(cover)}
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
          {props.instrument.name} covers don't exist yet... Be the first to make
          one!
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
