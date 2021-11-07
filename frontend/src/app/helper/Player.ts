const tracks = [
  {
    name: 'Mekanın Sahibi',
    artist: 'Norm Ender',
    cover:
      'https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg',
    source:
      'https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/1.mp3',
    url: 'https://www.youtube.com/watch?v=z3wAjJXbYzA',
    favorited: false,
  },
  {
    name: 'Everybody Knows',
    artist: 'Leonard Cohen',
    cover:
      'https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/2.jpg',
    source:
      'https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/8.mp3',
    url: 'https://www.youtube.com/watch?v=Lin-a2lTelg',
    favorited: true,
  },
  // {
  //   name: 'Extreme Ways',
  //   artist: 'Moby',
  //   cover:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/3.jpg',
  //   source:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/3.mp3',
  //   url: 'https://www.youtube.com/watch?v=ICjyAe9S54c',
  //   favorited: false,
  // },
  // {
  //   name: 'Butterflies',
  //   artist: 'Sia',
  //   cover:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/4.jpg',
  //   source:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/4.mp3',
  //   url: 'https://www.youtube.com/watch?v=kYgGwWYOd9Y',
  //   favorited: false,
  // },
  // {
  //   name: 'The Final Victory',
  //   artist: 'Haggard',
  //   cover:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/5.jpg',
  //   source:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/5.mp3',
  //   url: 'https://www.youtube.com/watch?v=0WlpALnQdN8',
  //   favorited: true,
  // },
  // {
  //   name: 'Genius ft. Sia, Diplo, Labrinth',
  //   artist: 'LSD',
  //   cover:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/6.jpg',
  //   source:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/6.mp3',
  //   url: 'https://www.youtube.com/watch?v=HhoATZ1Imtw',
  //   favorited: false,
  // },
  // {
  //   name: 'The Comeback Kid',
  //   artist: 'Lindi Ortega',
  //   cover:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/7.jpg',
  //   source:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/7.mp3',
  //   url: 'https://www.youtube.com/watch?v=me6aoX0wCV8',
  //   favorited: true,
  // },
  // {
  //   name: 'Overdose',
  //   artist: 'Grandson',
  //   cover:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/8.jpg',
  //   source:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/8.mp3',
  //   url: 'https://www.youtube.com/watch?v=00-Rl3Jlx-o',
  //   favorited: false,
  // },
  // {
  //   name: `Rag'n'Bone Man`,
  //   artist: 'Human',
  //   cover:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/9.jpg',
  //   source:
  //     'https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/9.mp3',
  //   url: 'https://www.youtube.com/watch?v=L3wKzyIN1yk',
  //   favorited: false,
  // },
];
// TODO("한번에 여러개를 실행하는 작업 필요.")

export default class Player {
  private static _instance: Player | null = null;
  private static _player = new Audio(tracks[0].source);

  static getInstance(): Player {
    if (Player._instance == null) {
      Player._instance = new Player();
    }
    return this._instance!;
  }

  private audios: HTMLAudioElement[] = [];

  private constructor() {
    tracks.forEach(async track => {
      const audio = new Audio();
      this.audios.push(audio);
      audio.src = track.source;
      audio.load();
    });
    console.log(this.audios);

    (window as any).player = this;
  }

  isPaused() {
    return this.audios.every(audio => audio.paused);
  }

  play() {
    if (this.getMinReadyState() < 3) {
      console.log('not ready', this.getMinReadyState());
      return false;
    }
    console.log('ready', this.getMinReadyState());
    if (this.audios.length !== 0) {
      const currentTime = this.getCurrentTime();
      this.setCurrentTime(currentTime);
      this.audios.forEach(audio => {
        if (!audio.ended) {
          audio.play();
        }
        console.log(audio.readyState);
      });
    }
    return true;
  }

  pause() {
    if (this.audios.length !== 0) {
      this.audios.forEach(audio => {
        audio.pause();
      });
    }
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
