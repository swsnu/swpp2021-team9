import React from 'react';

interface Props {
  msg: string;
  isStart: boolean;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  getCurrentTime: (isStart: boolean) => void;
}

export default function WaveformSetButton({
  msg,
  isStart,
  setIsClicked,
  getCurrentTime,
}: Props) {
  return (
    <button
      data-testid="waveform-set-button"
      className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
      type="button"
      onClick={() => {
        setIsClicked(prev => !prev);
        getCurrentTime(isStart);
      }}
    >
      {msg}
    </button>
  );
}
