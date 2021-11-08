export interface Combination {
  id: number;
  views: number;
  song: number;
  covers: number[];
  likes: number;
}

export interface Cover {
  id: number;
  audio: string;
  title: string;
  category: string;
  description?: string;
  user: number;
  instrument: number;
  song: number;
  tags: string[];
  likes: number;
  views: number;
  combination: number | null;
}

export interface Instrument {
  id: number;
  name: string;
  icon: string;
}

export interface Song {
  id: number;
  title: string;
  singer: string;
  category: string;
  reference: string;
  description?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  description: string;
  photo: string;
  followings: number[];
  instruments: number[];
}
