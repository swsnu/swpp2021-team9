const followList = [
  [1, 2, 3, 4],
  [2, 9, 3, 4, 6],
  [3, 9, 4, 1],
  [4, 9, 5, 1, 2],
  [3, 6, 3, 1],
  [3, 7, 8, 1, 4, 2],
  [0, 7, 8, 1],
  [0, 6, 8, 1, 2, 4],
  [0, 2, 6, 4],
  [1, 2, 6, 4, 5],
];

export const dummyUser: User[] = Array.from({ length: 10 }, (_, idx) => {
  return {
    id: idx,
    username: `USER_${idx}`,
    email: `USER${idx}@metaband.com`,
    description: `USER_DESCRIPTION_${idx}`,
    photo: `USER_PHOTO_${idx}`,
    followings: followList[idx],
    instruments: followList[idx],
  };
});

const instNames = ['Vocals', 'Keyboard', 'Guitar', 'Drum'];
const instIcons = ['mic', 'piano', 'guitar', 'drum'];

export const dummyInstruments: Instrument[] = Array.from(
  { length: instNames.length },
  (_, idx) => {
    return {
      id: idx,
      name: instNames[idx],
      icon: instIcons[idx],
    };
  },
);

export const dummySongs: Song[] = [
  {
    id: 0,
    title: '신호등',
    singer: '이무진',
    category: 'POP',
    reference: 'https://www.youtube.com/watch?v=SK6Sm2Ki9tI',
    description: '붉은색 푸른색 그 사이 3초 그 짧은 시간~',
  },
  {
    id: 1,
    title: 'strawberry moon',
    singer: '아이유',
    category: 'POP',
    reference: 'https://www.youtube.com/watch?v=sqgxcCjD04s',
    description: '',
  },
  {
    id: 2,
    title: 'Savage',
    singer: 'aespa',
    category: 'POP',
    reference: 'https://www.youtube.com/watch?v=WPdWvnAAurg',
    description: '',
  },
  {
    id: 3,
    title: 'STAY',
    singer: 'The Kid LAROI, Justin Bieber',
    category: 'POP',
    reference: 'https://www.youtube.com/watch?v=rkYlZnIbe2E',
    description: '',
  },
  {
    id: 4,
    title: 'My Universe',
    singer: 'Coldplay, 방탄소년단',
    category: 'POP',
    reference: 'https://www.youtube.com/watch?v=bZYPI4mYwhw',
    description: '',
  },
  {
    id: 5,
    title: 'OHAYO MY NIGHT',
    singer: '디핵 (D-Hack), PATEKO (파테코)',
    category: 'HIP-HOP',
    reference: 'https://www.youtube.com/watch?v=KCpWMEsiN3Q',
    description: '',
  },
];

export const dummyCovers: Cover[] = [
  {
    id: 0,
    audio: 'https://js-music-sample.s3.ap-northeast-2.amazonaws.com/1.mp3',
    title: 'Cute Vocals!',
    category: '',
    description: '',
    user: dummyUser[0],
    instrument: dummyInstruments[0],
    song: dummySongs[0],
    tags: ['Calm', 'Cute'],
    likes: 5,
    views: 27,
    combinationId: null,
  },
  {
    id: 1,
    audio: 'https://js-music-sample.s3.ap-northeast-2.amazonaws.com/2.mp3',
    title: 'Folk Guitar Cover',
    category: '',
    description: '',
    user: dummyUser[1],
    instrument: dummyInstruments[2],
    song: dummySongs[0],
    tags: ['Cool'],
    likes: 3,
    views: 12,
    combinationId: null,
  },
  {
    id: 2,
    audio: 'https://js-music-sample.s3.ap-northeast-2.amazonaws.com/3.mp3',
    title: 'FUNKY Piano cover',
    category: '',
    description: '',
    user: dummyUser[2],
    instrument: dummyInstruments[1],
    song: dummySongs[0],
    tags: ['Funky'],
    likes: 4,
    views: 11,
    combinationId: null,
  },
  {
    id: 3,
    audio: 'https://js-music-sample.s3.ap-northeast-2.amazonaws.com/1.mp3',
    title: '신호등 female solo cover',
    category: '',
    description: '',
    user: dummyUser[3],
    instrument: dummyInstruments[0],
    song: dummySongs[0],
    tags: ['Cute'],
    likes: 3,
    views: 25,
    combinationId: 0,
  },
];

export const dummyCombinations: Combination[] = [
  {
    id: 0,
    views: 141,
    song: 0,
    covers: [0, 1, 2],
    likes: 25,
  },
  {
    id: 1,
    views: 93,
    song: 0,
    covers: [1, 2, 3],
    likes: 14,
  },
];

export const dummyResultLines = [
  {
    title: 'strawberry moon',
    singer: 'jenny',
    view: 1034,
    likes: 426,
  },
  {
    title: 'strawberry muun',
    singer: 'henry',
    view: 1020,
    likes: 324,
  },
  {
    title: 'strawberry boom',
    singer: 'betty',
    view: 1023,
    likes: 302,
  },
];
