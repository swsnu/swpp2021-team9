import Player from 'app/helper/Player';
import * as React from 'react';
import { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Song, Profile } from 'utils/urls';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

interface Props {
  title: string;
  singer: string;
  view: number;
  likes: number;
  onLineClicked: () => void;
  onPlayClicked: () => void;
}

export default function ResultLine(props: Props) {
  return (
    <tr data-testid="ResultLine" className="hover:bg-gray-100 cursor-pointer">
      <td
        data-testid="Title"
        onClick={props.onLineClicked}
        className="py-2 text-md font-medium whitespace-nowrap text-center"
      >
        {props.title}
      </td>

      <td className="flex font-md font-medium whitespace-nowrap text-center">
        <button
          className="self-stretch flex-grow"
          onClick={props.onLineClicked}
        />
        <span data-testid="Singer" className="px-3 my-2 rounded-lg">
          {props.singer}
        </span>
        <button
          className="self-stretch flex-grow"
          onClick={props.onLineClicked}
        />
      </td>

      <td
        onClick={props.onLineClicked}
        className="text-md font-medium whitespace-nowrap text-center"
      >
        {props.view}
      </td>

      <td
        onClick={props.onLineClicked}
        className="py-2 text-md font-medium whitespace-nowrap text-center"
      >
        {props.likes}
      </td>

      <td className="flex whitespace-nowrap text-center">
        <button
          className="self-stretch flex-grow"
          onClick={props.onLineClicked}
        />
        <button
          data-testid="Play"
          onClick={props.onPlayClicked}
          className="py-2 text-lg font-semibold"
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button
          className="self-stretch flex-grow"
          onClick={props.onLineClicked}
        />
      </td>
    </tr>
  );
}
