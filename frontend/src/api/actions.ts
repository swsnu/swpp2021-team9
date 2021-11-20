import * as AT from 'api/actionTypes';
import { asyncAction } from 'api/utils';

export const loadCover = asyncAction<number, Cover, string>(AT.LOAD_COVER);
