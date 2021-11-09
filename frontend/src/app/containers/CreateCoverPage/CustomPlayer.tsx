import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
interface Props {}

export default function CustomPlayer({}: Props) {
  const player = useRef<any>(null);
  // const [url, setUrl] = useState<String | null>(null);
  // const [pip, setPip] = useState(false);
  // const [playing, setPlaying] = useState(true);
  // const [controls, setControls] = useState(false);
  // const [light, setLight] = useState(false);
  // const [volume, setVolume] = useState(0.8);
  // const [muted, setMuted] = useState(false);
  // const [played, setPlayed] = useState(0);
  // const [loaded, setLoaded] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [playbackRate, setPlaybackRate] = useState(1.0);
  // const [loop, setLoop] = useState(false);
  // const [seeking, setSeeking] = useState(false);

  // const resetPlaying = () => {
  //   setPlayed(0);
  //   setLoaded(0);
  //   setPip(false);
  // };

  // const load = (url: String | null) => {
  //   setUrl(url);
  //   resetPlaying();
  // };

  // // 일시정지
  // const handlePlayPause = () => {
  //   setPlaying(!playing);
  // };
  // // 재생 중지
  // const handleStop = () => {
  //   setUrl(null);
  //   setPlaying(false);
  // };

  // // ToggleControls => 이거 켜면 유튜브 자체 재생 바 켜짐.
  // const handleToggleControls = () => {
  //   const playing_url = url;
  //   setControls(!controls);
  //   load(playing_url);
  // };

  // // light하게 표시.
  // const handleToggleLight = () => {
  //   setLight(!light);
  // };

  // // 반복 재생
  // const handleToggleLoop = () => {
  //   setLoop(loop);
  // };

  // // 소리 크기 조정
  // const handleVolumeChange = e => {
  //   setVolume(parseFloat(e.target.value));
  // };

  // // 음소거
  // const handleToggleMuted = () => {
  //   setMuted(!muted);
  // };

  // const handleSetPlaybackRate = e => {
  //   setPlaybackRate(parseFloat(e.target.value));
  // };

  // const handleOnPlaybackRateChange = speed => {
  //   setPlaybackRate(parseFloat(speed));
  // };

  // const handleTogglePIP = () => {
  //   setPip(!pip);
  // };

  // const handlePlay = () => {
  //   console.log('onPlay');
  //   setPlaying(true);
  // };

  // const handleEnablePIP = () => {
  //   console.log('onEnablePIP');
  //   setPip(true);
  // };

  // const handleDisablePIP = () => {
  //   console.log('onDisablePIP');
  //   setPip(false);
  // };

  // const handlePause = () => {
  //   console.log('onPause');
  //   setPlaying(false);
  // };

  // const handleSeekMouseDown = e => {
  //   setSeeking(true);
  // };

  // const handleSeekChange = e => {
  //   setPlayed(parseFloat(e.target.value));
  // };

  // const handleSeekMouseUp = e => {
  //   setSeeking(false);
  //   player.current.seekTo(parseFloat(e.target.value));
  // };

  // // const handleProgress = state => {
  // //   console.log('onProgress', state)
  // //   // We only want to update time slider if we are not currently seeking
  // //   if (!this.state.seeking) {
  // //     this.setState(state)
  // //   }
  // // }

  // const handleProgress = state => {
  //   console.log('onProgress', state);
  //   // We only want to update time slider if we are not currently seeking
  //   if (!seeking) {
  //     setPlayed(state.played);
  //   }
  // };

  // const handleDuration = duration => {
  //   console.log('onDuration', duration);
  //   setDuration(duration);
  // };

  // const handleEnded = () => {
  //   console.log('onEnded');
  //   setPlaying(loop);
  // };

  return (
    <div>
      <ReactPlayer
        ref={player}
        className={'shadow border'}
        url={[
          'https://www.youtube.com/watch?v=FtaW6YMAafk',
          'https://www.youtube.com/watch?v=ww9hZfgC2d8',
        ]}
        controls={true}
        width={900}
        height={600}
      />
    </div>
  );
}
