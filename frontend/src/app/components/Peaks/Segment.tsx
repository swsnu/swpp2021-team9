import { WaveformColor } from 'peaks.js';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
interface Props {
  startTime: number;
  endTime: number;
  editable?: boolean;
  color?: WaveformColor;
  labelText?: string;
  id: string;
  isMergeClicked: boolean;
  handleMergeList: (id: string, isMerge: boolean) => any;
  onPlaySegment: (id: string) => void;
  onDeleteSegment: (id: string) => void;
}

export default function SegmentComponent({
  id,
  startTime,
  endTime,
  labelText,
  isMergeClicked,
  handleMergeList,
  onPlaySegment,
  onDeleteSegment,
}: Props) {
  const [isMerge, setIsMerge] = useState(false);

  useEffect(() => {
    if (isMergeClicked) {
      setIsMerge(false);
    }
  }, [isMergeClicked]);

  return (
    <tr data-testid="Segment" className="hover:bg-gray-100 cursor-pointer">
      <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
        <input
          data-testid="MergeCheckBox"
          checked={isMerge}
          onChange={e => {
            handleMergeList(id, !isMerge);
            setIsMerge(prev => !prev);
          }}
          type="checkBox"
        ></input>
      </td>
      <td className="py-2 border text-md font-medium whitespace-nowrap text-center">
        {id.split('.')[2]}
      </td>
      <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
        {startTime.toFixed(3)}
      </td>
      <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
        {endTime.toFixed(3)}
      </td>
      <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
        {labelText}
      </td>
      <td
        data-testid="PlayButton"
        onClick={() => {
          onPlaySegment(id);
        }}
        className="py-2 border font-md font-medium whitespace-nowrap text-center"
      >
        <button>
          <FontAwesomeIcon icon={faPlay} />
        </button>
      </td>

      <td
        data-testid="DeleteButton"
        onClick={() => {
          onDeleteSegment(id);
        }}
        className="py-2 border font-md font-medium whitespace-nowrap text-center"
      >
        <button>
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </td>
    </tr>
  );
}
