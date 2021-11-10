interface Combination {
  id: number;
  views: number;
  song: number;
  covers: number[];
  likes: number;
}

interface Cover {
  id: number;
  audio: string;
  title: string;
  category: string;
  description?: string;
  user: number;
  instrument: Instrument;
  song: number;
  tags: string[];
  likes: number;
  views: number;
  combination: number | null;
}

interface Instrument {
  id: number;
  name: string;
  icon: string;
}

interface Song {
  id: number;
  title: string;
  singer: string;
  category: string;
  reference: string;
  description?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  description: string;
  photo: string;
  followings: number[];
  instruments: number[];
}

type UserInfo = {
  id: number;
  username: string;
};

type PlayInfo = {
  covers: string[];
  song: SongInfo;
};

type SongInfo = {
  title: string;
  singer: string;
  category: string;
  reference: string;
  description: string;
};

type TrackInfo = {
  song: SongInfo;
  sources: string[];
  like: boolean;
};
