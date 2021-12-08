import React from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { useMakeCombinationSlice } from './slice/makeCombination';
import * as urls from 'utils/urls';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faHeart } from '@fortawesome/free-solid-svg-icons';

export interface Props {
  combinations: Combination[];
}

export default function TopCombination(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useMakeCombinationSlice();

  const styles = {
    th: 'px-3 py-2 text-center text-xs font-medium text-gray-500 tracking-wider',
  };

  const onClickGet = (combination: Combination) => {
    dispatch(actions.getCovers(combination.covers));
  };

  const renderCoverButtons = (covers: Cover[]) => {
    return covers.map((cover, index) => {
      return (
        cover && (
          <button
            key={index}
            className="justify-center px-1 shadow-sm text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300"
            onClick={() => history.push(urls.Cover(cover.id))}
          >
            {cover.title}
          </button>
        )
      );
    });
  };

  const renderCombinations = (combinations: Combination[]) => {
    return combinations.length > 0 ? (
      [...combinations]
        .sort((a, b) => {
          return -(a.views - b.views); // more views = higher rank
        })
        .map((combination, index) => (
          <tr key={combination.id} className="hover:bg-gray-100 cursor-pointer">
            <td
              className="px-3 py-2 font-bold whitespace-nowrap text-center"
              data-testid="combinationGetButton"
              onClick={() => onClickGet(combination)}
            >
              {index + 1}
            </td>
            <td className="flex relative whitespace-nowrap">
              <ul className="flex my-0.5 py-2 gap-1 overflow-x-auto scroll-simple">
                {renderCoverButtons(combination.covers)}
              </ul>
              <button
                className="self-stretch flex-grow"
                data-testid="combinationGetButton"
                onClick={() => onClickGet(combination)}
              />
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap text-center"
              data-testid="combinationGetButton"
              onClick={() => onClickGet(combination)}
            >
              {combination.views}
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap text-center"
              data-testid="combinationGetButton"
              onClick={() => onClickGet(combination)}
            >
              {combination.likes}
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap text-sm font-medium"
              data-testid="combinationGetButton"
              onClick={() => onClickGet(combination)}
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
          There are no combinations yet.
        </td>
      </tr>
    );
  };

  return (
    <div data-testid="TopCombination" className="mt-8 flex flex-col">
      <h2 className="pl-4 sm:pl-0 text-left text-sm font-bold text-gray-600 tracking-wider">
        TOP META-BANDS
      </h2>
      <div className="mt-4 shadow border-b border-gray-200 sm:rounded-lg">
        <table className="table-fixed w-full">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className={styles.th}>
                RANK
              </th>
              <th scope="col" className={styles.th + ' w-1/2 sm:w-2/3'}>
                COVERS
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
            {renderCombinations(props.combinations)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
