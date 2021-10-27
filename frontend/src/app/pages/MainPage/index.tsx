/**
 *
 * MainPage
 *
 */
import * as React from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {}

export function MainPage(props: Props) {
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
    </div>
  );
}
