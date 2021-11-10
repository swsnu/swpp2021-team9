import * as React from 'react';
import { Component, useState } from 'react';
import '../Album/Album.css';
import { useHistory } from 'react-router-dom';
import { Song } from 'utils/urls';
import Player from '../SimplePlayer/index';
//import SongInfo from '../../../../src/types/types';

interface Props {
  id: number;
  title: string;
  singer: string;
  thumbnail: string | undefined;
}

export default function Album(props: Props) {
  const history = useHistory();

  const [Form, setForm] = useState({
    id: '',
    title: '',
    singer: '',
    thumbnail: '',
  });

  /*
  const song:SongInfo = {
    title:'',
    singer:'',
    category:'',
    reference:'',
    description:'',
  }
*/
  const onTitleClicked = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(Form);
    history.push(Song(props.id));
  };

  const onPlayClicked = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(Form);
    //player = Player.getInstance();
    //player.addSong(song)
    //player.play();
  };

  return (
    <div data-testid="Album" className="flex flex-col items-center w-full">
      <br></br>
      <br></br>
      <form onSubmit={onTitleClicked}>
        <button className="text-lg font-medium leading-6 text-gray-900 font-semibold">
          {props.title}
          <br></br> {props.singer}
        </button>
      </form>
      <br></br>
      <img
        className="rounded-full border border-gray-100 shadow-sm AlbumImage"
        src={props.thumbnail}
        width="150"
        height="150"
        alt="Album image"
      />
      <br></br>
      <form onSubmit={onPlayClicked}>
        <div className="px-4 py-3 bg-gray-50 text-left sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Play
          </button>
        </div>
      </form>
      <br></br>
      <br></br>
    </div>
  );
}
