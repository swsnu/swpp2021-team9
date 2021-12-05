import AudioEditor from './AudioEditor';
import { getMockAudioContext } from '__mocks__/AudioContext.mock';
import * as WavToMp3 from './WavToMp3';
// https://stackoverflow.com/questions/59581721/testing-functions-containing-promise-and-filereader-in-jest
// 참고해서 이어서 진행할 예정.
// https://stackoverflow.com/questions/57192090/minimal-audio-wav-or-mp3-file-in-bytes-for-unit-testing

// global.File = class MockFile {
//   filename: string;
//   lastModified: number;
//   name: string;
//   webkitRelativePath: string;
//   size: number;
//   type: string;
//   arrayBuffer!: () => Promise<ArrayBuffer>;
//   slice;
//   stream;
//   text;
//   constructor(
//     parts: (string | Blob | ArrayBuffer | ArrayBufferView)[],
//     filename: string,
//     properties?: FilePropertyBag,
//   ) {
//     this.filename = filename;
//     this.lastModified = 1519211810362;
//     this.name = 'testFile';
//     this.webkitRelativePath = 'webPath';
//     this.size = 1152;
//     this.type = properties?.type ? 'audio/wav' : 'audio/mpeg';
//     this.slice = jest.fn(() => {});
//     this.stream = jest.fn(() => {});
//     this.text = jest.fn(() => {});
//   }
// };
// class FileReaderMock {
//   DONE = FileReader.DONE;
//   EMPTY = FileReader.EMPTY;
//   LOADING = FileReader.LOADING;
//   readyState = 0;
//   error: FileReader['error'] = null;
//   result: FileReader['result'] = null;
//   abort = jest.fn();
//   addEventListener = jest.fn();
//   dispatchEvent = jest.fn();
//   onabort = jest.fn();
//   onerror = jest.fn();
//   onload = jest.fn();
//   onloadend = jest.fn();
//   onloadprogress = jest.fn();
//   onloadstart = jest.fn();
//   onprogress = jest.fn();
//   readAsArrayBuffer = jest.fn((file: File) => {
//     new ArrayBuffer(1);
//   });
//   readAsBinaryString = jest.fn();
//   readAsDataURL = jest.fn();
//   readAsText = jest.fn();
//   removeEventListener = jest.fn();
// }

jest.mock('./WavToMp3.ts');

// const mockConnect = jest.fn();
// const mockcreateMediaElementSource = jest.fn(
//   (mediaElement: HTMLMediaElement) => {
//     return {
//       connect: MediaElementAudioSourceNode,
//     };
//   },
// );
// const mockgetByteFrequencyData = jest.fn();
// const mockcreateAnalyser = jest.fn(() => {
//   return {
//     connect: mockConnect,
//     frequencyBinCount: [0, 1, 2],
//     getByteFrequencyData: mockgetByteFrequencyData,
//   };
// });

// const mockcreateOscillator = jest.fn(() => {
//   return {
//     channelCount: 2,
//   };
// });

// const mockChannelSplitterConnect = jest.fn(n => n);

// const mockcreateChannelSplitter = jest.fn(() => {
//   return {
//     connect: mockChannelSplitterConnect,
//   };
// });

// const mockAudioContext = jest.fn(() => {
//   return {
//     createAnalyser: mockcreateAnalyser,
//     createMediaElementSource: mockcreateMediaElementSource,
//     createOscillator: mockcreateOscillator,
//     createChannelSplitter: mockcreateChannelSplitter,
//     decodeAudioData: jest.fn(
//       data =>
//         new Promise((resolve, reject) => {
//           resolve(
//             new AudioBuffer({
//               length: 100,
//               numberOfChannels: 2,
//               sampleRate: 44100,
//             }),
//           );
//         }),
//     ),
//     baseLatency: 0.01,
//     outputLatency: 0.01,
//     close: jest.fn(),
//     createMediaStreamDestination: jest.fn(),
//     createMediaStreamSource: jest.fn(),
//     getOutputTimestamp: jest.fn(),
//     resume: jest.fn(),
//     suspend: jest.fn(),
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//     audioWorklet: jest.fn(),
//     currentTime: jest.fn(),
//     destination: jest.fn(),
//     listener: jest.fn(),
//     onstatechange: jest.fn(),
//     sampleRate: 44100,
//     state: 'running',
//     createBiquadFilter: jest.fn(),
//     createBuffer: jest.fn(),
//     createBufferSource: jest.fn(),
//     createChannelMerger: jest.fn(),
//     createConstantSource: jest.fn(),
//     createConvolver: jest.fn(),
//     createDelay: jest.fn(),
//     createDynamicsCompressor: jest.fn(),
//     createGain: jest.fn(),
//     createIIRFilter: jest.fn(),
//     createPanner: jest.fn(),
//     createPeriodicWave: jest.fn(),
//     createScriptProcessor: jest.fn(),
//     createStereoPanner: jest.fn(),
//     createWaveShaper: jest.fn(),
//     dispatchEvent: jest.fn(),
//   };
// });

describe('AudioEditor.ts test', () => {
  let ae;
  let fileWav;
  // const mockFileReader = new FileReaderMock();
  let spyArrBufToWav;
  let spyFileReaderOnLoad;
  beforeEach(() => {
    jest.clearAllMocks();
    spyArrBufToWav = jest
      .spyOn(WavToMp3, 'audioBufferToWav')
      .mockImplementation(
        jest.fn(
          () =>
            new File([new ArrayBuffer(1)], 'file.mp3', { type: 'audio/mpeg' }),
        ),
      );

    fileWav = new File([new ArrayBuffer(23123)], 'file.wav', {
      type: 'audio/wav',
    });
    // window.console.log = jest.fn();
    window.alert = jest.fn();
    getMockAudioContext();
    ae = AudioEditor.getInstance();
  });
  it('is Singleton', () => {
    ae = AudioEditor.getInstance();
    const another = AudioEditor.getInstance();
    expect(ae).toBe(another);
  });

  it('readAudio Test ', async () => {
    try {
      await ae.readAudio(fileWav);
    } catch (e) {
      console.error(e);
    }
  });
  it('readAndDecode wav file successfully', async function () {
    try {
      await ae.readAndDecode(fileWav);
    } catch (e) {
      console.error(e);
    }
  });
  it('readAndDecode wav file failure test', async function () {
    console.error = jest.fn();
    // wrong file input
    await ae.readAndDecode({ type: 'audio/wav' });
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  // it('audiocontext decode error', async function () {
  //   console.error = jest.fn();

  //   await ae.readAndDecode(fileWav);
  //   expect(console.error).toHaveBeenCalledTimes(1);
  // });

  it('test invalid mp3 file', async () => {
    await ae.readAndDecode({ type: 'audio/mpeg' });
    expect(window.alert).toHaveBeenCalledTimes(1);
  });

  // it('floatTo16BitPCM'):
});
