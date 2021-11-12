import React, { useEffect, useRef } from 'react';

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
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
    <video
      data-testid="video-preview"
      ref={videoRef}
      width={500}
      height={500}
      autoPlay
      controls
    />
  );
};

export default VideoPreview;
