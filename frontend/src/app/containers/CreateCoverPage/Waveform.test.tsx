import * as React from 'react';
import WaveSurfer from 'wavesurfer.js';
import { screen, render } from '@testing-library/react';
import { Waveform } from './index';

jest.dontMock('wavesurfer.js');
jest.mock('../../components/CreateCover/WaveformSetButton', () => () => {
  return <div>button</div>;
});

describe('<Waveform />', () => {
  let waveformDiv;
  let dummyPlugin;
  let wavesurfer;
  beforeEach(() => {});
  // clean up after each test
  afterEach(done => {
    jest.clearAllMocks();
    done();
  });

  it('should render', () => {
    const spyWavesurferCreate = jest
      .spyOn(WaveSurfer, 'create')
      .mockImplementation(jest.fn());
    const spyWavesurferOn = jest.spyOn;
    render(<Waveform url="" />);
  });
});
