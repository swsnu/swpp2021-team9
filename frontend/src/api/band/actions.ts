import * as AT from 'api/actionTypes';
import { asyncAction } from 'api/utils';
import { AxiosError } from 'axios';

// instrument actions
export const loadInstruments = asyncAction<undefined, Instrument[], AxiosError>(
  AT.LOAD_INSTRUMENTS,
);

// cover actions
export const loadCoversSong = asyncAction<number, Cover[], AxiosError>(
  AT.LOAD_COVERS_SONG,
);
export const loadCoversSongInst = asyncAction<
  { songId: number; instrumentId: number },
  Cover[],
  AxiosError
>(AT.LOAD_COVERS_SONG_INST);
export const loadCover = asyncAction<number, Cover, AxiosError>(AT.LOAD_COVER);
export const editCover = asyncAction<CoverFormPut, Cover, AxiosError>(
  AT.EDIT_COVER,
);
export const deleteCover = asyncAction<number, number, AxiosError>(
  AT.DELETE_COVER,
);
export const createCover = asyncAction<CoverForm, Cover, AxiosError>(
  AT.CREATE_COVER,
);

// combination actions
export const loadCombinations = asyncAction<number, Combination[], AxiosError>(
  AT.LOAD_COMBINATIONS,
);

// song actions
export const createSong = asyncAction<SongForm, Song, AxiosError>(
  AT.CREATE_SONG,
);
export const loadSong = asyncAction<number, Song, AxiosError>(AT.LOAD_SONG);
