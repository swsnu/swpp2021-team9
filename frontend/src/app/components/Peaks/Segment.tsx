import { WaveformColor } from 'peaks.js';
import React, { useEffect, useState } from 'react';

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
          onClick={() => {
            console.log(id);
            setSelectedId(id);
            setIsPlaySegmentClicked(true);
          }}
        >
          Play Segment
        </button>
      </td>

      <td className="py-2 border font-md font-medium whitespace-nowrap text-center">
        <button
          onClick={() => {
            console.log(id);
            setSelectedId(id);
            setIsDeleteClicked(true);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
