import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSongSlice } from './slice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faHeart } from '@fortawesome/free-solid-svg-icons';

export interface Props {
  combinations: Combination[];
  covers: Cover[];
}

export default function TopCombination(props: Props) {
  const dispatch = useDispatch();
  const { actions } = useSongSlice();
  const [state, setstate] = useState({});

  const styles = {
    th: 'px-3 py-2 text-center text-xs font-medium text-gray-500 tracking-wider',
  };

  const onClickGet = (combination: Combination) => {
    dispatch(
      actions.addCovers(
        combination.covers.map(id =>
          props.covers.find(cover => cover.id === id),
        ),
      ),
    );
  };

  const renderCoverButtons = (covers: number[]) => {
    return covers.map(id => {
      const cover = props.covers.find(cover => cover.id === id);
      return cover ? (
        <button
          key={id}
          className="justify-center px-1 shadow-sm text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300"
        >
          {cover.title}
        </button>
      ) : (
        <div key={id}></div>
      );
    });
  };

  const renderCombinations = (combinations: Combination[]) => {
    return combinations.length > 0 ? (
      combinations
        .sort((a, b) => {
          return -(a.views - b.views); // more views = higher rank
        })
        .map((combination, index) => (
          <tr key={combination.id} className="hover:bg-gray-100 cursor-pointer">
            <td
              className="px-3 py-2 font-bold whitespace-nowrap text-center"
              onClick={() => onClickGet(combination)}
            >
              {index + 1}
            </td>
            <td className="flex px-3 whitespace-nowrap">
              <ul className="flex my-0.5 py-2 gap-1 overflow-x-auto scroll-simple">
                {renderCoverButtons(combination.covers)}
              </ul>
              <button
                className="self-stretch flex-grow"
                onClick={() => onClickGet(combination)}
              />
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap text-center"
              onClick={() => onClickGet(combination)}
            >
              {combination.views}
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap text-center"
              onClick={() => onClickGet(combination)}
            >
              {combination.likes}
            </td>
            <td
              className="px-3 py-2 whitespace-nowrap text-sm font-medium"
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
        TOP COMBINATIONS
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
