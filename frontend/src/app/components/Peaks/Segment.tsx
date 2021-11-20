import { WaveformColor } from 'peaks.js';
import React, { Component } from 'react';

interface Props {
  startTime: number;
  endTime: number;
  editable?: boolean;
  color?: WaveformColor;
  labelText?: string;
  id?: string;
}

class SegmentComponent extends Component<Props> {
  render() {
    return (
      <tr test-dataid="Segment">
        <td>{this.props.id}</td>
        <td>{this.props.startTime}</td>
        <td>{this.props.endTime}</td>
        <td>{this.props.labelText}</td>
      </tr>
    );
  }
}

export default SegmentComponent;
