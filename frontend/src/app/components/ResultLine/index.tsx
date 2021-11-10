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
  //songexample : SongInfo;
  //trackexample : TrackInfo;
}

export default function ResultLine(props: Props) {
  const [player] = useState(Player.getInstance());
  const [track, setTrack] = useState<TrackInfo>();

  const songexample: SongInfo = {
    title: '',
    singer: '',
    category: '',
    reference: '',
    description: '',
  };
  const trackexample: TrackInfo = {
    song: songexample,
    sources: ['hello', 'world'],
    like: false,
  };

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

  return (
    <tr data-testid="ResultLine" className="hover:bg-gray-100 cursor-pointer">
      <td
        onClick={onLineClicked}
        className="py-2 text-md font-medium whitespace-nowrap text-center"
      >
        {props.title}
      </td>

      <td className="flex font-md font-medium whitespace-nowrap text-center">
        <button className="self-stretch flex-grow" onClick={onLineClicked} />
        <span
          onClick={onAuthorClicked}
          className="px-3 my-2 rounded-lg hover:bg-gray-300"
        >
          {props.author}
        </span>
        <button className="self-stretch flex-grow" onClick={onLineClicked} />
      </td>

      <td
        onClick={onLineClicked}
        className="text-md font-medium whitespace-nowrap text-center"
      >
        {props.view}
      </td>

      <td
        onClick={onLineClicked}
        className="py-2 text-md font-medium whitespace-nowrap text-center"
      >
        {props.likes}
      </td>

      <td className="flex whitespace-nowrap text-center">
        <button className="self-stretch flex-grow" onClick={onLineClicked} />
        <button onClick={onPlayClicked} className="py-2 text-lg font-semibold">
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button className="self-stretch flex-grow" onClick={onLineClicked} />
      </td>
    </tr>
  );
}
