import { apiClient } from './client';

export const api = {
  // users
  signup: async (form: SignUpForm) => {
    return await apiClient.post<null>(`/api/user/signup/`, form);
  },
  signin: async (form: SignInForm) => {
    return await apiClient.post<User>(`/api/user/signin/`, form);
  },
  signout: async () => {
    const response = await apiClient.get<null>(`/api/user/signout/`);
    return response.data;
  },
  getUserInfo: async (userId: number) => {
    const response = await apiClient.get<User>(`/api/user/info/${userId}/`);
    return response.data;
  },

  // `/api/instrument/`
  getInstruments: async () => {
    const response = await apiClient.get<Instrument[]>(`/api/instrument/`);
    return response.data;
  },

  // `/api/cover/<songId: int>/`
  getCoversBySongId: async (songId: number) => {
    const response = await apiClient.get<Cover[]>(`/api/cover/${songId}/`);
    return response.data;
  },
  postCover: async (coverForm: CoverForm) => {
    const audioBlob = await fetch(coverForm.audio).then(r => r.blob());
    const audiofile = new File([audioBlob], 'audiofile.mp3', {
      type: 'audio/mpeg',
    });
    const coverFormData = new FormData();
    coverFormData.append('audio', audiofile);
    coverFormData.append('title', coverForm.title);
    coverFormData.append('category', coverForm.category);
    coverFormData.append('description', coverForm.description);
    coverFormData.append('tags', JSON.stringify(coverForm.tags));
    coverFormData.append('combination', String(coverForm.combinationId));
    coverFormData.append('instrument', String(coverForm.instrumentId));
    return await apiClient.post<Cover>(
      `/api/cover/${coverForm.songId}/`,
      coverFormData,
    );
  },
  getCoverBySongAndInstrument: async (songId: number, instrumentId: number) => {
    const response = await apiClient.get<Cover>(
      `/api/cover/${songId}/${instrumentId}/`,
    );
    return response.data;
  },

  // `/api/cover/info/<coverId: int>/`
  getCoverInfo: async (coverId: number) => {
    const response = await apiClient.get<Cover>(`/api/cover/info/${coverId}/`);
    return response.data;
  },
  putCoverInfo: async (coverForm: CoverFormPut) => {
    return await apiClient.put<Cover>(
      `/api/cover/info/${coverForm.id}/`,
      coverForm,
    );
  },
  deleteCover: async (coverId: number) => {
    return await apiClient.delete<null>(`/api/cover/info/${coverId}/`);
  },

  // `/api/cover/like/<id:int>/`
  getCoverLike: async (coverId: number) => {
    const response = await apiClient.get<{ isLiked: Boolean }>(
      `/api/cover/like/${coverId}/`,
    );
    return response.data;
  },
  putCoverLike: async (form: { coverId: number; isLiked: Boolean }) => {
    return await apiClient.put<{ isLiked: Boolean }>(
      `/api/cover/like/${form.coverId}/`,
      { isLiked: form.isLiked },
    );
  },
  deleteCoverLike: async (coverId: number) => {
    return await apiClient.delete<null>(`/api/cover/like/${coverId}/`);
  },

  // `/api/combination/<songid:int>/`
  getCombinationsBySong: async (songId: number) => {
    const response = await apiClient.get<Combination[]>(
      `/api/combination/${songId}/`,
    );
    return response.data;
  },
  postCombination: async (form: CombinationForm) => {
    return await apiClient.post<Combination[]>(
      `/api/combination/${form.songId}/`,
      form,
    );
  },

  // `/api/combination/main/`
  getCombinationMain: async () => {
    const response = await apiClient.get<Combination[]>(
      `/api/combination/main/`,
    );
    return response.data;
  },

  // `/api/song/`
  getSongList: async () => {
    const response = await apiClient.get<Song[]>(`/api/song/`);
    return response.data;
  },
  postSong: async (songForm: SongForm) => {
    return await apiClient.post<Song>(`/api/song/`, songForm);
  },

  // `/api/song/search/?search=key:str/`
  getSongBySearch: async (key: string) => {
    const response = await apiClient.get<Song[]>(`/api/search/`, {
      params: { search: key },
    });
    return response.data;
  },

  // `/api/song/info/<id: int>`
  getSongInfo: async (songId: number) => {
    const response = await apiClient.get<Song>(`/api/song/info/${songId}/`);
    return response.data;
  },
};
