// import React, { useEffect } from 'react';

// interface Props {
//   previewAudioStream: MediaStream;
// }
// const audioContext = new AudioContext();
// const analyser = audioContext.createAnalyser();

// export default function AudioVisualizer({ previewAudioStream }: Props) {
//   useEffect(() => {
//     const source = audioContext.createMediaStreamSource(previewAudioStream);
//     source.connect(analyser);
//     analyser.fftSize = 2048;
//     source.connect(audioContext.destination);
//     source.connect(analyser);
//     var bufferLength = analyser.frequencyBinCount;
//     var dataArray = new Uint8Array(bufferLength);
//     analyser.getByteTimeDomainData(dataArray);

//     return () => {
//       audioContext.close();
//       analyser.disconnect();
//     };
//   }, []);
//   return (
//     <div>
//       <div>hihi</div>
//     </div>
//   );
// }

import React, { Component } from 'react';

export const recordState = Object.freeze({
  START: 'start',
  PAUSE: 'pause',
  STOP: 'stop',
  NONE: 'none',
});

interface Props {
  state?: Object;
  type: string;
  backgroundColor?: string;
  foregroundColor?: string;
  canvasWidth?: [string, number];
  canvasHeight?: [string, number];
  previewAudioStream: HTMLMediaElement;
  audioURL: string;
  //method calls
  onStop: () => void;
}

interface VisualizerState {
  audioData?: AnalyserNode;
}

class AudioVisualizer extends Component<Props, VisualizerState> {
  state = {};
  canvasRef: React.RefObject<unknown>;
  previewAudioStream: HTMLMediaElement;
  audioURL: string;
  frequencyBandArray: number[];

  constructor(props: Props) {
    super(props);
    this.state = {};
    this.frequencyBandArray = Array.from(Array(25).keys());
    this.previewAudioStream = props.previewAudioStream;
    this.canvasRef = React.createRef();
    this.audioURL = props.audioURL;
  }
  static defaultProps = {
    state: recordState.NONE,
    type: 'audio/wav',
    backgroundColor: 'rgb(200, 200, 200)',
    foregroundColor: 'rgb(0, 0, 0)',
    canvasWidth: 500,
    canvasHeight: 300,
  };

  initializeAudioAnalyser = () => {
    const audioFile = new Audio();
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(
      this.previewAudioStream,
    );
    const analyser = audioContext.createAnalyser();
    audioFile.src = this.audioURL;
    analyser.fftSize = 64;
    source.connect(audioContext.destination);
    source.connect(analyser);
    audioFile.play();
    this.setState({
      audioData: analyser,
    });
  };

  // getFrequencyData = styleAdjuster => {
  //   const bufferLength = this.state.audioData?.frequencyBinCount;
  //   const amplitudeArray = new Uint8Array(bufferLength);
  //   this.state.audioData.getByteFrequencyData(amplitudeArray);
  //   styleAdjuster(amplitudeArray);
  // };

  render() {
    return (
      <div>
        {/* <VisualDemo
          initializeAudioAnalyser={this.initializeAudioAnalyser}
          frequencyBandArray={this.frequencyBandArray}
          getFrequencyData={this.getFrequencyData}
          audioData={this.state.audioData}
        /> */}
      </div>
    );
  }
}

export default AudioVisualizer;
