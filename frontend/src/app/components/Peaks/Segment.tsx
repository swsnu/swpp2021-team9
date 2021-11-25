import { WaveformColor } from 'peaks.js';
import React, { Component } from 'react';

interface Props {
  startTime: number;
  endTime: number;
  editable?: boolean;
  color?: WaveformColor;
  labelText?: string;
  id?: string;
  setSelectedId: (props: string | undefined) => any;
  setIsPlaySegmentClicked: (props: any) => any;
}

class SegmentComponent extends Component<Props> {
  render() {
    return (
      <tr test-dataid="Segment" className="hover:bg-gray-100 cursor-pointer">
        <td className="py-2 border text-md font-medium whitespace-nowrap text-center">
          {this.props.id}
        </td>
        <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
          {this.props.startTime}
        </td>
        <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
          {this.props.endTime}
        </td>
        <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
          {this.props.labelText}
        </td>
        <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
          <button
            onClick={() => {
              console.log(this.props.id);
              this.props.setSelectedId(this.props.id);
              this.props.setIsPlaySegmentClicked(prev => !prev);
            }}
          >
            Play Segment
          </button>
        </td>
      </tr>
    );
  }
}

export default SegmentComponent;
