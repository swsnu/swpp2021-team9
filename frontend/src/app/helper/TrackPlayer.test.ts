import mockPlaylist from './mockPlayList';
import Player from './Player';
import TrackPlayer from './TrackPlayer';

const mockTrack: TrackInfo[] = mockPlaylist.map(v => {
  return {
    song: {
      title: v.name,
      singer: v.artist,
      category: 'category',
      reference: 'ref',
      description: 'des',
    },
    sources: [v.source, v.source],
    like: false,
  };
});

class MockAudio {
  currentTime = 0;
  duration = 0;
  paused = true;
  readyState = 4;
  listeners = {};
  ended = false;
  src = '';

  constructor(src?: string) {
    this.src = src ?? '';
  }

  play() {
    return new Promise<void>(res => {
      this.paused = false;
    });
  }

  pause() {
    this.paused = true;
  }

  load() {
    this.readyState = 4;
  }

  addEventListener(
    type: string,
    listener: (element: MockAudio, ev: Event) => void,
  ) {
    this.listeners[type] = listener;
  }

  testCall(type: string) {
    this.listeners[type](this, {});
  }
}

describe('Player', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.Audio = jest.fn().mockImplementation(() => {
      return new MockAudio();
    });
  });

  test('init', () => {
    const trackPlayer = new TrackPlayer(mockTrack[0]);
    expect(trackPlayer['audios'].length).toBe(mockTrack[0].sources.length);
  });

  test('setting tracks', () => {
    const trackPlayer = new TrackPlayer();
    trackPlayer.onStatusChange = jest.fn();

    trackPlayer.setTrack(mockTrack[0]);
    trackPlayer['audios'].forEach(audio => {
      (audio as unknown as MockAudio).testCall('canplay');
    });
    expect(trackPlayer.onStatusChange).lastCalledWith('playing');
  });

  test('play and pause', () => {
    const trackPlayer = new TrackPlayer();
    trackPlayer.onStatusChange = jest.fn();

    const audios = [new MockAudio(), new MockAudio(), new MockAudio()];
    trackPlayer['audios'] = audios as any;

    audios[1].currentTime = 100;
    trackPlayer.play();
    expect(audios[0].currentTime).toBe(100);

    trackPlayer.pause();

    audios[1].duration = 100;
    expect(trackPlayer.getDuration()).toBe(100);

    audios[1].ended = true;
    trackPlayer.play();
    expect(audios[0].currentTime).toBe(100);

    trackPlayer['audios'] = [];
    expect(trackPlayer.getCurrentTime()).toBe(0);
    expect(trackPlayer.getDuration()).toBe(0);
    expect(trackPlayer.play()).toBe(false);
  });

  test('is puased when every paused', () => {
    const trackPlayer = new TrackPlayer();
    trackPlayer.onStatusChange = jest.fn();

    const audios: HTMLAudioElement[] = [];
    for (let i = 0; i < 10; i++) {
      const audio = new MockAudio();
      audio.paused = true;
      audios.push(new Audio());
    }
    trackPlayer['audios'] = audios;
    expect(trackPlayer.isPaused()).toBe(true);

    (audios[0] as unknown as MockAudio).paused = false;
    expect(trackPlayer.isPaused()).toBe(false);
  });

  test('audios test', () => {
    const trackPlayer = new TrackPlayer();
    trackPlayer.onStatusChange = jest.fn();

    const audios: HTMLAudioElement[] = [];
    for (let i = 0; i < 10; i++) {
      const audio = new MockAudio();
      audio.paused = true;
      audios.push(new Audio());
    }
    trackPlayer['audios'] = audios;

    (audios[0] as unknown as MockAudio).readyState = 1;
    expect(trackPlayer.getMinReadyState()).toBe(1);

    expect(trackPlayer.play()).toBe(false);
  });
});
