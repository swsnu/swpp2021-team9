type status = 'init' | 'loading' | 'loadFinish' | 'pause' | 'playing';

export default class TrackPlayer {
  private audios: HTMLAudioElement[] = [];
  private track?: TrackInfo;
  private status: status = 'init';

  private checkLoading() {
    if (
      this.status === 'loading' &&
      this.audios.every(audio => audio.readyState > 3)
    ) {
      this.setStatus('loadFinish');
      this.play();
    }
  }

  private setStatus(status: status) {
    this.status = status;
    this.onStatusChange?.(this.status);
  }

  onStatusChange?: (status: string) => void;

  constructor(track?: TrackInfo) {
    if (track) {
      this.setTrack(track);
    }
  }

  setTrack(track: TrackInfo) {
    this.pause();
    this.track = track;
    this.audios = [];
    this.setStatus('loading');
    this.track.sources.forEach((source, idx) => {
      const audio = new Audio();
      this.audios.push(audio);
      audio.src = source;
      audio.addEventListener('canplay', () => {
        this.checkLoading();
      });
      audio.load();
    });
  }

  isPaused() {
    return this.audios.every(audio => audio.paused);
  }

  play() {
    if (this.getMinReadyState() < 3) {
      this.setStatus('loading');
      return false;
    }
    if (this.audios.length !== 0) {
      const currentTime = this.getCurrentTime();
      this.setCurrentTime(currentTime);
      this.audios.forEach(audio => {
        if (!audio.ended) {
          const promise = audio.play();
          promise.catch(() => this.setStatus('pause'));
        }
      });
      this.setStatus('playing');
      return true;
    } else {
      return false;
    }
  }

  pause() {
    if (this.audios.length !== 0) {
      this.audios.forEach(audio => {
        audio.pause();
      });
    }
    this.setStatus('pause');
  }

  getDuration() {
    if (this.audios.length !== 0) {
      return Math.max(...this.audios.map(audio => audio.duration));
    } else {
      return 0;
    }
  }

  getCurrentTime() {
    if (this.audios.length !== 0) {
      return Math.max(...this.audios.map(audio => audio.currentTime));
    } else {
      return 0;
    }
  }

  setCurrentTime(time: number) {
    this.audios.forEach(audio => {
      audio.currentTime = time;
    });
  }

  getMinReadyState() {
    let state = 4;
    this.audios.forEach(audio => {
      if (state > audio.readyState) {
        state = audio.readyState;
      }
    });
    return state;
  }
}
