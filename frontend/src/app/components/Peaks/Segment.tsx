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
  id?: string;
  isMergeClicked: boolean;
  setSelectedId: (props: string | undefined) => any;
  setIsPlaySegmentClicked: (props: any) => any;
  setIsDeleteClicked: (props: any) => any;
  handleMergeList: (id: string | undefined, isMerge: boolean) => any;
}

export default function SegmentComponent({
  id,
  startTime,
  endTime,
  labelText,
  isMergeClicked,
  setSelectedId,
  setIsPlaySegmentClicked,
  setIsDeleteClicked,
  handleMergeList,
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
        {id}
      </td>
      <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
        {startTime}
      </td>
      <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
        {endTime}
      </td>
      <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
        {labelText}
      </td>
      <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
        <button
          data-testid="PlayButton"
          onClick={() => {
            setSelectedId(id);
            setIsPlaySegmentClicked(true);
          }}
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
      </td>

      <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
        <button
          data-testid="DeleteButton"
          onClick={() => {
            setSelectedId(id);
            setIsDeleteClicked(true);
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </td>
    </tr>
  );
}
