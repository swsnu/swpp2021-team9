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
