import * as React from 'react';
import { shallow, mount } from 'enzyme';
import CoverPage, { Props, State } from './index';

describe('<CoverPage />', () => {
  it('should render', () => {
    const component = shallow(<CoverPage />);
    const wrapper = component.find('.coverPage');
    expect(wrapper.length).toBe(1);
  });
});
