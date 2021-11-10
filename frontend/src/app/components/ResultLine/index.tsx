import Player from 'app/helper/Player';
import * as React from 'react';
import { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Song, Profile } from 'utils/urls';

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
    player.setTrack(trackexample);
  };

  return (
    <div data-testid="ResultLine" className="flex flex-row items-center w-full">
      <br></br>
      <br></br>
      <form onSubmit={onLineClicked}>
        <button className="px-20 py-2 font-bold whitespace-nowrap text-center">
          <td className="text-lg font-semibold">{props.title}</td>
        </button>
      </form>

      <form onSubmit={onAuthorClicked}>
        <button className="px-20 py-2 font-bold whitespace-nowrap text-center">
          <td className="flex my-0.5 py-2 gap-1 overflow-x-auto scroll-simple">
            {props.author}
          </td>
        </button>
      </form>
      <form>
        <td className="flex px-10 whitespace-nowrap">
          <p className="text-lg font-semibold">{props.view}</p>
        </td>
      </form>
      <form>
        <td className="px-20 py-2 font-bold whitespace-nowrap text-center">
          <p className="text-lg font-semibold">{props.likes}</p>
        </td>
      </form>
      <form onSubmit={onPlayClicked}>
        <button className="px-20 py-2 font-bold whitespace-nowrap text-center">
          <td className="text-lg font-semibold">Play</td>
        </button>
      </form>
      <br></br>
    </div>
  );
}
