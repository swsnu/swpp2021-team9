import * as React from 'react';
import { shallow, mount } from 'enzyme';
import CreateCoverPreviewPage, { Props, State } from './step2';

describe('<CreateCoverPreviewPage />', () => {
  it('should render', () => {
    const component = shallow(<CreateCoverPreviewPage />);
    const wrapper = component.find('.createCoverPreviewPage');
    expect(wrapper.length).toBe(1);
  });
});
