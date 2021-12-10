import React from 'react';
interface Props {
  audioUrl: string;
}

export default function MergedAudio({ audioUrl }: Props) {
  return (
    <div data-testid="MergedAudio">
      <audio className="" src={audioUrl} controls />
    </div>
  );
}
