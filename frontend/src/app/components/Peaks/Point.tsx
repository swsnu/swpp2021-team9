import React, { Component } from 'react';

interface Props {
  id: number;
  time: number;
  labelText: string;
}

class Point extends Component<Props> {
  render() {
    return (
      <tr test-dataid="Point">
        <td>{this.props.id}</td>
        <td>{this.props.time}</td>
        <td>{this.props.labelText}</td>
      </tr>
    );
  }
}

export default Point;
