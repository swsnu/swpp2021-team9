import mockPlaylist from './mockPlayList';
import Player from './Player';

jest.mock('./TrackPlayer');

const mockTrack: TrackInfo[] = mockPlaylist.map((v, index) => {
  return {
    combinationId: index,
    song: {
      title: v.name,
      singer: v.artist,
      category: 'category',
      reference: 'ref',
      description: 'des',
    },
    sources: [v.source],
    like: false,
  };
});

describe('Player', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Player is singleton', () => {
    const player = Player.getInstance();
    const otherPlayer = Player.getInstance();
    expect(player).toBe(otherPlayer);
  });

  test('setting tracks', () => {
    const player = Player.getInstance();
    player.onTrackChanged = jest.fn();
    player.setTracks(mockTrack);

    expect(player.onTrackChanged).toHaveBeenLastCalledWith(mockTrack[0]);
    expect(() => player.setIndex(mockTrack.length)).toThrowError();

    player.addTrack(mockTrack[1]);
    expect(player.onTrackChanged).toHaveBeenLastCalledWith(mockTrack[1]);
  });

  test('play next, prev', () => {
    const player = Player.getInstance();
    player.onTrackChanged = jest.fn();

    // call 1
    player.setTracks(mockTrack);

    // call 2
    player.setIndex(0);

    expect(player.onTrackChanged).toBeCalledTimes(2);

    // not call
    player.playPrev();
    expect(player.onTrackChanged).toBeCalledTimes(2);

    // call 3
    player.playNext();
    expect(player.onTrackChanged).toBeCalledTimes(3);

    // call 4
    player.playPrev();
    expect(player.onTrackChanged).toBeCalledTimes(4);

    // call 5
    player.setIndex(mockTrack.length - 1);
    expect(player.onTrackChanged).toBeCalledTimes(5);

    //not call
    player.playNext();
    expect(player.onTrackChanged).toBeCalledTimes(5);
  });
});
