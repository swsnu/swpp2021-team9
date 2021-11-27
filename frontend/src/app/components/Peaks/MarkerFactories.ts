import CustomSegmentMarker from './CustomSegmentMarker';
import { CreateSegmentMarkerOptions } from 'peaks.js';

export function createSegmentMarker(options: CreateSegmentMarkerOptions) {
  if (options.view === 'zoomview') {
    return new CustomSegmentMarker(options);
  }

  return null;
}
