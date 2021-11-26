import React from 'react';

interface Props {
  audioFile: File[];
  audioUrl: string;
}

export default function MergedAudio({ audioFile, audioUrl }: Props) {
  console.log(audioFile, audioUrl);
  return (
    <div>
      <audio src={audioUrl} controls />
    </div>
  );
}
