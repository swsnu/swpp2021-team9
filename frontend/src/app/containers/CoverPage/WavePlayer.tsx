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
        'background-color': 'black',
        color: '#fff',
        'font-size': '4px',
      },
    }),
  ],
});

export default function WavePlayer({ url }) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<any>(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(url);

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  useEffect(() => {
    // make sure object stillavailable when file loaded
    wavesurfer.current?.setVolume?.(volume);
  }, [volume]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = e => {
    const { target } = e;
    const newVolume = +target.value;
    setVolume(newVolume);
  };

  return (
    <div className="flex flex-col">
      <div id="waveform" className="relative border-4" ref={waveformRef} />
      <div className="inline-flex p-1 space-x-20 justify-center items-center">
        <button data-testid="playButton" onClick={handlePlayPause}>
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
    </div>
  );
}
