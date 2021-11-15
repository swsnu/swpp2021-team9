import { apiClient } from './client';

export const api = {
  // users
  signup: async (form: SignUpForm) => {
    return await apiClient.post<null>(`api/user/signup/`, form);
  },
  signin: async (form: SignInForm) => {
    return await apiClient.post<User>(`api/user/signin/`, form);
  },
  signout: async () => {
    return await apiClient.get<null>(`api/user/signin/`);
  },
  getUserInfo: async (userId: number) => {
    return await apiClient.get<User>(`api/user/info/${userId}/`);
  },

  // `/api/instrument/`
  getInstruments: async () => {
    return await apiClient.get<Instrument[]>(`api/instrument/`);
  },

  // `/api/cover/${songId}/`
  getCoversBySongId: async (songId: number) => {
    return await apiClient.get<Cover[]>(`api/cover/${songId}/`);
  },
  postCover: async (coverForm: CoverForm) => {
    const audioBlob = await fetch(coverForm.audio).then(r => r.blob());
    const audiofile = new File([audioBlob], 'audiofile.webm', {
      type: 'audio/webm',
    });
    const coverFormData = new FormData();
    coverFormData.append('audio', audiofile);
    coverFormData.append('title', coverForm.title);
    coverFormData.append('description', coverForm.description);
    coverFormData.append('tags', coverForm.tags.join('||'));
    coverFormData.append('combination_id', String(coverForm.combinationId));
    coverFormData.append('instrument_id', String(coverForm.instrumentId));
    return await apiClient.post<Cover>(
      `api/cover/${coverForm.songId}/`,
      coverFormData,
    );
  },
  getCoverBySongAndInstrument: async (songId: number, instrumentId: number) => {
    return await apiClient.get<Cover>(`api/cover/${songId}/${instrumentId}/`);
  },

  // `/api/cover/info/<coverId: int>/`
  getCoverInfo: async (coverId: number) => {
    return await apiClient.get<Cover>(`api/cover/info/${coverId}/`);
  },
  putCoverInfo: async (coverForm: CoverFormPut) => {
    return await apiClient.put<Cover>(
      `api/cover/info/${coverForm.id}/`,
      coverForm,
    );
  },
  deleteCover: async (coverId: number) => {
    return await apiClient.delete<null>(`api/cover/info/${coverId}/`);
  },

  // `/api/cover/like/<id:int>/
  getCoverLike: async (coverId: number) => {
    return await apiClient.get<{ isLike: Boolean }>(
      `api/cover/like/${coverId}/`,
    );
  },
  putCoverLike: async (form: { coverId: number; isLike: Boolean }) => {
    return await apiClient.put<{ isLike: Boolean }>(
      `api/cover/like/${form.coverId}/`,
      { isLike: form.isLike },
    );
  },
  deleteCoverLike: async (coverId: number) => {
    return await apiClient.delete<null>(`api/cover/like/${coverId}/`);
  },

  // `/api/combination/<songid:int>/
  getCombinationsBySong: async (songId: number) => {
    return await apiClient.get<Combination[]>(`api/combination/${songId}/`);
  },
  postCombination: async (form: CombinationForm) => {
    return await apiClient.post<Combination[]>(
      `api/combination/${form.songId}/`,
      form,
    );
  },

  // `/api/song/`
  getSongList: async () => {
    return await apiClient.get<Song[]>(`/api/song/`);
  },
  postSong: async (songForm: SongForm) => {
    return await apiClient.post<Song>(`/api/song/`, songForm);
  },

  // `/api/song/main/`
  getSongMain: async () => {
    return await apiClient.get<Song[]>(`/api/song/main/`);
  },

  // `/api/song/search/?q=key:str/
  getSongBySearch: async (key: string) => {
    return await apiClient.get<Song[]>(`/api/search`, { params: { key: key } });
  },

  // `/api/song/info/<id: int>`
  getSongInfo: async (songId: number) => {
    return await apiClient.get<Song>(`/api/song/info/${songId}/`);
  },
};
