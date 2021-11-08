import React from 'react';

import AddedCoverList from './AddedCoverList';
import AddCoverButton from './AddCoverButton';

export interface Props {
  img?: string;
}

export default function MakeCombination(props: Props) {
  return (
    <div
      data-testid="MakeCombination"
      className="mt-4 flex w-full items-center"
    >
      <AddedCoverList />
      <AddCoverButton />
    </div>
  );
}
