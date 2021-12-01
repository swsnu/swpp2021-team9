type status = 'init' | 'loading' | 'wait' | 'pause' | 'play' | 'ended';

export default class TrackPlayer {
  private audios: HTMLAudioElement[] = [];
  private track?: TrackInfo;
  private status: status = 'init';

  private checkCanPlay() {
    if (this.audios.every(audio => audio.readyState > 3)) {
      if (this.status === 'wait') {
        this.play();
      } else if (this.status === 'loading') {
        this.pause();
      }
    }
  }

  private checkEnded() {
    if (this.audios.every(audio => audio.ended)) {
      this.setStatus('ended');
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
    this.track.sources.forEach(source => {
      const audio = new Audio();
      this.audios.push(audio);
      audio.src = source;
      audio.addEventListener('canplay', () => {
        this.checkCanPlay();
      });
      audio.addEventListener('ended', () => {
        this.checkEnded();
      });
      audio.load();
    });
  }

  play() {
    if (['wait', 'pause'].includes(this.status)) {
      this.audios.forEach(audio => {
        audio.play().catch(() => {
          this.pause();
        });
      });
      this.setStatus('play');
    } else if (this.status === 'ended') {
      this.setCurrentTime(0);
    } else if (this.status === 'loading') {
      this.setStatus('wait');
    }
  }

  pause() {
    if (['loading', 'play'].includes(this.status)) {
      this.audios.forEach(audio => audio.pause());
    }

    const currentTime = this.getCurrentTime();
    this.audios.forEach(audio => (audio.currentTime = currentTime));
    this.setStatus('pause');
  }

  setCurrentTime(time: number) {
    if (isNaN(time)) return;
    if (['ended', 'play', 'wait'].includes(this.status)) {
      this.setStatus('wait');
    } else if (['loading', 'pause'].includes(this.status)) {
      this.setStatus('loading');
    }
    this.audios.forEach(audio => {
      audio.currentTime = time;
    });
  }

  isPaused() {
    return this.audios.every(audio => audio.paused);
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
