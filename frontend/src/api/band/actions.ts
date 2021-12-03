import * as AT from 'api/actionTypes';
import { asyncAction } from 'api/utils';
import { AxiosError } from 'axios';

export const loadCover = asyncAction<number, Cover, AxiosError>(AT.LOAD_COVER);
export const editCover = asyncAction<CoverFormPut, Cover, AxiosError>(
  AT.EDIT_COVER,
);
export const deleteCover = asyncAction<number, number, AxiosError>(
  AT.DELETE_COVER,
);
