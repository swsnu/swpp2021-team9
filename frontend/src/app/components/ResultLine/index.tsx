import Player from 'app/wrapper/PlayerBar';
import * as React from 'react';
import { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Song, Profile } from 'utils/urls';

interface Props {
  title: string;
  author: string;
  view: number;
  likes: number;
}

export default function ResultLine(props: Props) {
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
    //player = Player.getInstance();
    //player.setTrack(song);
  };

  return (
    <div data-testid="ResultLine" className="flex flex-row items-center w-full">
      <br></br>
      <br></br>
      <form onSubmit={onLineClicked}>
        <button className="px-3 py-2 font-bold whitespace-nowrap text-center">
          <td className="text-lg font-semibold">{props.title}</td>
        </button>
      </form>

      <form onSubmit={onAuthorClicked}>
        <button className="px-3 py-2 font-bold whitespace-nowrap text-center">
          <div className="flex my-0.5 py-2 gap-1 overflow-x-auto scroll-simple">
            {props.author}
          </div>
        </button>
      </form>
      <form>
        <div className="flex px-3 whitespace-nowrap">
          <p className="text-lg font-semibold">{props.view}</p>
        </div>
      </form>
      <form>
        <div className="px-3 py-2 font-bold whitespace-nowrap text-center">
          <p className="text-lg font-semibold">{props.likes}</p>
        </div>
      </form>
      <form onSubmit={onPlayClicked}>
        <button className="px-3 py-2 font-bold whitespace-nowrap text-center">
          <p className="text-lg font-semibold">Play</p>
        </button>
      </form>
      <br></br>
    </div>
  );
}
