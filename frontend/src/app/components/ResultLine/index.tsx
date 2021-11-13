import Player from 'app/helper/Player';
import * as React from 'react';
import { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Song, Profile } from 'utils/urls';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

interface Props {
  title: string;
  author: string;
  view: number;
  likes: number;
  onLineClicked: () => void;
  onAuthorClicked: () => void;
  onPlayClicked: () => void;
}

export default function ResultLine(props: Props) {
  /*
  const [player] = useState(Player.getInstance());

  const history = useHistory();

  const [Form, setForm] = useState({
    title: '',
    singer: '',
  });

  const onLineClicked = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(Form);
    history.push(Song(0));
  };

  const onAuthorClicked = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(Form);
    history.push(Profile(0));
  };

  const onPlayClicked = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(Form);
    player.setIndex(0);
  };
  */
  return (
    <div>
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
          <span
            data-testid="Author"
            onClick={props.onAuthorClicked}
            className="px-3 my-2 rounded-lg hover:bg-gray-300"
          >
            {props.author}
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
    </div>
  );
}
