import React, { useEffect, useRef, useState } from 'react';

import WaveSurfer from 'wavesurfer.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js';

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
    <div>
      <div id="waveform" className="relative" ref={waveformRef} />
      <div className="controls">
        <button onClick={handlePlayPause}>{'Play / Pause'}</button>
        <input
          type="range"
          id="volume"
          name="volume"
          min="0.01"
          max="1"
          step=".025"
          onChange={onVolumeChange}
          defaultValue={volume}
        />
        <label htmlFor="volume">Volume</label>
      </div>
      <div className="space-x-3">
        <button type="button" onClick={() => getCurrentTime(true)}>
          {`Set Start`}
        </button>
        <button type="button" onClick={() => getCurrentTime(false)}>
          {`Set End`}
        </button>
        <button type="button" onClick={() => playSelectedRegion()}>
          play selected Region
        </button>
      </div>
    </div>
  );
}
