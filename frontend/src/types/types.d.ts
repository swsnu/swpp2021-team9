interface SignUpForm {
  email: string;
  password: string;
}

type SignInForm = SignUpForm;

interface Combination {
  id: number;
  views: number;
  song: number;
  covers: number[];
  likes: number;
}

interface CombinationForm {
  songId: number;
  covers: number[];
}

interface Cover {
  id: number;
  audio: string;
  title: string;
  category: string;
  description?: string;
  user: UserInfo;
  instrument: Instrument;
  song: Song;
  tags: string[];
  likes: number;
  views: number;
  combinationId: number | null;
}

interface CoverForm {
  audio: string;
  songId: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  combinationId: number;
  instrumentId: number;
}

interface CoverFormPut {
  id: number;
  title: string;
  description: string;
  tags: string[];
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

interface SongForm {
  title: string;
  singer: string;
  category: string;
  reference: string;
  description: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  description: string;
  photo: string;
  followings: number[];
  instruments: number[];
}

type UserInfo = {
  id: number;
  username: string;
  photo?: string;
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

type ResultLine = {
  title: string;
  author: string;
  view: number;
  likes: number;
};
