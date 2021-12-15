import * as WavToMp3 from './WavToMp3';

const stubAudioBuf = {
  duration: 1,
  length: 2655,
  numberOfChannels: 1,
  sampleRate: 44100,
  copyFromChannel: (
    destination: Float32Array,
    channelNumber: number,
    bufferOffset?: number,
  ) => {},
  copyToChannel: (
    source: Float32Array,
    channelNumber: number,
    bufferOffset?: number,
  ) => {},
  getChannelData: (idx: number) => {
    return [new Float32Array(2655), new Float32Array(2655)];
  },
};

describe('WavToMp3', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    URL.createObjectURL = jest.fn().mockReturnValue('URL');
  });
  test('wav2Mp3', async () => {
    WavToMp3.wavToMp3(
      1,
      44100,
      new Int16Array(new ArrayBuffer(566288), 44, 283122),
    );
  });

  test('audioBufferToWav', async () => {
    WavToMp3.audioBufferToWav(stubAudioBuf);
  });
});
