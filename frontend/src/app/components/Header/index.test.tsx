import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Header from './index';

describe('<Header />', () => {
  it('should render', () => {
    const component = shallow(<Header />);
    const wrapper = component.find('#header');
    expect(wrapper.length).toBe(1);
  });
});
