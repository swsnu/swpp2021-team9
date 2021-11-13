import * as React from 'react';
import { useState, useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Props {
  onSearchClicked?: (key: string) => void;
}

export default function Search({ onSearchClicked }: Props) {
  const [inputKey, setInputKey] = useState('');

  const handleInput = useCallback(
    event => {
      setInputKey(event.target.value);
    },
    [setInputKey],
  );

  const handleClick = useCallback(() => {
    onSearchClicked && onSearchClicked(inputKey);
  }, [inputKey, onSearchClicked]);

  return (
    <div data-testid="Search" className="relative w-full flex items-stretch">
      <input
        type="text"
        data-testid="searchTerm"
        placeholder="Search Music..."
        className="w-full px-3 border-2 border-gray-300 border-r-0 rounded-l-md text-gray-600 focus:text-gray-800 outline-none"
        onChange={handleInput}
      />
      <button
        type="submit"
        data-testid="submit"
        onClick={handleClick}
        className="px-3 border-2 border-gray-300 rounded-r-md text-center text-gray-400 text-base"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
}
