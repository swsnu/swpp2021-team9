import Konva from 'konva';
import { CreateSegmentLabelOptions } from 'peaks.js';

export function createSegmentLabel(options: CreateSegmentLabelOptions) {
  //   if (options.view === 'overview') {
  //     return;
  //   }

  const label = new Konva.Label({
    x: 12,
    y: 16,
  });

  label.add(
    new Konva.Tag({
      fill: 'black',
      pointerDirection: 'none',
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 3,
      shadowOffsetY: 3,
      shadowOpacity: 0.3,
    }),
  );

  label.add(
    new Konva.Text({
      text: options.segment.labelText,
      fontSize: 14,
      fontFamily: 'Calibri',
      fill: 'white',
      padding: 8,
    }),
  );

  return label;
}
