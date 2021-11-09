import React from 'react';
import { Instrument, Cover } from 'types/models';

import AddedCoverList from './AddedCoverList';
import AddCoverButton from './AddCoverButton';

export interface Props {
  instruments: Instrument[];
  covers: Cover[];
}

export default function CombinationArea(props: Props) {
  return (
    <div data-testid="CombinationArea" className="mt-4 ml-4 sm:ml-0">
      <h2 className="text-left text-sm font-bold text-gray-600 tracking-wider">
        MAKE COMBINATION
      </h2>
      <div className="mt-1 flex w-full items-start">
        <AddedCoverList />
        <AddCoverButton instruments={props.instruments} />
      </div>
    </div>
  );
}
