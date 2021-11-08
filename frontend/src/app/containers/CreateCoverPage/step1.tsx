import React, { useState } from 'react';
import CustomPlayer from './CustomPlayer';
export type Props = {};

export default function CreateCoverRecordPage(props: Props) {
  return (
    <div data-testid="CreateCoverRecordPage">
      <CustomPlayer />
    </div>
  );
}
