import TrackPlayer from './TrackPlayer';

export default class Player extends TrackPlayer {
  /* For singleton */
  private static _instance: Player | null = null;

  static getInstance(): Player {
    if (Player._instance == null) {
      Player._instance = new Player();
    }
    (window as any).player = this;
    return this._instance!;
  }

  /* player */
  private tracks!: TrackInfo[];
  private index = 0;

  onTrackChanged?: (track: TrackInfo) => void;

  private constructor(tracks?: TrackInfo[]) {
    super();
    this.setTracks(tracks ?? []);
  }

  setIndex(idx: number) {
    if (idx < this.tracks.length) {
      this.index = idx;
      this.setTrack(this.tracks[idx]);
      this.onTrackChanged?.(this.tracks[idx]);
      console.log(this.tracks[idx]);
    } else {
      throw Error(
        `Out of index of tracks idx: ${idx}, lenth: ${this.tracks.length}`,
      );
    }
  }

  setTracks(tracks: TrackInfo[]) {
    if (tracks && tracks.length > 0) {
      this.tracks = tracks;
      this.setIndex(0);
    } else {
      this.tracks = [];
    }
  }

  playNext() {
    if (this.index + 1 < this.tracks.length) {
      this.setIndex(this.index + 1);
    }
  }

  playPrev() {
    if (this.index - 1 >= 0) {
      this.setIndex(this.index - 1);
    }
  }
}
