import { Segment, WaveformColor } from 'peaks.js';
import React, { Component } from 'react';

interface Props {
  startTime: number;
  endTime: number;
  editable?: boolean;
  color?: WaveformColor;
  labelText?: string;
  id?: string;
}
interface State {}

class SegmentComponent extends Component<Props, State> {
  state = {};

  render() {
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.props.startTime}</td>
        <td>{this.props.endTime}</td>
        <td>{this.props.labelText}</td>
      </tr>
    );
  }
}

export default SegmentComponent;
