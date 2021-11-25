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
  setIsSegmentListVisible: (props: any) => void;
  selectedSegmentId: string | undefined;
}

interface State {}

class WaveformView extends Component<Props, State> {
  static PeaksInstance: any;
  static getPeaks() {
    if (this.PeaksInstance) {
      return this.PeaksInstance;
    }
    throw new Error('Method not implemented.');
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
        <button onClick={this.deleteSegment}>Delete Segement</button>
        <button onClick={this.logMarkers}>See segments</button>
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

    if (this.props.selectedSegmentId) {
      const seg = this.peaks.segments.getSegment(this.props.selectedSegmentId);
      this.peaks.player.playSegment(seg);
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
    this.peaks.setSource(options, function (err, peaks) {
      console.log(peaks);
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
      // createPointMarker: createPointMarker,
      webAudio: {
        audioContext: audioContext,
        scale: 128,
        multiChannel: true,
      },
      showPlayheadTime: true,
    };
    // if (this.props.waveformDataUrl) {
    //   options.dataUri = {
    //     arraybuffer: this.props.waveformDataUrl,
    //   };
    // }

    console.log(this);

    this.audioElementRef.current.src = this.props.audioUrl;

    if (this.peaks) {
      this.peaks.destroy();
      this.peaks = null;
      WaveformView.PeaksInstance = null;
    }

    Peaks.init(options, (err, peaks) => {
      this.peaks = peaks;
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
        endTime: time + 10,
        labelText: `편집할 부분 ${id}`,
        editable: true,
      });
    }
  };

  deleteSegment = () => {
    if (this.peaks) {
      const input = window.prompt('삭제하실 Segment 번호를 입력해주세요');
      if (!input) return;
      const id = Number(input);

      if (id >= 0 && id < 100) {
        this.peaks.segments.removeById(`peaks.segment.${id}`);
      }
    }
  };

  logMarkers = () => {
    if (this.peaks) {
      this.props.setSegments(prevState => this.peaks.segments.getSegments());
      console.log(this.peaks.segments.getSegments());
      this.props.setIsSegmentListVisible(prev => !prev);
    }
  };

  onPeaksReady = () => {
    // Do something when the Peaks instance is ready for use
    console.log('Peaks.js is ready');
  };
}

export default WaveformView;
