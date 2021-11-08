import React, { useState } from 'react';

import { Combination, Cover } from 'types/models';

interface RankedCombination extends Combination {
  rank: number;
}

interface RankedCover extends Cover {
  rank: number;
}

export interface Props {
  combinations: Combination[];
  covers: Cover[];
}

export default function TopCombination(props: Props) {
  const [state, setstate] = useState({});

  const renderCoverButtons = (covers: number[]) => {
    return covers.map(id => {
      const cover = props.covers.find(cover => cover.id === id);
      return cover ? (
        <button
          key={id}
          className="justify-center px-1 border border-transparent shadow-sm text-sm font-medium rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300"
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
          return a.views - b.views;
        })
        .map((combination, index) => (
          <tr key={combination.id}>
            <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
            <td className="px-4 py-2 whitespace-nowrap">
              <ul className="flex -my-1.5 py-2 gap-1 overflow-x-auto scroll-simple">
                {renderCoverButtons(combination.covers)}
              </ul>
            </td>
            <td className="px-4 py-2 whitespace-nowrap">{combination.views}</td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
              {combination.likes}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
              <button className="text-indigo-600 hover:text-indigo-900 font-bold">
                GET
              </button>
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

  const styles = {
    th: 'px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider',
  };

  return (
    <div data-testid="TopCombination" className="mt-8 flex flex-col">
      <h2 className="text-left text-sm font-bold text-gray-600 tracking-wider">
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
                PLAYS
              </th>
              <th scope="col" className={styles.th}>
                LIKES
              </th>
              <th scope="col" className={styles.th}>
                <span className="sr-only">GET</span>
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
