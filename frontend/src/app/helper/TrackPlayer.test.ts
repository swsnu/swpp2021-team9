import mockPlaylist from './mockPlayList';
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

  play = jest.fn(() => {
    return new Promise<void>(res => {
      this.paused = false;
    });
  });

  pause() {
    this.paused = true;
  }

  load() {
    this.readyState = 1;
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

  testLoaded() {
    this.readyState = 4;
    this.listeners['canplay'](this, {});
  }
}

describe('TrackPlayer', () => {
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

  test('setTracks', () => {
    const trackPlayer = new TrackPlayer();
    trackPlayer.onStatusChange = jest.fn();
    trackPlayer.setTrack(mockTrack[0]);

    expect(trackPlayer.onStatusChange).lastCalledWith('loading');

    const mockAudios: MockAudio[] = trackPlayer['audios'] as any;
    mockAudios.forEach((audio, idx) => {
      audio.testLoaded();
      expect(audio.src).toBe(mockTrack[0].sources[idx]);
    });
    expect(trackPlayer.onStatusChange).lastCalledWith('pause');
  });

  test('play and pause', () => {
    const trackPlayer = new TrackPlayer();
    trackPlayer.onStatusChange = jest.fn();
    trackPlayer.setTrack(mockTrack[0]);

    const mockAudios: MockAudio[] = trackPlayer['audios'] as any;
    expect(trackPlayer.onStatusChange).lastCalledWith('loading');

    // not ready
    trackPlayer.play();
    expect(trackPlayer.onStatusChange).lastCalledWith('wait');

    // ready one
    mockAudios[0].testLoaded();
    expect(trackPlayer.onStatusChange).lastCalledWith('wait');

    // ready all and play
    mockAudios[1].testLoaded();
    expect(trackPlayer.onStatusChange).lastCalledWith('play');

    // pass canplay
    mockAudios[1].testLoaded();
    expect(trackPlayer.onStatusChange).lastCalledWith('play');

    // pass play
    trackPlayer.play();
    expect(trackPlayer.onStatusChange).lastCalledWith('play');

    trackPlayer.pause();

    mockAudios.forEach(mockAudio => {
      mockAudio.ended = true;
      mockAudio.currentTime = 140;
      mockAudio.testCall('ended');
    });

    trackPlayer.play();
    expect(trackPlayer.getCurrentTime()).toBe(0);

    // error on play
    mockAudios[0].play = jest.fn(() => {
      return new Promise<void>((_res, rej) => {
        rej('error');
      });
    });

    trackPlayer.pause();
    trackPlayer.play();

    trackPlayer['audios'] = [];
    expect(trackPlayer.getCurrentTime()).toBe(0);
    expect(trackPlayer.getDuration()).toBe(0);
  });

  test('properties', () => {
    const trackPlayer = new TrackPlayer();
    trackPlayer.onStatusChange = jest.fn();
    trackPlayer.setTrack(mockTrack[0]);

    const mockAudios: MockAudio[] = trackPlayer['audios'] as any;

    mockAudios[1].duration = 100;
    expect(trackPlayer.getDuration()).toBe(100);

    mockAudios[0].currentTime = 150;
    mockAudios[1].currentTime = 200;
    expect(trackPlayer.getCurrentTime()).toBe(200);

    mockAudios.forEach(audio => {
      audio.paused = true;
    });
    expect(trackPlayer.isPaused()).toBe(true);

    mockAudios[0].paused = false;
    expect(trackPlayer.isPaused()).toBe(false);
  });

  test('ended when all ended', () => {
    const trackPlayer = new TrackPlayer();
    trackPlayer.onStatusChange = jest.fn();
    trackPlayer.setTrack(mockTrack[0]);

    const mockAudios = trackPlayer['audios'] as unknown as MockAudio[];

    (trackPlayer.onStatusChange as jest.Mock).mockClear();
    mockAudios[0].ended = true;
    mockAudios[0].testCall('ended');
    expect(trackPlayer.onStatusChange).toBeCalledTimes(0);

    mockAudios.forEach(mockAudio => {
      mockAudio.ended = true;
      mockAudio.testCall('ended');
    });
    expect(trackPlayer.onStatusChange).lastCalledWith('ended');
  });

  test('audios test', () => {
    const trackPlayer = new TrackPlayer();
    trackPlayer.onStatusChange = jest.fn();
    trackPlayer.setTrack(mockTrack[0]);

    const mockAudios = trackPlayer['audios'] as unknown as MockAudio[];

    mockAudios[0].readyState = 1;
    expect(trackPlayer.getMinReadyState()).toBe(1);

    expect(trackPlayer.onStatusChange).lastCalledWith('loading');
  });

  test('setCurrent"', () => {
    const trackPlayer = new TrackPlayer();
    trackPlayer.onStatusChange = jest.fn();
    trackPlayer.setTrack(mockTrack[0]);

    const mockAudios = trackPlayer['audios'] as unknown as MockAudio[];

    mockAudios[1].currentTime = 100;
    trackPlayer.play();

    expect(trackPlayer.onStatusChange).lastCalledWith('wait');

    (mockAudios[0].play as jest.Mock).mockClear();
    trackPlayer.setCurrentTime(50);
    expect(mockAudios[0].play).toHaveBeenCalledTimes(0);

    trackPlayer.pause();
    expect(trackPlayer.onStatusChange).lastCalledWith('pause');

    trackPlayer.setCurrentTime(30);
    expect(trackPlayer.onStatusChange).lastCalledWith('loading');

    trackPlayer.setCurrentTime(NaN);
    expect(trackPlayer.getCurrentTime()).toBe(30);

    // pass with no error
    const noTrackPlayer = new TrackPlayer();
    noTrackPlayer.setCurrentTime(3);
  });
});
