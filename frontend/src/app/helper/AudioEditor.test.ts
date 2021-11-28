import AudioEditor from './AudioEditor';

// https://stackoverflow.com/questions/59581721/testing-functions-containing-promise-and-filereader-in-jest
// 참고해서 이어서 진행할 예정.

const mockFileReader = jest.fn(() => {
  return {
    readAsDataURL: jest.fn(),
    readAsArrayBuffer: jest.fn(),
  };
});

describe('AudioEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('is Singleton', () => {
    const ae = AudioEditor.getInstance();
    const another = AudioEditor.getInstance();
    expect(ae).toBe(another);
  });
});
