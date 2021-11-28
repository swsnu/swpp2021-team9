import { createSegmentLabel } from '.';

jest.mock('Konva');

const stubOptions = {
  segment: { labelText: 'TEST_TEXT' },
};

test('createSegmentLabel', () => {
  const res = createSegmentLabel(stubOptions);
});
