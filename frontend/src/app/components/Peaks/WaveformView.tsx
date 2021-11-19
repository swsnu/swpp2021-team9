import React, { Component } from 'react';
import Peaks, { PeaksOptions } from 'peaks.js';
import { createPointMarker, createSegmentMarker } from './MarkerFactories';
import { createSegmentLabel } from './SegmentLabelFactory';

import './WaveformView.css';

interface Props {
  audioUrl: string;
  waveformDataUrl?: string;
  audioContentType: string;
  audioContext?: AudioContext;
  setSegments: (props: any) => void;
  setPoints: (props: any) => void;
}

interface State {}

class WaveformView extends Component<Props, State> {
  zoomviewWaveformRef: any;
  overviewWaveformRef: any;
  audioElementRef: any;
  peaks: any;
  constructor(props: Props) {
    super(props);

    this.zoomviewWaveformRef = React.createRef();
    this.overviewWaveformRef = React.createRef();
    this.audioElementRef = React.createRef();
    this.peaks = null;
  }

  render() {
    console.log(
      'WaveformView.render, audioUrl:',
      this.props.audioUrl,
      'waveformDataUrl:',
      this.props.waveformDataUrl,
    );

    return (
      <div>
        <div
          className="zoomview-container"
          ref={this.zoomviewWaveformRef}
        ></div>
        <div
          className="overview-container"
          ref={this.overviewWaveformRef}
        ></div>

        <audio ref={this.audioElementRef} controls>
          <source
            src={this.props.audioUrl}
            type={this.props.audioContentType}
          />
          Your browser does not support the audio element.
        </audio>

        {this.renderButtons()}
      </div>
    );
  }

  renderButtons() {
    return (
      <div className="inline-flex">
        <button onClick={this.zoomIn}>Zoom in</button>&nbsp;
        <button onClick={this.zoomOut}>Zoom out</button>&nbsp;
        <button onClick={this.addSegment}>Add Segment</button>&nbsp;
        <button onClick={this.addPoint}>Add Point</button>&nbsp;
        <button onClick={this.logMarkers}>Log segments/points</button>
      </div>
    );
  }

  componentDidMount() {
    console.log('WaveformComponent.componentDidMount');

    this.initPeaks();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('WaveformComponent.componentDidUpdate');
    if (this.props.audioUrl === prevProps.audioUrl) {
      return;
    }
    console.log('props', this.props);
    console.log('prevProps', prevProps);
    console.log(this.peaks);
    // this.initPeaks();
    const audioContext = new AudioContext();
    const options = {
      mediaUrl: this.props.audioUrl,
      webAudio: {
        audioContext: audioContext,
        scale: 128,
        multiChannel: true,
      },
      zoomLevels: [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
    };
    this.peaks.setSource(options, function (err, peaks) {
      console.log(peaks);
    });
  }

  initPeaks() {
    const audioContext = new AudioContext();

    const options: PeaksOptions = {
      containers: {
        overview: this.overviewWaveformRef.current,
        zoomview: this.zoomviewWaveformRef.current,
      },
      mediaElement: this.audioElementRef.current,
      keyboard: true,
      logger: console.error.bind(console),
      createSegmentMarker: createSegmentMarker,
      createSegmentLabel: createSegmentLabel,
      createPointMarker: createPointMarker,
      webAudio: {
        audioContext: audioContext,
        scale: 128,
        multiChannel: true,
      },
      showPlayheadTime: true,
    };
    console.log(options);
    // if (this.props.waveformDataUrl) {
    //   options.dataUri = {
    //     arraybuffer: this.props.waveformDataUrl,
    //   };
    // }

    this.audioElementRef.current.src = this.props.audioUrl;

    if (this.peaks) {
      this.peaks.destroy();
      this.peaks = null;
    }

    Peaks.init(options, (err, peaks) => {
      this.peaks = peaks;
      this.onPeaksReady();
    });
  }

  componentWillUnmount() {
    console.log('WaveformView.componentWillUnmount');

    if (this.peaks) {
      this.peaks.destroy();
    }
  }

  zoomIn = () => {
    if (this.peaks) {
      this.peaks.zoom.zoomIn();
    }
  };

  zoomOut = () => {
    if (this.peaks) {
      this.peaks.zoom.zoomOut();
    }
  };

  addSegment = () => {
    if (this.peaks) {
      const time = this.peaks.player.getCurrentTime();

      this.peaks.segments.add({
        startTime: time,
        endTime: time + 10,
        labelText: 'Test Segment',
        editable: true,
      });
    }
  };

  addPoint = () => {
    if (this.peaks) {
      const time = this.peaks.player.getCurrentTime();

      this.peaks.points.add({
        time: time,
        labelText: 'Test Point',
        editable: true,
      });
    }
  };

  logMarkers = () => {
    if (this.peaks) {
      this.props.setSegments(this.peaks.segments.getSegments());
      this.props.setPoints(this.peaks.points.getPoints());
    }
  };

  onPeaksReady = () => {
    // Do something when the Peaks instance is ready for use
    console.log('Peaks.js is ready');
  };
}

export default WaveformView;
