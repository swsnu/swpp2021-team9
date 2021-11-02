import React from 'react';
import { RouteComponentProps } from 'react-router';

interface MatchParams {
  id?: string;
}
export interface Props extends RouteComponentProps<MatchParams> {}

export default function SongPage(props: Props) {
  return <div data-testid="SongPage">SongPage</div>;
}
