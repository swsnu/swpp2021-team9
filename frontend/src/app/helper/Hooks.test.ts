import { renderHook } from '@testing-library/react-hooks';
import { useInterval } from './Hooks';

afterEach(() => {
  jest.useRealTimers();
});

test('Do anything when delay is null', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  renderHook(() => useInterval(callback, null as any));

  jest.runAllTimers();
  expect(callback).not.toHaveBeenCalled();
});

test('Call callback funtion with delay', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const delay = 1000;
  renderHook(() => useInterval(callback, delay));

  jest.advanceTimersByTime(delay);

  expect(callback).toHaveBeenCalledTimes(1);

  jest.advanceTimersByTime(delay);
  expect(callback).toHaveBeenCalledTimes(2);
});
