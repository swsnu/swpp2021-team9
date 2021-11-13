import { render, screen, fireEvent } from '@testing-library/react';
import WaveformSetButton from './WaveformSetButton';
describe('<WaveformSetButton />', () => {
  let mockSetIsClicked, mockGetCurrentTime;

  beforeEach(() => {
    mockSetIsClicked = jest.fn();
    mockGetCurrentTime = jest.fn();
  });

  it('should render set button properly', () => {
    render(
      <WaveformSetButton
        msg={'test'}
        isStart={false}
        setIsClicked={mockSetIsClicked}
        getCurrentTime={mockGetCurrentTime}
      />,
    );

    const button = screen.getByTestId('waveform-set-button');
    fireEvent.click(button);
    expect(mockGetCurrentTime).toHaveBeenCalledTimes(1);
    expect(mockSetIsClicked).toHaveBeenCalledTimes(1);
  });
});
