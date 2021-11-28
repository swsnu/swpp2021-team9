import React, { Component } from 'react';
import Peaks, { PeaksOptions } from 'peaks.js';
import { createSegmentMarker } from './MarkerFactories';
import { createSegmentLabel } from './SegmentLabelFactory';

import './WaveformView.css';

interface Props {
  audioUrl: string;
  waveformDataUrl?: string;
  audioContentType: string;
  // audioContext?: AudioContext;
  setSegments: (props: any) => void;
  selectedSegmentId: string | undefined;
}

interface State {}

class WaveformView extends Component<Props, State> {
  static PeaksInstance: any;
  static getPeaks() {
    if (this.PeaksInstance) {
      return this.PeaksInstance;
    }
    return null;
  }
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
      <div data-testid="WaveformView" className="justify-center items-center">
        <div
          className="zoomview-container"
          ref={this.zoomviewWaveformRef}
        ></div>
        <div
          className="overview-container"
          ref={this.overviewWaveformRef}
        ></div>

        <div className="flex-col justify-center items-center">
          <audio ref={this.audioElementRef} controls>
            <source
              src={this.props.audioUrl}
              type={this.props.audioContentType}
            />
            Your browser does not support the audio element.
          </audio>

          {this.renderButtons()}
        </div>
      </div>
    );
  }

  renderButtons() {
    return (
      <div className="inline-flex space-x-2">
        <button
          data-testid="ZoomIn"
          className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
          onClick={this.zoomIn}
        >
          Zoom in
        </button>
        &nbsp;
        <button
          data-testid="ZoomOut"
          className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
          onClick={this.zoomOut}
        >
          Zoom out
        </button>
        <button
          data-testid="AddSegment"
          className="px-4 py-3 justify-center items-center rounded-md bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 hover:bg-blue-300"
          onClick={this.addSegment}
        >
          Add Segment
        </button>
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
    if (!this.peaks) {
      this.initPeaks();
      return;
    }
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
    this.peaks.setSource(options, (err, peaks) => {
      this.onPeaksReady();
    });
    WaveformView.PeaksInstance = this.peaks;
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
      webAudio: {
        audioContext: audioContext,
        scale: 128,
        multiChannel: true,
      },
      showPlayheadTime: true,
      emitCueEvents: true,
    };

    console.log(this);

    this.audioElementRef.current.src = this.props.audioUrl;

    if (this.peaks) {
      this.peaks.destroy();
      this.peaks = null;
      WaveformView.PeaksInstance = null;
    }

    Peaks.init(options, (err, peaks) => {
      this.peaks = peaks;
      console.log(peaks);
      WaveformView.PeaksInstance = peaks;
      this.onPeaksReady();
    });
  }

  componentWillUnmount() {
    console.log('WaveformView.componentWillUnmount');

    if (this.peaks) {
      this.peaks.destroy();
      WaveformView.PeaksInstance = null;
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
      const id = this.peaks.segments._segmentIdCounter;
      this.peaks.segments.add({
        startTime: time,
        endTime: time + 5,
        labelText: `편집할 부분 ${id}`,
        editable: true,
      });
      this.logMarkers();
    }
  };

  logMarkers = () => {
    if (this.peaks) {
      this.props.setSegments(prevState => [
        ...this.peaks.segments.getSegments(),
      ]);
    }
  };

  onPeaksReady = () => {
    // Do something when the Peaks instance is ready for use
    console.log('Peaks.js is ready');
    this.peaks.on('segments.dragend', segment => {
      const segments = this.peaks.segments.getSegments();
      this.props.setSegments(prev => [...segments]);
    });
  };
}

export default WaveformView;
