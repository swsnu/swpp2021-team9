import * as React from 'react';
import { shallow, mount } from 'enzyme';
import CreateCoverInfoPage, { Props, State } from './step3';

describe('<CreateCoverInfoPage />', () => {
  it('should render', () => {
    const component = shallow(<CreateCoverInfoPage />);
    const wrapper = component.find('.createCoverInfoPage');
    expect(wrapper.length).toBe(1);
  });
});
