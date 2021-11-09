export const dummyInstruments: Instrument[] = [
  {
    id: 0,
    name: 'Vocals',
    icon: 'mic',
  },
  {
    id: 1,
    name: 'Keyboard',
    icon: 'piano',
  },
  {
    id: 2,
    name: 'Guitar',
    icon: 'guitar',
  },
  {
    id: 3,
    name: 'Drum',
    icon: 'drum',
  },
];

export const dummySongs: Song[] = [
  {
    id: 0,
    title: '신호등',
    singer: '이무진',
    category: 'POP',
    reference: 'https://www.youtube.com/watch?v=SK6Sm2Ki9tI',
    description: '붉은색 푸른색 그 사이 3초 그 짧은 시간~',
  },
];

export const dummyCovers: Cover[] = [
  {
    id: 0,
    audio: '',
    title: 'Cute Vocals!',
    category: '',
    description: '',
    user: 0,
    instrument: dummyInstruments[0],
    song: 0,
    tags: ['Calm', 'Cute'],
    likes: 5,
    views: 27,
    combination: null,
  },
  {
    id: 1,
    audio: '',
    title: 'Folk Guitar Cover',
    category: '',
    description: '',
    user: 1,
    instrument: dummyInstruments[2],
    song: 0,
    tags: ['Cool'],
    likes: 3,
    views: 12,
    combination: null,
  },
  {
    id: 2,
    audio: '',
    title: 'FUNKY Piano cover',
    category: '',
    description: '',
    user: 2,
    instrument: dummyInstruments[1],
    song: 0,
    tags: ['Funky'],
    likes: 4,
    views: 11,
    combination: null,
  },
  {
    id: 3,
    audio: '',
    title: '신호등 female solo cover',
    category: '',
    description: '',
    user: 3,
    instrument: dummyInstruments[0],
    song: 0,
    tags: ['Cute'],
    likes: 3,
    views: 25,
    combination: 0,
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
