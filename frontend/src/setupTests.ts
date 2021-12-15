// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import 'jest-styled-components';

import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-17-updated';
import axios from 'axios';

Enzyme.configure({
  // @ts-ignore
  adapter: new EnzymeAdapter(),
  disableLifecycleMethods: true,
});

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  create: () => {
    const client = jest.requireActual('axios').create();
    client.get = jest.fn();
    return client;
  },
}));

class MockAudio {
  currentTime = 0;
  duration = 0;
  paused = true;
  readyState = 4;
  listeners = {};
  ended = false;
  src = '';

  constructor(src?: string) {
    this.src = src ?? '';
  }

  play = jest.fn(() => {
    return new Promise<void>(res => {
      this.paused = false;
    });
  });

  pause() {
    this.paused = true;
  }

  load() {
    this.readyState = 1;
  }

  addEventListener(
    type: string,
    listener: (element: MockAudio, ev: Event) => void,
  ) {
    this.listeners[type] = listener;
  }

  testCall(type: string) {
    this.listeners[type](this, {});
  }

  testLoaded() {
    this.readyState = 4;
    this.listeners['canplay'](this, {});
  }
}

global.Audio = jest.fn().mockImplementation(() => {
  return new MockAudio();
});
