import * as AT from 'api/actionTypes';
import { asyncAction } from 'api/utils';

export const loadCover = asyncAction<string, CoverResponse, string>(
  AT.LOAD_COVER,
);
