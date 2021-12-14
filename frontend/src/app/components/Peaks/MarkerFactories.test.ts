import { createSegmentMarker } from '.';

test('createSegmentMarker zoomview', () => {
  createSegmentMarker({ view: 'zoomview' });
});

test('overview', () => {
  createSegmentMarker({ view: 'overview' });
});
