import React from 'react';
interface Props {
  audioUrl: string;
}

export default function MergedAudio({ audioUrl }: Props) {
  return (
    <div data-testid="MergedAudio">
      <audio src={audioUrl} controls />
    </div>
  );
}
