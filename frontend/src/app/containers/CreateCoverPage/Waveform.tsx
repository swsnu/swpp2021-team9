import React, { useEffect, useRef, useState } from 'react';

import WaveSurfer from 'wavesurfer.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js';
import { faPlay, faPause, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const formWaveSurferOptions = ref => ({
  container: ref,
  waveColor: '#eee',
  progressColor: 'OrangeRed',
  cursorColor: 'OrangeRed',
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 150,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,

  plugins: [
    CursorPlugin.create({
      container: ref,
      showTime: true,
      opacity: 1,
      customShowTimeStyle: {
        'background-color': 'OrangeRed',
        color: '#fff',
        'font-size': '2px',
      },
    }),
  ],
});

export default function Waveform({ url }) {
  const waveformRef = useRef<any>(null);
  const wavesurfer = useRef<any>(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.on('ready', function () {
      // https://wavesurfer-js.org/docs/methods.html
      wavesurfer.current.play();
      setPlay(true);

      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });
    wavesurfer.current.load(url);

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };
  const getCurrentTime = (isStart: boolean) => {
    const currTime = wavesurfer.current.getCurrentTime();
    console.log('getCurrentTime', currTime);
    if (isStart) {
      setStartTime(currTime);
      wavesurfer.current.cursor.showCursor();
    } else {
      setEndTime(currTime);
    }
  };
  const onVolumeChange = e => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  const playSelectedRegion = () => {
    wavesurfer.current.play(startTime, endTime);
  };

  return (
    <div className="flex flex-col">
      <div id="waveform" className="relative border-4" ref={waveformRef} />
      <div className="inline-flex p-1 space-x-20 justify-center items-center">
        <button onClick={handlePlayPause}>
          <FontAwesomeIcon icon={faPlay} />
          {' / '}
          <FontAwesomeIcon icon={faPause} />
        </button>
        <div className="inline-flex space-x-2">
          <input
            type="range"
            id="volume"
            name="volume"
            min="0.01"
            max="1"
            step="0.01"
            onChange={onVolumeChange}
            defaultValue={volume}
          />
          <label htmlFor="volume">
            <FontAwesomeIcon icon={faVolumeUp} />
          </label>
        </div>
      </div>
      <div className="mt-10 space-x-20">
        <button
          className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300 "
          type="button"
          onClick={() => getCurrentTime(true)}
        >
          Set Start
        </button>
        <button
          className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
          type="button"
          onClick={() => getCurrentTime(false)}
        >
          Set End
        </button>
        <button
          className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
          type="button"
          onClick={() => playSelectedRegion()}
        >
          Play Selected Region
        </button>
      </div>
    </div>
  );
}
