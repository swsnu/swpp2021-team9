/**
 *
 * Asynchronously loads the component for MainPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MainPage = lazyLoad(
  () => import('./index'),
  module => module.MainPage,
);
