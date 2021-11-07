import * as React from 'react';
import { useState, useCallback } from 'react';
import { ReactComponent as SearchSvg } from 'res/search-icon.svg';
import './Search.css';

interface Props {
  onSearchClicked?: (key: string) => void;
}

export default function Search({ onSearchClicked }: Props) {
  const [inputKey, setInputKey] = useState('');

  const handelInput = useCallback(
    event => {
      setInputKey(event.target.value);
    },
    [setInputKey],
  );

  const handleClick = useCallback(() => {
    onSearchClicked && onSearchClicked(inputKey);
  }, [inputKey, onSearchClicked]);

  return (
    <div className="search" data-testid="Search">
      <input
        type="text"
        data-testid="searchTerm"
        className="searchTerm"
        placeholder="Search Music"
        onChange={handelInput}
      />
      <button
        type="submit"
        data-testid="submit"
        className="searchButton"
        onClick={handleClick}
      >
        <SearchSvg />
      </button>
    </div>
  );
}
