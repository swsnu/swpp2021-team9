import CustomSegmentMarker from './CustomSegmentMarker';

export function createSegmentMarker(options) {
  if (options.view === 'zoomview') {
    return new CustomSegmentMarker(options);
  }

  return null;
}
