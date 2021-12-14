import React, { useEffect, useRef } from 'react';

interface Props {
  stream: MediaStream | null;
  className: string;
}

const VideoPreview = ({ stream, className }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }
  return (
    <div className={className}>
      <video
        data-testid="video-preview"
        ref={videoRef}
        width={500}
        height={500}
        autoPlay
        controls
      />
    </div>
  );
};

export default VideoPreview;
