import { CustomSegmentMarker } from '.';

jest.mock('Konva');

let stubStartOptions = {
  segment: { color: '#213123', labelText: 'label' },
  startMarker: true,
  layer: { getHeight: jest.fn(() => {}) },
};

let evts = {};
let stubGroup = {
  add: jest.fn(label => {}),
  x: jest.fn(x => {}),
  y: jest.fn(y => {}),
  on: jest.fn((e, cb) => {
    evts[e] = cb;
  }),
};

describe('CustomSegmentMarker', () => {
  it('init', () => {
    const instance = new CustomSegmentMarker(stubStartOptions);
    instance.init(stubGroup);
    instance.bindEventHandlers();
  });
});
