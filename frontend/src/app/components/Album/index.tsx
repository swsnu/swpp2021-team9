import * as React from 'react';
import { Component, useState } from 'react';
import Image from './AlbumImage.png';
import '../Album/Album.css';
import { useHistory } from 'react-router-dom';
import { Song } from 'utils/urls';

interface Props {
  title: string;
  singer: string;
  //thumbnail:string|undefined,
  //play:string|undefined,
  //onTitleClicked: Function,
  //onPlayClicked: Function
}

//const onTitleClicked = ()=>{//Redirect to SongPage of the clicked song}
//const onPlayClicked = ()=>{//Resume or pause playing the song}

export default function Album(props: Props) {
  const history = useHistory();

  const [Form, setForm] = useState({
    title: '',
    singer: '',
  });

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(Form);
    history.push(Song(0));
  };

  const styles = {
    label: 'block text-sm font-medium text-gray-700',
    input:
      'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
  };

  return (
    <div data-testid="Album" className="flex flex-col items-center">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        {props.title} - {props.singer}
      </h3>
      <div className="px-4 py-3 bg-gray-50 text-left sm:px-6">
        <img
          className="AlbumImage"
          src={Image}
          width="100"
          height="120"
          alt="AlbumImage"
        />
      </div>
      <form onSubmit={onSubmitForm}>
        <div className="px-4 py-3 bg-gray-50 text-left sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Play
          </button>
        </div>
      </form>
    </div>
  );
}
