import { createSegmentLabel } from '.';

const stubOptions = {
  segment: { labelText: 'TEST_TEXT' },
};

test('createSegmentLabel', () => {
  createSegmentLabel(stubOptions);
});
